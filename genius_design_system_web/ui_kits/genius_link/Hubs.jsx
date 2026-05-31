/* global React, Breadcrumb, Icon */
// GeniusLink — Module landing hubs. Mirrors the Settings hub pattern:
// each sidebar module opens a hub of cards that drill into its screens.

function MHubCard({ it, onClick }) {
  const [hover, setHover] = React.useState(false);
  return (
    <div onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ background: 'var(--gl-surface)', border: `1px solid ${hover ? '#4A7CFF' : 'var(--gl-border)'}`, borderRadius: 8, padding: 20, cursor: 'pointer', transition: 'border-color 150ms ease', position: 'relative' }}>
      <div style={{ width: 38, height: 38, borderRadius: 8, background: 'rgba(74,124,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4A7CFF', marginBottom: 14 }}>
        <Icon name={it.icon} size={19} />
      </div>
      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--gl-fg-1)' }}>{it.label}</div>
      <div style={{ fontSize: 12, color: 'var(--gl-fg-3)', marginTop: 4, lineHeight: 1.5 }}>{it.desc}</div>
    </div>
  );
}

function ModuleHub({ crumb, title, sub, groups, onNavigate }) {
  return (
    <div style={{ maxWidth: 1120, margin: '0 auto', padding: '64px 32px 0', display: 'flex', flexDirection: 'column', gap: 28 }}>
      <Breadcrumb items={[crumb, title]} />
      <div>
        <h1 style={{ fontFamily: 'var(--gl-font-display)', fontWeight: 700, fontSize: 30, letterSpacing: '-0.025em', color: 'var(--gl-fg-1)', margin: 0 }}>{title}</h1>
        {sub && <div style={{ fontFamily: 'var(--gl-font-mono)', fontSize: 13, color: 'var(--gl-fg-3)', marginTop: 8 }}>{sub}</div>}
      </div>
      {groups.map((g) => (
        <div key={g.group} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ fontWeight: 700, fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--gl-fg-3)' }}>{g.group}</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {g.items.map((it) => (
              <MHubCard key={it.id} it={it} onClick={() => onNavigate(it.id)} />
            ))}
          </div>
        </div>
      ))}
      <div style={{ height: 48 }} />
    </div>
  );
}

// ── Per-module hub definitions ─────────────────────────────────────────────
const HUBS = {
  accountsHub: {
    crumb: 'Finance', title: 'Accounts', sub: 'Chart of accounts, hierarchy and groups',
    groups: [
      { group: 'Chart of Accounts', items: [
        { id: 'accounts', label: 'Chart of Accounts', icon: 'ledger', desc: 'Browse and manage all ledger accounts' },
        { id: 'accountTree', label: 'Account Tree', icon: 'briefcase', desc: 'Hierarchical account structure' },
        { id: 'createAccount', label: 'Create Account', icon: 'plus', desc: 'Add a new ledger account' },
      ] },
      { group: 'Account Groups', items: [
        { id: 'group', label: 'Create Account Group', icon: 'briefcase', desc: 'Define a reporting group' },
      ] },
    ],
  },
  ledgerHub: {
    crumb: 'Finance', title: 'Ledger', sub: 'Journal entries and financial operations',
    groups: [
      { group: 'Journal Entries', items: [
        { id: 'journals', label: 'Journal Entries', icon: 'ledger', desc: 'All posted and draft entries' },
        { id: 'createJournal', label: 'Create Journal Entry', icon: 'plus', desc: 'Record a new journal entry' },
        { id: 'journal', label: 'Opening Journal', icon: 'ledger', desc: 'Set opening balances' },
      ] },
    ],
  },
  bankingHub: {
    crumb: 'Finance', title: 'Banking', sub: 'Deposits, withdrawals and transfers',
    groups: [
      { group: 'Cash Movements', items: [
        { id: 'deposit', label: 'Create Deposit', icon: 'download', desc: 'Record incoming funds' },
        { id: 'withdrawal', label: 'Create Withdrawal', icon: 'upload', desc: 'Record outgoing funds' },
      ] },
      { group: 'Transfers', items: [
        { id: 'localTransfer', label: 'Local Transfer', icon: 'paperclip', desc: 'Move between own accounts' },
        { id: 'extTransfer', label: 'External Transfer', icon: 'compass', desc: 'Send to external parties' },
      ] },
    ],
  },
  reportsHub: {
    crumb: 'Finance', title: 'Reports', sub: 'Financial statements and audit trail',
    groups: [
      { group: 'Financial', items: [
        { id: 'trialBalance', label: 'Trial Balance', icon: 'ledger', desc: 'All account balances' },
        { id: 'incomeStmt', label: 'Income Statement', icon: 'doc', desc: 'Profit & loss for the period' },
        { id: 'balanceSheet', label: 'Balance Sheet', icon: 'doc', desc: 'Assets, liabilities and equity' },
      ] },
      { group: 'Inventory', items: [
        { id: 'invValuation', label: 'Inventory Valuation', icon: 'scanner', desc: 'Stock value by location' },
      ] },
      { group: 'Security', items: [
        { id: 'auditLog', label: 'Audit Log', icon: 'lock', desc: 'Immutable activity trail' },
      ] },
    ],
  },
  storesHub: {
    crumb: 'Operations', title: 'Inventory & Stores', sub: 'Catalog, warehouses and stock operations',
    groups: [
      { group: 'Catalog', items: [
        { id: 'products', label: 'Products', icon: 'scanner', desc: 'Items, pricing and stock levels' },
        { id: 'categories', label: 'Categories', icon: 'briefcase', desc: 'Organize the product catalog' },
        { id: 'uom', label: 'Units of Measure', icon: 'compass', desc: 'Measurement units' },
        { id: 'priceLists', label: 'Price Lists', icon: 'ledger', desc: 'Customer and tier pricing' },
      ] },
      { group: 'Warehouses', items: [
        { id: 'stores', label: 'Warehouses', icon: 'store', desc: 'Locations and stock by site' },
        { id: 'createStore', label: 'Create Warehouse', icon: 'plus', desc: 'Add a storage location' },
      ] },
      { group: 'Stock Operations', items: [
        { id: 'inventory', label: 'Issue Inventory', icon: 'scanner', desc: 'Issue stock out' },
        { id: 'receive', label: 'Receive Inventory', icon: 'download', desc: 'Receive stock in' },
        { id: 'transferList', label: 'Stock Transfers', icon: 'paperclip', desc: 'Move stock between sites' },
        { id: 'adjust', label: 'Stock Adjustment', icon: 'settings', desc: 'Correct stock counts' },
        { id: 'stockTake', label: 'Stock Take', icon: 'check', desc: 'Full physical count' },
        { id: 'barcodePrint', label: 'Barcode Print', icon: 'hash', desc: 'Print product labels' },
      ] },
    ],
  },
  salesHub: {
    crumb: 'Operations', title: 'Sales', sub: 'Customers and receivables',
    groups: [
      { group: 'Customers', items: [
        { id: 'customers', label: 'Customers', icon: 'user', desc: 'Customer accounts and balances' },
        { id: 'createCustomer', label: 'Add Customer', icon: 'plus', desc: 'Register a new customer' },
      ] },
    ],
  },
  procurementHub: {
    crumb: 'Operations', title: 'Procurement', sub: 'Suppliers and payables',
    groups: [
      { group: 'Suppliers', items: [
        { id: 'suppliers', label: 'Suppliers', icon: 'briefcase', desc: 'Supplier accounts and balances' },
        { id: 'createSupplier', label: 'Add Supplier', icon: 'plus', desc: 'Register a new supplier' },
      ] },
    ],
  },
  configHub: {
    crumb: 'Administration', title: 'Configuration', sub: 'Currencies, rates and fiscal calendar',
    groups: [
      { group: 'Currencies', items: [
        { id: 'currencies', label: 'Currencies', icon: 'briefcase', desc: 'Manage active currencies' },
        { id: 'createCurrency', label: 'Add Currency', icon: 'plus', desc: 'Register a new currency' },
        { id: 'exchangeRates', label: 'Exchange Rates', icon: 'compass', desc: 'Daily rate setup' },
      ] },
      { group: 'Calendar', items: [
        { id: 'fiscalYear', label: 'Fiscal Year', icon: 'ledger', desc: 'Periods and year-end close' },
      ] },
    ],
  },
  adminHub: {
    crumb: 'Administration', title: 'Team & Access', sub: 'Users and permission roles',
    groups: [
      { group: 'Users', items: [
        { id: 'users', label: 'Users', icon: 'user', desc: 'Workspace members and invites' },
        { id: 'createUser', label: 'Invite User', icon: 'plus', desc: 'Add a team member' },
      ] },
      { group: 'Access', items: [
        { id: 'roles', label: 'Roles & Permissions', icon: 'settings', desc: 'Access levels per module' },
      ] },
    ],
  },
};

// Build one component per hub id, bound to its config.
const HUB_COMPONENTS = {};
Object.keys(HUBS).forEach((id) => {
  HUB_COMPONENTS[id] = ({ onNavigate }) => <ModuleHub {...HUBS[id]} onNavigate={onNavigate} />;
});

Object.assign(window, {
  AccountsHub: HUB_COMPONENTS.accountsHub,
  LedgerHub: HUB_COMPONENTS.ledgerHub,
  BankingHub: HUB_COMPONENTS.bankingHub,
  ReportsHub: HUB_COMPONENTS.reportsHub,
  StoresHub: HUB_COMPONENTS.storesHub,
  SalesHub: HUB_COMPONENTS.salesHub,
  ProcurementHub: HUB_COMPONENTS.procurementHub,
  ConfigHub: HUB_COMPONENTS.configHub,
  AdminHub: HUB_COMPONENTS.adminHub,
});
window._hubs = HUBS;
