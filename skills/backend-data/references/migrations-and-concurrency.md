# Zero-Downtime Database Migrations & Concurrency Patterns

> **Loading Level:** L2 Reference Document  
> **Load Condition:** Load when writing schema migrations on live tables, handling high-concurrency race conditions, or setting up database connection poolers.

---

## 1. Foundations: PostgreSQL Lock Hierarchy

Every schema alteration in relational databases acquires a lock on the table. Knowing which operations lock reads or writes is the foundation of zero-downtime engineering:

| Migration Operation | PostgreSQL Lock Level | Blocks Concurrent Reads? | Blocks Concurrent Writes? |
|---|---|---|---|
| `SELECT` | `AccessShare` | No | No |
| `UPDATE / DELETE` | `RowExclusive` | No | No |
| `CREATE INDEX` (without CONCURRENTLY) | `Share` | No | **YES** |
| `CREATE INDEX CONCURRENTLY` | `ShareUpdateExclusive` | No | No |
| `ADD COLUMN` (with DEFAULT in PG 11+) | `AccessExclusive` (metadata only) | No | **YES** (briefly) |
| `ALTER COLUMN TYPE` / `RENAME` | `AccessExclusive` | **YES** | **YES** |
| `DROP TABLE / TRUNCATE` | `AccessExclusive` | **YES** | **YES** |

---

## 2. Professional Practice: Expand-and-Contract Migration Blueprint

### Phase 1: Expand (Release N)
```sql
-- 1. Set short lock timeout so migration fails fast instead of queueing behind long transactions
SET lock_timeout = '2s';

-- 2. Add new column without non-null constraint
ALTER TABLE users ADD COLUMN phone_number VARCHAR(32);

-- Application code deployed in Release N:
-- Writes to BOTH phone AND phone_number
-- Reads from phone
```

### Phase 2: Backfill (Online Asynchronous Job)
```sql
-- Run in batches of 1,000 with sleep between batches to avoid replication lag
UPDATE users 
SET phone_number = phone 
WHERE id BETWEEN $start_id AND $end_id AND phone_number IS NULL;
```

### Phase 3: Contract (Release N+1)
```sql
-- Application code deployed in Release N+1:
-- Reads from phone_number
-- Writes only to phone_number

-- Run cleanup migration:
SET lock_timeout = '2s';
ALTER TABLE users DROP COLUMN phone;
```

---

## 3. Advanced Practice: The Stripe Webhook Idempotency Pattern

```typescript
// Production Idempotent Webhook Handler
export async function handleStripeWebhook(req: Request, res: Response) {
  const sig = req.headers['stripe-signature'];
  let event: Stripe.Event;

  try {
    // 1. Cryptographic signature check on RAW unparsed body buffer
    event = stripe.webhooks.constructEvent(req.rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    // Peer Review 06-security: Do not leak internal stack or key config in 400 response
    return res.status(400).send('Webhook Signature Verification Failed');
  }

  // 2. Atomic deduplication via PostgreSQL ON CONFLICT
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const insertResult = await client.query(
      `INSERT INTO webhook_events (event_id, event_type, status, created_at)
       VALUES ($1, $2, 'processing', NOW())
       ON CONFLICT (event_id) DO NOTHING
       RETURNING id;`,
      [event.id, event.type]
    );

    // If rowCount is 0, event was already received and processed
    if (insertResult.rowCount === 0) {
      await client.query('ROLLBACK');
      return res.status(200).json({ received: true, deduplicated: true });
    }

    // 3. Process business logic (e.g. fulfill subscription)
    await fulfillSubscription(client, event.data.object);

    await client.query(
      `UPDATE webhook_events SET status = 'completed', processed_at = NOW() WHERE event_id = $1;`,
      [event.id]
    );

    await client.query('COMMIT');
    return res.status(200).json({ received: true });
  } catch (error) {
    await client.query('ROLLBACK');
    // Return 500 so Stripe automatically retries with exponential backoff
    return res.status(500).json({ error: 'Processing failed, please retry' });
  } finally {
    client.release();
  }
}
```
