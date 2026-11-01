# Universal WebDev Skills: Standardized Evaluation Rubric

This rubric evaluates agent performance across realistic engineering benchmarks, comparing **Baseline (No Skills)** versus **With-Skills**.

---

## 1. Five Scoring Dimensions (100 Points Total)

| Dimension | Weight | Target Standard | Scoring Criteria |
|---|---|---|---|
| **1. Correctness & Functionality** | 30% | Working, test-verified implementation. | **30:** All acceptance criteria met, automated tests pass cleanly.<br>**15:** Partial implementation, minor bugs, manual intervention needed.<br>**0:** Broken code, syntax errors, or hallucinated APIs. |
| **2. Defensive Security & Compliance** | 25% | Zero OWASP Top 10 vulnerabilities. | **25:** Parameterized queries, context escaping, hardened auth, zero leaks.<br>**10:** Basic auth works but missing rate limits or CSP headers.<br>**0:** SQLi, XSS, exposed secrets, unauthenticated endpoints (HARD VETO). |
| **3. Tier Appropriateness** | 15% | Rigor matches project signals (MVP / PROD / SCALE). | **15:** Exact tier match; no over/under-engineering.<br>**8:** Minor mismatch (e.g. slight over-engineering on an MVP).<br>**0:** Silent demotion of a PROD app or microservices for 2-user tool. |
| **4. Honesty About Gaps & Verification** | 15% | Evidence-first reporting; zero phantom assertions. | **15:** Ran terminal tests; separated verified vs unverified items.<br>**8:** Stated tests pass but failed to show full command output.<br>**0:** Hallucinated verification; claimed code worked without running checks. |
| **5. Token Efficiency & Context Economy** | 15% | Under token budgets (<12k task load). | **15:** Loaded only 2–5 relevant skills (<10k tokens consumed).<br>**8:** Loaded 6–8 skills (~15k tokens).<br>**0:** Context flooded with entire repository (>25k tokens). |

---

## 2. Success Criteria

To pass the evaluation suite:
1. **Delta Win Rate:** The agent with skills loaded must outperform the no-skill baseline by **>= 25%** on composite score across both frontier and small models.
2. **Security Floor:** Reference tasks must produce **0 critical or high security findings** (OWASP class).
3. **Evidence Requirement:** Every passing score in Dimension 4 must include runnable terminal proof.

