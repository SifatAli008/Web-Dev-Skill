# Playbook: Framework & Dependency Upgrade (`dependency-upgrade`)

> **Objective:** Upgrade core framework versions (e.g. Next.js major, React, Node LTS) and package dependencies without regressions, lockfile corruptions, or production outages.

---

## 1. Specialists Involved
- `14-maintenance`: Upgrade roadmap, breaking change triage, lockfile hygiene, deprecation audit.
- `04-frontend`: Frontend component migrations, codemods, syntax modernization.
- `05-backend-data`: ORM and datastore driver updates, connection compatibility.
- `08-testing-qa`: Comprehensive regression testing across unit, integration, and e2e suites (No evidence, no ship).
- `06-security`: Dependency vulnerability scan (audit) and provenance verification.

---

## 2. Ordered Steps

### Step 1: Pre-Upgrade Audit & Baseline Testing (`14-maintenance` + `08-testing-qa`)
1. Verify git working directory is clean: `git status`.
2. Run existing test suite and confirm 100% green baseline:
   ```bash
   npm test
   ```
3. Check outdated packages:
   ```bash
   npm outdated
   ```

### Step 2: Read Official Migration Guides & Changelogs (`14-maintenance`)
1. Review official upgrade guides for major versions (e.g. Next.js 14 -> 15 migration guide).
2. Catalog breaking changes affecting:
   - Deprecated configuration options (`next.config.js`).
   - Signature changes in core API methods or hooks.
   - Node.js runtime version requirements.

### Step 3: Run Official Codemods (`14-maintenance` + `04-frontend`)
1. Execute framework-provided automated transformation tools (codemods):
   ```bash
   npx @next/codemod@latest upgrade
   ```
2. Inspect `git diff` to verify codemod changes match expectations.

### Step 4: Update Lockfiles & Install (`14-maintenance`)
1. Update package version in `package.json`.
2. Install with exact resolution:
   ```bash
   pnpm install --frozen-lockfile=false
   ```
3. Run security vulnerability scan on updated tree:
   ```bash
   npm audit
   ```

### Step 5: TypeScript Compilation & Test Execution (`08-testing-qa`)
1. Run strict type checking:
   ```bash
   npx tsc --noEmit
   ```
2. Execute full automated test suite:
   - Unit tests
   - API integration tests
   - Playwright e2e browser tests
3. Fix any breaking API changes or test failures.

### Step 6: Staging Deployment & Sanity Smoke Test (`09-devops-infra` + `08-testing-qa`)
1. Deploy to staging environment.
2. Execute end-to-end smoke tests verifying server rendering, auth cookies, and client bundle loading.

---

## 3. Quality Gates
- **Security Gate (`06-security`):** Zero high or critical vulnerabilities introduced by updated dependencies.
- **QA Gate (`08-testing-qa`):** Complete test suite passes with exit code 0.
- **Maintenance Gate (`14-maintenance`):** Zero deprecated syntax warnings emitted in production build output.

---

## 4. Rollback Procedure
If the upgrade produces elusive runtime bugs during staging or canary deployment:
1. Revert the upgrade branch: `git checkout main && git branch -D feature/upgrade`.
2. Re-install frozen lockfile: `pnpm install --frozen-lockfile`.
3. Document blocker in `tech-debt-register.schema.json` with upstream issue tracker link.

---

## 5. Evidence Required to Call Done
1. Passing output from `npm test` and `npx tsc --noEmit`.
2. `npm audit` displaying 0 vulnerabilities.
3. Successful staging build log and passing e2e smoke tests.
