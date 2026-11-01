# Legacy Codebase Rescue & Scaling Triggers Reference

> **Loading Level:** L2 Reference Document  
> **Load Condition:** Load when rescuing untested legacy applications, applying the Strangler Fig pattern, or establishing infrastructure scaling triggers.

---

## 1. Foundations: The Strangler Fig Rescue Pattern

```
                       [Incoming Traffic]
                               │
                               ▼
                    ┌─────────────────────┐
                    │  API Gateway/Proxy  │
                    └──────────┬──────────┘
                               │
            ┌──────────────────┴──────────────────┐
            ▼                                     ▼
   ┌─────────────────┐                   ┌─────────────────┐
   │ Legacy Monolith │                   │  Modern Module  │
   │   (Decreasing)  │                   │   (Increasing)  │
   └─────────────────┘                   └─────────────────┘
```

1. **Step 1 (Scaffold):** Deploy an API proxy (e.g. Nginx, Cloudflare Worker, or Next.js middleware) in front of the legacy app.
2. **Step 2 (Characterize):** Write automated integration characterization tests recording input/output contracts of Endpoint A.
3. **Step 3 (Implement):** Build Endpoint A in the new modern architecture.
4. **Step 4 (Reroute):** Route traffic for Endpoint A to the modern service via the proxy.
5. **Step 5 (Decommission):** Repeat for remaining endpoints until the legacy monolith is empty and can be deleted.

---

## 2. Professional Practice: The Technical Debt Register Schema

Track technical debt in `tech-debt-register.json`:

```json
{
  "debt_items": [
    {
      "id": "DEBT-014",
      "title": "Legacy unindexed queries in reporting dashboard",
      "module": "analytics",
      "severity": "Medium",
      "business_risk": "Dashboard timeouts during peak reporting hours",
      "remediation_plan": "Add composite index on (org_id, created_at) and migrate to background CSV job",
      "effort_estimate": "M",
      "status": "In_Backlog",
      "target_milestone": "v1.4.0"
    }
  ]
}
```

---

## 3. Advanced Practice: The Objective Scaling Trigger Matrix

| Component to Introduce | Telemetry Trigger Metric | Verification Command / Metric |
|---|---|---|
| **B-Tree Database Index** | Slow query duration `> 100ms` appearing in `pg_stat_statements`. | `EXPLAIN ANALYZE SELECT ...` showing Seq Scan on >10k rows. |
| **Distributed Cache (Redis)** | Repeated identical read queries with low mutation frequency and DB CPU `> 70%`. | Cache hit ratio `> 80%`; cache invalidation tagged via surrogate keys. |
| **Asynchronous Worker Queue** | Outbound HTTP requests (Stripe, Resend) causing web worker thread exhaustion. | HTTP request duration `> 300ms` on external calls. |
| **Database Read Replica** | Read-to-write ratio `> 5:1` with primary DB read IOPS `> 80%`. | Replicate via streaming replication; route read queries via connection pooler. |
| **Database Connection Pooler (PgBouncer)** | Active DB connections `> 80%` of `max_connections` (500+ concurrent lambdas). | Connection wait spikes observed in database metrics. |

### PgBouncer Transaction Mode Invariant (Peer Review 02-architecture)
When deploying PgBouncer in `transaction` mode (recommended for serverless scaling):
- Never use `SET session ...` or global connection variables because connections are reassigned to different clients after each transaction.
- Always scope tenant variables locally to the transaction: `SELECT set_config('app.tenant_id', $1, true);` (where `true` marks the setting as local to the active transaction).
