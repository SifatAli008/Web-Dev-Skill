# Human-Computer Interaction (HCI) & Cognitive Ergonomics Reference Guide

This reference guide serves as the Level 2 (L2) operational companion for `15-hci-interaction`. It provides mathematical models, empirical research foundations, cognitive psychology principles, and concrete implementation patterns for human-centric web applications.

---

## 1. Empirical Laws of Interaction Science

### 1.1 Fitts's Law (Target Acquisition)

Formulated by Paul Fitts in 1954, Fitts's Law models human motor movement time when acquiring a target:

$$MT = a + b \log_2\left(\frac{2D}{W}\right)$$

Where:
* $MT$ = Movement Time to acquire the target.
* $D$ = Distance (amplitude) from starting cursor/finger position to target center.
* $W$ = Width (tolerance) of target along axis of motion.
* $a, b$ = Empirical regression constants specific to input device (mouse, trackpad, stylus, touchscreen thumb).
* $ID = \log_2(2D/W)$ = Index of Difficulty (measured in bits).

#### Engineering Implications:
1. **Target Size Floor:** On touch interfaces, soft-tissue finger pads compress, creating contact ellipses of 8–10mm. Interactive controls must measure at least $44\times 44\text{px}$ (iOS HIG) or $48\times 48\text{px}$ (Android Material), with $\ge 8\text{px}$ spacing between adjacent interactive bounding boxes.
2. **Infinite Targets:** Screen edges and viewport corners have infinite apparent width ($W = \infty$) on desktop displays with bounded mouse cursors. Docking frequent controls (close buttons, bottom taskbars, corner menus) reduces $MT$ to near zero.
3. **Proximity of Contextual Actions:** In-context action triggers (e.g. inline edit icons, right-click context menus, hover cards) minimize distance $D$, dramatically reducing task duration.

---

### 1.2 Hick-Hyman Law (Decision Reaction Time)

Formulated by William Hick and Ray Hyman, this law dictates that the time required to make a decision increases logarithmically with the number of options:

$$RT = b \log_2(n + 1)$$

Where:
* $RT$ = Reaction / Decision Time.
* $n$ = Number of equally probable alternatives.
* $b$ = Cognitive processing constant (~0.15s for visual scanning).

#### Engineering Implications:
1. **Option Pruning:** Never present flat menus with $>7$ unorganized choices.
2. **Hierarchical Categorization:** Group complex decision trees into categorical chunks. If a user must choose between 64 items, a flat list requires $\log_2(65) \approx 6.02$ bits of decision effort, whereas two sequential 8-item categories require $\log_2(9) + \log_2(9) \approx 3.17 + 3.17 = 6.34$ bits, but human visual scanning search time drops by over $70\%$.
3. **Smart Defaults:** Pre-selecting recommended or most probable defaults eliminates the decision penalty entirely ($n = 0 \implies RT = 0$).

---

### 1.3 Doherty Threshold & Latency Perception

In 1982, Walter J. Doherty and Ahrvid J. Thadhani published research demonstrating that when computer response time drops below $400\text{ms}$, user productivity increases exponentially, user focus remains uninterrupted, and flow state is preserved.

#### Perceptual Latency Bands:
* **$< 50\text{ms}$ (Imperceptible):** Immediate physical feedback. Required for touch tracking, stylus drawing, and keypress audio/haptic responses.
* **$50\text{ms} - 100\text{ms}$ (Instantaneous):** Perceived as immediate cause-and-effect. Required for `:active` press states, dropdown toggles, and checkbox toggles.
* **$100\text{ms} - 300\text{ms}$ (Perceptible, Unbroken Attention):** Slight noticeable delay, but mental continuity remains intact. Smooth CSS spring transitions operate in this window.
* **$300\text{ms} - 1000\text{ms}$ (Attention Drift Boundary):** User notices waiting. Requires visual indeterminate feedback (micro-spinner, pulse skeleton) to communicate that the system is processing.
* **$> 1000\text{ms}$ (Context Switch Hazard):** Working memory begins decaying. Requires determinate progress bars showing percentage complete or elapsed/remaining time.
* **$> 10\text{s}$ (Task Abandonment):** User switches tasks. Requires background job processing with asynchronous notifications or email alerts.

#### Optimistic UI Engineering Pattern:
For network mutations with $>99\%$ success probability (likes, bookmarks, toggling task completion, moving kanban cards):
1. Immediately render expected success state on the client ($<50\text{ms}$).
2. Dispatch background network mutation asynchronously.
3. If the mutation fails, rollback local state gracefully and display an actionable toast: `"Failed to save changes. [Retry]"`.

---

## 2. Norman's Interaction Framework

Don Norman (*The Design of Everyday Things*) defines the core interaction cycle bridging the human mind and physical/digital systems:

```
                  +--------------------------------+
                  |         User's Goal            |
                  +--------------------------------+
                               |      ^
      Gulf of Execution        |      |       Gulf of Evaluation
      (How do I do it?)        |      |       (What just happened?)
                               v      |
                  +--------------------------------+
                  |     System Interface & State   |
                  +--------------------------------+
```

### Seven Fundamental Principles:
1. **Affordances:** The actual physical properties and potential interactions supported by an object (e.g. a button affords clicking or tapping).
2. **Signifiers:** Explicit visual signals communicating where the action should take place (e.g. raised bevels, underlined links, pointer cursor, contrasting border).
3. **Constraints:** Restricting possible actions to prevent errors:
   - *Physical:* Restricting input length, disabling invalid fields.
   - *Semantic:* Knowing that a shipping address requires a postal code.
   - *Cultural:* Red means destructive/stop, green means proceed/success.
   - *Logical:* Disabling the "Checkout" button until a delivery method is chosen.
4. **Mappings:** Spatial and conceptual correspondence between controls and outcomes (e.g. slider moving right increases volume; reordering list items mirrors finger drag position).
5. **Feedback:** Immediate, unambiguous communication of interaction results.
6. **Conceptual Model:** The mental simulation a user builds of how the underlying system works. If the system behaves counter to this model, severe user confusion and errors occur.
7. **Gulfs of Execution and Evaluation:**
   - *Gulf of Execution:* Difference between user intentions and allowable system actions. Minimized by intuitive signifiers, discoverable menus, and clear affordances.
   - *Gulf of Evaluation:* Effort required to interpret system state. Minimized by obvious status tags, confirmation banners, and clear visual state changes.

---

## 3. Keystroke-Level Model (KLM) for Workflow Optimization

Card, Moran, and Newell developed the Keystroke-Level Model (KLM) within the GOMS (Goals, Operators, Methods, Selection rules) framework to predict expert task execution time:

$$T_{\text{execute}} = \sum T_K + \sum T_P + \sum T_H + \sum T_D + \sum T_M + \sum T_R$$

### Standard KLM Operator Times:
| Operator | Description | Expert Time (s) |
|---|---|---|
| **$K$ (Keystroke)** | Pressing a single key on a standard keyboard | 0.20s |
| **$P$ (Point)** | Moving cursor to target via mouse/trackpad (Fitts's Law average) | 1.10s |
| **$H$ (Homing)** | Moving hands from keyboard to mouse, or vice versa | 0.40s |
| **$M$ (Mental Act)** | Mental preparation / cognitive retrieval of next step | 1.35s |
| **$R$ (Response)** | System latency waiting time | Variable ($t$) |

### Worked Example: Quick Search Workflow

#### Scenario A: Pointer-Heavy Interface
1. User moves hand to mouse: $H$ (0.40s)
2. User points to search icon in top right: $P$ (1.10s)
3. User clicks search input: $K$ (0.20s)
4. User prepares search term mentally: $M$ (1.35s)
5. User moves hand back to keyboard: $H$ (0.40s)
6. User types 6 characters (`"report"`): $6 \times K$ (1.20s)
7. User hits Enter: $K$ (0.20s)
**Total Time:** $0.40 + 1.10 + 0.20 + 1.35 + 0.40 + 1.20 + 0.20 = \mathbf{4.85s}$

#### Scenario B: Keyboard Accelerator Interface (`/` or `Cmd+K`)
1. User prepares mentally: $M$ (1.35s)
2. User presses `/` shortcut: $K$ (0.20s)
3. User types 6 characters: $6 \times K$ (1.20s)
4. User hits Enter: $K$ (0.20s)
**Total Time:** $1.35 + 0.20 + 1.20 + 0.20 = \mathbf{2.95s}$

**Optimization Delta:** Direct $39.2\%$ reduction in task completion duration and zero hand-homing friction.

---

## 4. Mobile Ergonomics: The Thumb Zone Mapping

Research by Steven Hoober reveals that over $75\%$ of mobile interactions are executed with a single thumb. Ergonomic zones on modern smartphones (6.1" to 6.7" screens):

```
+---------------------------+
|      HARD TO REACH        | <-- Top 20% (Destructive / Rare settings)
|                           |
+---------------------------+
|         STRETCH           | <-- Middle 20% (Secondary navigation, search)
|                           |
+---------------------------+
|          NATURAL          | <-- Bottom 60% (Primary CTAs, bottom sheets,
|        THUMB ZONE         |     tab bars, form inputs, submit buttons)
|                           |
+---------------------------+
```

### Thumb Zone Implementation Rules:
1. **Bottom-Docked Primary CTAs:** Fixed bottom action bars (`position: sticky; bottom: 0;`) for checkout, submit, and continue buttons.
2. **Top Corners Reserved for Rare/Escape Actions:** Place "Cancel", "Back", or "Settings" at the top edges where accidental thumb touches are virtually impossible.
3. **Safety Buffer:** Provide at least $16\text{px}$ margin from device home indicator bar (`env(safe-area-inset-bottom)`).

---

## 5. Slips vs Mistakes & Reversible Error Architecture

Psychologist James Reason classifies human errors into two distinct categories:

| Error Type | Root Cause | Example | Defensive HCI Mechanism |
|---|---|---|---|
| **Slip** | Unconscious execution failure; correct intention, wrong physical action. | User intended to click "Edit", but accidentally tapped adjacent "Delete" due to tight $4\text{px}$ spacing. | Adequate spatial separation ($\ge 8\text{px}$), visual distinctness (red danger styling), non-blocking reversible "Undo" snackbars. |
| **Mistake** | Conscious cognitive planning failure; incorrect mental model. | User typed invalid date format `31/02/2026` because the system did not communicate expected syntax. | Constrained input widgets (date pickers), proactive inline formatting mask, real-time validation feedback. |

### The Reversible "Undo" Pattern vs "Are You Sure?" Dialogs:
Modal confirmation dialogs (`window.confirm()` or modal alerts) create cognitive fatigue. Over time, users develop habituated blind clicking, pressing "OK" without reading.

* **Best Practice:** For reversible actions (archiving emails, deleting messages, removing items from cart), execute the deletion immediately, show an optimistic UI state, and present a persistent non-blocking snackbar:
  > *"Conversation moved to trash. [Undo] (Dismisses in 8s)"*
* **Reserve Modal Confirmations Strictly For:** Irreversible, catastrophic actions (e.g. dropping a production database, transferring ownership, closing a billing account).

