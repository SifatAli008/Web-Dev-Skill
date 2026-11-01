# Incident Command & Blameless Postmortem Facilitation

> **Loading Level:** L2 Reference Document  
> **Load Condition:** Load when managing SEV1/SEV2 outages, facilitating postmortems, or designing production smoke test checklists.

---

## 1. Foundations: The Severity Matrix (SEV1 – SEV4)

| Level | Severity | Criteria | Response Time | Communication Cadence |
|---|---|---|---|---|
| **SEV1** | Critical Outage | Core customer journey down (checkout, auth), data loss, security breach. | `< 15 minutes` | Public status update every 30 minutes. |
| **SEV2** | Major Degradation | Major feature broken, performance degraded severely for >20% of users. | `< 1 hour` | Internal update every 2 hours; customer status page updated. |
| **SEV3** | Minor Problem | Non-critical feature bug with simple customer workaround. | Same business day | Handled in standard team ticketing backlog. |
| **SEV4** | Trivial / Cosmetic | Typo, minor visual imperfection, non-blocking documentation issue. | Normal sprint | Addressed during routine maintenance cycles. |

---

## 2. Professional Practice: Blameless Postmortem Facilitation Guide

Blameless postmortems operate on the foundational premise: **Engineers do not wake up intending to break production.** If an engineer makes an error, the engineering system allowed that error to reach production without automated detection.

### The Five "Whys" Systemic Analysis
```
Incident: User accounts accidentally deleted during mass cleanup job.
1. Why did the accounts get deleted?
   - The cleanup script ran with an unconstrained WHERE clause.
2. Why was the WHERE clause unconstrained?
   - The parameter was parsed as undefined, and the ORM defaulted to matching all rows.
3. Why did the script execute in production?
   - The engineer ran it directly via database CLI to resolve a customer ticket.
4. Why did the database CLI allow direct write access without a transaction preview?
   - Production database credentials had unrestricted write access for developers.
5. Why was there no safety guard or dry-run validation?
   - There was no automated admin tool with dry-run verification and approval gates.

Corrective Action: Revoke direct DB write access; build an internal admin script with dry-run confirmation and peer approval in CI.
```

---

## 3. Advanced Practice: The 5-Minute Production Smoke Test Suite

### Synthetic Smoke Test Cleanup Invariant (Peer Review 08-testing-qa)
Always prefix synthetic smoke-test accounts with `smoke-test-run-[timestamp]@yourdomain.com` and pass `test: true` in metadata. Immediately invoke the test cleanup endpoint upon smoke verification to purge synthetic rows from live database analytics and CRM synchronization.

Run these 5 automated checks immediately upon cutover:
1. **SSL/TLS & Apex Redirect:** `curl -Iv https://example.com` (Verifies valid cert, HTTP/2 or HTTP/3, and `http://` redirects to `https://`).
2. **Health Check:** `curl -f https://example.com/api/health/readiness` (Expects HTTP 200).
3. **Synthetic User Auth:** Execute automated script creating test account and validating session cookie.
4. **Synthetic Transaction:** Execute $1.00 payment transaction in Stripe test/live mode and verify database receipt.
5. **CDN Cache Headers:** Verify `Cache-Control` header on `/assets/main.js` contains `immutable`.
