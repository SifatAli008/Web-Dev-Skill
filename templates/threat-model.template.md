# Defensive Security Threat Model & Audit

> **Schema Conformance:** `templates/schemas/threat-model.schema.json`  
> **Author:** `06-security`  
> **Authority Status:** PASSED | VETOED

---

## 1. Review Summary
- **Component / Feature Name:** [Component Name]
- **Review Date:** [YYYY-MM-DD]
- **Target Tier:** [MVP | PROD | SCALE]
- **Veto Status:** [PASSED | VETOED]

## 2. Attack Surface Inventory
| Endpoint / Boundary | Auth Required? | Input Schema Validated? | Data Sensitivity Level |
|---|---|---|---|
| `POST /api/auth/login` | No (Public) | Yes (Zod) | Confidential (Credentials) |
| `GET /api/projects/:id` | Yes (Session) | Yes (UUID) | Internal (Tenant Scoped) |

## 3. STRIDE Threat Analysis
| Threat Category | Threat Description | Defensive Mitigation | Mitigation Status |
|---|---|---|---|
| **Spoofing** | Attacker spoofs user identity via forged JWT | Server-managed HttpOnly signed session cookies | Mitigated |
| **Tampering** | Attacker injects raw SQL via search query | Parameterized queries with prepared statements | Mitigated |
| **Repudiation** | Attacker denies changing organization role | Append-only audit logs with UTC timestamps | Mitigated |
| **Information Disclosure** | Database error stack trace exposed in API | Generic error handler; sanitized 500 responses | Mitigated |
| **Denial of Service** | Attacker floods login with credential stuffing | Distributed IP and account rate limiting | Mitigated |
| **Elevation of Privilege** | User accesses other tenant's invoices (IDOR) | Mandatory tenant `org_id` filter on all queries | Mitigated |

## 4. Required Security Mitigations Before Release
1. [Mitigation item 1]
2. [Mitigation item 2]

