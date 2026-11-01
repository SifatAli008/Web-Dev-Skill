# Defensive Security Controls & Threat Mitigation Guide

> **Loading Level:** L2 Reference Document  
> **Load Condition:** Load when conducting STRIDE threat reviews, authoring Content Security Policies, or hardening authentication/authorization boundaries.

---

## 1. Foundations: STRIDE Threat Matrix

| STRIDE Category | Web Threat Definition | Defensive Control | Standard |
|---|---|---|---|
| **Spoofing** | Attacker impersonates legitimate user or service. | Cryptographically signed sessions, MFA, Webhook HMAC signatures. | RFC-6749, ASVS §2 |
| **Tampering** | Attacker modifies data in transit or at rest. | Parameterized queries, input schema validation, TLS 1.3, CSP integrity hashes. | ASVS §5 |
| **Repudiation** | Attacker denies performing an action without audit trail. | Append-only audit logs with UTC timestamps and authenticated user IDs. | NIST-SSDF |
| **Information Disclosure** | Sensitive data leaked to unauthorized parties. | Context-aware output encoding, strict CORS, stripped error stack traces, PII encryption. | ASVS §8 |
| **Denial of Service** | System resources exhausted by malicious traffic. | Distributed rate limiting, connection pooling timeouts, query complexity limits. | ASVS §11 |
| **Elevation of Privilege** | User gains unauthorized capabilities or data access. | Server-side authorization checks, tenant-scoped queries, RBAC/ABAC guards. | CWE-SANS-25 |

---

## 2. Professional Practice: Concrete Implementations

### A. Hardened Session Cookies (Express / Node.js)
```javascript
// Express session cookie hardening
app.use(session({
  name: '__Host-session', // Prefixed with __Host- for strict origin protection
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,       // Prevents client JS access
    secure: true,         // Requires HTTPS
    sameSite: 'lax',      // Protects against CSRF on top-level navigation
    maxAge: 1000 * 60 * 60 * 24 // 24 hours
  }
}));
```

### B. Defensive Content Security Policy (CSP)
```http
Content-Security-Policy: default-src 'self'; \
  script-src 'self' 'nonce-rAnd0m123'; \
  style-src 'self' 'unsafe-inline'; \
  img-src 'self' data: https:; \
  font-src 'self' https:; \
  connect-src 'self' https://api.stripe.com; \
  frame-ancestors 'none'; \
  base-uri 'self'; \
  form-action 'self';
```

---

## 3. Advanced Practice & Incident Postmortems

### IDOR at Scale: The Tenant-Scope Trap & Connection Pools
- **The Failure:** Developers frequently check `if (req.user)` at the controller, then run `Order.findById(req.params.id)`. An authenticated user from Company A can view Company B's invoices by cycling integer IDs.
- **Defensive Invariant:** Every query modifying or fetching customer data MUST include tenant boundaries:
  ```sql
  SELECT * FROM orders WHERE id = $1 AND organization_id = $2;
  ```
- **Architectural Integration (Peer Review 02-architecture):** When using pooled database connections with PostgreSQL Row-Level Security (RLS), set session-scoped tenant claims per transaction:
  ```sql
  BEGIN;
  SELECT set_config('app.current_org_id', $1, true);
  -- Queries now enforce RLS using current_setting('app.current_org_id')
  COMMIT;
  ```
- **Cross-Domain Cookies (CHIPS):** For distributed architectures where frontend and API reside on distinct origins, configure cookies with `SameSite=None; Secure; Partitioned` (Cookies Having Independent Partitioned State) to prevent third-party cookie phase-out breakage.
