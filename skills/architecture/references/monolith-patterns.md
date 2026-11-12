# Modular Monolith Patterns & Architectural Decision Guide

> **Loading Level:** L2 Reference Document  
> **Load Condition:** Load when designing domain boundaries, evaluating monolith-to-microservice migration triggers, or defining multi-tenant isolation patterns.

---

## 1. Foundations: Modular Monolith Architecture

A modular monolith enforces strict encapsulation within a single deployment unit. Modules communicate via well-defined public interfaces, never through direct internal database joins or private helper classes.

```
src/
├── modules/
│   ├── identity/          # User authentication, credentials, sessions
│   │   ├── domain/        # Entities, value objects
│   │   ├── application/   # Use cases, service layer
│   │   ├── infrastructure/# DB repositories, password hashers
│   │   └── index.ts       # Public module API export
│   ├── billing/           # Subscriptions, invoices, Stripe webhooks
│   └── projects/          # Core collaborative project workspace
└── shared/                # Cross-cutting primitives (logger, db connection, errors)
```

---

## 2. Professional Practice: Concrete Decision Frameworks

### Synchronous vs Asynchronous Workloads
- **Synchronous (<200ms):** Read queries, immediate CRUD mutations, authentication credential checks.
- **Asynchronous (>200ms or 3rd-party network dependency):**
  - Transactional emails (Resend, SendGrid)
  - PDF/CSV generation
  - Webhook dispatch and retries
  - Third-party data sync
- **Worker Security Invariant (Peer Review 06-security):** Never serialize sensitive tenant credentials or unauthenticated user objects into queue payloads. Store only the `{ event_type, entity_id, tenant_id }` reference in the queue payload; have the worker re-fetch and re-authorize from the primary datastore upon execution.

### Multi-Tenancy Patterns
| Pattern | Isolation Level | Maintenance Cost | Best Fit Tier |
|---|---|---|---|
| **Shared DB, Shared Schema (`org_id` column + RLS)** | Logical | Low | MVP / PROD |
| **Shared DB, Separate Schemas (Postgres Schema per tenant)** | Intermediate | Medium | PROD (Enterprise) |
| **Separate Databases per Tenant** | Physical | High | SCALE / Regulated |

---

## 3. Advanced Practice: The 3 Legitimate Microservice Triggers

Never split a service based on code organization. Only split when one of these 3 physical triggers is met:
1. **Independent Scalability Bottleneck:** Workload A needs 64 CPU cores with GPU for AI/Video; Workload B needs 512MB RAM for API.
2. **Organizational Concurrency Boundary:** 4+ independent engineering squads colliding on the same deployment pipeline daily.
3. **Conflicting Security/Compliance Enclaves:** Cardholder data environment (PCI-DSS Level 1) requiring strict isolation from generic product analytics code.
