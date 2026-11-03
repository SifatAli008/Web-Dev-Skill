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

## 2. Perceptual Color System: OKLCH & Surface Hierarchy

```css
:root {
  /* Surface Layers (3 Clean Architectural Layers) */
  --bg-base: #ffffff;
  --bg-base-oklch: oklch(99% 0.002 250);

  --bg-surface: #f8fafc;
  --bg-surface-oklch: oklch(97% 0.005 250);

  --bg-overlay: #ffffff;
  --bg-overlay-oklch: oklch(100% 0 0);

  /* Text & Foreground */
  --text-primary: #0f172a;
  --text-primary-oklch: oklch(15% 0.02 250);   /* >= 4.5:1 contrast */

  --text-secondary: #475569;
  --text-secondary-oklch: oklch(45% 0.02 250); /* >= 4.5:1 contrast */

  --text-muted: #64748b;
  --text-muted-oklch: oklch(58% 0.02 250);     /* >= 4.5:1 contrast */

  /* Structural Borders */
  --border-subtle: #e2e8f0;
  --border-strong: #cbd5e1;
  --border-focus: #2563eb;
  --border-focus-oklch: oklch(58% 0.22 255);

  /* Functional Accents (Single Sharp Hue - Zero Ambient Gradients) */
  --accent-primary: #2563eb;
  --accent-success: #16a34a;
  --accent-warning: #d97706;
  --accent-danger: #dc2626;
}
```

---

## 3. Fluid Typography & Modular Spacing Math

* **Numeric Invariant:** All numbers, pricing, and telemetry must use `font-variant-numeric: tabular-nums`.

```css
:root {
  /* Fluid Typography Formulas (CSS clamp) */
  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: clamp(0.9375rem, 0.9rem + 0.25vw, 1rem);
  --text-lg: clamp(1.0625rem, 1rem + 0.35vw, 1.125rem);
  --text-xl: clamp(1.125rem, 1rem + 0.6vw, 1.25rem);
  --text-2xl: clamp(1.35rem, 1.1rem + 1.2vw, 1.5rem);
  --text-3xl: clamp(1.65rem, 1.3rem + 1.8vw, 1.875rem);
  --text-4xl: clamp(2rem, 1.4rem + 3.2vw, 2.75rem);

  /* Fluid Spacing Rhythm */
  --space-section-y: clamp(2.5rem, 1.5rem + 4.5vw, 5rem);
  --space-container-x: clamp(1rem, 0.5rem + 2.5vw, 3rem);
}
```

---

## 4. Spring Physics Motion Tokens

```css
:root {
  --spring-snap: cubic-bezier(0.16, 1, 0.3, 1);
  --spring-snap-duration: 180ms;
  --spring-smooth: cubic-bezier(0.25, 1, 0.5, 1);
  --spring-smooth-duration: 320ms;
}
```

* Buttons must implement tactile squish: `:active { transform: scale(0.97); }`.

---

## 5. The 7-State Component Lifecycle Matrix

Every interactive component must explicitly implement:
1. **Idle / Default**
2. **Hover**
3. **Active / Pressed** (`scale(0.97)`)
4. **Focus-Visible** (`2px solid --border-focus; outline-offset: 2px`)
5. **Loading / Pending** (Zero CLS dimension-reserving state)
6. **Disabled** (`aria-disabled="true"` with tooltip)
7. **Error / Invalid** (`aria-invalid="true"` with recovery text)

---

## 6. Anti-Slop Visual Directives & Non-Negotiables

1. **Zero Em-Dashes:** Never use em-dashes (`—`) or en-dashes (`–`) anywhere in web copy.
2. **Zero Gradient Soup:** No purple-to-blue background gradients; use solid architectural surfaces with 1px borders.
3. **Layout Family Diversity:** Compose at least 4 distinct layout families without repeating identical card grids.
4. **Hero Discipline:** Headline $\le 2$ lines, subheadline $< 20$ words, primary CTA above fold.
5. **Visual Dominance 2:1 Rule:** Primary CTA button must have at least $2\times$ visual weight over secondary links.
6. **WCAG 2.2 AA Compliance:** Body text $\ge 4.5:1$ contrast, controls $\ge 3:1$, touch targets $\ge 44\times 44\text{px}$, visible focus indicator.

---

## 7. Design Theory Foundations & Spatial Architecture

1. **Gestalt Spatial Hierarchy:** Maintain a 2:1 proximity ratio between outer section spacing and inner card padding. Group heterogeneous data inside explicit common region containers (`rounded-xl border`).
2. **60-30-10 Color Composition:** 60% dominant base canvas, 30% structural text/borders, 10% high-contrast accent.
3. **Typographic Measure & Rhythm:** Constrain reading copy to `max-w-[65ch]`. Enforce inverse leading (tight on display titles, relaxed on body). Activate `font-variant-numeric: tabular-nums` for data tables.
4. **8-Point Modular Grid:** Snap all spacing and component dimensions to multiples of 8px (4px micro).
5. **APCA Perceptual Contrast Standard:** Target $L^c \ge 75$ for body copy and $L^c \ge 60$ for large titles.
