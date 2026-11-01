# Design Tokens Specification & WCAG 2.2 AA Reference

> **Loading Level:** L2 Reference Document  
> **Load Condition:** Load when establishing design token systems, calculating color contrast ratios, or designing keyboard focus rings.

---

## 1. Foundations: WCAG 2.2 AA Core Checkpoints

| WCAG Criterion | Level | Requirement | Implementation Target |
|---|---|---|---|
| **1.4.3 Contrast (Minimum)** | AA | Visual presentation of text and images of text. | Ratio >= 4.5:1 (normal text), >= 3:1 (large text >=18pt or 14pt bold). |
| **1.4.11 Non-text Contrast** | AA | UI components and graphical objects. | Ratio >= 3:1 against adjacent background colors. |
| **2.1.1 Keyboard** | A | All functionality operable via keyboard interface. | No mouse-only interactions. |
| **2.4.7 Focus Visible** | AA | Any keyboard operable user interface has a mode of operation where the keyboard focus indicator is visible. | Visible focus ring (>= 2px solid, >= 3:1 contrast against surface). |
| **2.5.8 Target Size (Minimum)** | AA | The size of the target for pointer inputs. | Area >= 44x44 CSS px, or >= 24x24 px with sufficient spacing. |

---

## 2. Professional Practice: W3C Design Tokens Blueprint

```json
{
  "color": {
    "surface": {
      "base": { "$value": "#ffffff", "$type": "color" },
      "subtle": { "$value": "#f8fafc", "$type": "color" },
      "overlay": { "$value": "#0f172a", "$type": "color" }
    },
    "text": {
      "primary": { "$value": "#0f172a", "$type": "color", "$description": "Contrast 15.8:1 on base" },
      "secondary": { "$value": "#475569", "$type": "color", "$description": "Contrast 7.1:1 on base" },
      "muted": { "$value": "#64748b", "$type": "color", "$description": "Contrast 4.6:1 on base" }
    },
    "border": {
      "focus": { "$value": "#2563eb", "$type": "color" }
    }
  },
  "spacing": {
    "1": { "$value": "4px", "$type": "dimension" },
    "2": { "$value": "8px", "$type": "dimension" },
    "3": { "$value": "12px", "$type": "dimension" },
    "4": { "$value": "16px", "$type": "dimension" },
    "8": { "$value": "32px", "$type": "dimension" }
  }
}
```

---

## 3. Advanced Practice: The Modal Keyboard Focus Trap & Native Dialog

### Recommended Implementation (Peer Review 04-frontend)
Prefer the native HTML `<dialog>` element with `.showModal()`. The browser automatically provides:
- Built-in keyboard focus trap within the dialog.
- Automatic backdrop rendering with `::backdrop`.
- Automatic dismissal on `Escape` key press.
- Native return of keyboard focus to the triggering element upon close.

If a custom modal is required, it must strictly implement:
1. Move focus to the first interactive element or dialog container upon opening.
2. Trap keyboard `Tab` within the modal container so focus does not escape to the background document.
3. Close immediately when the user presses `Escape`.
4. Restore keyboard focus back to the triggering button upon dismissal.
