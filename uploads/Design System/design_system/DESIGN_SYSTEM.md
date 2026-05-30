# GeniusLink Design System — Master Guide (V2)

The single entry point for the GeniusLink Design System. Pairs with `FOUNDATIONS.md` (tokens) and the live galleries in this folder.

---

## 1. What's here

| Area | File(s) |
|---|---|
| Foundations & tokens | `FOUNDATIONS.md`, `tokens.css`, `tokens.dart`, `app_theme.dart` |
| Core components | `components-core.html` (+ `ds-kit.jsx`) |
| Domain components | `components-domain.html` |
| Browser-style tabs | `components-browsertabs.html`, `BrowserTabs.jsx`, `BrowserStyleTabBar.dart` |
| Charts | `components-charts.html` |
| Skeleton loaders | `components-skeletons.html` |
| Combo box | `components-combobox.html` |
| Editable table | `components-table.html` |
| Patterns | `patterns.html` |
| Motion | `motion.html` |
| Flutter structure | `flutter-structure.md` |

Every gallery has a **dark/light toggle** and supports **RTL/LTR**. All values come from tokens — nothing is hardcoded.

---

## 2. Content guidelines

GeniusLink copy is **clinical, operator-facing, bilingual**. (Full voice + casing rules in the root `README.md` → CONTENT FUNDAMENTALS.) Component-specific rules:

- **Button labels** — Title Case imperative verbs naming the action: `Create Store`, `Post Entry`, `Issue Inventory`, `Back to List`. Never "OK", "Submit", "Click here". Destructive: `Delete`, `Void`, `Reverse`.
- **Error messages** — specific + actionable, sentence case: *"Account name is required."*, *"Out of balance by SAR 1,240.00."* Never "Invalid input" or "Error 422".
- **Empty states** — name what's missing + the next action: *"No entries yet — posted journal entries will appear here."* + a primary button.
- **Confirmation titles** — a question naming the object: *"Delete journal entry?"*, *"Post this entry?"*. Body states the consequence + that it's logged to the audit trail.
- **Notification text** — actor + verb + object: *"Controller approved wire EXT-2024-0311."* Tapping deep-links to that record.
- **Form validation** — inline, below the field, red, sentence case. Fire on blur / submit, not per keystroke.
- **Tone of voice** — impersonal, precise, no exclamation marks, no emoji. Neither "I" nor "you"; name the thing being defined/posted/issued.
- **Arabic & English** — every label ships in both; English LTR left, Arabic RTL right (stacked on mobile). Numbers stay Western digits in both (`$5,240.00`, `JV-2024-0042`).

---

## 3. Accessibility checklist (per component)

- [ ] **Contrast** — text ≥ 4.5:1 (AA). Verified for both themes; semantic colors carry a non-color cue (icon/label), never color alone.
- [ ] **Touch targets** ≥ 44×44 px (buttons/icon-buttons/list rows enforce it).
- [ ] **Focus** — visible 2 px blue outline; logical focus order; ESC closes overlays; arrow keys move within tabs/combobox/menus.
- [ ] **Semantic labels** — every control has an accessible name (icon-only buttons use `aria-label` / `Semantics(label:)`).
- [ ] **Roles** — tablist/tab, listbox/option, dialog, etc. on the right nodes.
- [ ] **Font scaling** — layouts reflow at large text sizes; no fixed-height text clipping.
- [ ] **Reduced motion** — honour `prefers-reduced-motion`; collapse transitions to instant, disable shimmer.
- [ ] **Errors** — announced, tied to their field, specific.

---

## 4. Component documentation template

Copy this for every component (`docs/<Component>.md`):

```md
# <ComponentName>

**Purpose** — one sentence: what problem it solves.

## When to use
- Bullet scenarios where this is the right choice.

## When NOT to use
- Cases where another component fits better (link it).

## Anatomy
1. Container · 2. Leading icon · 3. Label · 4. Trailing/action · 5. …
(annotated diagram or screenshot)

## Variants
| Variant | Use |
|---|---|
| primary | … |

## States
Default · Hover · Pressed · Focused · Disabled · Loading · Error · Selected · Empty
(+ domain states for chat/media: Sending/Sent/Delivered/Read/Failed, Uploading/Paused/Failed/Completed)

## Props / parameters
| Prop | Type | Default | Notes |
|---|---|---|---|
| variant | enum | primary | … |

## Usage example
\`\`\`jsx
<DSButton variant="primary" icon="plus">Create</DSButton>
\`\`\`

## Flutter example
\`\`\`dart
ElevatedButton.icon(onPressed: …, icon: Icon(Icons.add), label: Text('Create'))
\`\`\`

## Accessibility notes
- Min target, aria/semantics label, focus behaviour, contrast.

## Do & Don't
✅ Do: Title-case imperative labels · one primary action per view.
❌ Don't: two primary buttons side by side · vague labels ("OK").
```

---

## 5. Worked example — DSButton

**Purpose** — trigger the single most important action in a view.
**When to use** — form submits, primary CTAs. **When not** — low-priority/secondary actions (use `secondary`/`ghost`), or navigation (use a link/tab).
**Variants** — `primary` (one per view) · `secondary` · `danger` · `ghost`. **Sizes** — `md` (40px) · `sm` (32px).
**States** — default / hover (+6% lighten) / pressed (darken + scale .98) / disabled (40% opacity) / loading (spinner replaces icon).
**Props** — `variant`, `size`, `icon`, `loading`, `disabled`, `onClick`.
**A11y** — 44px min target, `aria-label` when icon-only, 2px focus ring, AA contrast on blue.
**Do** ✅ "Create Store" · **Don't** ❌ "Submit" / two primaries together.

---

## 6. Scaling recommendations

- **Tokens are law.** New surfaces consume `tokens.css` / `GL*` — never literal hex/px. To rebrand, change tokens once.
- **Compose, don't fork.** Build screens from `ds-kit.jsx` primitives + domain components; avoid bespoke one-offs.
- **One implementation per state.** Loading/Empty/Error route through the shared `StateView`; status ticks/upload states are shared enums.
- **Bilingual by default.** Author every string EN+AR; rely on `Directionality`/`dir` for mirroring rather than manual `left/right`.
- **Version the kit.** Tag releases; document breaking prop changes in each component's doc.
- **Test matrix per component:** dark ✓ light ✓ · LTR ✓ RTL ✓ · default/loading/empty/error ✓ · reduced-motion ✓ · large-font ✓.
