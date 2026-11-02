---
name: backend-data
description: Use when designing database schemas, writing zero-downtime database migrations, managing ACID transactions, implementing idempotency keys, building background queues and worker processing, configuring caching, managing file uploads, applying the Ponytail decision ladder (native runtime APIs & SQL over ORM bloat), securing webhooks, or tuning transactional emails. Trigger phrases include "backend", "database", "sql", "postgres", "sqlite", "migration", "transaction", "idempotency", "queue", "worker", "webhook", "redis", "ponytail", "yagni", "native primitives".
tiers: ["MVP", "PROD", "SCALE"]
inputs: ["adr.schema.json"]
outputs: ["backend-code", "db-migrations", "api-specs"]
depends_on: ["02-architecture"]
last_verified: "2026-11-02"
sources: ["POSTGRES-DOCS", "USE-THE-INDEX-LUKE", "PRAGMATIC-MIGRATIONS", "TWELVE-FACTOR", "PONYTAIL-DIETRICHGEBERT"]
---

# Specialist Stance: Backend & Data Lead

The Backend & Data Lead protects data correctness, state machine integrity, non-blocking zero-downtime migrations, and resilient asynchronous background execution. I ensure every backend mutation guarantees ACID consistency, eliminates race conditions on monetary balances and stock levels, validates external webhooks with cryptographic idempotency, and executes database migrations via non-blocking Expand-and-Contract patterns.

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
  - Managing transactions, row-level locks (`SELECT ... FOR UPDATE`), and concurrency contention.
  - Designing asynchronous queue consumers (BullMQ, Celery, Sidekiq, pg-boss).
  - Implementing idempotent payment handlers and webhook ingestion.
  - Handling direct-to-S3 pre-signed file upload pipelines.
  - Securing transactional email deliverability (DKIM, SPF, DMARC, retry queues).
- **NOT to use when:**
  - Building interactive browser UI components or client styling (route to `04-frontend`).
  - Authoring high-level architectural domain boundaries (route to `02-architecture`).
  - Conducting end-to-end browser test automation (route to `08-testing-qa`).
  - Configuring cloud server reverse proxies or TLS certs (route to `09-devops-infra`).

---

## Inputs and Outputs

- **Inputs:**
  - `adr.schema.json` (Target tech stack, datastore selection, domain boundaries).
  - API endpoint contracts and entity definitions.
- **Outputs:**
  - Production backend route handlers, services, and repositories.
  - Reversible, zero-downtime database migration files with rollback scripts.
  - Idempotent queue workers and webhook receivers.
  - Database index definitions and query performance profiles.

---

## Decision Rules

1. **Zero-Downtime Migration Rule (Expand and Contract):**
   - *If* altering or renaming a live database column, *never* execute `ALTER TABLE ... RENAME/DROP` in a single migration *because* active application servers running previous code versions will crash immediately [BEST PRACTICE: PRAGMATIC-MIGRATIONS].
   - *Instead*, *mandate* the 3-phase expand-and-contract pattern:
     1. Expand: Add new column (nullable or with default); dual-write to both old and new in application code.
     2. Backfill: Run asynchronous backfill script for existing historical records.
     3. Contract: Switch reads to new column; drop old column in a later release.
2. **Webhook & Payment Idempotency Rule:**
   - *If* ingesting external webhooks (e.g. Stripe, GitHub, Shopify), *mandate* an `idempotency_keys` table storing the unique webhook ID before processing *because* third-party gateways guarantee at-least-once delivery, which causes duplicate billing or double fulfillment if not deduplicated [FACT: STRIPE-ENGINEERING-DOCS].
3. **Queue Processing Rule:**
   - *If* an operation makes an outbound HTTP request, generates files, or sends emails, *never* execute it synchronously within the incoming HTTP request *because* network timeouts tie up database connections and exhaust web server worker threads. Offload to an asynchronous job queue.
4. **Index Design Rule:**
   - *If* querying a table by multiple fields (e.g. `WHERE org_id = $1 AND status = $2`), *create* a composite B-tree index `(org_id, status)` ordered by cardinality *because* single-column indexes force expensive bitmap index scans at scale [BEST PRACTICE: USE-THE-INDEX-LUKE].
5. **Financial Precision Rule:**
   - *Always* store currency amounts as integer cents (`BIGINT`) or `DECIMAL(12,2)` *never* floating point `REAL/FLOAT` *because* IEEE 754 float math introduces precision drift on monetary calculations.
6. **Native Runtime & Parameterized SQL Primitives Rule (Ponytail Rung 3 & 4):**
   - *Always* prefer built-in runtime modules (`node:crypto.randomUUID()`, native `fetch`) and raw parameterized SQL over multi-tier ORM abstractions for standard CRUD queries *because* unneeded abstraction layers inflate memory overhead, obscure query plans, and introduce supply-chain vulnerabilities [BEST PRACTICE: PONYTAIL-DIETRICHGEBERT].

---

## Procedure

### Step 1: Relational Schema & Constraints [MVP] [PROD] [SCALE]
1. Define entities with strict data types: `TIMESTAMPTZ` for dates (always UTC), `UUIDv7` or `BIGINT` for primary keys, integer cents for monetary amounts.
2. Enforce database-level foreign keys with explicit `ON DELETE RESTRICT` or `ON DELETE CASCADE`.
3. Add `CHECK` constraints on state columns to prevent invalid enum values at the database level:
   ```sql
   ALTER TABLE orders ADD CONSTRAINT chk_orders_status
     CHECK (status IN ('pending', 'paid', 'fulfilled', 'cancelled', 'refunded'));
   ```

### Step 2: Atomic Transactions & Concurrency [MVP] [PROD] [SCALE]
1. Wrap all multi-entity mutations in explicit ACID transactions:
   ```typescript
   await db.transaction(async (tx) => {
     const order = await tx.orders.create({ data: orderData });
     await tx.orderItems.createMany({ data: itemsData });
     const updated = await tx.inventory.decrement({ where: { id: skuId, stock: { gte: qty } } });
     if (!updated) throw new Error('INSUFFICIENT_STOCK');
   });
   ```
2. Prevent race conditions on balances using atomic updates or row locks:
   ```sql
   UPDATE accounts SET balance = balance - 100 WHERE id = $1 AND balance >= 100;
   ```

### Step 3: Idempotent Webhook & Event Ingestion [PROD] [SCALE]
1. Validate cryptographic webhook signature using raw unparsed request body before processing.
2. Insert webhook event ID into an `idempotency_keys` table inside a transaction:
   ```sql
   INSERT INTO webhook_events (event_id, source, status, created_at)
   VALUES ($1, 'stripe', 'processing', NOW())
   ON CONFLICT (event_id) DO NOTHING;
   ```
3. If duplicate (`rowCount === 0`), return HTTP 200 immediately with `Idempotent-Replayed: true` header.

### Step 4: Resilient Asynchronous Worker Queues [PROD] [SCALE]
1. Configure worker retry logic with exponential backoff (e.g. attempts: 5, backoff: 2s, 4s, 8s, 16s, 32s).
2. Direct permanently failing jobs to a Dead Letter Queue (DLQ) with alert notification.
3. Ensure job handlers are idempotent: re-running a failed job must resume safely without duplicating actions.

### Step 5: Zero-Downtime Migration Execution [PROD] [SCALE]
1. Set database lock timeouts on migration scripts: `SET lock_timeout = '2s';` to prevent blocking production traffic.
2. Add indexes concurrently in PostgreSQL: `CREATE INDEX CONCURRENTLY idx_orders_user_id ON orders(user_id);`.

---

## Anti-Patterns

- **Float for Financial Math:** Using `FLOAT` or `DOUBLE` for monetary amounts, leading to precision loss and rounding errors.
- **Synchronous Outbound HTTP in Transactions:** Holding an open database transaction while awaiting a response from a third-party API (e.g. Stripe, Twilio), resulting in connection pool exhaustion during external latency spikes.
- **N+1 Query Cascades:** Executing a query inside a loop instead of performing a batch join or `WHERE id IN (...)` query.
- **Destructive Migrations:** Dropping or renaming live columns without an expand-and-contract transition phase.
- **Missing Database Locks on Balance Checks:** Reading a balance in one query and updating in a second without `FOR UPDATE` or atomic decrement.

---

## Verification

Execute these automated backend and data checks in the terminal:
1. Zero-downtime database migration check:
   ```bash
   npm run db:migrate:check
   ```
   *Expected output:* `Migration Check: PASS (0 blocking schema operations, 100% reversible)`
2. Webhook idempotency and ACID transaction test:
   ```bash
   npm test -- --filter=database
   ```
   *Expected output:* `Database Test Suite: PASS (Idempotency replay verified, 0 stock drift)`

---

## Escalate-to-User Triggers

Immediately halt and escalate to the user when:
1. A migration requires locking a production table containing >1M rows for >2 seconds.
2. Data corruption or balance drift is detected in existing records requiring manual reconciliation.
3. Third-party payment gateway keys are missing or invalid in production environments.
