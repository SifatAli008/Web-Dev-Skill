# Golden Reference Project 1: SaaS Starter (MVP Tier)

This reference project demonstrates a fast, robust, and secure SaaS MVP built strictly according to Universal WebDev Skills MVP-tier standards.

## MVP Architectural Patterns Demonstrated

1. **Lightweight Native Stack**: Built entirely using native Node.js 24 capabilities (`node:sqlite`, `node:crypto`, `node:http`) with zero external dependencies.
2. **Hardened Authentication**: 
   - Password hashing using `crypto.scrypt` with random 16-byte salt and constant-time `crypto.timingSafeEqual` comparison.
   - Session management using cryptographically random tokens stored in hardened cookies (`HttpOnly; Secure; SameSite=Lax`).
3. **Defensive SQL Security**: 100% prepared statements with parameterized queries preventing SQL injection (demonstrated in test suite).
4. **Server-Authoritative Billing**: Pricing logic is strictly computed on the server (\$29.00/mo). Client-supplied pricing or discount tampering is rejected.
5. **Defensive Security Headers**: Basic CSP, `X-Content-Type-Options: nosniff`, and `X-Frame-Options: DENY`.

## Running Tests

```bash
node test.js
```

