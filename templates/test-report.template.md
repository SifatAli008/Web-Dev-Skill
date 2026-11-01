# Automated Test Execution & Quality Report

> **Schema Conformance:** `templates/schemas/test-report.schema.json`  
> **Author:** `08-testing-qa`  
> **Authority Status:** READY_TO_SHIP | BLOCKED_NO_EVIDENCE | BLOCKED_TESTS_FAILED

---

## 1. Test Execution Metadata
- **Timestamp:** [ISO 8601 Timestamp]
- **Target Tier:** [MVP | PROD | SCALE]
- **Command Executed:** [e.g. `npm test` or `npx playwright test`]
- **Exit Code:** [0 | 1]
- **Ship Status:** [READY_TO_SHIP | BLOCKED_TESTS_FAILED]

## 2. Test Pyramid Summary
| Category | Passed | Failed | Skipped | Quarantined | Duration |
|---|---|---|---|---|---|
| **Unit Tests** | [e.g. 142] | 0 | 0 | 0 | 2.4s |
| **Integration Tests** | [e.g. 38] | 0 | 0 | 0 | 8.1s |
| **E2E Playwright Tests** | [e.g. 8] | 0 | 0 | 0 | 24.3s |
| **Accessibility (axe-core)** | [e.g. 5] | 0 | 0 | 0 | 4.2s |
| **TOTAL** | [193] | 0 | 0 | 0 | 39.0s |

## 3. Code Coverage Summary
- **Statements:** [e.g. 88.5%]
- **Branches:** [e.g. 84.2%]
- **Functions:** [e.g. 91.0%]
- **Lines:** [e.g. 89.1%]

## 4. Terminal Output Proof
```text
[Paste terminal test execution output here with exit code]
```

