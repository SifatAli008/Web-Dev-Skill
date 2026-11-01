# Product Scoping, JTBD Framework, & Kill Criteria Reference

> **Loading Level:** L2 Reference Document  
> **Load Condition:** Load when pruning feature backlogs, authoring PRDs from ambiguous ideas, or formulating kill criteria.

---

## 1. Foundations: The Jobs-to-be-Done (JTBD) Syntax

People do not buy software; they "hire" products to make progress in specific circumstances.

```
When [Context / Trigger]:
  When an invoice is 14 days overdue and I feel awkward confronting a client...
I want to [Specific Action]:
  I want an automated polite payment reminder sent on my company's behalf...
So I can [Desired Progress / Emotional Outcome]:
  So I get paid faster without damaging my client relationship.
```

---

## 2. Professional Practice: The MoSCoW Scoping Matrix

| Priority | Definition | Release Boundary | Allocation Budget |
|---|---|---|---|
| **Must Have** | Non-negotiable core capability. Without it, the launch is illegal, broken, or pointless. | In Scope | 60% of cycle |
| **Should Have** | High-value and impactful, but a manual workaround exists for launch day. | In Scope (if time permits) | 25% of cycle |
| **Could Have** | Desirable enhancement or convenience feature. First to be dropped. | Stretch Goal | 15% of cycle |
| **Won't Have (This Time)** | Explicitly out of scope. Documented to stop bikeshedding. | Out of Scope | 0% |

---

## 3. Tier Signal Extraction (Peer Review 00-orchestrator)
When drafting `prd.schema.json`, explicitly extract and document tier signals:
- Does this PRD include user accounts, emails, or payments? -> Flag as **PROD** tier.
- Does this PRD require >100k MAU or strict SLAs? -> Flag as **SCALE** tier.
- If none of the above are present, designate as **MVP** tier.

---

## 4. Advanced Practice: The 30-Day Kill Criteria Contract

Every major new feature or experiment must include a kill contract agreed by engineering and product before work starts:

```markdown
### Feature Kill Contract: Automated SMS Alerts
- **Primary Metric:** Opt-in rate >= 15% of active accounts within 30 days of launch.
- **Economic Constraint:** Cost per SMS notification <= $0.02.
- **Negative Threshold:** Opt-out or spam complaint rate <= 0.5%.
- **Kill Action:** If opt-in is < 15% or complaints exceed 0.5% after 30 days, the SMS service is deprecated, UI toggles removed, and background worker decommissioned.
```
