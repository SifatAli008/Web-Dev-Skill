# Design System Contract (`DESIGN.md`)

> **Single Source of Truth for Visual Design, Art Direction, and UI Tokens**  
> Conforming to `nexu-io/open-design` and `Leonxlnx/taste-skill` v2 standards.

---

## 1. Design Read & Active Art Direction

```text
[Design Read]: <Page / App Kind> | ICP: <Target Audience> | Vibe: <Mood Keywords> | Dials: [V=<1-10>, M=<1-10>, D=<1-10>] | Profile: <Minimalist | Industrial-Brutalist | Editorial | Soft-Consumer>
```

* **Active Taste Profile:** `[Minimalist | Industrial-Brutalist | Editorial | Soft-Consumer]`
* **Quantitative Dials (1–10 Scale):**
  * `DESIGN_VARIANCE: [1-10]` (1-3: Corporate/Symmetric; 4-6: Balanced; 7-10: Asymmetric/Editorial)
  * `MOTION_INTENSITY: [1-10]` (1-3: Static/Hover; 4-6: Tactile Micro-Interactions; 7-10: Physics Springs/Scroll)
  * `VISUAL_DENSITY: [1-10]` (1-3: Airy Luxury; 4-6: Balanced SaaS; 7-10: Dense Cockpit/Data)

---

## 2. Color System & Surface Hierarchy

```css
:root {
  /* Surface Layers (3 Clean Architectural Layers) */
  --bg-base: #ffffff;        /* or dark equivalent */
  --bg-surface: #f8fafc;     /* Raised cards, sidebars */
  --bg-overlay: #ffffff;     /* Dropdowns, modals */

  /* Text & Foreground */
  --text-primary: #0f172a;   /* >= 4.5:1 contrast on base */
  --text-secondary: #475569; /* >= 4.5:1 contrast on base */
  --text-muted: #64748b;     /* >= 4.5:1 contrast on base */

  /* Structural Borders */
  --border-subtle: #e2e8f0;  /* 1px crisp separation */
  --border-strong: #cbd5e1;  /* High-contrast element borders */
  --border-focus: #2563eb;   /* Visible keyboard focus ring (>= 3:1) */

  /* Functional Accent (Single Sharp Hue - Zero Ambient Gradients) */
  --accent-primary: #2563eb;
  --accent-success: #16a34a;
  --accent-warning: #d97706;
  --accent-danger: #dc2626;
}
```

---

## 3. Typography Scale & Modular Spacing

### A. Font Families
* **Primary Sans (UI & Prose):** `[Primary Font, system-ui, sans-serif]`
* **Metadata & Code:** `[Monospace Font, ui-monospace, monospace]`

### B. Type Scale Steps
| Token | Font Size | Line Height | Usage |
|---|---|---|---|
| `text-xs` | 12px | 16px | Badges, metadata tags |
| `text-sm` | 14px | 20px | Secondary captions, form notes |
| `text-base`| 16px | 24px | Standard body prose |
| `text-lg` | 18px | 28px | Lead paragraphs, card headers |
| `text-xl` | 20px | 28px | Section titles |
| `text-2xl` | 24px | 32px | Major component headings |
| `text-3xl` | 30px | 36px | Page titles |
| `text-4xl` | 36px | 40px | Hero display titles (Max 2 lines) |

### C. Modular Spacing (4px/8px Unit)
* `space-1` = `4px` | `space-2` = `8px` | `space-3` = `12px` | `space-4` = `16px`
* `space-6` = `24px` | `space-8` = `32px` | `space-12` = `48px`

---

## 4. Anti-Slop Visual Directives & Non-Negotiables

1. **Zero Em-Dashes:** Never use em-dashes (`—`) or en-dashes (`–`) anywhere in web copy.
2. **Zero Gradient Soup:** No purple-to-blue background gradients; use solid architectural surfaces with 1px borders.
3. **Layout Family Diversity:** Compose at least 4 distinct layout families without repeating identical card grids.
4. **Hero Discipline:** Headline $\le 2$ lines, subheadline $< 20$ words, primary CTA above fold.
5. **WCAG 2.2 AA Compliance:** Body text $\ge 4.5:1$ contrast, controls $\ge 3:1$, touch targets $\ge 44\times 44\text{px}$, visible focus indicator.
