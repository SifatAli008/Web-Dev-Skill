# SQAT Standards, Quality Gates, and Mutation Testing Guide

> **Domain:** Software Quality Assurance and Testing (SQAT)  
> **Authority:** ISO/IEC/IEEE 29119, ISO/IEC 25010, ISTQB Advanced, SonarQube Quality Gates, Stryker Mutator  
> **Applies to:** MVP, PROD, SCALE tiers

---

## 1. The SQAT Discipline: SQA vs SQC

Software Quality Assurance and Testing (SQAT) is a dual-discipline framework that integrates proactive quality assurance with reactive dynamic testing:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                 SQAT (Software Quality Assurance & Testing)                 │
├──────────────────────────────────────┬──────────────────────────────────────┤
│    SQA (Software Quality Assurance)  │   SQC & ST (Quality Control/Testing) │
│         [Defect Prevention]          │          [Defect Detection]          │
├──────────────────────────────────────┼──────────────────────────────────────┤
│ • Static Analysis & AST Linting      │ • Unit & Integration Test Suites     │
│ • Cyclomatic & Cognitive Complexity  │ • Playwright E2E Browser Automation  │
│ • Clean as You Code Quality Gates    │ • Mutation Testing (Fault Injection) │
│ • Coding Standards & Architecture    │ • Accessibility Automation (axe-core)│
│ • Flaky Test Quarantine Protocol     │ • Contract & API Boundary Testing    │
└──────────────────────────────────────┴──────────────────────────────────────┘
```

- **SQA (Quality Assurance):** Focuses on the *process* of software development to prevent defects before code enters testing. Enforces coding standards, complexity limits, peer reviews, and automated CI quality gates.
- **SQC / ST (Quality Control & Testing):** Focuses on the *product* by dynamically executing software against deterministic test oracles to verify that observable behavior matches specifications.

---

## 2. Static Quality Analysis Metrics & Thresholds

Static analysis inspects code without executing it, catching syntax errors, potential null-pointer dereferences, code smells, and unbounded algorithmic complexity.

| Metric | Target Standard | Blocker Threshold | Tooling |
|---|---|---|---|
| **Cyclomatic Complexity (McCabe)** | $\le 10$ per function | $> 15$ blocks merge | ESLint `complexity`, Biome |
| **Cognitive Complexity** | $\le 15$ per function | $> 20$ blocks merge | SonarQube, CodeClimate |
| **Maintainability Index** | $\ge 75 / 100$ | $< 65$ blocks merge | radon, plato, complex |
| **Duplicated Blocks** | $< 3\%$ codebase | $> 5\%$ blocks merge | jscpd, SonarQube |
| **TypeScript Strictness** | `strict: true` | `any` casts in domain logic | `tsc --noEmit` |

### Remediating High Cyclomatic Complexity
When a function exceeds cyclomatic complexity of 10:
1. **Extract Strategy Pattern:** Replace cascading `switch` or nested `if-else` statements with dictionary lookups or polymorphism.
2. **Early Return Guard Clauses:** Invert nested conditionals to exit early (`if (!user) return null;`).
3. **Decompose Multi-Responsibility Functions:** Split monolithic functions into single-responsibility, pure helper functions.

---

## 3. Dynamic Test Pyramid & Coverage Standards

```
          / \
         / E2E \        10% (Playwright: Critical user journeys & a11y)
        /───────\
       / Integr. \      20% (API contracts, DB transactions with rollback)
      /───────────\
     /    Unit     \    70% (Pure business logic, math, state transitions)
    /───────────────\
```

### Coverage Thresholds by Rigor Tier
- **MVP Tier:** $\ge 60\%$ line coverage on core business logic.
- **PROD Tier:** $\ge 80\%$ line coverage, $\ge 75\%$ branch coverage across all backend services and frontend state machines.
- **SCALE Tier:** $\ge 85\%$ line coverage, $\ge 80\%$ branch coverage, and verified mutation score $\ge 70\%$.

---

## 4. Mutation Testing: Auditing the Tests

Line coverage metrics can be dangerously misleading: an engineer can achieve 100% line coverage with **vacuous tests** (tests that invoke functions but never assert on return values or state mutations).

**Mutation testing** injects synthetic bugs ("mutants") into source code (e.g. changing `>` to `<`, `+` to `-`, or deleting function calls) and runs the test suite against each mutant.
- **Killed Mutant:** The test suite fails when the bug is introduced (**Desired outcome**).
- **Surviving Mutant:** The test suite passes despite the introduced bug (**Defect in the test suite**).

$$\text{Mutation Score} = \left(\frac{\text{Killed Mutants}}{\text{Total Mutants}}\right) \times 100$$

### Automated Mutation Testing with Stryker
```bash
# Install Stryker for JavaScript / TypeScript
npx stryker init

# Run mutation tests on core domain modules
npx stryker run
```

### Passing Standard:
- Core billing, checkout, authorization, and data transformation modules must achieve a **Mutation Score $\ge 70\%$**.
- Any surviving mutant must be examined: either add a missing assertion or document why the condition is unreachable.

---

## 5. The SQAT Quality Gate (Clean as You Code)

A release or Pull Request is automatically blocked unless all 4 conditions of the SQAT Quality Gate evaluate to **PASS**:

```
[Quality Gate Condition 1: Static Code Quality]
- Linter errors: 0
- Type errors: 0
- Max cyclomatic complexity: <= 10

[Quality Gate Condition 2: Vulnerabilities & Secrets]
- npm audit / snyk critical vulnerabilities: 0
- Secret detection (trufflehog / gitleaks): 0 leaks

[Quality Gate Condition 3: Test Suite Execution]
- Automated unit/integration tests: 100% passing (exit code 0)
- Flaky tests in release branch: 0 tolerated

[Quality Gate Condition 4: Test Rigor & A11y]
- axe-core WCAG 2.2 AA violations: 0
- Mutation testing score (PROD/SCALE): >= 70%
```

---

## 6. Flaky Test Quarantine Protocol

A flaky test is any test that passes and fails intermittently without code modifications. Flaky tests erode developer trust and mask real regressions.

### Quarantine Protocol Steps
1. **Immediate Quarantine:** Move flaky tests into a dedicated `@quarantine` suite that does not block production CI pipelines.
2. **Defect Tracking:** File an urgent P1 remediation ticket detailing failure timestamps, environment, and stack trace.
3. **Isolation Root-Cause Analysis:** Run the test in a 100-iteration loop locally to identify timing dependencies, race conditions, or unmocked network sockets.
4. **Graduation Standard:** A quarantined test may only be reintroduced to the main blocking suite after **100 consecutive successful runs** in CI with zero failures.

