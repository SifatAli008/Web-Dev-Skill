---
name: business-monetization
description: Use when designing pricing models, architecting Stripe/billing checkout flows, handling subscription lifecycles (upgrades, prorations, dunning, grace periods, cancellations), integrating sales tax/VAT fundamentals, or modeling unit economics. Trigger phrases include "billing", "stripe", "payments", "subscription", "checkout", "pricing tiers", "proration", "dunning", "vat", "sales tax", "merchant of record".
tiers: ["MVP", "PROD", "SCALE"]
inputs: ["prd.schema.json"]
outputs: ["billing-spec.schema.json", "webhook-matrix"]
depends_on: ["01-product-discovery", "05-backend-data"]
last_verified: "2026-11-01"
sources: ["STRIPE-ENGINEERING-DOCS", "TAX-CALC-BASICS", "SAAS-METRICS"]
---

# Specialist Stance: Business & Monetization Lead

The Business & Monetization Lead protects commercial viability, billing state machine correctness, payment gateway reliability, and basic tax/regulatory compliance.

### What I Refuse to Compromise On
I refuse to permit fragile billing workflows that lose revenue, unhandled subscription state transitions (prorations, failed renewals, cancellations), trusting client-side price claims, storing raw credit card numbers on application servers (PCI-DSS violation), or ignoring statutory sales tax/VAT compliance obligations.

### Three Questions I Always Ask First
1. **Server-Authoritative Pricing:** Is pricing strictly determined and verified on the server side (never accepting price amounts or plan IDs submitted by client browsers)?
2. **Subscription State Machine & Edge Cases:** Does the billing state machine correctly handle prorated upgrades/downgrades, dunning retry grace periods, payment method updates, and instant vs end-of-period cancellations?
3. **Tax & Merchant of Record Obligations:** Are sales tax, EU VAT MOSS/OSS, and invoicing obligations handled compliantly (either via Stripe Tax/TaxJar or a Merchant of Record like Lemon Squeezy/Paddle)?

---

## When to Use / NOT to Use

- **Use when:**
  - Designing subscription tiers, usage meters, or one-time payment checkouts.
  - Integrating payment processors (Stripe, Lemon Squeezy, Paddle, PayPal).
  - Building billing state machines and handling lifecycle webhooks.
  - Configuring dunning workflows for failed payment card renewals.
  - Implementing sales tax, VAT calculation, and invoice receipt generation.
  - Formulating customer Terms of Service, refund policies, and cancellation disclosures.
- **NOT to use when:**
  - Writing frontend CSS styling for cards (route to `04-frontend`).
  - Configuring database backup snapshots in AWS (route to `09-devops-infra`).
  - Performing deep penetration tests on network protocols (route to `06-security`).

---

## Inputs and Outputs

- **Inputs:**
  - `prd.schema.json` from `01-product-discovery` (Target pricing tiers, billing models, customer jurisdictions).
  - Backend database entity definitions from `05-backend-data`.
- **Outputs:**
  - Billing Architecture Specification conforming to `billing-spec.schema.json`.
  - Comprehensive Webhook State Machine Matrix (`webhook-matrix`).
  - Terms of Service & Refund Policy requirements checklist.

---

## Decision Rules

1. **Merchant of Record (MoR) vs Direct Gateway Rule:**
   - *If* a software project is an MVP or early-stage global SaaS with small team (<5 engineers), *recommend* a **Merchant of Record (e.g. Lemon Squeezy, Paddle)** *because* an MoR acts as the legal seller, assuming liability for calculating, filing, and remitting global sales tax/VAT across 100+ tax jurisdictions automatically [JUDGMENT].
   - *If* the project has established domestic volume or custom enterprise contracts [PROD/SCALE], *choose* **Direct Gateway (Stripe + Stripe Tax)** *because* transaction processing fees are lower (2.9% + $0.30 vs 5% + $0.50) and API customizability is maximum.
2. **Payment Card Industry (PCI-DSS) Zero-Storage Rule:**
   - *Never* accept, process, or store raw Credit Card numbers (PAN) or CVVs on application servers; *mandate* client-side tokenization via Stripe Elements or hosted checkout pages *because* touching raw cardholder data brings severe PCI-DSS Level 1 compliance burdens and massive liability in the event of a breach [FACT: STRIPE-ENGINEERING-DOCS].
3. **Subscription Cancellation Rule (Consumer Protection):**
   - *If* a customer cancels an ongoing subscription, *default* to granting access until the end of the current paid billing period (`cancel_at_period_end: true`), and *mandate* a self-service cancellation flow that is as simple to cancel as it was to subscribe *because* FTC Click-to-Cancel rules and EU consumer law prohibit dark patterns that force phone calls or human retention chats to cancel [FACT: FTC-FTC-ACT].
4. **Idempotent Webhook Handling Rule:**
   - *Always* treat payment webhooks as untrusted at-least-once deliveries; *record* processed transaction IDs before provisioning subscriptions *because* duplicate webhook deliveries otherwise trigger duplicate account credits.

---

## Procedure

### Step 1: Pricing Model & Billing Tier Definition [MVP] [PROD] [SCALE]
1. Structure clear tiers:
   - Free / Starter: Limited features or usage limits.
   - Pro / Team: Standard monthly/annual recurring subscription.
   - Enterprise: Volume-based, invoice-billed, custom SLA.
2. Store product IDs and price IDs in environment variables or a configuration table; never hardcode price values in client components.

### Step 2: Hosted Checkout vs Custom Elements [MVP] [PROD] [SCALE]
1. [MVP / PROD] Implement Stripe Hosted Checkout:
   - Client clicks "Upgrade" -> server creates Stripe Checkout Session -> redirects user to Stripe.
   - Eliminates PCI compliance burden and handles mobile wallets (Apple Pay / Google Pay) automatically.
2. Define `success_url` and `cancel_url` with verified session validation.

### Step 3: Webhook Lifecycle & State Machine [PROD] [SCALE]
1. Map and handle critical webhook events:
   - `checkout.session.completed`: Provision user subscription; link `stripe_customer_id`.
   - `invoice.paid`: Extend subscription end date (`current_period_end`).
   - `invoice.payment_failed`: Transition state to `past_due`; trigger dunning email sequence.
   - `customer.subscription.deleted`: Revoke premium access; transition state to `canceled`.
2. Connect to `05-backend-data` idempotency queue pattern.

### Step 4: Tax Compliance & Legal Disclosures [PROD] [SCALE]
1. Enable automated tax calculation: collect customer billing address and postal code at checkout.
2. Add clear statutory billing disclosures before checkout button:
   - "You will be charged $29.00/month until you cancel. You can cancel anytime in your account settings."
3. Provide automated PDF receipts and VAT-compliant invoices on user billing portal.

---

## Anti-Patterns

- **Client-Specified Pricing:** Passing the price from client frontend to server (e.g. `fetch('/checkout', { body: JSON.stringify({ amount: 2900 }) })`), allowing malicious users to modify prices.
- **Storing Cardholder PANs:** Attempting to store raw credit card numbers or CVVs in application database tables.
- **Immediate Hard-Lockout on Failed Renewal:** Revoking user access instantly on the first failed payment retry instead of providing a 3-to-7 day dunning grace period.
- **Click-to-Cancel Dark Patterns:** Hiding the cancel button or forcing users to email support or call a phone number to cancel recurring charges.
- **Silent Currency Rounding:** Storing prices as floats instead of integer cents (e.g. $29.00 stored as 2900 cents).

---

## Verification

Run these automated verification checks:
1. Verify that `SKILL.md` contains all required sections:
   ```bash
   node -e "
   const fs = require('fs');
   const text = fs.readFileSync('skills/12-business-monetization/SKILL.md', 'utf8');
   const required = ['Specialist Stance', 'When to Use', 'Inputs and Outputs', 'Decision Rules', 'Procedure', 'Anti-Patterns', 'Verification'];
   const missing = required.filter(r => !text.includes(r));
   console.log('Business skill structure:', missing.length === 0 ? 'PASS' : 'FAIL: ' + missing.join(', '));
   "
   ```
   *Expected output:* `Business skill structure: PASS`

---

## Escalate-to-User Triggers

Immediately halt and escalate to the user when:
1. User chargeback / dispute rates exceed 0.75%, threatening immediate merchant account termination by Visa/Mastercard/Stripe.
2. Stripe or payment processor places a hold or reserve on incoming funds due to fraud or compliance flags.
3. Customer operates in heavily restricted financial or sanctioned jurisdictions (OFAC compliance).
