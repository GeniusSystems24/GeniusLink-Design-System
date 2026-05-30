# Feature Specification: Mobile Banking Dashboard

**Feature Branch**: `002-mobile-dashboard`

**Created**: 2026-05-30

**Status**: Draft

**Input**: User description: "بحسب docs/MVP/banking-mvp/banking-mvp.md نريد بناء شاشة dashboard الخاصة بالموبايل مع الالتزام بأسلوب التصميم الموجود في مكونات مكتبة genius_link_core_app"

> Build the mobile **Dashboard** screen described in the Banking MVP (`docs/MVP/banking-mvp/banking-mvp.md`, §4 "Essential Screens"), adhering to the design language of the shared **genius_link_core_app** component library.

## Clarifications

### Session 2026-05-30

- Q: How should the summary cards handle multiple currencies, given each card shows a single figure but the system is multi-currency? → A: The Dashboard shows figures for **one selected currency at a time**. A currency selector (a popup/dropdown button) lets the operator choose which of the tenant's active currencies to view; switching it re-scopes all summary figures and their details to that currency. Figures are never summed or converted across currencies.
- Q: Which summary cards should the Dashboard show and how are their categories derived? → A: The summary is organized into **three domain tabs — Accounting, Banking, and Commercial** — and the operator switches between them via tabs. The **Accounting** tab shows a fixed set of 4 cards (Total Assets, Cash, Revenue MTD, Net Income); the **Banking** and **Commercial** tabs show their own domain card sets. In every tab, each card's category is mapped to the tenant's real account types/groups (and, where relevant, service domains) — no placeholder/sample mappings.
- Q: Are the quick actions fixed, or do they change with the selected domain tab? → A: **Per domain tab** — Banking → Deposit/Withdrawal/Transfer, Commercial → Sale/Purchase, Accounting → Journal Entry/Voucher. The tabs themselves MUST follow the design style of the shared **genius_link_core_app** library (use its tab/segmented component where available, otherwise compose from its tokens).
- Q: Do "Recent Operations" and "Needs Attention" follow the selected domain tab? → A: **Recent Operations follows the active tab** (its transactions are filtered to that domain), while **Needs Attention is global** (cross-domain alerts, independent of the tab). Architecture directive (for planning): **each domain tab owns its own state controller (`ChangeNotifier`) holding its own filter, its own data, and its own reactive watches**, loading and refreshing independently of the other tabs.
- Q: What should the trend indicator compare against? → A: **Period-over-period** versus the previous comparable period, with a **comparison-period selector offering Day / Week / Month (default: Week)**; changing it recomputes all trends. When the comparison period's data is unavailable, the indicator is omitted rather than showing a misleading value.

## User Scenarios & Testing *(mandatory)*

The Dashboard is the operator's home base after choosing which organization (tenant) to work in. It must answer three questions in one glance — *How are we doing? What just happened? What needs me right now?* — and let the operator start the most common money operations immediately. Every part must look and behave like the rest of the GeniusLink app by reusing the shared core component library.

### User Story 1 - At-a-glance financial overview (Priority: P1)

A banking operator opens the app, selects the organization they are working in, and lands on the Dashboard. They immediately see a summary of the organization's financial position — overall balance and the key figures that matter (e.g., total assets, available cash, period revenue, net income) — each with a short trend indicator showing whether the figure is up or down versus the previous period. The summary is organized into **Accounting, Banking, and Commercial tabs**, a **currency selector** lets them view the figures for any of the tenant's active currencies, and a **comparison-period selector (Day / Week / Month, default Week)** controls the trend shown on each card.

**Why this priority**: This is the core reason the screen exists and the first thing every operator needs. It is independently valuable even with nothing else on the screen, and it is the foundation the other sections attach to.

**Independent Test**: Sign in, pick a tenant, and confirm the Dashboard shows the financial summary for that tenant with correctly formatted amounts and trend indicators, refreshing to live data after showing any cached values.

**Acceptance Scenarios**:

1. **Given** an operator who has selected an active tenant, **When** the Dashboard opens, **Then** a balance/financial summary for that tenant is displayed with amounts formatted per the active locale and currency.
2. **Given** a comparison period is selected (default Week), **When** a summary figure differs from its value in the previous comparable period, **Then** a trend indicator shows the direction (up/down) and percentage change versus that previous period.
3. **Given** data for the selected comparison period is unavailable, **When** the Dashboard renders, **Then** the figure is shown without a (misleading) trend indicator.
4. **Given** cached data is available, **When** the Dashboard opens, **Then** cached values appear immediately and are then replaced by freshly loaded values without a blocking full-screen spinner.
5. **Given** the summary has Accounting, Banking, and Commercial tabs, **When** the operator switches tabs, **Then** the metric cards change to that domain's figures for the currently selected currency.
6. **Given** the tenant has multiple active currencies, **When** the operator changes the currency selector, **Then** all summary figures (in every tab) re-scope to the chosen currency without summing or converting across currencies.
7. **Given** the operator changes the comparison period (Day / Week / Month), **When** the selection changes, **Then** every card's trend indicator recomputes against that period.

---

### User Story 2 - Start a common operation in one tap (Priority: P1)

From the Dashboard, the operator launches the most frequent operations for the **currently selected domain tab** — Banking → Deposit/Withdrawal/Transfer, Commercial → Sale/Purchase, Accounting → Journal Entry/Voucher — directly, without hunting through menus.

**Why this priority**: The Banking MVP explicitly lists "quick actions (deposit, withdraw, transfer)" as core Dashboard content, and it is the screen's primary call to action. Reading numbers has limited value if the operator cannot act on them immediately.

**Independent Test**: From the Dashboard, tap each quick action and confirm it opens the corresponding operation flow for the active tenant; confirm actions the operator lacks permission for are not offered.

**Acceptance Scenarios**:

1. **Given** the Banking tab is active, **When** the operator taps "Deposit", "Withdrawal", or "Transfer", **Then** the corresponding operation flow opens scoped to the active tenant.
2. **Given** the operator lacks permission for a given operation, **When** the Dashboard renders, **Then** that quick action is hidden or disabled rather than failing after the tap.
3. **Given** the operator completes or cancels an operation, **When** they return, **Then** the Dashboard reflects any resulting balance and recent-activity changes.
4. **Given** the operator switches to the Commercial or Accounting tab, **When** they view the quick actions, **Then** the actions match that domain (Commercial → Sale/Purchase; Accounting → Journal Entry/Voucher).

---

### User Story 3 - See and reach recent activity (Priority: P2)

The operator sees the most recent transactions for the active tenant **within the selected domain tab** on the Dashboard — reference, short description, amount, and whether it was a credit or debit — and can jump to the full transaction history with one tap.

**Why this priority**: Recent activity confirms that operations went through and provides context for the figures above; it is high value but the screen is still useful without it (P1 stories stand alone).

**Independent Test**: Create or have existing transactions for a tenant, open the Dashboard, and confirm the latest few appear with correct direction/amount and that "view all" opens the full journal.

**Acceptance Scenarios**:

1. **Given** the active tenant has transactions, **When** the Dashboard opens, **Then** the most recent transactions **for the active domain tab** (default: the latest 5) are listed with reference, description, amount, and credit/debit direction.
2. **Given** the recent-activity list is shown, **When** the operator taps "view all", **Then** the full transaction journal for that domain opens.
3. **Given** the active tenant has no transactions in that domain, **When** the Dashboard opens, **Then** a clear empty state is shown instead of a blank area.
4. **Given** a new transaction is committed, **When** it is recorded, **Then** the recent-activity list updates to include it without requiring a manual app restart.
5. **Given** the operator switches the domain tab, **When** the new tab loads, **Then** the recent-operations list re-scopes to that domain's transactions.

---

### User Story 4 - Surface what needs attention (Priority: P2)

The operator sees a concise "Needs Attention" area highlighting items that require action — for example out-of-balance entries or active alerts/notifications — grouped by category so they can triage quickly.

**Why this priority**: Proactively surfacing exceptions reduces missed problems, but it is supplementary to the core overview and actions.

**Independent Test**: With active alerts present for a tenant, open the Dashboard and confirm they are grouped by category with counts; with none present, confirm the section is hidden.

**Acceptance Scenarios**:

1. **Given** there are items needing attention, **When** the Dashboard opens, **Then** they are shown grouped by category with a count and short description per group.
2. **Given** there are no items needing attention, **When** the Dashboard opens, **Then** the attention area is hidden entirely (no empty placeholder).

---

### User Story 5 - Stay current and work offline-aware (Priority: P3)

The operator pulls down to refresh the Dashboard at any time, and is clearly told when the device is offline so they understand the figures may be last-known values.

**Why this priority**: Refresh and offline clarity improve trust and usability, building on the offline-first nature of the platform, but the screen delivers value before this polish.

**Independent Test**: Pull to refresh and confirm all sections reload; disable connectivity and confirm an offline indicator appears while the last-known data remains visible.

**Acceptance Scenarios**:

1. **Given** the Dashboard is open, **When** the operator pulls to refresh, **Then** all sections reload and reflect the latest available data.
2. **Given** the device loses connectivity, **When** the operator views the Dashboard, **Then** an offline indicator is shown and the last-known data remains visible and readable.

---

### Edge Cases

- **No data yet**: A freshly created tenant with no balances/transactions/alerts shows meaningful empty states per section, not blank space or errors.
- **Load failure**: If a section fails to load, that section shows a retryable error state without taking down the rest of the Dashboard.
- **Multi-currency**: Figures are always shown for one selected currency at a time via the currency selector; amounts are never silently summed or converted across currencies. The selected currency is clearly indicated, and switching currencies via the selector updates every figure. If the tenant has only one active currency, the selector may show that single currency or be hidden.
- **Permission changes mid-session**: If the operator's permissions change, quick actions they may no longer perform are not offered on next render.
- **Tenant switch**: Switching the active tenant re-scopes every section to the newly selected tenant with no leftover data from the previous one.
- **Very large numbers**: Large monetary values remain readable (grouped/abbreviated as appropriate) without breaking the card layout.
- **RTL / long translations**: Arabic (RTL) layout mirrors correctly and longer translated labels do not overflow or truncate awkwardly.
- **Trend with missing/zero prior period**: When the previous-period value is absent or zero, the indicator is omitted (or shown as "new" without a percentage) rather than producing a misleading percentage.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The Dashboard MUST be the landing screen presented to the operator after an active tenant is selected.
- **FR-002**: The Dashboard MUST display a financial/balance summary for the active tenant **in a single selected currency at a time**, organized into selectable domain groups (tabs). Figures MUST NOT be summed or converted across different currencies.
- **FR-002a**: The Dashboard MUST provide a currency selector control (a popup/dropdown button) that lets the operator choose which of the tenant's active currencies the summary is shown in; changing the selection MUST re-scope all summary figures and their details (across all tabs) to the chosen currency. When the tenant has a single active currency, the selector MAY display that one currency or be hidden.
- **FR-002b**: The summary MUST be organized into **three domain tabs — Accounting, Banking, and Commercial** — and the operator MUST be able to switch between them via tabs; switching tabs MUST change the displayed set of metric cards to that domain's figures while preserving the selected currency. The tab control MUST follow the shared **genius_link_core_app** design language (use the library's tab/segmented component where available, otherwise compose from its design tokens).
- **FR-002c**: The **Accounting** tab MUST present a fixed set of 4 cards (Total Assets, Cash, Revenue MTD, Net Income). The **Banking** and **Commercial** tabs MUST present their own domain-appropriate card sets. In every tab, each card's category MUST be derived from the tenant's real configuration (account types/groups, and service domains where relevant) — never from placeholder/sample mappings (see FR-017).
- **FR-003**: Each summary figure MUST display a trend indicator (direction and percentage) computed as **period-over-period change versus the previous comparable period**. The Dashboard MUST let the operator choose the comparison period — **Day, Week, or Month (default: Week)** — and changing it MUST recompute all trend indicators. When data for the chosen comparison period is unavailable, the indicator MUST be omitted (no misleading value shown).
- **FR-004**: The Dashboard MUST provide quick actions that **change with the selected domain tab** — **Banking** → Deposit, Withdrawal, Transfer; **Commercial** → Sale, Purchase; **Accounting** → Journal Entry, Voucher — each launchable directly from the Dashboard for the active tenant. (The per-domain action lists above are the working defaults and are finalized in planning.)
- **FR-005**: The Dashboard MUST display the most recent transactions for the active tenant **filtered to the selected domain tab** (default: the latest 5), each showing reference, description, amount, and credit/debit direction, and MUST provide a way to open the full transaction journal for that domain.
- **FR-006**: The recent-activity list MUST update to reflect newly committed transactions without requiring an app restart.
- **FR-007**: The Dashboard MUST surface items needing attention **across all domains (global — independent of the selected tab)** grouped by category with counts and short descriptions, and MUST hide this area entirely when there is nothing to show.
- **FR-007a**: Each domain tab MUST maintain its own independent state — its own data filter, its own loaded data, and its own live/reactive updates — and MUST load and refresh independently of the other tabs (a tab's data may load when first opened and refresh without reloading the others).
- **FR-008**: The Dashboard MUST support pull-to-refresh that reloads all sections.
- **FR-009**: The Dashboard MUST show cached data immediately when available and then update to the latest data, avoiding a blocking full-screen load when cached data exists.
- **FR-010**: The Dashboard MUST display an offline indicator when connectivity is unavailable while keeping the last-known data visible and usable.
- **FR-011**: All monetary values MUST be formatted according to the active locale and the relevant currency.
- **FR-012**: All Dashboard text MUST be fully localized (Arabic and English) with no hardcoded user-facing strings, and the layout MUST mirror correctly for right-to-left (RTL).
- **FR-013**: Every asynchronous section MUST present distinct loading (skeleton/placeholder), empty, and error states.
- **FR-014**: The Dashboard MUST use the shared GeniusLink core component library (**genius_link_core_app**) design tokens (color, spacing, typography, radius, elevation) and components for all visual elements, with no ad-hoc colors, spacing, or one-off styling — so it is visually consistent with the rest of the app.
- **FR-015**: All interactive targets on the Dashboard MUST meet the platform minimum touch-target size (≥ 48×48 dp).
- **FR-016**: All Dashboard data MUST be scoped to the active tenant, and quick actions MUST respect the operator's permissions (actions the operator cannot perform are hidden or disabled).
- **FR-017**: Summary-figure categories and attention-alert categories MUST be derived from the organization's real configuration (account types, alert/notification types), not from placeholder/sample category mappings.
- **FR-018**: The Dashboard MUST provide an entry point to view notifications/alerts in detail (e.g., from the screen's header).
- **FR-019**: Switching the active tenant MUST re-scope all Dashboard sections to the newly selected tenant with no residual data from the previous tenant.

### Key Entities *(include if feature involves data)*

- **Dashboard Summary Figure**: A labeled financial value for the active tenant within the currently **selected currency** (e.g., Total Assets, Cash, Revenue MTD, Net Income), with an optional **period-over-period** trend (direction + percentage) computed against the selected comparison period. Derived from the tenant's balances; never aggregated across currencies.
- **Comparison Period**: The operator-selected window used to compute trends — **Day, Week, or Month (default: Week)** — applied to every summary figure's trend indicator.
- **Currency Selection**: The operator's chosen display currency from the tenant's active currencies, controlled by the Dashboard's currency selector (popup button); it scopes every summary figure and its details across all tabs.
- **Summary Domain Tab**: One of three domain groupings — **Accounting, Banking, Commercial** — each owning its own set of Dashboard Summary Figures, its own quick actions, and its own recent-operations list, backed by its own independent data state (filter, data, live updates). The operator switches the displayed content by selecting a tab. (The Needs Attention section is global, shared across all tabs.)
- **Quick Action**: A labeled shortcut belonging to the active domain tab (Banking: Deposit/Withdrawal/Transfer; Commercial: Sale/Purchase; Accounting: Journal Entry/Voucher), gated by the operator's permissions, that opens the corresponding operation flow.
- **Recent Operation**: A summarized transaction for the active tenant — reference, short description, amount, credit/debit direction, and date — sourced from the tenant's transaction history.
- **Attention Item**: A categorized count and description of something requiring operator action (e.g., out-of-balance entry, active alert), grouped by category, sourced from the tenant's alerts/notifications.
- **Active Tenant Context**: The organization currently selected by the operator; every Dashboard section is scoped to it.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: When cached data exists, the Dashboard displays the financial summary within ~300 ms of opening, and refreshed live figures within ~2 s on a standard mobile connection.
- **SC-002**: An operator can initiate the active domain tab's quick action (e.g., Deposit/Withdrawal/Transfer on Banking; Sale/Purchase on Commercial; Journal Entry/Voucher on Accounting) from the Dashboard in a single tap (≤ 1 tap to reach the operation flow).
- **SC-003**: The Dashboard shows the operator's most recent activity, defaulting to the latest 5 transactions, with correct credit/debit direction and amount in 100% of cases checked.
- **SC-004**: A design review confirms 100% of Dashboard visual elements use the shared core library's tokens and components, with zero ad-hoc/hardcoded colors, spacing, or typography.
- **SC-005**: The Dashboard renders correctly in both Arabic (RTL) and English (LTR) with no untranslated strings, clipped text, or mirrored-layout defects.
- **SC-006**: In a usability check, at least 90% of operators correctly identify the organization's overall position and start a common operation on their first attempt without guidance.
- **SC-007**: Every Dashboard section presents an appropriate loading, empty, or error state in 100% of those conditions (no blank areas, no full-screen failures from a single section).
- **SC-008**: When offline, the Dashboard clearly indicates the offline state while keeping the last-known figures readable, in 100% of offline checks.

## Assumptions

- The Dashboard targets **mobile** (Android/iOS) as the primary form factor; desktop/tablet layouts are governed by the broader Banking MVP responsive work and are out of scope here beyond not breaking.
- The shared **genius_link_core_app** library is the single source of UI truth (design tokens + reusable components); the Dashboard composes existing tokens/components rather than introducing new visual styles. Where the core library does not yet provide a needed component, an app-local widget is built using the library's tokens to stay visually consistent.
- "Balance summary" is interpreted as a small set of **aggregate financial metric cards** (overall total plus key categories) rather than a per-account list; per-account balances live on the Accounts/Account-detail screens. The cards are grouped into **three domain tabs (Accounting, Banking, Commercial)**. The Accounting tab's default set is Total Assets, Cash, Revenue (MTD), and Net Income; the **Banking** and **Commercial** tabs' exact card sets are not yet enumerated and will be defined during planning (mapped to the tenant's real account types/groups and service domains). Figures are shown for one **selected currency** at a time (chosen via the currency selector), never summed or converted across currencies.
- Quick actions are **per domain tab** (Banking: Deposit/Withdrawal/Transfer — the MVP set; Commercial: Sale/Purchase; Accounting: Journal Entry/Voucher). The Commercial/Accounting action lists are working defaults to be finalized in planning, and launch into existing operation flows.
- Recent activity defaults to the **latest 5** transactions and is **filtered to the active domain tab**; "view all" navigates to the existing transaction journal for that domain.
- Architecture (for planning, per user direction): each domain tab is backed by its own state controller (a `ChangeNotifier`) that owns the tab's filter, data, and reactive watches and loads/refreshes independently; "Needs Attention" is a single global section. This framework-specific directive is recorded here and detailed in `/speckit-plan`.
- "Needs Attention" is sourced from the tenant's **alerts/notifications** and any out-of-balance indicators already available to the app.
- Trend indicators are **period-over-period**: each figure is compared to its value in the previous comparable period, with a comparison-period selector offering **Day / Week / Month (default: Week)**. When historical data for the chosen period is unavailable, the indicator is omitted rather than shown as a misleading value. (This requires period/historical figures to be derivable from existing data; availability is confirmed in planning.)
- Data is read from existing tenant-scoped sources (balances, transactions, notifications) already synced by the platform; no new backend endpoints are required for this screen.
- Offline behavior, caching, and tenant scoping rely on the platform's existing offline-first/sync and active-tenant mechanisms.
- An initial version of this Dashboard already exists in the app; this specification defines the complete intended behavior and explicitly drives the currently-missing pieces (quick actions, full localization with RTL, real category mapping instead of placeholders, offline indicator, and consistent loading/empty/error states).

## Dependencies

- **Active tenant selection** must be available before the Dashboard renders (operator has chosen an organization).
- **Existing operation flows** for the per-tab quick actions must exist to launch into: Banking (Deposit, Withdrawal, Transfer), Commercial (Sale, Purchase), and Accounting (Journal Entry, Voucher).
- **Existing transaction journal** screen for the "view all" navigation.
- **Tenant-scoped data sources** for balances, transactions, and notifications/alerts.
- **Localization assets** (Arabic + English) must be restored/extended with the Dashboard's strings (note: localization resource files were recently removed and must be re-established for FR-012).
- The **genius_link_core_app** design system (tokens + components) as the mandated UI foundation.
