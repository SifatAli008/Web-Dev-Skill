# Privacy & Compliance Audit Checklist

> **Authority:** Privacy & Compliance Officer (`07-privacy-compliance`) — HARD VETO  
> **Scope:** GDPR, CCPA/CPRA, ePrivacy, and Data Subject Rights

---

- [ ] **1. Lawful Basis & Personal Data Inventory:**
  - [ ] Is every field of collected personal data mapped in `privacy-register.schema.json`?
  - [ ] Is a specific statutory lawful basis (Consent, Contract, Legal Obligation) documented for each field?
  - [ ] Are special category data (health, biometric, racial, minor) strictly excluded or governed by Art. 9?

- [ ] **2. Consent & Cookie Banner Architecture:**
  - [ ] Do zero tracking scripts or analytics cookies fire before explicit affirmative consent?
  - [ ] Do 'Accept All' and 'Reject All' buttons have equal visual weight, color, and size?
  - [ ] Are pre-ticked checkboxes and deceptive dark patterns completely absent?
  - [ ] Is the Global Privacy Control (`navigator.globalPrivacyControl`) honored as an opt-out signal?
  - [ ] Can users access a persistent "Cookie Settings" link in the footer to modify consent?

- [ ] **3. Data Subject Access Rights (DSAR):**
  - [ ] Can an authenticated user download an automated JSON export of all their personal data?
  - [ ] Can an authenticated user trigger permanent account deletion?
  - [ ] Are statutory financial invoices retained for tax audits while personal identifiers are anonymized?

- [ ] **4. Retention & Third-Party Processing:**
  - [ ] Are data retention schedules defined and enforced by automated scheduled database purge jobs?
  - [ ] Are signed Data Processing Agreements (DPAs) in place with all cloud sub-processors?
  - [ ] Is cross-border data transfer protected by EU Standard Contractual Clauses (SCCs)?

