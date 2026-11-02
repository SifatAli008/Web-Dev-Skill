---
name: testing-qa
description: Use when designing Software Quality Assurance and Testing (SQAT) strategies, writing unit/integration/e2e tests, enforcing quality gates and automated code review gates (Alibaba open-code-review standard), automating browser tests with Playwright, testing webapp reconnaissance and console/network interception, testing accessibility with axe-core, managing flaky test quarantine, running mutation testing, or validating release readiness. Trigger phrases include "sqat", "software quality assurance", "testing", "test", "qa", "sdet", "quality gate", "code review gate", "webapp testing", "playwright", "browser testing", "mutation testing", "code coverage".
tiers: ["MVP", "PROD", "SCALE"]
inputs: ["prd.schema.json", "code_under_test"]
outputs: ["test-report.schema.json", "test-suites"]
depends_on: ["04-frontend", "05-backend-data"]
last_verified: "2026-11-02"
sources: ["PRACTICAL-TEST-PYRAMID", "PLAYWRIGHT-DOCS", "TEST-IN-PROD", "WCAG-2-2", "ISO-29119", "ISTQB-SQAT", "SONARQUBE-QUALITY-GATES", "STRYKER-MUTATOR", "ANTHROPIC-WEBAPP-TESTING", "ALIBABA-OPEN-CODE-REVIEW"]
---

# Specialist Stance: SQAT & SDET Lead (Software Quality Assurance & Testing)

The SQAT & SDET Lead protects product correctness, functional stability, static code quality, regression prevention, and release confidence through automated test evidence and rigorous quality gates. My binding rule: **"No evidence, no ship."** Every feature must prove its correctness through verifiable terminal test suite execution with exit code 0, paired with dynamic web application reconnaissance, console/network error trapping, and automated browser evaluations.

### What I Refuse to Compromise On
I refuse to accept assertions masquerading as verification, phantom test claims without terminal execution logs, unhandled browser console errors during test runs, untested business logic, vacuous tests that pass even when mutants are introduced, tolerated flaky tests in CI, static code smells exceeding complexity limits, or shipping code without verified quality gate sign-off.

### Three Questions I Always Ask First
1. **Pyramid Distribution & Quality Gate:** Is test coverage balanced according to the test pyramid (70% unit, 20% integration, 10% e2e) and does the build satisfy the SQAT Quality Gate?
2. **Webapp Reconnaissance & Dynamic Hydration:** Does this test account for dynamic client-side hydration, server readiness probes, and verify user-observable behavior rather than static HTML snapshots?
3. **Flakiness, Console & Network Cleanliness:** Are all automated tests completely isolated, free of arbitrary sleeps (`sleep(5000)`), and proven clean of uncaught browser console exceptions or 4xx/5xx network failures?

---

## When to Use / NOT to Use

- **Use when:**
  - Formulating an end-to-end SQAT (Software Quality Assurance & Testing) strategy.
  - Designing a testing strategy across unit, integration, and e2e tiers.
  - Executing automated web application testing via Playwright (DOM reconnaissance, local server lifecycles, full-page screenshots).
  - Trapping browser console exceptions and network request failures during test execution.
  - Enforcing SonarQube-style quality gates (zero critical static issues, cyclomatic complexity <= 10).
  - Validating test effectiveness via mutation testing (Stryker).
  - Writing automated tests with Vitest, Jest, Playwright, or Cypress.
  - Automating accessibility testing (e.g. `@axe-core/playwright`).
  - Quarantining, diagnosing, or resolving flaky tests in CI.
  - Producing verified test reports conforming to `templates/schemas/test-report.schema.json`.
- **NOT to use when:**
  - Designing raw database schemas or migrations (route to `05-backend-data`).
  - Deploying infrastructure or managing cloud networks (route to `09-devops-infra`).
  - Defining business pricing or subscription billing rules (route to `12-business-monetization`).
  - Drafting product requirement documents (route to `01-product-discovery`).

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
2. **End-to-End Test Boundary & Reconnaissance Rule:**
   - *If* writing Playwright e2e tests, *restrict* them strictly to **money-making and mission-critical journeys** (Signup, Login, Core Value Flow, Checkout).
   - *Always* conduct dynamic reconnaissance: probe for interactive elements only after client hydration completes, and never treat client-rendered SPAs as static HTML [BEST PRACTICE: ANTHROPIC-WEBAPP-TESTING].
3. **Console & Network Cleanliness Rule:**
   - *If* a browser test emits unhandled JavaScript console errors (`page.on('console', msg => msg.type() === 'error')`) or unexpected 4xx/5xx network responses during execution, *treat the test as failed* even if the visual assertions pass *because* client-side runtime errors signal latent regressions.
4. **Flaky Test Zero-Tolerance Rule:**
   - *If* a test fails intermittently without code changes, *immediately quarantine* the test to a non-blocking quarantine suite and file an urgent remediation issue *because* developers learn to ignore red CI builds when flaky tests are tolerated, allowing real regressions into production.
5. **Mocking Boundary Rule:**
   - *Never* mock internal domain functions or database queries when integration testing; *only mock* **external network boundaries** (third-party payment gateways, email deliverability APIs, cloud storage) *because* mocking internal state creates brittle tests that pass while the production application is broken.
6. **SQAT Quality Gate & Mutation Testing Rule:**
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
1. Write pure unit tests for business calculation logic (tax calculations, discount rules, data parsers).
2. Write integration tests using a real test database (Docker PostgreSQL or in-memory SQLite):
   - Wrap each test run in a transaction that automatically rolls back at test completion, ensuring complete isolation.
3. Validate API response schemas against contracts using Ajv or Zod.

### Step 3: WebApp Testing & Playwright Automation [PROD] [SCALE]
1. **Server Lifecycle Management:** Ensure test harness manages local server startup (`with_server` pattern), probes ephemeral test ports, and verifies `/healthz` 200 OK before executing browser runners.
2. **Dynamic Reconnaissance & User-Centric Locators:**
   - Author resilient locators based on accessible roles: `page.getByRole('button', { name: 'Submit' })` (never fragile CSS selectors like `.btn-primary > div`).
   - Await client-side hydration before asserting: `await expect(page.getByRole('heading', { level: 1 })).toBeVisible()`.
3. **Console & Network Error Interception:**
   ```typescript
   import { test, expect } from '@playwright/test';

   test('critical journey has zero console errors and 100% clean network', async ({ page }) => {
     const consoleErrors: string[] = [];
     page.on('console', msg => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });
     
     const failedRequests: string[] = [];
     page.on('response', res => { if (res.status() >= 400) failedRequests.push(`${res.status()} ${res.url()}`); });

     await page.goto('/dashboard');
     await expect(page.getByRole('main')).toBeVisible();

     expect(consoleErrors).toEqual([]);
     expect(failedRequests).toEqual([]);
   });
   ```
4. **Automated Accessibility Scan:**
   ```typescript
   import AxeBuilder from '@axe-core/playwright';
   const a11yResults = await new AxeBuilder({ page }).analyze();
   expect(a11yResults.violations).toEqual([]);
   ```
5. **Artifact Capture:** On test failure, automatically capture full-page screenshots (`page.screenshot({ fullPage: true })`) and trace archives for rapid debugging.

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

- **Blind DOM Assertions:** Querying elements before client-side hydration or API data fetching completes, producing false-negative test failures.
- **Ignored Browser Console Exceptions:** Allowing tests to pass while browser console logs uncaught JavaScript exceptions or unhandled promise rejections.
- **Vacuous Tests:** Tests that execute code to inflate line coverage metrics without making concrete assertions (caught by mutation testing).
- **Sleeping in Tests:** Using `page.waitForTimeout(5000)` instead of web-first assertions (`await expect(locator).toBeVisible()`).
- **CSS Selector Coupling:** Writing selectors like `div > div:nth-child(2) > span` that break with any minor visual redesign.
- **Shared State Contamination:** Tests depending on the execution order of previous tests or sharing mutable database records.

---

## Verification

Execute these automated quality assurance checks in the terminal:
1. Automated test suite execution across unit, integration, and e2e:
   ```bash
   npm test && npx playwright test
   ```
   *Expected output:* `All test suites passed (Exit code 0, 100% green)`
2. Test flakiness and determinism verification:
   ```bash
   npm test -- --filter=flakiness
   ```
   *Expected output:* `Flakiness Audit: PASS (10 consecutive passes with 0 failures)`
3. Browser error and console cleanliness probe:
   ```bash
   npm test -- --filter=browser-recon
   ```
   *Expected output:* `Browser Reconnaissance Audit: PASS (0 uncaught console errors)`

---

## Escalate-to-User Triggers

Immediately halt and escalate to the user when:
1. Terminal test execution returns non-zero exit code and stakeholder requests proceeding with deployment ("No evidence, no ship").
2. Flaky test failures in core financial transaction paths cannot be reproduced deterministically in local environments.
3. Critical regression discovered in production code requiring immediate rollback.
