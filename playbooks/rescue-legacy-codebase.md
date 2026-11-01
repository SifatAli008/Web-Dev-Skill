# Playbook: Rescue Legacy Untested Codebase (`rescue-legacy-codebase`)

> **Objective:** Systematically stabilize, test, refactor, and modernize an inherited, undocumented, or fragile legacy codebase without causing regressions or halting feature velocity.

---

## 1. Specialists Involved
- `14-maintenance`: Strangler Fig pattern architecture, technical debt register, legacy modernization roadmap.
- `08-testing-qa`: Characterization test authoring, golden master testing, safety net establishment (No evidence, no ship).
- `02-architecture`: Boundary identification, modular encapsulation, database abstraction.
- `06-security`: Dependency vulnerability remediation, hardcoded secret extraction (HARD VETO).

---

## 2. Ordered Steps

### Step 1: Establish Git Safety Net & Freeze Risky Commits (`14-maintenance`)
1. Create a baseline snapshot branch: `git checkout -b baseline-snapshot`.
2. Do NOT attempt any refactoring or code cleanup yet.
3. Catalog known pain points in `tech-debt-register.schema.json`.

### Step 2: Extract Hardcoded Secrets & Scan CVEs (`06-security`)
1. Scan for hardcoded credentials, API keys, and connection strings:
   ```bash
   grep -rn "postgres://" --include="*.js"
   ```
2. Move credentials to `.env` file; verify `.env` is listed in `.gitignore`.
3. Run `npm audit` and patch any critical remote-code-execution (RCE) vulnerabilities.

### Step 3: Author Characterization Tests ("Golden Master") (`08-testing-qa`)
1. Never refactor code without automated tests!
2. Write **Characterization Tests** around the legacy system's public API endpoints or core services:
   - Pass valid inputs and record the exact current outputs (including quirks and legacy status codes).
   - Pass boundary inputs and record the outputs.
3. These tests establish the "Golden Master": they verify that existing behavior does not change during refactoring.

### Step 4: Apply the Strangler Fig Pattern (`14-maintenance` + `02-architecture`)
1. Identify the single highest-value or most painful module to modernize (e.g. `/api/orders`).
2. Implement a reverse proxy or middleware layer that routes traffic:
   - `/api/orders` -> New Modern Modular Service.
   - All other routes -> Legacy Codebase.
3. Build the new module with modern TypeScript, schema validation (Zod), and unit tests.
4. Verify that the Characterization Tests pass identically against the new module.

### Step 5: Cutover & Decommission Legacy Module (`14-maintenance`)
1. Route 100% of traffic to the new module in staging, then production.
2. Monitor error logs for 48 hours.
3. Delete the legacy code for that module (`git rm legacy/orders.js`).
4. Repeat Step 4 and Step 5 for the next domain module.

---

## 3. Quality Gates
- **QA Gate (`08-testing-qa`):** Characterization test suite passes 100% with zero observable behavioral regressions.
- **Security Gate (`06-security`):** Zero hardcoded secrets remaining in source code.
- **Maintenance Gate (`14-maintenance`):** Technical debt register initialized and updated.

---

## 4. Rollback Procedure
If a refactored module exhibits unexpected bugs in production:
1. Re-route the proxy rule back to the legacy endpoint immediately.
2. Update the Characterization Test suite with the missing edge case test before attempting a second refactoring pass.

---

## 5. Evidence Required to Call Done
1. Passing Characterization Test suite terminal log output.
2. Clean `git diff` showing deletion of legacy file and replacement with modular modern code.
3. Verified technical debt register tracking remaining legacy modules.
