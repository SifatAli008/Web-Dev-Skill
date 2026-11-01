# Performance & Core Web Vitals Audit Report

> **Schema Conformance:** `templates/schemas/perf-audit.schema.json`  
> **Author:** `10-performance`  
> **Overall Status:** PASS | WARN | FAIL

---

## 1. Audit Metadata
- **Timestamp:** [ISO 8601 Timestamp]
- **Target URL:** [e.g. `https://app.example.com/products/view`]
- **Audited Profile:** [Mobile 4G (Emulated) / Desktop Broadband]
- **Overall Status:** [PASS | WARN | FAIL]

---

## 2. Core Web Vitals Scorecard

| Metric | Measured Value | Standard Target | Status |
|---|---|---|---|
| **Largest Contentful Paint (LCP)** | [e.g. 1.8s] | $\le 2.5\text{s}$ | [PASS / WARN / FAIL] |
| **Interaction to Next Paint (INP)** | [e.g. 110ms] | $\le 200\text{ms}$ | [PASS / WARN / FAIL] |
| **Cumulative Layout Shift (CLS)** | [e.g. 0.02] | $\le 0.1$ | [PASS / WARN / FAIL] |

---

## 3. Asset Breakdown & Budgets

| Asset Category | Transfer Size (Gzip/Brotli) | Budget Limit | Status |
|---|---|---|---|
| **Total JavaScript** | [e.g. 142 KB] | $\le 170\text{ KB}$ | [PASS / OVER BUDGET] |
| **Total CSS** | [e.g. 24 KB] | $\le 50\text{ KB}$ | [PASS / OVER BUDGET] |
| **Total Images** | [e.g. 380 KB] | $\le 500\text{ KB}$ | [PASS / OVER BUDGET] |
| **Total Fonts** | [e.g. 45 KB] | $\le 60\text{ KB}$ | [PASS / OVER BUDGET] |

---

## 4. Key Bottlenecks Identified

1. **[Bottleneck 1 Title]:** [Detailed description of request waterfall, render-blocking asset, or main thread task > 50ms].
2. **[Bottleneck 2 Title]:** [Detailed description of unoptimized image or missing priority hint].

---

## 5. Prioritized Remediation Action Items

- [ ] **Priority 1 (LCP):** [e.g. Add `<link rel="preload" as="image" fetchpriority="high">` to hero asset].
- [ ] **Priority 2 (CLS):** [e.g. Reserve aspect-ratio on ad slots and dynamic content containers].
- [ ] **Priority 3 (INP):** [e.g. Break up long script task via `scheduler.yield()` or Web Worker].

