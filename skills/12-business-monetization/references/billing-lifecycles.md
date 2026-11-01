# Subscription State Machines, Proration, & Tax Compliance

> **Loading Level:** L2 Reference Document  
> **Load Condition:** Load when implementing Stripe Checkout Sessions, configuring dunning workflows, or writing proration math.

---

## 1. Foundations: Subscription Lifecycle State Machine

```
               [checkout.session.completed]
                       │
                       ▼
                 ┌───────────┐
                 │  ACTIVE   │ ◄──────────────────────┐
                 └─────┬─────┘                        │
                       │                              │
             [invoice.payment_failed]           [invoice.paid]
                       │                              │
                       ▼                              │
                 ┌───────────┐                        │
                 │ PAST_DUE  ├────────────────────────┘
                 └─────┬─────┘ (retry succeeded)
                       │
          (dunning grace period expired)
                       │
                       ▼
                 ┌───────────┐
                 │ CANCELED  │
                 └───────────┘
```

---

## 2. Subscription Schema Design (Peer Review 05-backend-data)
Store billing metadata in an explicit PostgreSQL table with strict types:
```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  stripe_customer_id VARCHAR(64) UNIQUE NOT NULL,
  stripe_subscription_id VARCHAR(64) UNIQUE NOT NULL,
  status VARCHAR(32) NOT NULL, -- 'active', 'past_due', 'canceled', 'trialing'
  price_id VARCHAR(64) NOT NULL,
  quantity INTEGER DEFAULT 1,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  current_period_start TIMESTAMPTZ NOT NULL,
  current_period_end TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 3. Professional Practice: Server-Authoritative Checkout Session

```typescript
// Safe Server-Side Checkout Initiation (Next.js / Node)
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2023-10-16' });

// Immutable mapping of plan keys to Stripe Price IDs
const PRICE_MAP: Record<string, string> = {
  pro_monthly: process.env.STRIPE_PRICE_PRO_MONTHLY!,
  pro_annual: process.env.STRIPE_PRICE_PRO_ANNUAL!
};

export async function createCheckoutSession(userId: string, planKey: string) {
  const priceId = PRICE_MAP[planKey];
  if (!priceId) {
    throw new Error('Invalid plan selection');
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    automatic_tax: { enabled: true },
    customer_email: user.email,
    client_reference_id: userId,
    subscription_data: {
      metadata: { userId }
    },
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?billing=success`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?billing=canceled`
  });

  return { checkoutUrl: session.url };
}
```

---

## 3. Advanced Practice: Proration Calculation & Plan Upgrades

When a user upgrades from a $20/month plan to a $50/month plan 10 days into a 30-day billing cycle:
1. **Unused Credit:** 20 days remaining on $20 plan = `(20 / 30) * $20 = $13.33` credit.
2. **New Cost:** 20 days remaining on $50 plan = `(20 / 30) * $50 = $33.33` charge.
3. **Prorated Invoice:** Customer is charged the difference immediately: `$33.33 - $13.33 = $20.00`.
4. **Implementation:** By default, Stripe handles this when `proration_behavior: 'always_invoice'` is passed to `stripe.subscriptions.update()`.
