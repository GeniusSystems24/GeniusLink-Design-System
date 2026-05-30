# GeniusLink UI Kit

Pixel-faithful recreation of the GeniusLink ERP screens, factored as small React components for reuse in prototypes and mocks.

## Demo

Open `index.html` to launch the desktop clickable demo. Open `mobile.html` for the **iOS mobile app** demo (login → dashboard → accounts/stores with bottom-tab nav, inside an iPhone frame). Use the top-right toggle to switch dark ↔ light theme, and the sidebar tabs to navigate between the desktop screens:

- **Create Store** — the form-creation pattern (bilingual fields, single section card, footer actions).
- **Create Account Group** — multi-section form with a collapsible section.
- **Issue Inventory** — line-item editor with currency totals and a documents/compliance footer.
- **Opening Journal Entry** — debit/credit ledger entry with running totals.
- **Account Group Details** — read-only detail view with audit metadata.

## Components

| File | Component | Purpose |
|---|---|---|
| `components.jsx` | `Card`, `SectionHeader`, `Marker` | Section card with the signature 4×40 marker bar. |
|  | `Field`, `BilingualPair`, `Select`, `Toggle`, `LockedField` | Form inputs with the GeniusLink label/input pattern. |
|  | `Button`, `IconBtn` | Primary / secondary / danger / icon variants. |
|  | `StatusPill` | Capsule status badges (success/info/warning/danger/neutral). |
|  | `Breadcrumb`, `PageTitle` | Top-of-page chrome with the all-caps trail. |
|  | `LedgerTable`, `TableRow` | Tabular layout for transfer lines / accounting distribution. |
|  | `TotalsStrip` | Total debits / credits / difference row with semantic colors. |
|  | `Footer` | Bottom-of-page uppercase chrome. |
|  | `Icon` | Inline SVG icon dispatcher (Lucide-style outline). |
|  | `Logo`, `Sidebar` | Brand mark and the demo sidebar shell. |
| `CreateStore.jsx` | `<CreateStore />` | Screen 1. |
| `AccountGroup.jsx` | `<CreateAccountGroup />` + `<AccountGroupDetails />` | Screens 2 & 5. |
| `IssueInventory.jsx` | `<IssueInventory />` | Screen 3. |
| `JournalEntry.jsx` | `<OpeningJournalEntry />` | Screen 4. |
| `app.jsx` | `<App />` | Demo shell with navigation + theme toggle. |

## Substitutions / Notes

- **Icons** — outline SVG paths inlined per Lucide style (1.5 px stroke, rounded). When production icons land, swap in the SVGs from `../../assets/icons/`.
- **Arabic font** — Noto Naskh Arabic (Google Fonts). Figma source attributes Arabic text to "FreeSerif" which is a pseudocode artifact; flagged for the user.
- This is a recreation. The forms don't actually persist anything; "Create" buttons trigger a transient toast.
