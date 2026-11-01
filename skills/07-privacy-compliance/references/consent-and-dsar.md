# Consent Architecture & DSAR Compliance Reference

> **Loading Level:** L2 Reference Document  
> **Load Condition:** Load when implementing cookie consent barriers, configuring Global Privacy Control (GPC), or authoring automated data subject access request (DSAR) workflows.

---

## 1. Foundations: Lawful Basis Decision Matrix (GDPR Art. 6)

| Lawful Basis | Legal Requirement | Valid Use Case Examples |
|---|---|---|
| **Contract (Art. 6.1.b)** | Strictly necessary to deliver the requested service. | User login credentials, order shipping address, payment checkout processing. |
| **Legal Obligation (Art. 6.1.c)** | Statutory compliance with commercial or tax law. | Retaining invoice and transaction records for financial audit (7–10 years). |
| **Consent (Art. 6.1.a)** | Freely given, specific, informed, and unambiguous opt-in. | Non-essential analytics (GA4), marketing newsletters, advertising retargeting pixels. |
| **Legitimate Interest (Art. 6.1.f)** | Necessary for business interest, balanced against user rights. | Internal fraud prevention, rate limiting security logs, application crash monitoring. |

---

## 2. Professional Practice: Cookie-Free Consent Barrier

```javascript
// Client-side consent barrier implementation
export class ConsentManager {
  static COOKIE_NAME = 'site_consent_v1';

  static getConsent() {
    try {
      const stored = localStorage.getItem(this.COOKIE_NAME);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }

  static setConsent(preferences) {
    // Peer Review 01-product-discovery: Version consent records to trigger re-prompt on policy update
    const payload = {
      version: '1.0',
      timestamp: new Date().toISOString(),
      analytics: preferences.analytics === true,
      marketing: preferences.marketing === true
    };
    localStorage.setItem(this.COOKIE_NAME, JSON.stringify(payload));
    this.applyConsent(payload);
  }

  static applyConsent(consent) {
    if (consent.analytics) {
      this.loadAnalytics();
    }
    // GPC signal check: auto-disable marketing if user sends GPC
    if (navigator.globalPrivacyControl === true) {
      console.log('Global Privacy Control active: Marketing data sale disabled.');
      consent.marketing = false;
    }
  }

  static loadAnalytics() {
    // Only injected after explicit user opt-in
    const script = document.createElement('script');
    script.src = 'https://analytics.example.com/tracker.js';
    script.async = true;
    document.head.appendChild(script);
  }
}
```

---

## 3. Advanced Practice: The Anonymization vs Pseudonymization Trap

- **Pseudonymization (Reversible):** Replacing a user's name with `user_uuid_12345`. If the mapping table still exists, it is STILL personal data under GDPR!
- **True Anonymization (Irreversible):** Stripping identifiers such that re-identification is mathematically impossible under all reasonable means.
- **DSAR Deletion Standard:**
  ```sql
  -- Compliant Erasure on Order Records (Retained for Tax Law)
  UPDATE orders
  SET customer_name = 'DELETED USER',
      customer_email = 'anonymized-' || id || '@deleted.local',
      shipping_address = 'REDACTED',
      ip_address = NULL
  WHERE user_id = $1;
  ```
