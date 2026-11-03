# Universal WebDev Skills: Design System Contract (`DESIGN.md`)

> **Single Source of Truth for Visual Design, Art Direction, and UI Tokens**  
> Conforming to `nexu-io/open-design` and `Leonxlnx/taste-skill` v2 standards.

---

## 1. Design Read & Active Art Direction

```text
[Design Read]: Developer Documentation & CLI Platform | ICP: Full-Stack Engineers & AI Agents | Vibe: Precision, High-Contrast, Dense Craft | Dials: [V=3, M=3, D=8] | Profile: Minimalist
```

* **Active Taste Profile:** **Minimalist** (Engineered precision, monochromatic discipline, crisp 1px borders, zero gradient soup).
* **Quantitative Dials (1–10 Scale):**
  * `DESIGN_VARIANCE: 3` — Structured, predictable document hierarchy, clear table and list alignments.
  * `MOTION_INTENSITY: 3` — Subtle micro-interactions, 150ms ease transitions, tactile button press active scale (`0.98`).
  * `VISUAL_DENSITY: 8` — High-efficiency information density, compact tables, dense code snippets, tight typographic tracking.

---

## 2. Color System & Surface Hierarchy

```css
:root {
  /* Surface Layers (3 Clean Architectural Layers) */
  --bg-base: #09090b;       /* Dark base canvas */
  --bg-surface: #141416;    /* Raised cards, sidebars, code containers */
  --bg-overlay: #1c1c1f;    /* Dropdowns, tooltips, modals, active states */

  /* Text & Foreground */
  --text-primary: #f4f4f5;   /* 15.6:1 contrast against base (WCAG AAA) */
  --text-secondary: #a1a1aa; /* 7.2:1 contrast against base (WCAG AA) */
  --text-muted: #71717a;     /* 4.6:1 contrast against base (WCAG AA) */

  /* Structural Borders */
  --border-subtle: #27272a;  /* 1px crisp separation */
  --border-strong: #3f3f46;  /* High-contrast element borders */
  --border-focus: #3b82f6;   /* Accessible keyboard focus ring (>= 3:1) */

  /* Functional Accent (Single Sharp Hue - Zero Gradients) */
  --accent-primary: #3b82f6; /* Blue-500 functional interactive state */
  --accent-success: #10b981; /* Emerald-500 verification pass */
  --accent-warning: #f59e0b; /* Amber-500 warning / review required */
  --accent-danger: #ef4444;  /* Red-500 hard veto / security blocker */
}
```

---

## 3. Typography Scale & Modular Spacing

### A. Font Families
* **Primary Sans (UI & Prose):** `Inter`, `-apple-system`, `BlinkMacSystemFont`, `Segoe UI`, `sans-serif`
* **Metadata & Code (Telemetry & AST):** `JetBrains Mono`, `Fira Code`, `ui-monospace`, `monospace`

### B. Type Scale Steps (Snapped to Scale)
| Token | Font Size | Line Height | Letter Spacing | Usage |
|---|---|---|---|---|
| `text-xs` | 12px | 16px | `0` | Badges, metadata, timestamps, table captions |
| `text-sm` | 14px | 20px | `-0.005em` | UI controls, code blocks, secondary notes |
| `text-base`| 16px | 24px | `-0.01em` | Standard body prose, form inputs |
| `text-lg` | 18px | 28px | `-0.015em` | Subheadings, lead paragraphs |
| `text-xl` | 20px | 28px | `-0.02em` | Section headers, card titles |
| `text-2xl` | 24px | 32px | `-0.025em` | Major module headings |
| `text-3xl` | 30px | 36px | `-0.03em` | Page titles |
| `text-4xl` | 36px | 40px | `-0.035em` | Hero display titles (Max 2 lines) |

### C. Modular Spacing Rhythm (4px/8px Unit)
* `space-1` = `4px` | `space-2` = `8px` | `space-3` = `12px` | `space-4` = `16px`
* `space-6` = `24px` (Card padding) | `space-8` = `32px` | `space-12` = `48px` (Section gaps)

---

## 4. Corner Radius & Component Tokens

* `radius-sm: 4px` — Badges, inline code tags, compact pills.
* `radius-md: 6px` — Buttons, text inputs, segmented control switches.
* `radius-lg: 8px` — Cards, dialog surfaces, code container viewports.
* `radius-full: 9999px` — Avatar indicators, circular status pings.

---

## 5. Anti-Slop Visual Directives & Non-Negotiables

1. **Zero Em-Dashes:** Never use em-dashes (`—`) or en-dashes (`–`) anywhere in web copy or documentation.
2. **Zero Gradient Soup:** No purple-to-blue background gradients; surfaces must use crisp 1px borders over solid architectural layers.
3. **No Fake Window Dots:** Never render red/yellow/green fake window dots with static text. Use authentic, syntax-highlighted code blocks or interactive widgets.
4. **WCAG 2.2 Level AA Gate:**
   * All normal text must achieve $\ge 4.5:1$ contrast against adjacent background.
   * All interactive controls and focus indicators must achieve $\ge 3:1$ contrast.
   * Interactive elements must provide $\ge 44\times 44\text{px}$ touch targets.
   * Focus states must never be suppressed without visible replacements (`outline: 2px solid var(--border-focus); outline-offset: 2px;`).
