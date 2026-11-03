# HCI & Cognitive Ergonomics Inspection Checklist

> **Checklist ID:** `hci`  
> **Target Specialist:** `15-hci-interaction`  
> **Associated Schema:** `templates/schemas/hci-evaluation.schema.json`  
> **Quality Gate:** Usability & Interaction Science Gate (Zero blocking motor or cognitive friction).

---

## 1. Laws of UX & Empirical Interaction Science

- [ ] **Fitts's Law Target Size:** All clickable and tappable elements meet the minimum physical size of $\ge 44\times 44\text{px}$ (mobile) or $\ge 24\times 24\text{px}$ (desktop pointer).
- [ ] **Fitts's Law Target Distance:** Critical primary actions (Submit, Continue, Next) are placed within immediate reach of current user attention, avoiding jarring pointer travel across extreme screen corners.
- [ ] **Hick-Hyman Decision Density:** The number of choices per decision point is capped to $\le 5$ options. Complex multi-choice selections utilize category grouping or progressive disclosure.
- [ ] **Doherty Feedback Threshold:** Every user interaction produces an immediate visual state change within $< 100\text{ms}$ (hover, active/pressed, focus ring).
- [ ] **Latency Management:** Operations exceeding $300\text{ms}$ display a spinner or skeleton screen; operations exceeding $1000\text{ms}$ display determinate progress metrics.
- [ ] **Miller's Working Memory Chunking:** Unstructured lists of items are broken into manageable semantic chunks of $5 \pm 2$ items (e.g. phone numbers formatted with spacing, form fields grouped by fieldsets).
- [ ] **Jakob's Law Mental Model Match:** Standard platform interaction patterns (e.g. back navigation, search placement, cart location, modal close buttons) follow standard conventions without confusing novel reinventions.
- [ ] **Tesler's Complexity Conservation:** Boilerplate inputs are automated (geolocation inference, browser autofill hints `autocomplete="email"`, sensible smart defaults) without hiding essential control.

---

## 2. Motor Ergonomics & Touch Geometry

- [ ] **Thumb Zone Distribution:** On mobile viewports, high-frequency interactive controls are placed within the primary bottom thumb zone (lower 60% of viewport).
- [ ] **Target Spacing Boundary:** Adjacent interactive elements have at least $8\text{px}$ of non-interactive spacing between bounding boxes to prevent accidental mistaps.
- [ ] **Zero Hover Dependencies:** No essential user flow requires desktop mouse hover to discover, execute, or confirm an action.
- [ ] **Gesture Redundancy:** Any complex gesture (swipe, pinch, multi-touch) has an equivalent accessible single-pointer or keyboard tap alternative.
- [ ] **Continuous Drag Precision:** Sliders and draggable controls provide large hit slop areas ($\ge 48\text{px}$) and clear numeric readout.

---

## 3. Cognitive Ergonomics & Mental Models

- [ ] **Gulf of Execution Bridging:** Visual signifiers (raised borders, contrasting pill outlines, chevron icons) clearly signal interactability before click or tap.
- [ ] **Gulf of Evaluation Bridging:** System status changes (saving, saved, error, empty) are communicated unambiguously within the user's immediate focal zone.
- [ ] **Recognition Over Recall:** Users are never required to remember information from one screen to the next; context, order summaries, and previously selected options remain visible.
- [ ] **Progressive Disclosure:** Advanced or destructive settings are hidden behind clear expandable disclosures, keeping primary interfaces clean and focused.
- [ ] **Information Scent:** Links, navigation items, and buttons accurately describe where they lead (e.g. "Download March Invoice (PDF)", not "Click here").

---

## 4. Error Prevention & Reversible Mechanics

- [ ] **Slip Prevention (Spatial & Visual):** Destructive actions (Delete, Cancel Account) are visually distinguished with warning styling and separated from primary positive actions.
- [ ] **Mistake Prevention (Constraint Enforcement):** Inputs enforce structural constraints in real-time (date pickers prevent impossible dates; numeric fields restrict invalid characters).
- [ ] **Reversible Actions (Undo Over Alerts):** Destructive or accidental modifications provide a non-blocking "Undo" snackbar (toast) with a 5–10 second grace period rather than annoying modal confirmation dialogs for routine actions.
- [ ] **Non-Destructive Defaults:** Default button states in modal dialogues are set to the safe or non-destructive action.
- [ ] **Preserved Input on Validation Failure:** If form validation fails, zero user-entered data is cleared; errors are highlighted inline directly beside the offending field.

---

## 5. Keyboard Navigation & GOMS / KLM Efficiency

- [ ] **Logical Tab Index Sequence:** Tab navigation follows a strictly intuitive reading and interaction hierarchy (`tabindex="0"`, zero positive `tabindex` hacks).
- [ ] **Focus Trapping in Modals:** Opening a modal or slide-over traps keyboard focus inside the container; pressing `Escape` closes the modal and returns focus to the trigger element.
- [ ] **Keyboard Accelerators:** Power-user shortcuts (e.g. `Cmd+K` / `Ctrl+K` for global command palette, `/` for search focus, `Enter` to submit) are documented and conflict-free.
- [ ] **Homing Time Minimization:** Common repetitive workflows allow completing tasks entirely via keyboard or entirely via pointer without constant switching.
- [ ] **Visible Focus Rings:** Every keyboard-focused interactive element has a high-contrast visible focus outline with minimum $2\text{px}$ offset (`:focus-visible`).
