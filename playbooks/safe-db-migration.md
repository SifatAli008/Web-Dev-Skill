# Playbook: Safe Zero-Downtime Database Migration (`safe-db-migration`)

> **Objective:** Execute schema migrations on high-volume production tables without acquiring exclusive locks, blocking concurrent user traffic, or causing application downtime.

---

## 1. Specialists Involved
- `05-backend-data`: Migration script authoring, expand-and-contract pattern, lock timeouts, backfills.
- `02-architecture`: Domain model consistency, dual-write abstractions.
- `09-devops-infra`: Database connection monitoring, replication lag checks, rollback automation (No rollback, no ship).
- `08-testing-qa`: Migration rollback verification tests, data parity assertions.

---

## 2. Ordered Steps

### Step 1: Pre-Migration Lock & Capacity Audit (`05-backend-data`)
1. Check table size and row count:
   ```sql
   SELECT pg_size_pretty(pg_total_relation_size('users')), count(*) FROM users;
   ```
2. Determine lock requirements of proposed operation (avoid table re-writes).
3. Always mandate lock timeouts in migration scripts:
   ```sql
   SET lock_timeout = '2s';
   ```

### Step 2: Phase 1 — Expand (Release N) (`05-backend-data` + `02-architecture`)
1. Add new column as nullable or with safe default (in PostgreSQL 11+, `DEFAULT` does not rewrite tables):
   ```sql
   SET lock_timeout = '2s';
   ALTER TABLE users ADD COLUMN full_phone VARCHAR(32);
   ```
2. Deploy Release N application code:
   - **Reads:** Read from legacy column (`phone`).
   - **Writes:** Dual-write to BOTH legacy (`phone`) and new column (`full_phone`).

### Step 3: Phase 2 — Online Asynchronous Backfill (`05-backend-data`)
1. Backfill existing historical rows in small, batched chunks to avoid locking or replication lag:
   ```sql
   UPDATE users 
   SET full_phone = phone 
   WHERE id >= $min_id AND id < $max_id AND full_phone IS NULL;
   ```
2. Sleep 50ms between batches of 1,000 rows.
3. Monitor database replication lag and CPU throughout the backfill.

### Step 4: Phase 3 — Switch Reads & Enforce Constraints (`05-backend-data`)
1. Deploy Release N+1 application code:
   - **Reads:** Read exclusively from new column (`full_phone`).
   - **Writes:** Continue dual-writing to both columns.
2. If `NOT NULL` is required, validate without table rewrite:
   ```sql
   SET lock_timeout = '2s';
   ALTER TABLE users ADD CONSTRAINT check_full_phone_not_null CHECK (full_phone IS NOT NULL) NOT VALID;
   ALTER TABLE users VALIDATE CONSTRAINT check_full_phone_not_null;
   ```

### Step 5: Phase 4 — Contract & Cleanup (Release N+2) (`05-backend-data`)
1. Deploy Release N+2 application code:
   - Remove all code references to legacy column (`phone`).
2. Run final cleanup migration:
   ```sql
   SET lock_timeout = '2s';
   ALTER TABLE users DROP COLUMN phone;
   ```

### Step 6: Concurrent Index Creation (`05-backend-data`)
1. If creating indexes on tables with >10k rows, never use standard `CREATE INDEX` (which locks writes).
2. Mandate concurrent index creation:
   ```sql
   CREATE INDEX CONCURRENTLY idx_users_full_phone ON users(full_phone);
   ```

---

## 3. Quality Gates
- **Backend Gate (`05-backend-data`):** Lock timeout <= 2s declared; no single-step renames on live tables.
- **DevOps Gate (`09-devops-infra`):** Database replication lag < 1s; automated rollback script verified.
- **QA Gate (`08-testing-qa`):** Dual-write and backfill data parity validated.

---

## 4. Rollback Procedure
If any migration step exceeds lock timeout or causes connection pool exhaustion:
1. Migration automatically aborts due to `SET lock_timeout = '2s'`.
2. Application remains operational because dual-write / backward-compatible code is deployed.
3. If Phase 1 must be reverted: drop the newly added column (`ALTER TABLE users DROP COLUMN full_phone;`).

---

## 5. Evidence Required to Call Done
1. Migration executed successfully in staging database with active synthetic load.
2. Data validation query showing 100% parity between legacy and new columns.
3. PostgreSQL query output confirming zero table lock stalls or connection pool spikes.

