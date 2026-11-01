# Playbook: SQAT Quality Gate & Test Suite Audit

> **Focus:** Software Quality Assurance and Testing (SQAT) Audit  
> **Participating Specialists:** `08-testing-qa` (Lead), `06-security`, `04-frontend`, `05-backend-data`  
> **Output Artifact:** Verified Test Report with SQAT Quality Gate certification  
> **Standard:** ISO/IEC/IEEE 29119, SonarQube Clean as You Code, Stryker Mutator

---

## 1. When to Run This Playbook

- Prior to promoting an application from staging to production.
- When inheriting an untested or regression-prone codebase.
- When CI builds frequently fail due to flaky or brittle tests.
- When establishing a formal Quality Gate for automated PR merges.

---

## 2. Step-by-Step Procedure

### Phase 1: Static Quality & Complexity Audit (SQA)
1. Run linter and type-checker:
   ```bash
   npm run lint && npx tsc --noEmit
   ```
   *Gate:* Must produce **0 errors**.
2. Measure Cyclomatic and Cognitive Complexity across modules:
   - Identify functions with cyclomatic complexity $> 10$.
   - Refactor deeply nested conditionals into early returns or strategy lookups.
3. Check for duplicated code blocks ($< 3\%$ permitted).

### Phase 2: Dynamic Test Pyramid Verification (SQC)
1. Verify test distribution across the pyramid:
   - 70% fast unit tests (pure calculation and domain logic).
   - 20% integration tests with database transaction rollback.
   - 10% Playwright e2e tests for core business flows.
2. Verify test execution in terminal:
   ```bash
   npm test
   ```
   *Gate:* 100% pass rate (Exit code 0). Zero skipped tests without an associated issue tracking link.

### Phase 3: Mutation Testing & Vacuous Test Elimination
1. Run Stryker mutation tests on business-critical pricing, auth, or state modules:
   ```bash
   npx stryker run
   ```
2. Measure Mutation Score:
   - Minimum passing threshold: **$\ge 70\%$ Mutation Score**.
   - Review any surviving mutants: verify whether tests are missing assertions or if dead code exists.

### Phase 4: Automated Accessibility & Browser Verification
1. Run Playwright with `@axe-core/playwright` on all critical page templates:
   ```bash
   npx playwright test --project=a11y
   ```
   *Gate:* **Zero WCAG 2.2 Level AA violations**.

### Phase 5: Flaky Test Quarantine Audit
1. Audit CI test execution history for intermittent failures.
2. Any test with intermittent failures must be immediately tagged with `@quarantine` and removed from blocking CI pipelines.
3. Run quarantined tests in an isolation loop:
   ```bash
   for i in {1..50}; do npx playwright test tests/e2e/flaky-spec.ts || break; done
   ```

### Phase 6: SQAT Quality Gate Sign-Off
1. Compile findings and produce a schema-valid `test-report.schema.json`.
2. Authority check: If any gate condition failed, mark status as `BLOCKED_TESTS_FAILED` and halt release.

---

## 3. Verification Checklist

- [ ] Static analysis produces 0 errors and 0 unhandled warnings.
- [ ] No function exceeds cyclomatic complexity of 10 without documented architectural exemption.
- [ ] Automated test suite achieves $\ge 80\%$ line coverage and passes with exit code 0.
- [ ] Mutation testing achieves $\ge 70\%$ mutation score on business calculation logic.
- [ ] Automated accessibility scan reports 0 WCAG 2.2 AA violations.
- [ ] Zero flaky tests exist in the main deployment branch.
