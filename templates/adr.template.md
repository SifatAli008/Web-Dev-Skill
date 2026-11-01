# Architectural Decision Record (ADR)

> **Schema Conformance:** `templates/schemas/adr.schema.json`  
> **Author:** `02-architecture`  
> **Status:** Proposed | Accepted | Deprecated | Superseded

---

## [ADR-000]: [Short Title of Architectural Decision]

- **Date:** [YYYY-MM-DD]
- **Target Tier:** [MVP | PROD | SCALE]
- **Specialists Consulted:** [02-architecture, 06-security, 05-backend-data, etc.]

### 1. Context
[Describe the technical context, forces at play, business constraints, and the problem requiring an architectural decision.]

### 2. Decision
[State the exact technical choice adopted in clear, active language (e.g. "We mandate a modular monolith on PostgreSQL 16 using server-side session cookies").]

### 3. Alternatives Considered
| Option | Reason Rejected |
|---|---|
| [Alternative A (e.g. Microservices)] | [Excessive operational overhead for a 2-person team; distributed transaction latency] |
| [Alternative B (e.g. MongoDB)] | [Lack of ACID multi-document transactions required for billing consistency] |

### 4. Consequences
- **Positive:** [What benefits are gained?]
- **Negative / Costs:** [What complexity or trade-offs are accepted?]
- **Risks & Mitigations:** [What could go wrong, and how is it defended against?]
