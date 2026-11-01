# Playbook: API Versioning, Contracts & Breaking Changes

> **Focus:** Zero-Downtime API Evolution, Contract Testing & Deprecation  
> **Participating Specialists:** `02-architecture` (Lead), `05-backend-data`, `08-testing-qa`, `13-launch-operations`  
> **Standard:** IETF RFC 8594 (Sunset Header), Consumer-Driven Contract Testing, OpenAPI 3.1  
> **Applies to:** PROD, SCALE tiers

---

## 1. When to Run This Playbook

- Modifying an existing REST or GraphQL API endpoint used by active mobile apps, third parties, or microservices.
- Deprecating legacy endpoints or field attributes.
- Introducing breaking schema alterations (renaming fields, changing data types, removing endpoints).

---

## 2. Decision Rules: Breaking vs Non-Breaking Changes

1. **Additive-Only First Rule:**
   - *If* adding new fields, parameters, or endpoints, *treat as non-breaking* and do NOT increment the API major version *because* well-formed API clients ignore unrecognized JSON fields.
2. **Contract Continuity Rule:**
   - *Never* change the type of an existing field (e.g. `string` to `integer`) or rename a key in place; *always* introduce a new key alongside the old key (dual-exposure) for a minimum 90-day transition period.

---

## 3. Step-by-Step Procedure

### Phase 1: API Design & OpenAPI Contract Update
1. Update the OpenAPI 3.1 schema specification before modifying backend implementation code.
2. Clearly mark modified or deprecated fields:
   ```yaml
   paths:
     /api/v1/orders:
       get:
         deprecated: true
         description: Deprecated. Migrate to /api/v2/orders.
   ```

### Phase 2: Dual-Read & Dual-Write Adapters
1. Backend routes must support both old and new data structures simultaneously:
   ```javascript
   // Accept both legacy 'customer_name' and modern 'buyer.name'
   const name = req.body.buyer?.name || req.body.customer_name;
   ```
2. For outgoing payloads, deliver both representations during the deprecation window.

### Phase 3: Contract Testing (SQAT Gate)
1. Write Consumer-Driven Contract tests verifying that legacy consumers continue to receive expected payloads.
2. Verify backwards compatibility before merging PRs:
   ```bash
   npx openapi-diff openapi-v1.json openapi-v2.json
   ```
   *Gate:* Must report **0 unhandled breaking changes**.

### Phase 4: Deprecation Telemetry & RFC 8594 Headers
1. Attach RFC 8594 `Deprecation` and `Sunset` HTTP headers to all v1 responses:
   ```http
   HTTP/1.1 200 OK
   Deprecation: @1775001600
   Sunset: Wed, 01 Jul 2026 00:00:00 GMT
   Link: <https://api.example.com/docs/v2-migration>; rel="sunset"
   ```
2. Instrument metrics tracking daily call volume to deprecated routes segmented by client user-agent.

### Phase 5: Sunset Cutover
1. Once telemetry shows 0 active client calls to the legacy endpoint (or the Sunset date is reached):
   - Return `410 Gone` with migration instructions in the response body.
   - Retain `410 Gone` for 30 days before tearing down the route handler.

---

## 4. Verification Checklist

- [ ] New fields introduced additively without breaking current consumers.
- [ ] Contract diff tool reports 0 unannounced breaking changes.
- [ ] Automated integration tests verify that legacy payload formats still succeed.
- [ ] RFC 8594 `Sunset` and `Deprecation` headers configured on all retired endpoints.
- [ ] Telemetry dashboard operational to track remaining legacy traffic.
