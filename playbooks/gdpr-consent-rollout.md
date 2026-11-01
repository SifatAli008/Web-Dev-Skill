# Playbook: GDPR Consent & Cookie Architecture Rollout (`gdpr-consent-rollout`)

> **Objective:** Roll out a lawful, non-coercive cookie and analytics consent architecture complying with GDPR Article 7, ePrivacy, and CCPA/CPRA, ensuring zero pre-consent data leakage.

---

## 1. Specialists Involved
- `07-privacy-compliance`: Statutory legal analysis, consent barrier architecture, ROPA documentation (HARD VETO).
- `04-frontend`: Accessible consent banner UI, equal visual prominence for reject/accept, script injection blocking.
- `11-seo-marketing`: Cookieless analytics setup (Plausible/Fathom) or consent-aware GTM integration.
- `08-testing-qa`: Automated browser network tests verifying zero network calls fire before consent.

---

## 2. Ordered Steps

### Step 1: Analytics & Cookie Inventory (`07-privacy-compliance`)
1. Audit all third-party scripts and cookies in the application.
2. Classify cookies into strict categories:
   - Essential (Session auth, CSRF, load balancer): No consent required.
   - Analytics (Traffic measurement): Requires prior consent unless cookieless/server-side.
   - Marketing (Ad retargeting, social pixels): Strictly requires prior consent.
3. Document in `privacy-register.schema.json`.

### Step 2: Cookieless Analytics Evaluation (`07-privacy-compliance` + `11-seo-marketing`)
1. Evaluate replacing client-side ad-tech trackers with privacy-preserving cookieless analytics (e.g. Plausible, Fathom).
2. If cookieless is adopted, eliminate the intrusive cookie banner entirely for analytics.
3. If marketing pixels remain necessary, proceed to Step 3.

### Step 3: Consent Barrier Architecture (`07-privacy-compliance` + `04-frontend`)
1. Implement client-side consent controller:
   - Check `localStorage.getItem('site_consent_v1')`.
   - If not set or version mismatch, render `<ConsentBanner />`.
   - Strictly DO NOT inject any tracking scripts into the DOM until explicit affirmative consent is granted.
2. Honor Global Privacy Control:
   - If `navigator.globalPrivacyControl === true`, automatically set `marketing: false`.

### Step 4: Accessible, Dark-Pattern-Free Banner UI (`04-frontend` + `03-ux-ui-design`)
1. Provide equal visual prominence for "Accept All" and "Reject All":
   - Both buttons must have identical font size, contrast, and click area.
   - Do not hide the "Reject" option behind a secondary sub-menu.
2. Trap focus or provide accessible keyboard navigation (`Escape`, `Tab`).
3. Add accessible persistent link in footer: "Cookie Settings" allowing users to change preferences anytime.

### Step 5: Automated Network Assertion Tests (`08-testing-qa`)
1. Author Playwright test that clears cookies/localStorage and visits landing page:
   - Assert zero outgoing network requests to analytics domains (`google-analytics.com`, `connect.facebook.net`).
2. Simulate clicking "Reject All":
   - Assert tracking scripts remain un-injected and zero analytics requests fire.
3. Simulate clicking "Accept All":
   - Assert analytics script is dynamically injected and fires valid initialization.

---

## 3. Quality Gates
- **Privacy Gate (`07-privacy-compliance`):** HARD VETO if tracking requests fire before consent or banner uses dark patterns.
- **QA Gate (`08-testing-qa`):** Automated Playwright network interception tests pass.

---

## 4. Rollback Procedure
If the consent manager fails or blocks critical essential functionality:
1. Revert to previous static script state with marketing tags disabled.
2. Purge cached service worker files if localStorage parsing errors occur.

---

## 5. Evidence Required to Call Done
1. Automated Playwright test run output confirming zero pre-consent network requests.
2. Screenshot/DOM inspection proving "Accept" and "Reject" buttons have identical visual styling.
3. Verified ROPA document conforming to `privacy-register.schema.json`.

