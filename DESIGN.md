# Universal WebDev Skills: Design System Contract (`DESIGN.md`)

> **Single Source of Truth for Visual Design, Art Direction, and UI Tokens**  
> Conforming to `nexu-io/open-design`, `Leonxlnx/taste-skill` v2, and W3C Design Tokens Community Group standards.

---

## 1. Design Read & Active Art Direction

```text
[Design Read]: Developer Documentation & CLI Platform | ICP: Full-Stack Engineers & AI Agents | Vibe: Precision, High-Contrast, Dense Craft | Dials: [V=3, M=3, D=8] | Profile: Minimalist
```

* **Active Taste Profile:** **Minimalist** (Engineered precision, monochromatic discipline, crisp 1px borders, zero gradient soup).
* **Quantitative Dials (1–10 Scale):**
  * `DESIGN_VARIANCE: 3` — Structured, predictable document hierarchy, clear table and list alignments.
  * `MOTION_INTENSITY: 3` — Subtle micro-interactions, spring snap micro-physics, tactile active press scale (`0.97`).
  * `VISUAL_DENSITY: 8` — High-efficiency information density, compact tables, dense code snippets, tight typographic tracking.

---

## 2. Perceptual Color System: OKLCH & Surface Hierarchy

We employ the **OKLCH (Perceptually Uniform Color Space)** to guarantee mathematically uniform contrast across hues, with standard sRGB fallbacks.

```css
:root {
  /* Surface Layers (3 Clean Architectural Layers) */
  --bg-base: #09090b;
  --bg-base-oklch: oklch(14% 0.005 250);       /* Canvas Base */
  
  --bg-surface: #141416;
  --bg-surface-oklch: oklch(18% 0.008 250);    /* Raised cards, sidebars */
  
  --bg-overlay: #1c1c1f;
  --bg-overlay-oklch: oklch(22% 0.01 250);     /* Modals, tooltips, active states */

  /* Text & Foreground (Perceptually Uniform Contrast Anchors) */
  --text-primary: #f4f4f5;
  --text-primary-oklch: oklch(98% 0.005 250);   /* Contrast 15.6:1 (WCAG AAA) */
  
  --text-secondary: #a1a1aa;
  --text-secondary-oklch: oklch(72% 0.015 250); /* Contrast 7.2:1 (WCAG AA) */
  
  --text-muted: #71717a;
  --text-muted-oklch: oklch(55% 0.02 250);      /* Contrast 4.6:1 (WCAG AA) */

  /* Structural Borders */
  --border-subtle: #27272a;                     /* 1px crisp separation */
  --border-strong: #3f3f46;                     /* High-contrast element borders */
  --border-focus: #3b82f6;
  --border-focus-oklch: oklch(62% 0.19 255);    /* Keyboard focus ring (>= 3:1) */

  /* Functional Accents (Single Sharp Hue - Zero Gradients) */
  --accent-primary: #3b82f6;                    /* Interactive CTA */
  --accent-success: #10b981;                    /* Verification PASS */
  --accent-warning: #f59e0b;                    /* Review Advisory */
  --accent-danger: #ef4444;                     /* Blocker / Hard Veto */
}
```

---

## 3. Fluid Typography & Modular Spacing Math

We use mathematical CSS `clamp()` formulas to provide smooth scaling from mobile (`375px`) to wide desktop (`1440px`) without abrupt breakpoint snaps.

### A. Font Families & Numeric Invariants
* **Primary Sans (UI & Prose):** `Inter`, `-apple-system`, `BlinkMacSystemFont`, `Segoe UI`, `sans-serif`
* **Metadata & Code:** `JetBrains Mono`, `Fira Code`, `ui-monospace`, `monospace`
* **Tabular Numeral Invariant:** All statistics, metrics, prices, and timer values must enforce `font-variant-numeric: tabular-nums` to eliminate layout jitter.

### B. Fluid Type Scale (`clamp()`)
| Token | Mathematical Fluid Formula | Desktop Bound | Line Height | Usage |
|---|---|---|---|---|
| `text-xs` | `0.75rem` (12px fixed) | 12px | 16px | Badges, metadata tags |
| `text-sm` | `0.875rem` (14px fixed) | 14px | 20px | Secondary captions, form notes |
| `text-base`| `clamp(0.9375rem, 0.9rem + 0.25vw, 1rem)` | 16px | 24px | Standard body copy |
| `text-lg` | `clamp(1.0625rem, 1rem + 0.35vw, 1.125rem)` | 18px | 28px | Lead text, card headers |
| `text-xl` | `clamp(1.125rem, 1rem + 0.6vw, 1.25rem)` | 20px | 28px | Section titles |
| `text-2xl` | `clamp(1.35rem, 1.1rem + 1.2vw, 1.5rem)` | 24px | 32px | Major component headings |
| `text-3xl` | `clamp(1.65rem, 1.3rem + 1.8vw, 1.875rem)`| 30px | 36px | Page titles |
| `text-4xl` | `clamp(2rem, 1.4rem + 3.2vw, 2.75rem)` | 44px | 48px | Hero display titles (Max 2 lines) |

### C. Fluid Spacing Rhythm
* `space-section-y: clamp(2.5rem, 1.5rem + 4.5vw, 5rem)` — Smooth vertical breathing room between major sections.
* `space-container-x: clamp(1rem, 0.5rem + 2.5vw, 3rem)` — Adaptive gutter margins.
* Snapped sub-units: `4px`, `8px`, `12px`, `16px`, `24px` (Card padding), `32px`.

---

## 4. Spring Physics Motion Architecture

We replace robotic `ease-in-out` transitions with physically modeled spring curves:

```css
:root {
  /* Fast interactive snap for buttons, toggles, chips */
  --spring-snap: cubic-bezier(0.16, 1, 0.3, 1);
  --spring-snap-duration: 180ms;

  /* Smooth layout transition for accordions, modals, navigation drawers */
  --spring-smooth: cubic-bezier(0.25, 1, 0.5, 1);
  --spring-smooth-duration: 320ms;

  /* Expressive dynamic micro-interactions (Soft-Consumer profile) */
  --spring-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

* **Tactile Press Squish:** Every interactive button must implement `:active { transform: scale(0.97); transition: transform var(--spring-snap-duration) var(--spring-snap); }`.

---

## 5. The 7-State Component Lifecycle Matrix

Every interactive component contract must explicitly implement and test **7 discrete states**:

1. **Idle / Default:** Calm baseline affordance with 1px border.
2. **Hover:** Surface brightness increases by 8% or border transitions to `--border-strong`.
3. **Active / Pressed:** Physical squish (`scale(0.97)`) with instantaneous tactile response.
4. **Focus-Visible:** Accessible 2px solid `--border-focus` with 2px `outline-offset` (keyboard only).
5. **Loading / Pending:** Dedicated spinner or shimmer reserving dimensions to guarantee **Zero CLS** (Cumulative Layout Shift).
6. **Disabled:** Communicated via `aria-disabled="true"` with keyboard discoverability and contextual tooltip explanation (avoiding dead HTML `disabled` attributes).
7. **Error / Invalid:** Explicit recovery microcopy with `aria-invalid="true"` and `aria-describedby`.

---

## 6. Cognitive Scanpath & Visual Dominance Budgeting

1. **Visual Dominance 2:1 Rule:** The primary Call-to-Action button must possess at least **$2\times$ the calculated visual weight** (contrast $\times$ area $\times$ saturation) of any secondary link.
2. **Cognitive Eye-Tracking Flow:** Sections must strictly follow an outcome-driven scanpath:
   $$\text{Hero Value Proposition} \longrightarrow \text{Proof Strip} \longrightarrow \text{Interactive Workbench} \longrightarrow \text{Objection Killer} \longrightarrow \text{Frictionless Action}$$
3. **Dynamic Media Contrast Anchors:** Whenever text overlays photography or video, apply a directional dark gradient scrim (`linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)`) or a frosted surface container (`backdrop-filter: blur(12px)`).
4. **WCAG 2.2 Level AA Gate:** Body contrast $\ge 4.5:1$, controls $\ge 3:1$, touch targets $\ge 44\times 44\text{px}$, visible focus indicator.
