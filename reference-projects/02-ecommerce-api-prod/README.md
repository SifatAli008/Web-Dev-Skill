# Golden Reference Project 2: E-commerce API (PROD Tier)

This reference project demonstrates the implementation of a high-rigor, production-grade e-commerce backend built strictly according to Universal WebDev Skills PROD-tier standards.

## Production Architectural Patterns Demonstrated

1. **Idempotency Keys**: Replay caching and duplicate execution suppression using `Idempotency-Key` HTTP headers.
2. **ACID Concurrency Protection**: Atomic inventory deduction using transaction isolation and checks (`stock >= quantity`), preventing negative balances and race conditions.
3. **Observability & Probes**: Standardized Kubernetes-ready `/api/health/liveness` and `/api/health/readiness` endpoints.
4. **Zero-Downtime Database Migrations**: 3-phase expand-and-contract rollout ensuring schema alterations occur with zero service disruption.
5. **Production Defensive Headers**: Automated HSTS (`max-age=31536000`), CSP (`default-src 'none'`), `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, and cache invalidation.

## Running Tests

```bash
node test.js
```
