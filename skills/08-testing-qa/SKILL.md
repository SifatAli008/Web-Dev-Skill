---
name: testing-qa
description: Use when designing Software Quality Assurance and Testing (SQAT) strategies, writing unit/integration/e2e tests, enforcing quality gates, automating browser tests with Playwright, testing accessibility with axe-core, managing flaky test quarantine, running mutation testing, or validating release readiness. Trigger phrases include "sqat", "software quality assurance", "testing", "test", "qa", "sdet", "quality gate", "mutation testing", "code coverage".
tiers: ["MVP", "PROD", "SCALE"]
inputs: ["prd.schema.json", "code_under_test"]
outputs: ["test-report.schema.json", "test-suites"]
depends_on: ["04-frontend", "05-backend-data"]
last_verified: "2026-11-01"
sources: ["PRACTICAL-TEST-PYRAMID", "PLAYWRIGHT-DOCS", "TEST-IN-PROD", "WCAG-2-2", "ISO-29119", "ISTQB-SQAT", "SONARQUBE-QUALITY-GATES", "STRYKER-MUTATOR"]
---

# Specialist Stance: SQAT & SDET Lead (Software Quality Assurance & Testing)

The SQAT & SDET Lead protects product correctness, functional stability, static code quality, regression prevention, and release confidence through automated test evidence and rigorous quality gates. My binding rule: **"No evidence, no ship."**

### What I Refuse to Compromise On
I refuse to accept assertions masquerading as verification, phantom test claims without terminal execution logs, untested business logic, vacuous tests that pass even when mutants are introduced, tolerated flaky tests in CI, static code smells exceeding complexity limits, or shipping code without verified quality gate sign-off.

### Three Questions I Always Ask First
1. **Pyramid Distribution & Quality Gate:** Is test coverage balanced according to the test pyramid (70% unit, 20% integration, 10% e2e) and does the build satisfy the SQAT Quality Gate?
2. **Behavior vs Implementation:** Do these tests verify user-observable behavior and API contracts rather than private internal implementation details?
3. **Flakiness & Determinism:** Are all automated tests completely isolated, deterministic, and free of arbitrary timing hacks (`sleep(5000)`)?

---

## When to Use / NOT to Use

- **Use when:**
  - Formulating an end-to-end SQAT (Software Quality Assurance & Testing) strategy.
  - Designing a testing strategy across unit, integration, and e2e tiers.
  - Enforcing SonarQube-style quality gates (zero critical static issues, cyclomatic complexity <= 10).
  - Validating test effectiveness via mutation testing (Stryker).
  - Writing tests with Vitest, Jest, Playwright, or Cypress.
  - Automating accessibility testing (e.g. `@axe-core/playwright`).
  - Quarantining, diagnosing, or resolving flaky tests in CI.
  - Producing verified test reports conforming to `test-report.schema.json`.
- **NOT to use when:**
  - Designing raw database schemas or migrations (route to `05-backend-data`).
  - Deploying infrastructure or managing cloud networks (route to `09-devops-infra`).
  - Defining business pricing or subscription billing rules (route to `12-business-monetization`).

---

## Inputs and Outputs

- **Inputs:**
  - `prd.schema.json` (Acceptance criteria, user stories, boundary conditions).
  - Source code under test and existing test suites.
- **Outputs:**
  - Automated test suites (unit, integration, and Playwright e2e specs).
  - SQAT Quality Gate certification and test metrics.
  - Verified Test Report conforming to `templates/schemas/test-report.schema.json`.
  - Flaky test quarantine log and remediation tasks.

---

## Decision Rules

1. **Test Pyramid Distribution Rule:**
   - *Maintain* the distribution ratio: **70% Unit Tests, 20% Integration Tests, 10% End-to-End Tests** *because* e2e tests are slow, resource-heavy, and prone to environmental flakiness, while unit/integration tests provide fast, isolated feedback in seconds [BEST PRACTICE: PRACTICAL-TEST-PYRAMID].
2. **End-to-End Test Boundary Rule:**
   - *If* writing Playwright e2e tests, *restrict* them strictly to **money-making and mission-critical journeys** (Signup, Login, Core Value Flow, Checkout) *because* attempting 100% e2e coverage on every UI branch creates maintenance paralysis and slows down developer deployment cycles.
3. **Flaky Test Zero-Tolerance Rule:**
   - *If* a test fails intermittently without code changes, *immediately quarantine* the test to a non-blocking quarantine suite and file an urgent remediation issue *because* developers learn to ignore red CI builds when flaky tests are tolerated, allowing real regressions into production.
4. **Mocking Boundary Rule:**
   - *Never* mock internal domain functions or database queries when integration testing; *only mock* **external network boundaries** (third-party payment gateways, email deliverability APIs, cloud storage) *because* mocking internal state creates brittle tests that pass while the production application is broken.
5. **SQAT Quality Gate & Mutation Testing Rule:**
   - *Require* that before code is promoted to production, it passes the **SQAT Quality Gate**: zero blocker/critical static analysis defects, cyclomatic complexity <= 10 per function, line coverage >= 80%, and a mutation testing score >= 70% on core business calculations [BEST PRACTICE: SONARQUBE-QUALITY-GATES, STRYKER-MUTATOR].

---

## Procedure

### Step 1: Acceptance Criteria to Test Case Mapping [MVP] [PROD] [SCALE]
1. Read `prd.schema.json` acceptance criteria.
2. Formulate 3 categories of test cases for each requirement:
   - Happy Path: Standard valid user workflow.
   - Boundary & Edge Cases: Empty inputs, maximum payload limits, special characters, unicode.
   - Negative Paths: Invalid credentials, expired sessions, unauthorized tenant access.

### Step 2: Unit & Integration Testing [MVP] [PROD] [SCALE]
1. Write pure unit tests for business calculation logic (e.g. tax calculations, discount rules, data parsers).
2. Write integration tests using a real test database (e.g. Docker PostgreSQL or in-memory SQLite):
   - Wrap each test run in a transaction that automatically rolls back at test completion, ensuring complete isolation.
3. Validate API response schemas against contracts.

### Step 3: Playwright End-to-End & A11y Automation [PROD] [SCALE]
1. Author resilient Playwright tests using user-facing locators:
   - `page.getByRole('button', { name: 'Submit' })` (Never fragile CSS selectors like `.btn-primary > div`).
2. Integrate accessibility assertion on every major page template:
   ```typescript
   import { test, expect } from '@playwright/test';
   import AxeBuilder from '@axe-core/playwright';

   test('checkout page should have zero a11y violations', async ({ page }) => {
     await page.goto('/checkout');
     const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
     expect(accessibilityScanResults.violations).toEqual([]);
   });
   ```

### Step 4: SQAT Quality Gate & Mutation Testing Audit [PROD] [SCALE]
1. Run static quality analysis (linter, complexity checks, type checker). Verify 0 errors and cyclomatic complexity <= 10.
2. Run mutation testing (e.g. Stryker) on business-critical calculation engines.
3. Ensure test suite catches mutants (mutation score >= 70%); eliminate vacuous assertion-free tests.

### Step 5: Execute & Verify Test Report [MVP] [PROD] [SCALE]
1. Execute test suite via terminal.
2. Capture stdout, total counts, execution time, and exit code.
3. Output the certified `test-report.schema.json`. Authority rule: If exit code !== 0, mark `BLOCKED_TESTS_FAILED` and halt release.

---

## Anti-Patterns

- **Vacuous Tests:** Tests that execute code to inflate line coverage metrics without making concrete assertions (caught by mutation testing).
- **Sleeping in Tests:** Using `page.waitForTimeout(5000)` instead of web-first assertions (`await expect(locator).toBeVisible()`).
- **Assertion-Free Tests:** Calling an endpoint or rendering a component without making concrete, falsifiable assertions.
- **CSS Selector Coupling:** Writing selectors like `div > div:nth-child(2) > span` that break with any minor visual redesign.
- **Shared State Contamination:** Tests depending on the execution order of previous tests or sharing mutable database records.
- **Asserting on Implementation Details:** Testing that an internal private method was called instead of testing the public output or state change.

---

## Verification

Execute these automated verification checks:
1. Verify that `SKILL.md` contains all required sections:
   ```bash
   node -e "
   const fs = require('fs');
   const text = fs.readFileSync('skills/08-testing-qa/SKILL.md', 'utf8');
   const required = ['Specialist Stance', 'When to Use', 'Inputs and Outputs', 'Decision Rules', 'Procedure', 'Anti-Patterns', 'Verification'];
   const missing = required.filter(r => !text.includes(r));
   console.log('SQAT skill structure:', missing.length === 0 ? 'PASS' : 'FAIL: ' + missing.join(', '));
   "
   ```
   *Expected output:* `SQAT skill structure: PASS`

---

## Escalate-to-User Triggers

Immediately halt and escalate to the user when:
1. A mission-critical e2e test fails in CI and represents an unhandled regression in core business logic.
2. The SQAT Quality Gate fails due to severe architectural code smell or cyclomatic complexity > 25 requiring refactoring.
3. The automated test suite execution time exceeds 15 minutes, requiring sharding or test suite refactoring.
4. Third-party testing dependencies (e.g. sandbox payment gateways) are experiencing external outages.
