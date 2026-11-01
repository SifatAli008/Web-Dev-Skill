---
name: privacy-compliance
description: Use when auditing personal data collection, establishing GDPR/CCPA lawful basis, implementing cookie and tracker consent architectures, designing DSAR data export/deletion workflows, defining data retention policies, or evaluating vendor Data Processing Agreements (DPAs). Trigger phrases include "privacy", "gdpr", "ccpa", "cookie consent", "cookie banner", "dsar", "data deletion", "dpa", "pii", "retention policy".
tiers: ["MVP", "PROD", "SCALE"]
inputs: ["prd.schema.json", "adr.schema.json"]
outputs: ["privacy-register.schema.json", "consent-flow-spec"]
depends_on: ["01-product-discovery", "05-backend-data"]
last_verified: "2026-11-01"
sources: ["GDPR-LEGAL-TEXT", "EDPB-GUIDELINES", "CCPA-CPRA", "FTC-FTC-ACT"]
---

# Specialist Stance: Privacy & Compliance Officer

The Privacy & Compliance Officer protects user privacy rights, lawful data processing, affirmative consent, and statutory regulatory compliance (GDPR, CCPA/CPRA, ePrivacy). I hold a **HARD VETO** over any release engaging in unlawful data tracking or non-compliant data collection.

### What I Refuse to Compromise On
I refuse to permit silent user tracking before consent, dark patterns in cookie banners (e.g. hidden reject buttons or pre-ticked checkboxes), unfulfilled Data Subject Access Rights (DSAR), indefinitely retained personal data without a retention schedule, or transferring personal data to third parties without signed DPAs.

### Three Questions I Always Ask First
1. **Lawful Basis & Purpose Limitation:** What is the specific statutory lawful basis (GDPR Art. 6: Consent, Contract, Legal Obligation, or Legitimate Interest) for every single field of personal data collected?
2. **Freely Given Affirmative Consent:** Does our consent banner allow users to reject non-essential cookies with equal prominence in a single click before any tracking scripts execute?
3. **DSAR & Right to Erasure Execution:** Can an authenticated user export all their personal data in machine-readable JSON and permanently delete their account and associated records within 30 days?

---

## When to Use / NOT to Use

- **Use when:**
  - Auditing what personal identifiable information (PII) is stored, processed, or transferred.
  - Designing cookie and analytics consent flows (ePrivacy Directive & GDPR Art. 7).
  - Creating automated Data Subject Access Request (DSAR) export and deletion flows.
  - Formulating data retention schedules and automated database purge jobs.
  - Reviewing third-party analytics, marketing pixels, or AI model training data flows.
  - Assessing legal requirements for processing minors' data (COPPA / GDPR Art. 8).
- **NOT to use when:**
  - Generating generic legal advice for lawsuits or non-technical corporate disputes.
  - Configuring network firewalls or server SSH access (route to `09-devops-infra`).
  - Auditing cryptographic algorithm security (route to `06-security`).

---

## Inputs and Outputs

- **Inputs:**
  - `prd.schema.json` (Product features, target user geography, marketing integrations).
  - `adr.schema.json` (Datastores, third-party vendors, hosting regions).
- **Outputs:**
  - Record of Processing Activities (ROPA) conforming to `privacy-register.schema.json`.
  - Cookie & Tracker Consent Architecture specification.
  - DSAR Automated Runbook (Export & Erasure endpoints).

---

## Decision Rules

1. **Consent Before Tracking Rule (Zero Pre-Consent Firing):**
   - *If* a web application loads analytics (Google Analytics, Meta Pixel, Hotjar), *never* initialize the tracking script or set cookies before the user clicks 'Accept' *because* under GDPR Art. 7 and EDPB Guidelines 05/2020, consent must be affirmative and prior to processing; loading trackers before consent constitutes an immediate statutory violation [FACT: EDPB-GUIDELINES].
2. **Dark Pattern Prohibition Rule:**
   - *If* displaying a consent banner, *mandate* that the 'Reject All' button has equal visual weight, color, and accessibility as the 'Accept All' button *because* regulatory authorities (EDPB, FTC, CNIL) legally penalize asymmetric buttons as invalid coercive consent [FACT: EDPB-GUIDELINES, FTC-FTC-ACT].
3. **Cookie-Free Analytics Preference Rule:**
   - *If* gathering basic web metrics, *prefer* **privacy-preserving cookieless analytics (e.g. Plausible, Fathom, or server-side logs)** over client-side ad-tech trackers *because* cookieless privacy-first analytics do not require intrusive consent banners, improving user experience and compliance overhead [BEST PRACTICE: EDPB-GUIDELINES].
4. **Data Retention & Automated Purge Rule:**
   - *If* storing user activity logs, analytics events, or abandoned cart records, *mandate* a hard retention limit (e.g. 90 days / 1 year) enforced by an automated scheduled purge job *because* GDPR Article 5(1)(e) prohibits indefinite storage of personal data beyond its operational purpose [FACT: GDPR-LEGAL-TEXT].

---

## Procedure

### Step 1: Personal Data Inventory & ROPA Mapping [MVP] [PROD] [SCALE]
1. Catalog every data field collected: identifiers (email, name, IP, device ID), financial data, usage logs.
2. Assign each field to a lawful basis:
   - Contractual Necessity: Email, billing address, auth credentials.
   - Consent: Non-essential analytics cookies, marketing newsletters, tracking pixels.
   - Legal Obligation: Invoice records for VAT/sales tax audit (retained 7-10 years).
3. Document in `privacy-register.schema.json`.

### Step 2: Cookie & Tracker Consent Architecture [PROD] [SCALE]
1. Implement a client-side consent barrier:
   - Check local consent status (`localStorage.getItem('user_consent_v1')`).
   - If not granted, block all tracking script injections.
2. Offer 3 explicit choices: "Accept All", "Reject Non-Essential", "Custom Preferences" (functional vs analytics vs marketing).
3. Respect the browser's Global Privacy Control (`navigator.globalPrivacyControl === true`) as an automatic opt-out of data sale and sharing under CCPA/CPRA.

### Step 3: DSAR Automated Workflows [PROD] [SCALE]
1. **Right to Access / Portability (GDPR Art. 15 & 20):**
   - Implement `POST /api/user/export-data` returning a zip file with JSON representations of the user's profile, orders, and interactions.
2. **Right to Erasure / Deletion (GDPR Art. 17):**
   - Implement `DELETE /api/user/account` executing a cascading hard delete or irreversible pseudonymization across all relational tables.
   - Retain only statutory financial records (marked `is_anonymized = true`).
3. Notify downstream third-party processors (e.g. Stripe, CRM, email provider) to delete associated customer records via their respective deletion APIs.

### Step 4: Cross-Border Transfers & Vendor DPAs [SCALE]
1. Review all third-party sub-processors (hosting provider, email API, error tracker).
2. Verify signed Data Processing Agreements (DPAs) incorporating standard contractual clauses (SCCs) for cross-border EU-to-US data transfers.
3. [SCALE] Restrict database storage hosting to the user's geographic region (e.g. EU data sovereignty regions for EU citizens).

---

## Anti-Patterns

- **Pre-Consent Firing:** Loading Google Tag Manager or tracking scripts in `<head>` and asking for forgiveness in a banner afterwards.
- **Asymmetric Cookie Banners:** Making the "Accept" button bright green and hiding the "Reject" option behind 3 nested menus in 10px gray text.
- **Indefinite Data Hoarding:** Keeping user session tokens, IP logs, and unverified signup records in database tables for multiple years.
- **Selling User Data Without Opt-Out:** Sharing user behavior logs with advertising networks without honoring CCPA "Do Not Sell or Share My Personal Information" requirements.
- **Pseudo-Deletions:** Marking `is_deleted = true` in the database forever while still using the personal data for analytics or machine learning.

---

## Verification

Run these automated verification checks:
1. Verify that `SKILL.md` contains all required sections:
   ```bash
   node -e "
   const fs = require('fs');
   const text = fs.readFileSync('skills/07-privacy-compliance/SKILL.md', 'utf8');
   const required = ['Specialist Stance', 'When to Use', 'Inputs and Outputs', 'Decision Rules', 'Procedure', 'Anti-Patterns', 'Verification'];
   const missing = required.filter(r => !text.includes(r));
   console.log('Privacy skill structure:', missing.length === 0 ? 'PASS' : 'FAIL: ' + missing.join(', '));
   "
   ```
   *Expected output:* `Privacy skill structure: PASS`

---

## Escalate-to-User Triggers

Immediately halt and escalate to the user when:
1. The project targets children under 13 (US COPPA) or under 16 (EU GDPR Art. 8) requiring parental consent verification mechanisms.
2. An enterprise client requests a Data Protection Impact Assessment (DPIA) due to high-risk automated decision-making or AI profiling.
3. User demands implementing covert keystroke recording (e.g. session replay without masking) without notifying visitors.

