# Modern Web Platform Primitives & Baseline Reference

> **Loading Level:** L2 Operational Reference Guide  
> **Load Condition:** Load when implementing UI modals, popovers, dropdowns, tooltips, responsive components, animations, or forms using native web platform standards.  
> **Authoritative Sources:** [BEST PRACTICE: CHROME-MODERN-WEB-GUIDANCE], [FACT: WEB-BASELINE], [FACT: MDN-WEB-DOCS]

---

## 1. The Baseline Compatibility Standard

Modern web development adheres to the **W3C WebDX Baseline** standard:
- **Baseline Widely Available:** Supported across all major browser engines (Chromium, Gecko/Firefox, WebKit/Safari) for at least 30 months. **Zero polyfills or fallbacks permitted.**
- **Baseline Newly Available:** Supported across all core browser engines today. Safe for production with standard progressive enhancement where legacy engine compatibility is strictly required.

```markdown
Rule: Never import a third-party npm package or custom JavaScript event listener when the feature is Baseline Widely Available or Baseline Newly Available.
```

---

## 2. Native `<dialog>` Modal & Top-Layer Architecture

Modals belong in the browser's native **Top Layer**, not inside arbitrary `z-index: 9999` containers.

### Native `<dialog>` Implementation with Entry & Exit Animations

```html
<!-- Semantic HTML -->
<button type="button" id="open-btn">Open Project Settings</button>

<dialog id="settings-dialog" aria-labelledby="dialog-title" class="modern-dialog">
  <div class="dialog-card">
    <h2 id="dialog-title">Project Settings</h2>
    <p>Configure repository access and environment keys.</p>
    <form method="dialog" class="dialog-actions">
      <button type="submit" value="cancel" class="btn-secondary">Cancel</button>
      <button type="submit" value="confirm" class="btn-primary">Save Changes</button>
    </form>
  </div>
</dialog>
```

```css
/* Top Layer & Starting Style Animations (Baseline) */
.modern-dialog {
  border: 1px solid var(--border-base);
  border-radius: 1rem;
  padding: 1.5rem;
  background: var(--bg-card);
  color: var(--text-base);
  max-width: 32rem;
  width: 90vw;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2);

  /* Smooth entry and exit transitions */
  opacity: 0;
  transform: scale(0.95) translateY(8px);
  transition: opacity 0.2s ease-out, transform 0.2s ease-out, overlay 0.2s allow-discrete, display 0.2s allow-discrete;
}

/* Open State */
.modern-dialog[open] {
  opacity: 1;
  transform: scale(1) translateY(0);
}

/* @starting-style: Animation entry values before first paint */
@starting-style {
  .modern-dialog[open] {
    opacity: 0;
    transform: scale(0.95) translateY(8px);
  }
}

/* Backdrop Styling */
.modern-dialog::backdrop {
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  opacity: 0;
  transition: opacity 0.2s ease-out, overlay 0.2s allow-discrete, display 0.2s allow-discrete;
}

.modern-dialog[open]::backdrop {
  opacity: 1;
}

@starting-style {
  .modern-dialog[open]::backdrop {
    opacity: 0;
  }
}
```

```javascript
// Accessible invocation
const dialog = document.getElementById('settings-dialog');
const openBtn = document.getElementById('open-btn');

openBtn.addEventListener('click', () => {
  dialog.showModal(); // Activates top layer, native focus trap, and Esc dismiss
});
```

---

## 3. Popover API & CSS Anchor Positioning

Non-modal overlays (dropdown menus, action menus, tooltips, flyout popovers) must use the **Popover API** and **CSS Anchor Positioning**, eliminating Popper.js, Floating UI, and manual document click listeners.

### Popover with CSS Anchor Positioning

```html
<!-- Anchor button and native popover -->
<button type="button" id="menu-trigger" popovertarget="user-menu" class="anchor-btn">
  Account Options
</button>

<div id="user-menu" popover class="anchor-popover" role="menu">
  <a href="/profile" role="menuitem">View Profile</a>
  <a href="/team" role="menuitem">Manage Team</a>
  <hr />
  <button type="button" role="menuitem" class="text-red-500">Log Out</button>
</div>
```

```css
/* CSS Anchor Positioning tethering */
#menu-trigger {
  anchor-name: --menu-trigger;
}

.anchor-popover {
  position: absolute;
  position-anchor: --menu-trigger;
  top: anchor(bottom);
  left: anchor(start);
  margin-top: 0.5rem;
  border: 1px solid var(--border-base);
  border-radius: 0.5rem;
  background: var(--bg-card);
  padding: 0.5rem;
  min-width: 12rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);

  /* Smooth light-dismiss transition */
  opacity: 0;
  transform: translateY(-4px);
  transition: opacity 0.15s ease-out, transform 0.15s ease-out, overlay 0.15s allow-discrete, display 0.15s allow-discrete;
}

.anchor-popover:popover-open {
  opacity: 1;
  transform: translateY(0);
}

@starting-style {
  .anchor-popover:popover-open {
    opacity: 0;
    transform: translateY(-4px);
  }
}
```

---

## 4. CSS Container Queries (`@container`) & Subgrid

Components must adapt to their container card or parent column width, **never** the global window viewport.

### Container Queries

```css
/* Declare parent card container context */
.card-wrapper {
  container-type: inline-size;
  container-name: card;
}

/* Default mobile/narrow card: vertical stack */
.card-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Wide container query: switch to horizontal bento layout */
@container card (min-width: 480px) {
  .card-content {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}
```

### CSS Subgrid for Equal-Height Card Alignment

```css
/* Parent grid defining row tracks */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  grid-auto-rows: auto auto 1fr auto;
  gap: 1.5rem;
}

/* Child card inheriting parent row tracks via Subgrid */
.card-item {
  display: grid;
  grid-row: span 4;
  grid-template-rows: subgrid;
}
```

---

## 5. View Transitions API

Provide seamless cross-fade and morph transitions across DOM updates and multi-page navigations without client-side SPA routing bloat.

```javascript
// Progressive enhancement check
export function updateDOMWithTransition(updateCallback) {
  if (!document.startViewTransition) {
    updateCallback();
    return;
  }
  document.startViewTransition(updateCallback);
}
```

```css
/* Named view transition for shared element morphing */
.hero-thumbnail {
  view-transition-name: hero-image;
}

::view-transition-old(hero-image),
::view-transition-new(hero-image) {
  animation-duration: 0.25s;
  animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
}
```

---

## 6. Auto-Sizing Forms & User-Perceived Validation

Modern forms do not require JavaScript auto-grow libraries or premature validation error flashes.

### CSS `field-sizing: content` & `:user-valid`

```css
/* Native auto-expanding input and textarea without JavaScript */
textarea.auto-grow {
  field-sizing: content;
  min-height: 4rem;
  max-height: 20rem;
  resize: none;
}

/* User-perceived form validation (only styles after user interacts) */
input:user-invalid {
  border-color: var(--color-danger, #ef4444);
  background-color: var(--color-danger-subtle, #fef2f2);
}

input:user-valid {
  border-color: var(--color-success, #10b981);
}
```

---

## 7. Legacy Code Modernization & Polyfill Pruning Matrix

When reviewing or modernizing frontend codebases, systematically prune these legacy workarounds:

| Legacy Pattern / Dependency | Modern Baseline Native Replacement | Advantages |
|---|---|---|
| `react-modal` / Custom overlay div | Native `<dialog>` + `showModal()` | Top-layer elevation, native focus trap, native Esc key, no z-index battles |
| `popper.js` / `@floating-ui/dom` | Native Popover API + CSS Anchor Positioning | Zero client JS, no positioning calculations on scroll, native light-dismiss |
| Window `resize` event listeners | CSS Container Queries (`@container`) / `ResizeObserver` | Off-main-thread layout calculation, component-level autonomy |
| Window `scroll` event listeners for animations | CSS Scroll-Driven Animations (`animation-timeline: scroll()`) | 100% off-thread GPU animation, zero main-thread scroll jank |
| `textarea-autosize` npm packages | CSS `field-sizing: content` | Zero dependencies, instant rendering, zero hydration delay |
| Complex `:parent` class toggling | CSS `:has()` relational selector | Declarative, pure CSS parent styling based on child states |
| `setTimeout(..., 0)` task splitting | `scheduler.yield()` | Cooperative multitasking without minimum timer clamp latency |
