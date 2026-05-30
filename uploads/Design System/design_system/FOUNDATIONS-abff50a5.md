# GeniusLink Design System — Foundations (V2)

The eleven foundation areas that every component is built on. Tokens are the single source of truth:

- **CSS / HTML** → `design_system/tokens.css` (re-exports `colors_and_type.css`, adds motion + z-index + breakpoints)
- **Flutter** → `design_system/tokens.dart` + `design_system/app_theme.dart`

> Golden rule: a component **never** hardcodes a value a token already covers. Change the token, every surface updates.

---

## 1. Color system

One bright primary (`#4A7CFF`) against a grayscale neutral spine. Saturated color outside the primary is **semantic only** — green = success/ledger, orange = notes/warning, red = danger. Dark is the default theme; light runs in full parity. See the **Colors** cards in the Design System tab for the full scale.

- Surfaces (dark): `#111318` page → `#1E2025` card → `#33353A` input.
- Surfaces (light): `#F7F8FA` page → `#FFFFFF` card → `#F1F3F8` input.
- Foreground ramps: `fg1` (primary) → `fg4` (disabled), per theme.
- Section markers: the signature 4×40 px pill in blue / green / orange.

## 2. Typography system

Four families, fixed roles: **Manrope** (H1 + headline numerics), **Inter** (everything UI), **JetBrains Mono** (numerics, serials, timestamps — tabular figures), **Noto Naskh Arabic** (Arabic). Tracking widens for small all-caps labels (0.05–0.15em) and tightens only on H1 (−0.025em). Scale: 10 → 36 px.

## 3. Spacing system

4 px base unit. Used steps: 4 · 8 · 12 · 16 · 24 · 32 · 40 · 64 · 80. Card padding 24; gap between stacked cards 32; form grid column/row gap 24.

## 4. Grid & layout rules

- Centered content column: **720 px** (forms / detail) and **1120 px** (dashboards / master template).
- Form grid is 2-column (English left, Arabic right) on desktop; **single column** below `md` (768 px).
- Page gutter 24 px.

## 5. Border radius

2 (xs) · 4 (sm — inputs/buttons) · 6 (md) · 8 (lg — cards) · 12 (xl — pills/markers) · 999 (pill).

## 6. Elevation & shadows

Only **cards lift**; everything else is flat. Dark: `0 25px 50px -12px rgba(0,0,0,.25)`. Light: a softer two-stop slate stack. No inner shadows, no emboss, no press-state shadow shift. Overlay stacking is governed by the **z-index scale** (base → tooltip), see the Elevation Layers card.

## 7. Iconography

Outlined line icons, 1.5 px stroke, rounded caps, 16–22 px, inherit `currentColor`. Local SVGs in `assets/icons/`; Lucide as the CDN substitute. No emoji, no glyph icons (only `•` separators and `…` truncation). Full detail in root `README.md` → ICONOGRAPHY.

## 8. Motion & animation rules

A slow, deliberate interface. Durations: instant 0 · fast 100 · **base 150 (default)** · moderate 200 · slow 300 · slower 500 (shimmer). Curves: `standard` / `out` (enter) / `in` (exit) / `emphasized` (sheets & dialogs). No springs, no bounce, no parallax. Page transitions are near-instant. List/message entrance staggers by 40 ms. Full system lands in **V2 Stage J**.

## 9. Accessibility rules

- Color contrast targets AA; body text on dark (`#E2E2E9` on `#1E2025`) and light meet 4.5:1.
- Touch targets ≥ **44 px** (buttons enforce a 44 px min in Flutter theme).
- Focus: 2 px solid blue outline outside the element; logical focus order.
- Semantic labels on every control; accessible, specific error messages.
- Respects **large font scaling** and `prefers-reduced-motion` (tokens collapse to 0 ms, shimmer disabled).

## 10. Responsive behavior

Breakpoints (min-width): sm 480 · md 768 · lg 1024 · xl 1280. Key rule: **data tables collapse to stacked cards below `md`**; 2-column forms become single column; the wide 1120 layout falls back to the 720 column.

## 11. Light & dark theme support

Every token has a light + dark value; components read semantic roles (`--gl-bg`, `--gl-fg-1`, …) that re-alias under `[data-theme="light"]` (CSS) or `Brightness` (Flutter). Both themes ship together — no component is dark-only.

---

## Token reference

| Group | CSS | Flutter |
|---|---|---|
| Colors | `--gl-blue-500`, `--gl-fg-1`, `--gl-success-500` … | `GLColors` |
| Type | `--gl-font-display`, `--gl-text-3xl` … | `GLFonts`, `GLType` |
| Spacing | `--gl-space-1..9` | `GLSpace` |
| Radius | `--gl-radius-xs..pill` | `GLRadius` |
| Shadows | `--gl-shadow-card` … | `GLShadows` |
| Durations | `--gl-dur-fast..slower`, `--gl-stagger` | `GLDur` |
| Curves | `--gl-ease-standard/out/in/emphasized` | `GLCurves` |
| Z-index | `--gl-z-base..tooltip` | `GLZ` |
| Breakpoints | `--gl-bp-sm..xl`, `--gl-content-*` | `GLBreak` |
