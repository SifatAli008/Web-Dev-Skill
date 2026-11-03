# Atomic Component Architecture & Interactive Primitives Specification

This reference document serves as the operational Level 2 (L2) companion for `03-ux-ui-design` and `04-frontend`. It establishes the canonical DOM structures, accessibility contracts (ARIA, focus trapping, keyboard traversal), and CSS recipes for the **12 universal interactive UI primitives**.

---

## 1. Dialog / Modal (Accessible Overlay)

### Accessibility & Behavioral Contract
* **Focus Trap:** When opened, focus is immediately moved to the initial interactive element inside the dialog. Pressing `Tab` cycles exclusively within the dialog boundaries.
* **Scroll Lock:** Background document scroll is locked (`overflow: hidden; padding-right: [scrollbar-width]`).
* **Dismissal:** Dismisses on `Escape` keypress, clicking backdrop overlay, or clicking explicit Close button.
* **Focus Restoration:** Upon closing, keyboard focus is programmatically restored to the trigger button that opened the dialog.
* **ARIA Semantics:** `role="dialog"`, `aria-modal="true"`, `aria-labelledby="dialog-title"`, `aria-describedby="dialog-desc"`.

### Canonical Markup
```html
<div class="dialog-backdrop" role="presentation" onclick="handleBackdropClick(event)">
  <div class="dialog-container" role="dialog" aria-modal="true" aria-labelledby="dialog-title" aria-describedby="dialog-desc">
    <div class="dialog-header">
      <h2 id="dialog-title" class="dialog-title">Delete Deployment</h2>
      <button type="button" class="dialog-close-btn" aria-label="Close dialog" onclick="closeDialog()">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
      </button>
    </div>
    <div id="dialog-desc" class="dialog-body">
      Are you sure you want to delete this deployment? This action is permanent and cannot be reversed.
    </div>
    <div class="dialog-footer">
      <button type="button" class="btn btn-ghost" onclick="closeDialog()">Cancel</button>
      <button type="button" class="btn btn-danger" onclick="confirmDelete()">Delete</button>
    </div>
  </div>
</div>
```

---

## 2. Dropdown Menu & Popover

### Accessibility & Behavioral Contract
* **Trigger:** Button with `aria-haspopup="menu"`, `aria-expanded="false"`, `aria-controls="menu-id"`.
* **Keyboard Navigation:**
  - `Enter` / `Space` / `ArrowDown`: Opens dropdown and focuses first menuitem.
  - `ArrowUp` / `ArrowDown`: Moves focus across menu items with wrap-around.
  - `Escape`: Closes menu and returns focus to trigger button.
* **Collision Detection:** Bounding box clamps to viewport edges (`left: max(8px, min(calc(100vw - width - 8px), triggerLeft))`).

---

## 3. Toast / Notification Stack

### Accessibility & Behavioral Contract
* **Live Region:** Container declared as `role="region" aria-label="Notifications"`.
* **Politeness:** Routine notifications use `aria-live="polite"`; critical errors use `aria-live="assertive" role="alert"`.
* **Non-Blocking:** Must never trap keyboard focus; docked to bottom-right or bottom-center.
* **Pause on Hover:** Auto-dismiss countdown timer halts when cursor hovers or toast receives keyboard focus.
* **Actionable Undo:** Must provide a visible, keyboard-accessible "Undo" trigger.

---

## 4. Tabs / Segmented Control

### Accessibility & Behavioral Contract
* **Structure:** `role="tablist"` containing `role="tab"` buttons, controlling `role="tabpanel"` elements.
* **Selected State:** Active tab marked `aria-selected="true" tabindex="0"`; inactive tabs marked `aria-selected="false" tabindex="-1"`.
* **Keyboard Traversal:** Left/Right arrow keys navigate tabs and update selection automatically.
* **Sliding Pill Indicator:** CSS transition uses `--spring-snap` for smooth indicator motion across tabs.

```html
<div role="tablist" aria-label="Project Views" class="tab-list">
  <button role="tab" aria-selected="true" id="tab-1" aria-controls="panel-1" tabindex="0" class="tab-btn active">Overview</button>
  <button role="tab" aria-selected="false" id="tab-2" aria-controls="panel-2" tabindex="-1" class="tab-btn">Deployments</button>
  <button role="tab" aria-selected="false" id="tab-3" aria-controls="panel-3" tabindex="-1" class="tab-btn">Settings</button>
  <div class="tab-active-indicator" aria-hidden="true"></div>
</div>
```

---

## 5. Accordion / Collapsible (Pure CSS Grid Animation)

### Zero-JS Smooth Height Animation Recipe
Animating height from `0` to `auto` without hardcoded heights using modern CSS Grid:
```css
.accordion-content {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 250ms var(--spring-smooth);
}
.accordion-item[open] .accordion-content {
  grid-template-rows: 1fr;
}
.accordion-inner {
  overflow: hidden;
}
```

---

## 6. Input & Form Field Architecture

### Standard Field Anatomy
1. Visible `<label for="field-id">` (Never replace labels with placeholder text).
2. Optional prefix/suffix icon or addon container (`$`, `.com`, search icon).
3. Field input with explicit type, `autocomplete`, and validation attributes.
4. Error microcopy bound via `aria-invalid="true"` and `aria-describedby="field-id-error"`.
5. Character counter (if length-constrained) bound via `aria-live="polite"`.

---

## 7. Button Variant Matrix & Sizes

### Variants:
* **Solid (Primary):** High-contrast accent fill (`--accent-primary`), white/contrast text. Limit to 1 per view.
* **Outline (Secondary):** Surface background with 1px `--border-strong` border.
* **Ghost (Tertiary):** Transparent background, reveals `--bg-surface` on hover.
* **Danger:** Red background (`--accent-danger`), reserved exclusively for destructive actions.
* **Link:** Borderless text button with underline on hover.

### Tactile Squish:
```css
.btn {
  transition: transform var(--spring-snap-duration) var(--spring-snap), background-color 150ms ease;
}
.btn:active {
  transform: scale(0.97) translateY(1px);
}
```

---

## 8. Table / Data Grid (Large Dataset Ergonomics)

### Ergonomic Invariants
* **Sticky Header:** `th { position: sticky; top: 0; background: var(--bg-surface); z-index: 10; }`
* **Tabular Figures:** `font-variant-numeric: tabular-nums lining-nums;` on all numeric data columns.
* **Horizontal Scroll Shadows:** Left/right gradient shadow masks indicating horizontal scrollability on mobile viewports.
* **Row Hover Affordance:** Explicit highlight on `tr:hover` (`bg-surface-raised`).

---

## 9. Skeleton Screen (Dimension-Reserving Shimmer)

### Zero-CLS Shimmer Recipe
Skeletons must reserve the exact height and aspect ratio of incoming content:
```css
.skeleton {
  background: linear-gradient(
    90deg,
    var(--bg-surface) 0%,
    oklch(from var(--bg-surface) calc(l + 0.05) c h) 50%,
    var(--bg-surface) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.8s infinite linear;
  border-radius: var(--radius-md);
}
@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

---

## 10. Avatar & Status Badge

* **Image Error Fallback:** When image fails to load, immediately render uppercase initials (`AB`) on a deterministic monochromatic background.
* **Status Presence Dot:** Positioned at bottom-right with a 2px mask border matching the surrounding container background to prevent visual collision.

---

## 11. Tooltip (Non-Obtrusive Disclosure)

* **Grouped Delay:** When moving from one icon button to an adjacent icon button, tooltip delay drops to `0ms` to avoid annoying repetitive delays.
* **Screen Edge Clamping:** Automatically inverts direction (top -> bottom, left -> right) if clipping window edge.
* **ARIA:** Connected to trigger element via `aria-describedby="tooltip-id"`.

---

## 12. Responsive Mobile Drawer / Navigation Sheet

* **Docked Position:** Slides in from left or bottom on mobile viewports (`touch-action: pan-y`).
* **Safe Area Insets:** Automatically offsets content using `padding-bottom: env(safe-area-inset-bottom)`.
* **Gesture Dismiss:** Supports swipe-down or swipe-left gestures to dismiss.
