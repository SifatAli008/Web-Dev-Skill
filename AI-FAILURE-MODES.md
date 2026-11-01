# Universal WebDev Skills: Common AI Coding Failure Modes

This catalogue details documented traps, cognitive failures, and security anti-patterns exhibited by Large Language Models when generating code. All specialist skills reference these failure modes to enforce defensive countermeasures.

---

## 1. Top AI Coding Traps

### FM-01: Hallucinated Packages and APIs
- **Symptom:** Inventing npm/pip packages, non-existent configuration flags, or phantom library methods that look plausible.
- **Root Cause:** Next-token completion predicting syntactically elegant names rather than verified runtime APIs.
- **Countermeasure:** [AGENTS.md Rule 2] Verify that a package and version exists in registry before importing. Test imports in terminal.

### FM-02: Insecure Defaults & False Security
- **Symptom:** Generating SQL queries with template literals (`SELECT * FROM users WHERE id = ${id}`), disabling CORS (`*`), using `dangerouslySetInnerHTML`, storing plaintext passwords, or disabling TLS verification (`NODE_TLS_REJECT_UNAUTHORIZED=0`).
- **Root Cause:** Training corpora containing quick tutorial snippets optimized for brief tutorials rather than production security.
- **Countermeasure:** `06-security` holds HARD VETO. Require parameterized queries, strict CSP headers, and schema-enforced input validation (Zod/Valibot).

### FM-03: Premature Distributed Over-Engineering
- **Symptom:** Recommending Kafka, Kubernetes, multi-region DynamoDB, microservices, and GraphQL for an MVP with zero users.
- **Root Cause:** Over-representation of enterprise tech blog posts in training data.
- **Countermeasure:** `02-architecture` monolith-first rule. Start with a single relational database (PostgreSQL/SQLite) and modular monolith.

### FM-04: Phantom Verification ("Evidence by Assertion")
- **Symptom:** Stating "I have tested the endpoint and verified all security checks pass" when no terminal command was executed.
- **Root Cause:** RLHF bias toward pleasing the user and asserting confidence.
- **Countermeasure:** Prime Directive 2 & `08-testing-qa` rule: "No evidence, no ship". Terminal output with exit code must be displayed.

### FM-05: Missing Dynamic UI States & Accessibility Violations
- **Symptom:** Generating React/Svelte components that assume network requests always succeed immediately. Zero `<Suspense>`, no skeleton loading, no error boundaries, no empty states, div buttons without `role="button"` or `onKeyDown`.
- **Root Cause:** LLM code snippet training favors the happy path.
- **Countermeasure:** `03-ux-ui-design` A11y gate: Verify keyboard tab navigation, screen reader labels, and 5-state lifecycle (idle, loading, error, empty, success).

### FM-06: Outdated & Deprecated Syntax
- **Symptom:** Emitting Next.js Pages router patterns in App router projects, class components instead of functional components, deprecated React lifecycle hooks, or legacy Node callback patterns.
- **Root Cause:** Training datasets heavily weighted with code written prior to framework paradigm shifts.
- **Countermeasure:** Inspect existing repo dependencies and lockfiles (`package.json`) before generating framework code.

### FM-07: Destructive Non-Reversible Database Migrations
- **Symptom:** Emitting `ALTER TABLE users DROP COLUMN name` or destructive table recreation scripts without an expand-and-contract migration strategy.
- **Root Cause:** Disregard for zero-downtime production operations.
- **Countermeasure:** `05-backend-data` rule: Expand-and-contract migration procedure with forward/rollback compatibility.

### FM-08: Dark-Pattern Consent & Privacy Violations
- **Symptom:** Injecting Google Analytics / Meta Pixel scripts directly into `<head>` without checking user consent or providing opt-out mechanisms.
- **Root Cause:** Ubiquity of tracking snippets in web examples.
- **Countermeasure:** `07-privacy-compliance` HARD VETO: Server-side or consent-gated tracking strictly enforced.

