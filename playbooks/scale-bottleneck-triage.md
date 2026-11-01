# Playbook: Scale Bottleneck Triage & Remediation (`scale-bottleneck-triage`)

> **Objective:** Diagnose and systematically remediate critical scaling bottlenecks (high database CPU, slow query exhaustion, worker queue lag, memory leaks) under production traffic spikes.

---

## 1. Specialists Involved
- `14-maintenance`: Scaling trigger evaluation, capacity planning, refactoring vs infrastructure triage.
- `05-backend-data`: Database query profiling (`EXPLAIN ANALYZE`), composite indexes, connection pooling (PgBouncer).
- `10-performance`: TTFB diagnosis, caching headers, slow endpoint profiling.
- `09-devops-infra`: Resource scaling, replica provisioning, worker horizontal scaling.
- `02-architecture`: Architectural boundary review, synchronous-to-asynchronous workload offloading.

---

## 2. Ordered Steps

### Step 1: Bottleneck Identification & Telemetry Audit (`10-performance` + `09-devops-infra`)
1. Review APM metrics and server dashboards during high-traffic load:
   - Database CPU > 80%? -> Datastore query exhaustion.
   - Worker Queue Depth growing monotonically? -> Worker consumer throughput bottleneck.
   - Server Memory climbing steadily without dropping? -> Event loop memory leak.
   - HTTP Response TTFB > 1000ms? -> Un-cached heavy queries or external network blocking.

### Step 2: Database Query Profiling & Index Optimization (`05-backend-data`)
1. Query PostgreSQL `pg_stat_statements` to find the top 5 slowest and most frequently executed queries:
   ```sql
   SELECT query, calls, total_exec_time / calls AS avg_time_ms, rows
   FROM pg_stat_statements
   ORDER BY total_exec_time DESC
   LIMIT 5;
   ```
2. Run `EXPLAIN (ANALYZE, BUFFERS)` on the top offending query.
3. Check for `Seq Scan` on large tables (>10,000 rows):
   - Add targeted B-Tree composite index concurrently:
     ```sql
     CREATE INDEX CONCURRENTLY idx_orders_org_created ON orders(organization_id, created_at DESC);
     ```

### Step 3: Connection Pool Exhaustion Fix (`05-backend-data` + `09-devops-infra`)
1. If server logs show `remaining connection slots are reserved` or connection timeout errors:
2. Verify active connections against `max_connections`:
   ```sql
   SELECT count(*), state FROM pg_stat_activity GROUP BY state;
   ```
3. Deploy PgBouncer in `transaction` mode in front of PostgreSQL to pool thousands of serverless/web connections into a controlled pool of 20–50 database connections.

### Step 4: Workload Offloading (Sync to Async) (`02-architecture` + `05-backend-data`)
1. Identify synchronous operations taking >300ms in HTTP request handlers (e.g. PDF generation, batch email dispatch, external API calls).
2. Offload them to an asynchronous worker queue (e.g. BullMQ / Redis):
   - Controller immediately returns HTTP 202 Accepted with `{ job_id }`.
   - Dedicated background workers process jobs outside the web server event loop.

### Step 5: Distributed Caching Layer Integration (`10-performance` + `14-maintenance`)
1. If read queries for static/semi-static data (e.g. tenant configurations, product catalogs) remain heavy after indexing:
2. Introduce Redis cache with explicit TTL (e.g. 5 minutes) and cache-tag invalidation upon mutation.
3. Verify cache hit ratio reaches > 80%.

---

## 3. Quality Gates
- **Performance Gate (`10-performance`):** p95 API response latency drops below 250ms.
- **Backend Gate (`05-backend-data`):** Database CPU drops below 60% under peak simulated load.
- **DevOps Gate (`09-devops-infra`):** Zero dropped connections; queue backlog processing lag < 30 seconds.

---

## 4. Rollback Procedure
If adding an index or caching layer causes locks or data inconsistency:
1. Drop concurrently created index: `DROP INDEX CONCURRENTLY idx_orders_org_created;`.
2. Disable Redis cache reads via feature flag; fallback immediately to direct database reads.

---

## 5. Evidence Required to Call Done
1. `pg_stat_statements` query output displaying average query execution time reduced by >= 50%.
2. APM metrics screenshot/log confirming p95 latency < 250ms under peak traffic.

