# Playbook: Add Payments & Subscriptions (`add-payments`)

> **Objective:** Implement a reliable, tax-compliant subscription billing integration (Stripe / Lemon Squeezy) with idempotent webhook handling and dunning lifecycles.

---

## 1. Specialists Involved
- `12-business-monetization`: Pricing tier definitions, billing state machine, statutory disclosures, tax basics.
- `05-backend-data`: Idempotent webhook receivers, subscription database tables, ACID transactions.
- `06-security`: Raw webhook signature verification, PCI-DSS zero-card-storage enforcement (HARD VETO).
- `04-frontend`: Pricing cards, checkout redirection, billing portal access.
- `08-testing-qa`: Webhook simulation tests (successful checkout, renewal failure, duplicate webhook delivery).

---

## 2. Ordered Steps

### Step 1: Gateway Selection & Pricing Structure (`12-business-monetization`)
1. Decide between Direct Gateway (Stripe + Stripe Tax) vs Merchant of Record (Lemon Squeezy/Paddle).
2. Configure product IDs and recurring price IDs in server environment variables.
3. Formulate the billing state machine (Trialing, Active, Past_Due, Canceled).

### Step 2: Database Schema & Idempotency Key Table (`05-backend-data`)
1. Create `subscriptions` and `webhook_events` tables:
   ```sql
   CREATE TABLE subscriptions (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     user_id UUID NOT NULL REFERENCES users(id),
     stripe_customer_id VARCHAR(64) UNIQUE NOT NULL,
     stripe_subscription_id VARCHAR(64) UNIQUE NOT NULL,
     status VARCHAR(32) NOT NULL,
     price_id VARCHAR(64) NOT NULL,
     current_period_end TIMESTAMPTZ NOT NULL
   );
   CREATE TABLE webhook_events (
     event_id VARCHAR(64) PRIMARY KEY,
     event_type VARCHAR(64) NOT NULL,
     status VARCHAR(32) NOT NULL,
     created_at TIMESTAMPTZ DEFAULT NOW()
   );
   ```

### Step 3: Server Checkout Initiation (`12-business-monetization` + `06-security`)
1. Implement `POST /api/billing/create-checkout-session`:
   - Enforce server-authoritative pricing: client sends `price_id` key, server looks up real cost.
   - Inject `client_reference_id: req.user.id`.
   - Return `{ checkoutUrl: session.url }`.

### Step 4: Webhook Handler with Deduplication (`05-backend-data` + `06-security`)
1. Implement `POST /api/webhooks/stripe`:
   - Validate signature using raw request body buffer (`stripe.webhooks.constructEvent`).
   - Insert `event.id` into `webhook_events` with `ON CONFLICT (event_id) DO NOTHING`.
   - If row count is 0, return HTTP 200 immediately (duplicate webhook).
   - If `checkout.session.completed`: insert/update subscription to `active`.
   - If `invoice.payment_failed`: update status to `past_due`, trigger dunning email.
   - If `customer.subscription.deleted`: update status to `canceled`.

### Step 5: Customer Portal & Legal Disclosures (`04-frontend` + `12-business-monetization`)
1. Add statutory recurring billing notice before purchase button: "Billed monthly until canceled. Cancel anytime in account settings."
2. Provide a self-service button to launch the Stripe Customer Billing Portal for card updates and cancellations.

### Step 6: Automated Webhook & Replay Testing (`08-testing-qa`)
1. Simulate sending the identical webhook payload 3 times -> verify user is only credited once.
2. Simulate failed signature verification -> returns 400 Bad Request.
3. Verify subscription status updates to `past_due` on failed invoice.

---

## 3. Quality Gates
- **Security Gate (`06-security`):** HARD VETO if raw card numbers touch backend or webhook signatures are unverified.
- **Business Gate (`12-business-monetization`):** Statutory recurring billing disclosures present.
- **QA Gate (`08-testing-qa`):** Webhook idempotency test suite passes.

---

## 4. Rollback Procedure
If payment checkout produces erroneous charges or failed webhooks:
1. Temporarily disable checkout endpoint (`maintenance_mode: true`).
2. Revert webhook listener to previous stable release.
3. Replay failed webhooks from the Stripe Dashboard once fixed.

---

## 5. Evidence Required to Call Done
1. Passing automated integration tests verifying signature check and event deduplication.
2. Verified live/test transaction record in Stripe dashboard with corresponding database row created.
