# MVP Verification Checklist

> **Tier:** MVP (Prototypes, Internal Tools, Proofs-of-Concept)  
> **Primary Focus:** Maximum delivery speed to user validation, baseline defensive security, clean modular separation.

---

- [ ] **Product Scoping:**
  - [ ] Must-Haves limited to <= 5 core capabilities enabling the primary Job-to-be-Done.
  - [ ] Non-essential features explicitly recorded under "Won't Have (This Cycle)".
  - [ ] 30-day kill criteria threshold defined.

- [ ] **Architecture & Data:**
  - [ ] Single modular monolith codebase on a single relational database (PostgreSQL or SQLite).
  - [ ] Foreign keys and cascading rules defined at database level.
  - [ ] Data state machine transitions documented.

- [ ] **Defensive Baseline Security:**
  - [ ] Zero hardcoded secrets; `.env` listed in `.gitignore`.
  - [ ] All database queries parameterized; zero string concatenation injection vectors.
  - [ ] Input validation schemas (Zod) on all incoming API routes.
  - [ ] Session cookies set with `HttpOnly` and `SameSite=Lax`.

- [ ] **UI & Usability:**
  - [ ] Semantic HTML used for buttons, links, and forms.
  - [ ] 5-state lifecycle handled: Idle, Loading, Error, Empty, Success.
  - [ ] Body text contrast meets minimum 4.5:1 ratio.

- [ ] **Testing & Verification:**
  - [ ] Happy-path integration test executes with exit code 0.
  - [ ] Basic manual user walkthrough completes successfully end-to-end.
