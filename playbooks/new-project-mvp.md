# Playbook: Bootstrap New Project to MVP (`new-project-mvp`)

> **Objective:** Take a raw project concept from inception to a secure, functioning, tested MVP ready for initial user validation.

---

## 1. Specialists Involved
- `00-orchestrator`: Rigor tier classification, sprint sequence, process gate.
- `01-product-discovery`: Persona definition, JTBD, MoSCoW scope cut (Must-Haves <= 5).
- `02-architecture`: Modular monolith design, relational data models, ADR authoring.
- `03-ux-ui-design`: Accessible wireframes, design tokens, 5-state lifecycle specifications.
- `04-frontend`: Component scaffolding, routing, form validation, error boundaries.
- `05-backend-data`: Database schemas, foreign keys, migrations, seed scripts.
- `06-security`: Baseline threat model, input validation schemas, secret handling.
- `08-testing-qa`: Core happy-path integration tests and test report certification.

---

## 2. Ordered Steps

### Step 1: Intake & Rigor Classification (`00-orchestrator`)
1. Scan project prompt for PROD signals (user accounts, emails, payments).
2. Classify tier (MVP vs PROD). If PROD signals exist, enforce PROD rigor unless explicit user override is logged in `DECISIONS.md`.
3. Select minimal specialist roster via `skills.index.json`.

### Step 2: Product Discovery & Scope Cut (`01-product-discovery`)
1. Extract Job-to-be-Done (JTBD): "When [context], I want to [action], so I can [outcome]."
2. Ruthlessly limit Must-Haves to 3–5 core capabilities. Push all else to Won't Have (This Cycle).
3. Output and validate `templates/schemas/prd.schema.json`.

### Step 3: Architecture & Data Modeling (`02-architecture`)
1. Adopt Modular Monolith pattern (single repo, single relational database).
2. Define domain entities and relationships.
3. Record architectural choices in `DECISIONS.md` matching `templates/schemas/adr.schema.json`.

### Step 4: UI Design Tokens & 5-State Specs (`03-ux-ui-design`)
1. Establish base WCAG 2.2 AA compliant tokens (4.5:1 text contrast, 44x44px touch targets).
2. Specify 5 states for the main view: Idle, Loading, Error, Empty, and Success.

### Step 5: Backend & Datastore Scaffolding (`05-backend-data` + `06-security`)
1. Scaffold relational database schema (PostgreSQL / SQLite).
2. Enforce strict data types: `TIMESTAMPTZ` for dates, integer cents for money.
3. Validate all incoming API inputs using schema validation (Zod).

### Step 6: Frontend Implementation (`04-frontend`)
1. Scaffold layout, routes, and components.
2. Implement native forms with accessible `<label>` and error states.
3. Wrap async views in `<Suspense>` and `<ErrorBoundary>`.

### Step 7: Automated Test Verification (`08-testing-qa`)
1. Author unit tests for business calculations and integration tests for core API routes.
2. Execute test suite via terminal.

---

## 3. Quality Gates
- **Process Gate (`00-orchestrator`):** PRD and ADR schemas valid.
- **Security Check (`06-security`):** Zero hardcoded secrets, input validation on all routes.
- **QA Gate (`08-testing-qa`):** Automated test suite passes with exit code 0.

---

## 4. Rollback Procedure
If the initial bootstrap fails or dependencies conflict:
1. Revert to initial git commit: `git reset --hard HEAD~1`.
2. Clean untracked build artifacts: `git clean -fd`.
3. Review and swap conflicting framework dependencies before re-initiating.

---

## 5. Evidence Required to Call Done
1. `npm test` or `vitest run` passes with 100% green tests.
2. Initial user can load the application, submit the core interaction form, and view persisted data.
3. `PROGRESS.md` updated with phase completion.
