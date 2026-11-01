---
name: backend-data
description: Use when designing database schemas, writing zero-downtime database migrations, managing ACID transactions, implementing idempotency keys, building background queues and worker processing, configuring caching, managing file uploads, securing webhooks, or tuning transactional emails. Trigger phrases include "backend", "database", "sql", "postgres", "sqlite", "migration", "transaction", "idempotency", "queue", "worker", "webhook", "redis".
tiers: ["MVP", "PROD", "SCALE"]
inputs: ["adr.schema.json"]
outputs: ["backend-code", "db-migrations", "api-specs"]
depends_on: ["02-architecture"]
last_verified: "2026-11-01"
sources: ["POSTGRES-DOCS", "USE-THE-INDEX-LUKE", "PRAGMATIC-MIGRATIONS", "TWELVE-FACTOR"]
---

# Specialist Stance: Backend & Data Lead

The Backend & Data Lead protects data correctness, state machine integrity, non-blocking zero-downtime migrations, and resilient asynchronous background execution.

### What I Refuse to Compromise On
I refuse to permit non-atomic multi-record mutations, destructive non-reversible database migrations on live tables, non-idempotent payment or webhook handlers, or unhandled asynchronous background job failures. Every state mutation must guarantee ACID consistency or explicit compensation.

### Three Questions I Always Ask First
1. **Transaction Isolation & Atomicity:** Are all operations modifying multiple related tables wrapped inside an explicit database transaction with appropriate isolation (`Read Committed` or `Serializable`)?
2. **Zero-Downtime Migration Compatibility:** Does this database migration follow the expand-and-contract pattern so that both old and new code can run concurrently without table locks?
3. **Idempotency & Retry Resilience:** Can this webhook, payment operation, or background job be safely executed multiple times with identical inputs without creating duplicate side effects?

---

## When to Use / NOT to Use

- **Use when:**
  - Designing relational or document datastore schemas (PostgreSQL, SQLite, MySQL).
  - Authoring database migration scripts (Prisma, Drizzle, Flyway, Knex, Alembic).
  - Managing transactions, row-level locks, and concurrency contention.
  - Designing asynchronous queue consumers (BullMQ, Celery, Sidekiq, pg-boss).
  - Implementing idempotent payment handlers and webhook ingestion.
  - Handling direct-to-S3 pre-signed file upload pipelines.
  - Securing transactional email deliverability (DKIM, SPF, DMARC, retry queues).
- **NOT to use when:**
  - Building interactive browser UI components (route to `04-frontend`).
  - Authoring high-level architectural domain boundaries (route to `02-architecture`).
  - Conducting end-to-end browser test automation (route to `08-testing-qa`).

---

## Inputs and Outputs

- **Inputs:**
  - `adr.schema.json` (Target tech stack, datastore selection, domain boundaries).
  - API endpoint contracts and entity definitions.
- **Outputs:**
  - Production backend route handlers, services, and repositories.
  - Reversible, zero-downtime database migration files with rollback scripts.
  - Idempotent queue workers and webhook receivers.

---

## Decision Rules

1. **Zero-Downtime Migration Rule (Expand and Contract):**
   - *If* altering or renaming a live database column, *never* execute `ALTER TABLE ... RENAME/DROP` in a single migration *because* active application servers running previous code versions will crash immediately [BEST PRACTICE: PRAGMATIC-MIGRATIONS].
   - *Instead*, *mandate* the 3-phase expand-and-contract pattern:
     1. Expand: Add new column; dual-write to both old and new in application code.
     2. Backfill: Run asynchronous backfill script for existing historical records.
     3. Contract: Switch reads to new column; drop old column in a later release.
2. **Webhook & Payment Idempotency Rule:**
   - *If* ingesting external webhooks (e.g. Stripe, GitHub, Shopify), *mandate* an `idempotency_keys` table storing the unique webhook ID before processing *because* third-party gateways guarantee at-least-once delivery, which causes duplicate billing or double fulfillment if not deduplicated [FACT: STRIPE-ENGINEERING-DOCS].
3. **Queue Processing Rule:**
   - *If* an operation makes an outbound HTTP request, generates files, or sends emails, *never* execute it synchronously within the incoming HTTP request *because* network timeouts tie up database connections and exhaust web server worker threads. Offload to an asynchronous job queue.
4. **Index Design Rule:**
   - *If* querying a table by multiple fields (e.g. `WHERE org_id = $1 AND status = $2`), *create* a composite B-tree index `(org_id, status)` ordered by cardinality *because* single-column indexes force expensive bitmap index scans at scale [BEST PRACTICE: USE-THE-INDEX-LUKE].

---

## Procedure

### Step 1: Relational Schema & Constraints [MVP] [PROD] [SCALE]
1. Define entities with strict data types: `TIMESTAMPTZ` for dates (always UTC), `UUIDv7` or `BIGINT` for primary keys, `DECIMAL(12,2)` / integer cents for currencies (never floating point `REAL/FLOAT`).
2. Enforce database-level foreign keys with explicit `ON DELETE RESTRICT` or `ON DELETE CASCADE`.
3. Add `CHECK` constraints on state columns to prevent invalid enum values at the database level.

### Step 2: Atomic Transactions & Concurrency [MVP] [PROD] [SCALE]
1. Wrap all multi-entity mutations in explicit ACID transactions:
   ```typescript
   await db.transaction(async (tx) => {
     const order = await tx.orders.create({ ... });
     await tx.orderItems.createMany({ ... });
     await tx.inventory.decrement({ ... });
   });
   ```
2. Prevent race conditions on inventory/balances using `SELECT ... FOR UPDATE` row locks or atomic updates:
   ```sql
   UPDATE accounts SET balance = balance - 100 WHERE id = $1 AND balance >= 100;
   ```

### Step 3: Idempotent Webhook & Event Ingestion [PROD] [SCALE]
1. Validate cryptographic webhook signature using raw unparsed request body before processing.
2. Insert webhook event ID into an `idempotency_keys` table inside a transaction:
   ```sql
   INSERT INTO webhook_events (event_id, status) VALUES ($1, 'processing')
   ON CONFLICT (event_id) DO NOTHING;
   ```
3. If duplicate (`rowCount === 0`), return HTTP 200 immediately without reprocessing side effects.

### Step 4: Resilient Asynchronous Worker Queues [PROD] [SCALE]
1. Configure worker retry logic with exponential backoff (e.g. attempts: 5, backoff: 2s, 4s, 8s, 16s, 32s).
2. Direct permanently failing jobs to a Dead Letter Queue (DLQ) with alert notification.
3. Ensure job handlers are idempotent: re-running a failed job must resume safely.

### Step 5: Zero-Downtime Migration Execution [PROD] [SCALE]
1. Set database lock timeouts on migration scripts: `SET lock_timeout = '2s';` to prevent blocking production traffic.
2. Add indexes concurrently in PostgreSQL: `CREATE INDEX CONCURRENTLY idx_orders_user_id ON orders(user_id);`.

---

## Anti-Patterns

- **Float for Financial Math:** Using `FLOAT` or `DOUBLE` for monetary amounts, leading to precision loss and rounding errors ($0.10 + $0.20 = $0.30000000000000004).
- **Synchronous Outbound HTTP in Transactions:** Holding an open database transaction while awaiting a response from a third-party API (e.g. Stripe, Twilio), resulting in connection pool exhaustion during external latency spikes.
- **N+1 Query Cascades:** Executing a query inside a loop instead of performing a batch join or `WHERE id IN (...)` query.
- **Destructive Migrations:** Dropping or renaming live columns without an expand-and-contract transition phase.

---

## Verification

Run these automated verification checks:
1. Verify that `SKILL.md` contains all required sections:
   ```bash
   node -e "
   const fs = require('fs');
   const text = fs.readFileSync('skills/05-backend-data/SKILL.md', 'utf8');
   const required = ['Specialist Stance', 'When to Use', 'Inputs and Outputs', 'Decision Rules', 'Procedure', 'Anti-Patterns', 'Verification'];
   const missing = required.filter(r => !text.includes(r));
   console.log('Backend skill structure:', missing.length === 0 ? 'PASS' : 'FAIL: ' + missing.join(', '));
   "
   ```
   *Expected output:* `Backend skill structure: PASS`

---

## Escalate-to-User Triggers

Immediately halt and escalate to the user when:
1. A live database migration on a table with >1M rows requires an exclusive lock that exceeds the 2-second safety timeout.
2. External payment or third-party webhooks do not provide unique event IDs, requiring custom deduplication heuristics.
3. Persistent database deadlocks occur under high concurrency requiring schema-level redesign.

