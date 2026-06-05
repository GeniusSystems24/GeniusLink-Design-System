# GeniusLink UI Kit — Desktop

Pixel-faithful recreation of the GeniusLink ERP **desktop** screens, factored as small React components for reuse in prototypes and mocks.

> The **mobile** app lives in the sibling kit `../genius_link_mobile/`. The two are fully independent — the desktop screens load `components.jsx`; the mobile screens carry their own primitives.

## Demo

Open `index.html` to launch the desktop clickable demo. Use the top-right toggle to switch dark ↔ light theme, and the sidebar tabs to navigate between screens (Accounts, Stores, Inventory, Journals, Reports, Settings, …).

## Components

| File | Component | Purpose |
|---|---|---|
| `components.jsx` | `Card`, `SectionHeader`, `Marker` | Section card with the signature 4×40 marker bar. |
|  | `Field`, `BilingualPair`, `Select`, `Toggle`, `LockedField` | Form inputs with the GeniusLink label/input pattern. |
|  | `Button`, `IconBtn` | Primary / secondary / danger / icon variants. |
|  | `StatusPill` | Capsule status badges (success/info/warning/danger/neutral). |
|  | `Breadcrumb`, `PageTitle` | Top-of-page chrome with the all-caps trail. |
|  | `LedgerTable`, `TableRow`, `TotalsStrip` | Tabular layout + totals row with semantic colors. |
|  | `Footer` | Bottom-of-page uppercase chrome. |
|  | `Icon` | Inline SVG icon dispatcher (Lucide-style outline). |
|  | `Logo`, `Sidebar` | Brand mark and the demo sidebar shell. |
| `EditableTable.jsx` | `<EditableTable />` | Reusable inline-editable line-item grid. |
| `CreateStore.jsx`, `AccountGroup.jsx`, `IssueInventory.jsx`, `JournalEntry.jsx`, … | screen components | One file per desktop screen. |
| `app.jsx` | `<App />` | Demo shell with navigation + theme toggle. |

## Substitutions / Notes

- **Icons** — outline SVG paths inlined per Lucide style (1.5 px stroke, rounded). When production icons land, swap in the SVGs from `../../assets/icons/`.
- **Arabic font** — Noto Naskh Arabic (Google Fonts). Figma source attributes Arabic text to "FreeSerif" which is a pseudocode artifact; flagged for the user.
- This is a recreation. The forms don't actually persist anything; "Create" buttons trigger a transient toast.
