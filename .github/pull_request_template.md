## Description
<!-- Summary of changes made and why they are needed -->

## Rigor Tier Classification
- [ ] **MVP** (Fast build, baseline security & auth)
- [ ] **PROD** (Production rigor, ACID transactions, telemetry, SLOs)
- [ ] **SCALE** (Spiky load, edge caching, zero-downtime migrations)
- [ ] **N/A** (Documentation, tool, or template update)

## Specialists Touched
<!-- List any skills/XX-specialist directories modified -->

## Quality & Verification Checklist
- [ ] **Line limit**: All modified skill files remain strictly `<300` lines.
- [ ] **Link integrity**: `npm run check:links` passes with 0 broken references.
- [ ] **AI hygiene**: Zero placeholder comments (`// TODO`, `/* FIXME */`) and no unrequested scratch files (`npm run lint:hygiene`).
- [ ] **Security scan**: `npm run check:security` passes with 0 forbidden patterns.
- [ ] **Reference tests**: `npm run test:reference` passes all 21 reference project tests.
- [ ] **Full master suite**: `npm test` passes 100% of verification checks.
- [ ] **No external dependencies**: Zero unapproved runtime dependencies added to `package.json`.

## Terminal Verification Evidence
<!-- Paste output of 'npm test' or affected test commands here with exit codes -->
```text

```
