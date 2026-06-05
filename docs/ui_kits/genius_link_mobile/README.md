# GeniusLink UI Kit — Mobile

Pixel-faithful recreation of the GeniusLink **iOS mobile app**, factored as small React components for reuse in prototypes and mocks.

> The **desktop** screens live in the sibling kit `../genius_link_desktop/`. The two are fully independent — the mobile screens carry their own primitives and do **not** load the desktop `components.jsx`.

## Demo

Open `index.html` for the mobile app demo (login → dashboard → accounts / stores / inventory / journals / settings with bottom-tab nav), rendered inside a phone-width frame. Light/dark follow the design-system tokens.

## Architecture

- `Mobile.jsx` — the mobile primitive kit. Registers `window._mob = { C, MIcon, Pill, MCard, MField, MBtn, AppBar, TabBar, Scroll, Mini }`. Every other screen file pulls its primitives from here.
- `MobileUI.jsx` — interactive controls (`window._mui`): controlled inputs, selects, toggles, segmented tabs, search, avatars.
- `MobileInventory.jsx` — also exposes shared inventory primitives on `window._minv` (`ISection`, `IField`, `IToggle`, …) reused by Journal, Currencies, Contacts, Settings, etc.
- Each `Mobile*.jsx` screen registers itself into `window.MScreens`.
- `MobileApp.jsx` — the navigator: reads `window.MScreens` and wires the bottom tab bar + stack navigation.

## Screens

`MobileLogin`, `MobileDashboard`, `MobileAccounts` (+ `MobileAccountsExtra`), `MobileStores`, `MobileLedger`, `MobileBanking`, `MobileInventory` (+ `MobileInventoryExtras`), `MobileJournal`, `MobileCurrencies`, `MobileUsers`, `MobileReports`, `MobileContacts`, `MobileSettings` (+ `MobileSettingsTeam`, `MobileSettingsPlatform`).

## External dependencies

`index.html` also loads, from the project root:

- `../../colors_and_type.css` — color + type tokens.
- `../../design_system/ds-kit.jsx`
- `../../mobile-dashboard/data.jsx` and `../../mobile-dashboard/components.jsx` — rich dashboard data/components merged into the dashboard screen.

## Unused / legacy

- `MobileScreens.jsx` and `ios-frame.jsx` (iOS device bezel) are **not** loaded by `index.html`. They're kept as reference; the live demo uses a plain phone-width wrapper instead of the bezel.

## Notes

- **Arabic font** — Noto Naskh Arabic (Google Fonts).
- This is a recreation. Forms don't persist; actions trigger transient toasts.
