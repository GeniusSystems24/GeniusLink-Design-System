/* global React, ReactDOM, Logo, Icon, CreateStore, CreateAccountGroup, AccountGroupDetails, IssueInventory, OpeningJournalEntry */
// GeniusLink UI Kit — demo shell.
// Switches between screens, toggles dark/light theme, demonstrates the components.

const SCREENS = [
  // Auth
  { id: 'login',         label: 'Sign In',                 icon: 'lock',       comp: 'Login',                section: 'Auth',     fullBleed: true },
  { id: 'signup',        label: 'Sign Up',                 icon: 'user',       comp: 'SignUp',               section: 'Auth',     fullBleed: true },
  { id: 'forgot',        label: 'Forgot Password',         icon: 'lock',       comp: 'ForgotPassword',       section: 'Auth',     fullBleed: true },
  // Overview
  { id: 'dashboard',     label: 'Dashboard',               icon: 'briefcase',  comp: 'Dashboard',            section: 'Overview' },
  { id: 'invDashboard',  label: 'Inventory Dashboard',     icon: 'scanner',    comp: 'InventoryDashboard',   section: 'Overview' },
  // Accounts
  { id: 'accounts',      label: 'Chart of Accounts',       icon: 'ledger',     comp: 'AccountsList',         section: 'Accounts' },
  { id: 'accountTree',   label: 'Account Tree',            icon: 'briefcase',  comp: 'AccountTree',          section: 'Accounts' },
  { id: 'createAccount', label: 'Create Account',          icon: 'plus',       comp: 'CreateAccount',        section: 'Accounts' },
  { id: 'accountDetail', label: 'Account · View',          icon: 'doc',        comp: 'AccountDetails',       section: 'Accounts' },
  { id: 'group',         label: 'Create Account Group',    icon: 'briefcase',  comp: 'CreateAccountGroup',   section: 'Accounts' },
  { id: 'groupDetail',   label: 'Account Group · View',    icon: 'doc',        comp: 'AccountGroupDetails',  section: 'Accounts' },
  // Stores
  { id: 'stores',        label: 'Warehouses',              icon: 'store',      comp: 'StoresList',           section: 'Stores' },
  { id: 'storeDetail',   label: 'Warehouse · View',        icon: 'doc',        comp: 'StoreDetails',         section: 'Stores' },
  { id: 'createStore',   label: 'Create Warehouse',        icon: 'plus',       comp: 'CreateStore',          section: 'Stores' },
  { id: 'products',      label: 'Products',                icon: 'scanner',    comp: 'ProductsList',         section: 'Stores' },
  { id: 'createProduct', label: 'Create Product',          icon: 'plus',       comp: 'CreateProduct',        section: 'Stores' },
  { id: 'productDetail', label: 'Product · View',          icon: 'doc',        comp: 'ProductDetails',       section: 'Stores' },
  { id: 'categories',    label: 'Categories',              icon: 'briefcase',  comp: 'Categories',           section: 'Stores' },
  { id: 'uom',           label: 'Units of Measure',        icon: 'compass',    comp: 'UnitsOfMeasure',       section: 'Stores' },
  { id: 'priceLists',    label: 'Price Lists',             icon: 'ledger',     comp: 'PriceLists',           section: 'Stores' },
  { id: 'inventory',     label: 'Issue Inventory',         icon: 'scanner',    comp: 'IssueInventory',       section: 'Stores' },
  { id: 'receive',       label: 'Receive Inventory',       icon: 'download',   comp: 'ReceiveInventory',     section: 'Stores' },
  { id: 'transferList',  label: 'Stock Transfers',         icon: 'paperclip',  comp: 'StockTransferList',    section: 'Stores' },
  { id: 'transfer',      label: 'New Stock Transfer',      icon: 'paperclip',  comp: 'TransferInventory',    section: 'Stores' },
  { id: 'adjust',        label: 'Stock Adjustment',        icon: 'settings',   comp: 'InventoryAdjustment',  section: 'Stores' },
  { id: 'stockTake',     label: 'Stock Take',              icon: 'check',      comp: 'StockTake',            section: 'Stores' },
  { id: 'barcodePrint',  label: 'Barcode Print',           icon: 'hash',       comp: 'BarcodePrint',         section: 'Stores' },
  // Ledger
  { id: 'journals',      label: 'Journal Entries',         icon: 'ledger',     comp: 'JournalList',          section: 'Ledger' },
  { id: 'createJournal', label: 'Create Journal Entry',    icon: 'plus',       comp: 'CreateJournalEntry',   section: 'Ledger' },
  { id: 'journalDetail', label: 'Journal Entry · View',    icon: 'doc',        comp: 'JournalEntryDetails',  section: 'Ledger' },
  { id: 'journal',       label: 'Opening Journal',         icon: 'ledger',     comp: 'OpeningJournalEntry',  section: 'Ledger' },
  { id: 'opDetail',      label: 'Financial Operation · View', icon: 'briefcase', comp: 'FinancialOperationDetails', section: 'Ledger' },
  // Banking
  { id: 'deposit',       label: 'Create Deposit',          icon: 'download',   comp: 'CreateDeposit',        section: 'Banking' },
  { id: 'depositDetail', label: 'Deposit · View',          icon: 'doc',        comp: 'DepositDetails',       section: 'Banking' },
  { id: 'withdrawal',    label: 'Create Withdrawal',       icon: 'upload',     comp: 'CreateWithdrawal',     section: 'Banking' },
  { id: 'withdrawalDetail', label: 'Withdrawal · View',    icon: 'doc',        comp: 'WithdrawalDetails',    section: 'Banking' },
  { id: 'localTransfer', label: 'Local Transfer',          icon: 'paperclip',  comp: 'CreateLocalTransfer',  section: 'Banking' },
  { id: 'localTransferDetail', label: 'Local Transfer · View', icon: 'doc',    comp: 'LocalTransferDetails', section: 'Banking' },
  { id: 'extTransfer',   label: 'External Transfer',       icon: 'compass',    comp: 'CreateExternalTransfer', section: 'Banking' },
  { id: 'extTransferDetail', label: 'External Transfer · View', icon: 'doc',   comp: 'ExternalTransferDetails', section: 'Banking' },
  // Configuration
  { id: 'currencies',    label: 'Currencies',              icon: 'briefcase',  comp: 'CurrenciesList',       section: 'Config' },
  { id: 'createCurrency',label: 'Add Currency',            icon: 'plus',       comp: 'CreateCurrency',       section: 'Config' },
  { id: 'currencyDetail',label: 'Currency · View',         icon: 'doc',        comp: 'CurrencyDetails',      section: 'Config' },
  { id: 'exchangeRates', label: 'Exchange Rates',          icon: 'compass',    comp: 'ExchangeRateSetup',    section: 'Config' },
  { id: 'fiscalYear',    label: 'Fiscal Year',             icon: 'ledger',     comp: 'FiscalYearSetup',      section: 'Config' },
  // Administration
  { id: 'users',         label: 'Users',                   icon: 'user',       comp: 'UsersList',            section: 'Admin' },
  { id: 'createUser',    label: 'Invite User',             icon: 'plus',       comp: 'CreateUser',           section: 'Admin' },
  { id: 'userDetail',    label: 'User · View',             icon: 'doc',        comp: 'UserDetails',          section: 'Admin' },
  { id: 'roles',         label: 'Roles & Permissions',     icon: 'settings',   comp: 'RolesPermissions',     section: 'Admin' },
  // Reports
  { id: 'trialBalance',  label: 'Trial Balance',           icon: 'ledger',     comp: 'TrialBalanceReport',   section: 'Reports' },
  { id: 'incomeStmt',    label: 'Income Statement',        icon: 'doc',        comp: 'IncomeStatement',      section: 'Reports' },
  { id: 'balanceSheet',  label: 'Balance Sheet',           icon: 'doc',        comp: 'BalanceSheet',         section: 'Reports' },
  { id: 'invValuation',  label: 'Inventory Valuation',     icon: 'scanner',    comp: 'InventoryValuation',   section: 'Reports' },
  { id: 'auditLog',      label: 'Audit Log',               icon: 'lock',       comp: 'AuditLog',             section: 'Reports' },
  // Sales
  { id: 'customers',     label: 'Customers',               icon: 'user',       comp: 'CustomersList',        section: 'Sales' },
  { id: 'createCustomer',label: 'Add Customer',            icon: 'plus',       comp: 'CreateCustomer',       section: 'Sales' },
  { id: 'customerDetail',label: 'Customer · View',         icon: 'doc',        comp: 'CustomerDetails',      section: 'Sales' },
  // Procurement
  { id: 'suppliers',     label: 'Suppliers',               icon: 'briefcase',  comp: 'SuppliersList',        section: 'Procurement' },
  { id: 'createSupplier',label: 'Add Supplier',            icon: 'plus',       comp: 'CreateSupplier',       section: 'Procurement' },
  { id: 'supplierDetail',label: 'Supplier · View',         icon: 'doc',        comp: 'SupplierDetails',      section: 'Procurement' },
  // Settings
  { id: 'settingsHub',   label: 'Settings',                icon: 'settings',   comp: 'SettingsHub',          section: 'Settings' },
  { id: 'setCompany',    label: 'Company Profile',         icon: 'building',   comp: 'CompanyProfileSettings', section: 'Settings', hideNav: true },
  { id: 'setFinancial',  label: 'Financial',               icon: 'globe',      comp: 'FinancialSettings',    section: 'Settings', hideNav: true },
  { id: 'setTaxes',      label: 'Taxes',                   icon: 'percent',    comp: 'TaxesSettings',        section: 'Settings', hideNav: true },
  { id: 'setCurrencies', label: 'Currencies · Settings',   icon: 'compass',    comp: 'CurrenciesSettings',   section: 'Settings', hideNav: true },
  { id: 'setNumbering',  label: 'Numbering',               icon: 'hash',       comp: 'NumberingSequences',   section: 'Settings', hideNav: true },
  { id: 'setBranches',   label: 'Branches & Stores',       icon: 'store',      comp: 'BranchesStores',       section: 'Settings', hideNav: true },
  { id: 'tenants',       label: 'Workspaces',              icon: 'switch2',    comp: 'TenantManagement',     section: 'Settings', hideNav: true },
  { id: 'setRoles',      label: 'Roles · Cards',           icon: 'settings',   comp: 'RolesListScreen',      section: 'Settings', hideNav: true },
  { id: 'roleEditor',    label: 'Role Editor',             icon: 'settings',   comp: 'RoleEditorScreen',     section: 'Settings', hideNav: true },
  { id: 'setAudit',      label: 'Audit Log · Settings',    icon: 'lock',       comp: 'AuditLogScreen',       section: 'Settings', hideNav: true },
  { id: 'setIntegrations', label: 'Integrations',          icon: 'plug',       comp: 'IntegrationsScreen',   section: 'Settings', hideNav: true },
  { id: 'setWebhooks',   label: 'Webhooks',                icon: 'link',       comp: 'WebhooksScreen',       section: 'Settings', hideNav: true },
  { id: 'setApiKeys',    label: 'API Keys',                icon: 'key',        comp: 'APIKeysScreen',        section: 'Settings', hideNav: true },
  { id: 'setNotifications', label: 'Notifications',        icon: 'bell',       comp: 'NotificationPreferencesScreen', section: 'Settings', hideNav: true },
  { id: 'setBilling',    label: 'Billing & Plan',          icon: 'card',       comp: 'BillingPlanScreen',    section: 'Settings', hideNav: true },
  { id: 'setBackup',     label: 'Backup & Export',         icon: 'database',   comp: 'BackupExportScreen',   section: 'Settings', hideNav: true },

  // ── Module landing hubs (the consolidated sidebar entries) ──
  { id: 'accountsHub',    label: 'Accounts',            icon: 'ledger',    comp: 'AccountsHub',    section: 'Modules' },
  { id: 'ledgerHub',      label: 'Ledger',              icon: 'ledger',    comp: 'LedgerHub',      section: 'Modules' },
  { id: 'bankingHub',     label: 'Banking',             icon: 'switch2',   comp: 'BankingHub',     section: 'Modules' },
  { id: 'reportsHub',     label: 'Reports',             icon: 'doc',       comp: 'ReportsHub',     section: 'Modules' },
  { id: 'storesHub',      label: 'Inventory & Stores',  icon: 'store',     comp: 'StoresHub',      section: 'Modules' },
  { id: 'salesHub',       label: 'Sales',               icon: 'user',      comp: 'SalesHub',       section: 'Modules' },
  { id: 'procurementHub', label: 'Procurement',         icon: 'briefcase', comp: 'ProcurementHub', section: 'Modules' },
  { id: 'configHub',      label: 'Configuration',       icon: 'compass',   comp: 'ConfigHub',      section: 'Modules' },
  { id: 'adminHub',       label: 'Team & Access',       icon: 'user',      comp: 'AdminHub',       section: 'Modules' },
];

// Sidebar is driven by this explicit map — related screens collapse into one
// module entry that opens a hub of cards (same pattern as Settings).
const SIDEBAR_NAV = [
  { group: 'Auth',           items: ['login', 'signup', 'forgot'] },
  { group: 'Overview',       items: ['dashboard', 'invDashboard'] },
  { group: 'Finance',        items: ['accountsHub', 'ledgerHub', 'bankingHub', 'reportsHub'] },
  { group: 'Operations',     items: ['storesHub', 'salesHub', 'procurementHub'] },
  { group: 'Administration', items: ['configHub', 'adminHub', 'settingsHub'] },
];

// ── Full browser-style tab strip — mirrors design_system/BrowserTabs.jsx ──
// Features: active/inactive/hover · closable · pinned (compact, anchored) ·
//   drag-reorder · overflow chevrons · right-click menu (close / close others /
//   close to right / duplicate / pin) · unsaved (dirty) dot + close-confirm
//   dialog · tab-list dropdown (jump to any tab) · hover mini-page preview
//   (real scaled-down render of the screen) · keyboard ←/→/Home/End · add (+).
function WorkspaceTab({ tab, active, compact, first, onSelect, onClose, onContextMenu, onPreview, drag }) {
  const [hover, setHover] = React.useState(false);
  const [closeHover, setCloseHover] = React.useState(false);
  const tabRef = React.useRef(null);
  const previewTimer = React.useRef(null);
  const dragging = drag && drag.dragId === tab.tid;
  const isOver = drag && drag.overId === tab.tid && drag.dragId !== tab.tid;
  const clearPreviewTimer = () => { if (previewTimer.current) { clearTimeout(previewTimer.current); previewTimer.current = null; } };
  const armPreview = () => {
    if (!onPreview) return;
    clearPreviewTimer();
    previewTimer.current = setTimeout(() => { if (tabRef.current) onPreview(tab.tid, tabRef.current.getBoundingClientRect()); }, 480);
  };
  const dropPreview = () => { clearPreviewTimer(); if (onPreview) onPreview(null); };
  React.useEffect(() => clearPreviewTimer, []);
  return (
    <div ref={tabRef} role="tab" aria-selected={active} aria-label={tab.label} tabIndex={active ? 0 : -1}
      draggable={!!drag}
      onDragStart={(e) => { dropPreview(); if (drag) { drag.onDragStart(tab.tid); e.dataTransfer.effectAllowed = 'move'; } }}
      onDragOver={(e) => { if (drag) { e.preventDefault(); drag.onDragOver(tab.tid); } }}
      onDrop={(e) => { if (drag) { e.preventDefault(); drag.onDrop(tab.tid); } }}
      onDragEnd={() => drag && drag.onDragEnd()}
      onMouseEnter={() => { setHover(true); armPreview(); }} onMouseLeave={() => { setHover(false); dropPreview(); }}
      onClick={() => { dropPreview(); onSelect(tab.tid); }}
      onContextMenu={(e) => { e.preventDefault(); dropPreview(); onContextMenu(e, tab.tid); }}
      style={{
        position: 'relative', display: 'flex', alignItems: 'center', gap: compact ? 0 : 8,
        height: 36, paddingInline: compact ? '0' : '12px 8px',
        width: compact ? 40 : undefined, maxWidth: 200, minWidth: compact ? 40 : 120, flexShrink: 0,
        justifyContent: compact ? 'center' : 'flex-start',
        borderRadius: '9px 9px 0 0', cursor: dragging ? 'grabbing' : 'pointer', userSelect: 'none',
        background: active ? 'var(--gl-bg)' : (hover ? 'var(--gl-hover)' : 'transparent'),
        color: active ? 'var(--gl-fg-1)' : 'var(--gl-fg-3)', opacity: dragging ? 0.4 : 1,
        transition: 'background 150ms ease, color 150ms ease, opacity 100ms ease',
      }}>
      {isOver && <span style={{ position: 'absolute', insetInlineStart: -1, top: 6, bottom: 6, width: 2, borderRadius: 2, background: '#4A7CFF' }} />}
      {!active && !first && !isOver && <span style={{ position: 'absolute', insetInlineStart: 0, top: 9, bottom: 9, width: 1, background: 'var(--gl-border)' }} />}
      <span style={{ display: 'flex', color: active ? '#4A7CFF' : 'var(--gl-fg-3)', flexShrink: 0 }}><Icon name={tab.icon} size={14} /></span>
      {!compact && <span style={{ flex: 1, fontSize: 12.5, fontWeight: active ? 600 : 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{tab.label}</span>}
      {compact
        ? (tab.dirty && <span title="Unsaved changes" style={{ position: 'absolute', top: 7, insetInlineEnd: 7, width: 6, height: 6, borderRadius: 999, background: '#F97316' }} />)
        : (tab.dirty && !hover
          ? <span title="Unsaved changes" style={{ width: 8, height: 8, borderRadius: 999, background: '#F97316', flexShrink: 0, marginInlineEnd: 4 }} />
          : <span role="button" aria-label="Close tab"
              onMouseEnter={() => setCloseHover(true)} onMouseLeave={() => setCloseHover(false)}
              onClick={(e) => { e.stopPropagation(); onClose(tab.tid); }}
              style={{ width: 18, height: 18, borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: closeHover ? 'var(--gl-input-bg)' : 'transparent', color: closeHover ? 'var(--gl-fg-1)' : 'var(--gl-fg-3)', visibility: (hover || active) ? 'visible' : 'hidden' }}>
              <Icon name="close" size={12} />
            </span>)}
    </div>
  );
}

function TabContextMenu({ menu, items, onClose }) {
  React.useEffect(() => {
    if (!menu) return;
    const dismiss = () => onClose();
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('mousedown', dismiss);
    window.addEventListener('scroll', dismiss, true);
    window.addEventListener('keydown', onKey);
    return () => { window.removeEventListener('mousedown', dismiss); window.removeEventListener('scroll', dismiss, true); window.removeEventListener('keydown', onKey); };
  }, [menu, onClose]);
  if (!menu) return null;
  const W = 224;
  const left = Math.min(menu.x, window.innerWidth - W - 8);
  const top = Math.min(menu.y, window.innerHeight - (items.length * 36 + 12));
  return (
    <div role="menu" onMouseDown={(e) => e.stopPropagation()}
      style={{ position: 'fixed', left, top, width: W, zIndex: 4000, background: 'var(--gl-surface)', border: '1px solid var(--gl-border-strong)', borderRadius: 6, boxShadow: 'var(--gl-shadow-pop)', padding: 6 }}>
      {items.map((it, i) => it.divider
        ? <div key={i} style={{ height: 1, background: 'var(--gl-border)', margin: '6px 4px' }} />
        : <button key={i} role="menuitem" disabled={it.disabled}
            onClick={() => { if (!it.disabled) { it.run(); onClose(); } }}
            onMouseEnter={(e) => { if (!it.disabled) e.currentTarget.style.background = 'var(--gl-hover)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, height: 32, padding: '0 10px', border: 'none', background: 'transparent', borderRadius: 6, cursor: it.disabled ? 'not-allowed' : 'pointer', color: it.danger ? '#EF4444' : 'var(--gl-fg-1)', opacity: it.disabled ? 0.4 : 1, fontSize: 13, textAlign: 'start', fontFamily: 'var(--gl-font-body)' }}>
            <span style={{ display: 'flex', flexShrink: 0 }}><Icon name={it.icon} size={15} /></span>
            <span style={{ flex: 1, textAlign: 'start' }}>{it.label}</span>
            {it.hint && <span style={{ fontSize: 11, color: 'var(--gl-fg-3)', fontFamily: 'var(--gl-font-mono)' }}>{it.hint}</span>}
          </button>)}
    </div>
  );
}

function TabListMenu({ open, anchorRef, tabs, activeTid, onPick, onClose }) {
  React.useEffect(() => {
    if (!open) return;
    const dismiss = () => onClose();
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('mousedown', dismiss);
    window.addEventListener('scroll', dismiss, true);
    window.addEventListener('keydown', onKey);
    return () => { window.removeEventListener('mousedown', dismiss); window.removeEventListener('scroll', dismiss, true); window.removeEventListener('keydown', onKey); };
  }, [open, onClose]);
  if (!open || !anchorRef.current) return null;
  const r = anchorRef.current.getBoundingClientRect();
  const W = 280;
  const left = Math.max(8, Math.min(r.right - W, window.innerWidth - W - 8));
  const top = Math.min(r.bottom + 6, window.innerHeight - 8);
  const maxH = Math.max(160, window.innerHeight - top - 16);
  return (
    <div role="menu" onMouseDown={(e) => e.stopPropagation()}
      style={{ position: 'fixed', left, top, width: W, maxHeight: maxH, overflowY: 'auto', zIndex: 4000, background: 'var(--gl-surface)', border: '1px solid var(--gl-border-strong)', borderRadius: 6, boxShadow: 'var(--gl-shadow-pop)', padding: 6 }}>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--gl-fg-3)', padding: '4px 10px 6px', fontFamily: 'var(--gl-font-mono)' }}>Open tabs · {tabs.length}</div>
      {tabs.map((t) => (
        <button key={t.tid} role="menuitemradio" aria-checked={t.tid === activeTid}
          onClick={() => { onPick(t.tid); onClose(); }}
          onMouseEnter={(e) => { if (t.tid !== activeTid) e.currentTarget.style.background = 'var(--gl-hover)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = t.tid === activeTid ? 'var(--gl-input-bg)' : 'transparent'; }}
          style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, minHeight: 34, padding: '0 10px', border: 'none', background: t.tid === activeTid ? 'var(--gl-input-bg)' : 'transparent', borderRadius: 6, cursor: 'pointer', color: t.tid === activeTid ? 'var(--gl-fg-1)' : 'var(--gl-fg-2)', fontSize: 13, textAlign: 'start', fontFamily: 'var(--gl-font-body)' }}>
          <span style={{ display: 'flex', color: t.tid === activeTid ? '#4A7CFF' : 'var(--gl-fg-3)', flexShrink: 0 }}><Icon name={t.icon} size={15} /></span>
          <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', textAlign: 'start', fontWeight: t.tid === activeTid ? 600 : 500 }}>{t.label}</span>
          {t.pinned && <span style={{ display: 'flex', color: 'var(--gl-fg-3)', flexShrink: 0 }} title="Pinned"><Icon name="pin" size={13} /></span>}
          {t.dirty && <span title="Unsaved changes" style={{ width: 7, height: 7, borderRadius: 999, background: '#F97316', flexShrink: 0 }} />}
        </button>
      ))}
    </div>
  );
}

function TabConfirmDialog({ data, onDiscard, onSave, onCancel }) {
  React.useEffect(() => {
    if (!data) return;
    const onKey = (e) => { if (e.key === 'Escape') onCancel(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [data, onCancel]);
  if (!data) return null;
  return (
    <div role="presentation" onMouseDown={onCancel}
      style={{ position: 'fixed', inset: 0, zIndex: 5000, background: 'color-mix(in srgb, var(--gl-fg-1) 38%, transparent)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div role="alertdialog" aria-modal="true" onMouseDown={(e) => e.stopPropagation()}
        style={{ width: 'min(420px, 100%)', background: 'var(--gl-surface)', border: '1px solid var(--gl-border-strong)', borderRadius: 8, boxShadow: 'var(--gl-shadow-pop)', padding: 22 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <span style={{ display: 'flex', flexShrink: 0, color: '#F97316', background: 'color-mix(in srgb, #F97316 14%, transparent)', width: 36, height: 36, borderRadius: 999, alignItems: 'center', justifyContent: 'center' }}><Icon name="alert" size={18} /></span>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'var(--gl-font-display)', fontWeight: 700, fontSize: 16, color: 'var(--gl-fg-1)' }}>Discard unsaved changes?</div>
            <div style={{ fontSize: 13, color: 'var(--gl-fg-3)', marginTop: 6, lineHeight: 1.5 }}>“{data.label}” has edits that haven’t been saved. Closing it now will lose them.</div>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 20, flexWrap: 'wrap' }}>
          <button onClick={onCancel}
            style={{ height: 36, padding: '0 14px', borderRadius: 6, border: '1px solid var(--gl-border-strong)', background: 'transparent', color: 'var(--gl-fg-1)', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--gl-font-body)' }}>Cancel</button>
          <button onClick={onSave}
            style={{ height: 36, padding: '0 14px', borderRadius: 6, border: '1px solid var(--gl-border-strong)', background: 'transparent', color: 'var(--gl-fg-1)', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'var(--gl-font-body)' }}><Icon name="save" size={14} /> Save &amp; close</button>
          <button onClick={onDiscard} autoFocus
            style={{ height: 36, padding: '0 14px', borderRadius: 6, border: '1px solid transparent', background: '#EF4444', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--gl-font-body)' }}>Discard &amp; close</button>
        </div>
      </div>
    </div>
  );
}

// Catches a screen that throws while rendering inside the tiny preview, so a
// hover never crashes the shell — degrades to a labelled placeholder.
class PreviewBoundary extends React.Component {
  constructor(p) { super(p); this.state = { err: false }; }
  static getDerivedStateFromError() { return { err: true }; }
  componentDidCatch() {}
  render() { return this.state.err ? this.props.fallback : this.props.children; }
}

// Hover preview — a real, scaled-down render of the screen the tab holds.
// Anchored to the tab, non-interactive, flips above when there is no room below.
function WorkspaceTabPreview({ data, screenProps, onClose }) {
  const [show, setShow] = React.useState(false);
  const CARD_W = 280, CARD_H = 206, DESIGN_W = 1180;
  React.useEffect(() => {
    if (!data) return;
    const t = setTimeout(() => setShow(true), 16);
    const dismiss = () => onClose && onClose();
    window.addEventListener('scroll', dismiss, true);
    window.addEventListener('resize', dismiss);
    return () => { clearTimeout(t); window.removeEventListener('scroll', dismiss, true); window.removeEventListener('resize', dismiss); };
  }, []);
  if (!data || !data.tab) return null;
  const { tab, rect } = data;
  const sc = SCREENS.find((s) => s.id === tab.screen);
  const Comp = sc && window[sc.comp];
  const left = Math.max(8, Math.min(rect.left, window.innerWidth - CARD_W - 8));
  let top = rect.bottom + 9, above = false;
  if (top + CARD_H > window.innerHeight - 8) { top = rect.top - CARD_H - 9; above = true; }
  const arrowX = Math.max(16, Math.min(rect.left + rect.width / 2 - left, CARD_W - 16));
  const fallback = (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, color: 'var(--gl-fg-3)', background: 'var(--gl-bg)' }}>
      <Icon name={tab.icon || 'globe'} size={26} /><span style={{ fontSize: 11 }}>{tab.label}</span>
    </div>
  );
  return (
    <div style={{
      position: 'fixed', left, top, width: CARD_W, zIndex: 6000, pointerEvents: 'none',
      opacity: show ? 1 : 0, transform: show ? 'translateY(0)' : `translateY(${above ? 5 : -5}px)`,
      transition: 'opacity 150ms cubic-bezier(0,0,0.2,1), transform 150ms cubic-bezier(0,0,0.2,1)', fontFamily: 'var(--gl-font-body)',
    }}>
      <div style={{ background: 'var(--gl-surface)', border: '1px solid var(--gl-border-strong)', borderRadius: 8, boxShadow: 'var(--gl-shadow-pop)', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 11px', borderBottom: '1px solid var(--gl-border)' }}>
          <span style={{ display: 'flex', color: '#4A7CFF', flexShrink: 0 }}><Icon name={tab.icon || 'globe'} size={15} /></span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--gl-fg-1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{tab.label}</div>
            <div style={{ fontSize: 10.5, color: 'var(--gl-fg-3)', fontFamily: 'var(--gl-font-mono)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: 1 }}>{sc ? sc.section : 'Screen'}</div>
          </div>
          {tab.pinned && <span style={{ display: 'flex', color: 'var(--gl-fg-3)', flexShrink: 0 }} title="Pinned"><Icon name="pin" size={12} /></span>}
          {tab.dirty && <span title="Unsaved changes" style={{ width: 7, height: 7, borderRadius: 999, background: '#F97316', flexShrink: 0 }} />}
        </div>
        <div style={{ position: 'relative', width: CARD_W, height: 150, overflow: 'hidden', background: 'var(--gl-bg)' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: DESIGN_W, transform: `scale(${CARD_W / DESIGN_W})`, transformOrigin: 'top left', pointerEvents: 'none' }}>
            <PreviewBoundary fallback={fallback}>{Comp ? <Comp {...screenProps} /> : fallback}</PreviewBoundary>
          </div>
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'linear-gradient(to bottom, transparent 78%, color-mix(in srgb, var(--gl-bg) 72%, transparent))' }} />
        </div>
      </div>
      <span style={{ position: 'absolute', left: arrowX - 5, width: 9, height: 9, background: 'var(--gl-surface)', transform: 'rotate(45deg)',
        ...(above ? { bottom: -5, borderRight: '1px solid var(--gl-border-strong)', borderBottom: '1px solid var(--gl-border-strong)' } : { top: -5, borderLeft: '1px solid var(--gl-border-strong)', borderTop: '1px solid var(--gl-border-strong)' }) }} />
    </div>
  );
}

function WorkspaceTabs({ tabs, activeTid, onSelect, onClose, onClearDirty, onAdd, onReorder, onPin, onDuplicate, onCloseOthers, onCloseRight, screenProps }) {
  const [dragId, setDragId] = React.useState(null);
  const [overId, setOverId] = React.useState(null);
  const [menu, setMenu] = React.useState(null);          // { tid, x, y }
  const [confirm, setConfirm] = React.useState(null);    // { tid, label }
  const [listOpen, setListOpen] = React.useState(false);
  const [preview, setPreview] = React.useState(null);    // { tid, rect } — hover mini-page preview
  const stripRef = React.useRef(null);
  const listBtnRef = React.useRef(null);

  const pinned = tabs.filter((t) => t.pinned);
  const unpinned = tabs.filter((t) => !t.pinned);
  const ordered = [...pinned, ...unpinned];
  // identity of the tab set — changes whenever tabs are added/removed/reordered/pinned
  const tabsKey = tabs.map((t) => t.tid + (t.pinned ? 'p' : '')).join(',');

  const drag = {
    dragId, overId,
    onDragStart: setDragId, onDragOver: setOverId,
    onDrop: (toId) => { if (dragId != null && toId != null && dragId !== toId) onReorder(dragId, toId); setDragId(null); setOverId(null); },
    onDragEnd: () => { setDragId(null); setOverId(null); },
  };

  // overflow chevrons — re-measured synchronously whenever the tab set changes
  // (useLayoutEffect with tab deps) plus on scroll / resize.
  const [chev, _setChev] = React.useState({ start: false, end: false });
  const chevRef = React.useRef(chev);
  const measure = React.useCallback(() => {
    const el = stripRef.current; if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const sl = Math.abs(el.scrollLeft);
    const next = { start: max > 4 && sl > 2, end: max > 4 && sl < max - 2 };
    const cur = chevRef.current;
    if (cur.start !== next.start || cur.end !== next.end) { chevRef.current = next; _setChev(next); }
  }, []);
  React.useLayoutEffect(() => { measure(); }, [measure, tabsKey]);
  React.useEffect(() => {
    const el = stripRef.current; if (!el) return;
    el.addEventListener('scroll', measure, { passive: true });
    window.addEventListener('resize', measure);
    const id = setTimeout(measure, 60);               // catch late font/layout settle
    return () => { el.removeEventListener('scroll', measure); window.removeEventListener('resize', measure); clearTimeout(id); };
  }, [measure, tabsKey]);
  const scrollByDir = (towardEnd) => { const el = stripRef.current; if (el) el.scrollBy({ left: 220 * (towardEnd ? 1 : -1), behavior: 'smooth' }); };

  // close — gate dirty tabs behind a confirm dialog
  const requestClose = (tid) => { const t = tabs.find((x) => x.tid === tid); if (t && t.dirty) setConfirm({ tid, label: t.label }); else onClose(tid); };
  const confirmDiscard = () => { if (confirm) onClose(confirm.tid); setConfirm(null); };
  const confirmSave = () => { if (confirm) { onClearDirty(confirm.tid); onClose(confirm.tid); } setConfirm(null); };

  // keyboard ←/→/Home/End
  const onKey = (e) => {
    const keys = ['ArrowRight', 'ArrowLeft', 'Home', 'End'];
    if (!keys.includes(e.key)) return;
    e.preventDefault();
    const i = ordered.findIndex((t) => t.tid === activeTid);
    let ni = i;
    if (e.key === 'ArrowRight') ni = Math.min(i + 1, ordered.length - 1);
    else if (e.key === 'ArrowLeft') ni = Math.max(i - 1, 0);
    else if (e.key === 'Home') ni = 0;
    else if (e.key === 'End') ni = ordered.length - 1;
    if (ordered[ni]) onSelect(ordered[ni].tid);
  };

  const openMenu = (e, tid) => { setPreview(null); setMenu({ tid, x: e.clientX, y: e.clientY }); };
  const handlePreview = (tid, rect) => {
    if (tid == null || dragId || menu || confirm) { setPreview(null); return; }
    setPreview({ tid, rect });
  };
  const menuTab = menu && tabs.find((t) => t.tid === menu.tid);
  const menuItems = menuTab ? [
    { icon: 'close', label: 'Close tab', hint: 'Del', danger: true, run: () => requestClose(menuTab.tid) },
    { icon: 'close', label: 'Close other tabs', disabled: unpinned.length <= 1, run: () => onCloseOthers(menuTab.tid) },
    { icon: 'chevRight', label: 'Close tabs to the right', disabled: ordered.slice(ordered.findIndex((t) => t.tid === menuTab.tid) + 1).every((t) => t.pinned), run: () => onCloseRight(menuTab.tid) },
    { divider: true },
    { icon: 'copy', label: 'Duplicate tab', run: () => onDuplicate(menuTab.tid) },
    { icon: 'pin', label: menuTab.pinned ? 'Unpin tab' : 'Pin tab', run: () => onPin(menuTab.tid) },
  ] : [];

  const chevBtn = (towardEnd, show) => show ? (
    <button aria-label={towardEnd ? 'Scroll tabs forward' : 'Scroll tabs back'} onClick={() => scrollByDir(towardEnd)}
      style={{ width: 26, height: 32, marginBottom: 2, padding: 0, border: 'none', background: 'var(--gl-surface)', color: 'var(--gl-fg-3)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
      onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--gl-fg-1)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--gl-fg-3)'; }}>
      <Icon name={towardEnd ? 'chevRight' : 'chevLeft'} size={16} />
    </button>
  ) : null;

  const iconBtn = (props, name, extra) => (
    <button {...props}
      style={{ width: 32, height: 32, marginBottom: 2, borderRadius: 7, border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: 'transparent', color: 'var(--gl-fg-3)', ...extra }}
      onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--gl-hover)'; e.currentTarget.style.color = 'var(--gl-fg-1)'; }}
      onMouseLeave={(e) => { if (!props['data-keep']) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--gl-fg-3)'; } }}>
      <Icon name={name} size={16} />
    </button>
  );

  return (
    <div role="tablist" onKeyDown={onKey} style={{
      display: 'flex', alignItems: 'flex-end', gap: 0, padding: '8px 8px 0',
      background: 'var(--gl-surface)', borderBottom: '1px solid var(--gl-border)',
      minHeight: 44, flexShrink: 0,
    }}>
      {/* pinned tabs — anchored, compact */}
      {pinned.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, flexShrink: 0, marginInlineEnd: 4 }}>
          {pinned.map((t, i) => <WorkspaceTab key={t.tid} tab={t} first={i === 0} compact active={t.tid === activeTid} onSelect={onSelect} onClose={requestClose} onContextMenu={openMenu} onPreview={handlePreview} drag={null} />)}
          <span style={{ width: 1, alignSelf: 'stretch', margin: '8px 4px 0', background: 'var(--gl-border-strong)' }} />
        </div>
      )}
      {chevBtn(false, chev.start)}
      <div ref={stripRef} style={{ display: 'flex', alignItems: 'flex-end', gap: 2, overflowX: 'auto', flex: 1, scrollbarWidth: 'none' }}>
        {unpinned.map((t, i) => <WorkspaceTab key={t.tid} tab={t} first={i === 0 && pinned.length === 0} active={t.tid === activeTid} onSelect={onSelect} onClose={requestClose} onContextMenu={openMenu} onPreview={handlePreview} drag={drag} />)}
      </div>
      {chevBtn(true, chev.end)}
      {iconBtn({ 'aria-label': 'New tab', title: 'New tab', onClick: onAdd }, 'plus', { marginInlineStart: 4 })}
      {iconBtn({
        ref: listBtnRef, 'aria-label': 'Show all tabs', 'aria-haspopup': 'menu', 'aria-expanded': listOpen,
        title: 'Show all tabs', 'data-keep': listOpen ? '1' : undefined,
        onMouseDown: (e) => e.stopPropagation(), onClick: () => { setPreview(null); setListOpen((v) => !v); },
      }, 'chevDown', { marginInlineStart: 2, background: listOpen ? 'var(--gl-hover)' : 'transparent', color: listOpen ? 'var(--gl-fg-1)' : 'var(--gl-fg-3)' })}

      <TabContextMenu menu={menu} items={menuItems} onClose={() => setMenu(null)} />
      <TabListMenu open={listOpen} anchorRef={listBtnRef} tabs={ordered} activeTid={activeTid} onPick={onSelect} onClose={() => setListOpen(false)} />
      <TabConfirmDialog data={confirm} onDiscard={confirmDiscard} onSave={confirmSave} onCancel={() => setConfirm(null)} />
      {preview && <WorkspaceTabPreview key={preview.tid} data={{ tab: tabs.find((t) => t.tid === preview.tid), rect: preview.rect }} screenProps={screenProps} onClose={() => setPreview(null)} />}
    </div>
  );
}

function EmptyWorkspace() {
  return (
    <div style={{ height: '100%', minHeight: 400, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, color: 'var(--gl-fg-3)' }}>
      <Icon name="ledger" size={40} />
      <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--gl-fg-2)' }}>No open tabs</div>
      <div style={{ fontSize: 13 }}>Pick a screen from the sidebar, or press + to open the Dashboard.</div>
    </div>
  );
}

function App() {
  // Tabs are first-class instances: { tid, screen, pinned, dirty } — this lets
  // the same screen be duplicated, pinned, and carry an unsaved flag.
  const seedRef = React.useRef(1);
  const FORM_SCREENS = new Set([
    'createAccount', 'createStore', 'createProduct', 'createJournal', 'createCurrency',
    'createUser', 'createCustomer', 'createSupplier', 'journal', 'group',
    'receive', 'inventory', 'transfer', 'adjust', 'stockTake',
  ]);
  const initialScreen = localStorage.getItem('gl-screen') || 'dashboard';
  const isFullBleed = (scr) => { const s = SCREENS.find((x) => x.id === scr); return !!(s && s.fullBleed); };
  // Tabs + active id live in ONE state object so every mutation is atomic —
  // no stale-closure races between the list and the focused tab.
  const [tabState, setTabState] = React.useState(() => ({
    list: [{ tid: 1, screen: initialScreen, pinned: false, dirty: FORM_SCREENS.has(initialScreen) }],
    activeTid: 1,
  }));
  const tabs = tabState.list;
  const activeTid = tabState.activeTid;
  const [theme, setTheme] = React.useState(() => localStorage.getItem('gl-theme') || 'dark');
  const [toast, setToast] = React.useState(null);

  const activeTab = tabs.find((t) => t.tid === activeTid);
  const screen = activeTab ? activeTab.screen : 'dashboard';
  const setActiveTid = (tid) => setTabState((s) => ({ ...s, activeTid: tid }));

  // Opening a screen focuses its existing tab (creating one if needed). Sidebar
  // nav reuses an open tab for that screen rather than stacking duplicates.
  // Full-bleed (auth) screens take over the whole view and are NOT tabbed.
  const setActive = (id) => {
    const sc = SCREENS.find((s) => s.id === id);
    if (sc && sc.fullBleed) {
      const tid = ++seedRef.current;
      setTabState({ list: [{ tid, screen: id, pinned: false, dirty: false }], activeTid: tid });
      return;
    }
    const tid = ++seedRef.current;
    setTabState((prev) => {
      const cleaned = prev.list.filter((t) => !isFullBleed(t.screen));
      const existing = cleaned.find((t) => t.screen === id);
      if (existing) return { list: cleaned, activeTid: existing.tid };
      return { list: [...cleaned, { tid, screen: id, pinned: false, dirty: FORM_SCREENS.has(id) }], activeTid: tid };
    });
  };
  const setScreen = setActive;

  const closeTab = (tid) => setTabState((prev) => {
    const list = prev.list.filter((t) => t.tid !== tid);
    let activeTid = prev.activeTid;
    if (prev.activeTid === tid && list.length) {
      const oi = prev.list.findIndex((t) => t.tid === tid);
      activeTid = (list[Math.min(oi, list.length - 1)] || list[list.length - 1]).tid;
    }
    return { list, activeTid };
  });
  const clearDirty = (tid) => setTabState((prev) => ({ ...prev, list: prev.list.map((t) => t.tid === tid ? { ...t, dirty: false } : t) }));
  const reorderTabs = (fromTid, toTid) => setTabState((prev) => {
    const a = [...prev.list];
    const from = a.findIndex((t) => t.tid === fromTid);
    const to = a.findIndex((t) => t.tid === toTid);
    if (from < 0 || to < 0 || from === to) return prev;
    const [m] = a.splice(from, 1); a.splice(to, 0, m);
    return { ...prev, list: a };
  });
  const togglePin = (tid) => setTabState((prev) => ({ ...prev, list: prev.list.map((t) => t.tid === tid ? { ...t, pinned: !t.pinned } : t) }));
  const duplicateTab = (tid) => {
    const ntid = ++seedRef.current;
    setTabState((prev) => {
      const i = prev.list.findIndex((t) => t.tid === tid); if (i < 0) return prev;
      const clone = { ...prev.list[i], tid: ntid, dirty: false, pinned: false };
      const a = [...prev.list]; a.splice(i + 1, 0, clone);
      return { list: a, activeTid: ntid };
    });
  };
  const closeOthers = (tid) => setTabState((prev) => ({ list: prev.list.filter((t) => t.tid === tid || t.pinned), activeTid: tid }));
  const closeToRight = (tid) => setTabState((prev) => {
    const ordered = [...prev.list.filter((t) => t.pinned), ...prev.list.filter((t) => !t.pinned)];
    const oi = ordered.findIndex((t) => t.tid === tid);
    const kill = new Set(ordered.slice(oi + 1).filter((t) => !t.pinned).map((t) => t.tid));
    const list = prev.list.filter((t) => !kill.has(t.tid));
    return { list, activeTid: kill.has(prev.activeTid) ? tid : prev.activeTid };
  });
  // tab metadata (label + icon) resolved from the screen registry
  const tabModels = tabs.map((t) => {
    const sc = SCREENS.find((s) => s.id === t.screen);
    return { ...t, label: sc ? sc.label : t.screen, icon: sc ? sc.icon : 'globe' };
  });

  React.useEffect(() => {
    document.body.dataset.theme = theme === 'light' ? 'light' : '';
    localStorage.setItem('gl-theme', theme);
  }, [theme]);

  React.useEffect(() => {
    localStorage.setItem('gl-screen', screen);
  }, [screen]);

  const handleAction = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2400);
  };

  const current = SCREENS.find(s => s.id === screen) || SCREENS[0];
  const Comp = window[current.comp];

  const screenProps = {
    onCancel:      () => handleAction('Cancelled'),
    onCreate:      () => {
      const toCreate = {
        accounts: 'createAccount', accountTree: 'createAccount',
        stores: 'createStore', products: 'createProduct',
        journals: 'createJournal', currencies: 'createCurrency',
        users: 'createUser', customers: 'createCustomer', suppliers: 'createSupplier',
        transferList: 'transfer',
      };
      if (toCreate[current.id]) return setScreen(toCreate[current.id]);
      handleAction('Created successfully');
    },
    onIssue:       () => handleAction('Inventory issued'),
    onEdit:        () => handleAction('Entering edit mode…'),
    onDelete:      () => handleAction('Delete confirmation required'),
    onBack:        () => {
      const map = { Stores: 'storesHub', Accounts: 'accountsHub', Banking: 'bankingHub', Ledger: 'ledgerHub', Config: 'configHub', Admin: 'adminHub', Sales: 'salesHub', Procurement: 'procurementHub' };
      setScreen(map[current.section] || 'accountsHub');
    },
    onOpenEntry:   () => setScreen('journalDetail'),
    onSave:        () => handleAction('Saved'),
    onSend:        () => handleAction('Reset link sent'),
    onRoles:       () => setScreen('roles'),
    onNavigate:    (id) => setScreen(id),
    onOpen:        () => {
      const map = { Admin: 'userDetail', Config: 'currencyDetail', Sales: 'customerDetail', Procurement: 'supplierDetail' };
      if (current.id === 'products') return setScreen('productDetail');
      if (current.id === 'stores') return setScreen('storeDetail');
      setScreen(map[current.section] || 'accountDetail');
    },
    onLogin:       () => { handleAction('Welcome back'); setScreen('accounts'); },
    onOpenAccount: () => setScreen('accountDetail'),
    onOpenStore:   () => setScreen('storeDetail'),
  };

  // Full-bleed screens (login) skip the sidebar/watermark chrome
  if (current.fullBleed) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--gl-bg)', position: 'relative' }}>
        <Comp {...screenProps} />
        <FloatingNav screen={screen} setScreen={setScreen} theme={theme} setTheme={setTheme} />
        {toast && <Toast>{toast}</Toast>}
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'grid', gridTemplateColumns: '256px 1fr',
      background: 'var(--gl-bg)', color: 'var(--gl-fg-1)',
    }}>
      <Sidebar screen={screen} setScreen={setScreen} theme={theme} setTheme={setTheme} />
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', position: 'relative' }}>
        <WorkspaceTabs
          tabs={tabModels}
          activeTid={activeTid}
          onSelect={setActiveTid}
          onClose={closeTab}
          onClearDirty={clearDirty}
          onAdd={() => setScreen('dashboard')}
          onReorder={reorderTabs}
          onPin={togglePin}
          onDuplicate={duplicateTab}
          onCloseOthers={closeOthers}
          onCloseRight={closeToRight}
          screenProps={screenProps} />
        <div style={{ position: 'relative', overflow: 'auto', flex: 1, background: 'var(--gl-bg)' }}>
          <Watermark screen={screen} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            {tabs.length === 0 ? <EmptyWorkspace /> : <Comp {...screenProps} />}
          </div>
        </div>
        {screen === 'users' && window.SessionExpiryBanner && <window.SessionExpiryBanner />}
        {toast && <Toast>{toast}</Toast>}
      </div>
    </div>
  );
}

// Tiny floating chip on full-bleed screens that lets you jump back to the app shell + theme toggle
function FloatingNav({ screen, setScreen, theme, setTheme }) {
  return (
    <div style={{
      position: 'fixed', top: 24, right: 24, zIndex: 50,
      display: 'flex', gap: 8, alignItems: 'center',
      background: 'var(--gl-surface)',
      border: '1px solid var(--gl-border-strong)',
      borderRadius: 6, padding: 6,
      boxShadow: '0 12px 32px -8px rgba(0,0,0,0.4)',
    }}>
      <button
        onClick={() => setScreen('accounts')}
        style={{
          padding: '6px 12px', borderRadius: 4,
          background: 'transparent', color: 'var(--gl-fg-2)',
          border: 'none', cursor: 'pointer',
          fontFamily: 'var(--gl-font-body)', fontWeight: 700, fontSize: 10,
          letterSpacing: '0.1em', textTransform: 'uppercase',
        }}>Skip to App</button>
      <div style={{ width: 1, height: 18, background: 'var(--gl-border)' }} />
      <ThemeToggle theme={theme} setTheme={setTheme} />
    </div>
  );
}

const TENANT_NAMES = { 9: 'Al-Rashid Trading Co.', 14: 'Najd Holdings', 22: 'Coastal Logistics' };

// Human-readable section names for the sidebar search subtitles.
const SECTION_LABELS = {
  Auth: 'Authentication', Overview: 'Overview', Accounts: 'Accounts',
  Stores: 'Inventory & Stores', Ledger: 'Ledger', Banking: 'Banking',
  Config: 'Configuration', Admin: 'Team & Access', Reports: 'Reports',
  Sales: 'Sales', Procurement: 'Procurement', Settings: 'Settings', Modules: 'Modules',
};

// Spotlight-style search over EVERY screen — main hub entries and the sub
// screens that live behind them — so any tab can be found and opened directly.
function SidebarSearch({ setScreen }) {
  const [query, setQuery] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [activeIdx, setActiveIdx] = React.useState(0);
  const [focused, setFocused] = React.useState(false);
  const boxRef = React.useRef(null);
  const inputRef = React.useRef(null);
  const listRef = React.useRef(null);

  const results = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const toks = q.split(/\s+/);
    return SCREENS
      .filter((s) => {
        const hay = (s.label + ' ' + (SECTION_LABELS[s.section] || s.section)).toLowerCase();
        return toks.every((t) => hay.includes(t));
      })
      .slice(0, 10);
  }, [query]);

  React.useEffect(() => { setActiveIdx(0); }, [query]);

  // dismiss on outside click
  React.useEffect(() => {
    if (!open) return;
    const onDoc = (e) => { if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false); };
    window.addEventListener('mousedown', onDoc);
    return () => window.removeEventListener('mousedown', onDoc);
  }, [open]);

  // "/" anywhere focuses the search (unless typing in a field)
  React.useEffect(() => {
    const onSlash = (e) => {
      if (e.key !== '/' || e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target, tag = t && t.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || (t && t.isContentEditable)) return;
      e.preventDefault();
      if (inputRef.current) inputRef.current.focus();
      setOpen(true);
    };
    window.addEventListener('keydown', onSlash);
    return () => window.removeEventListener('keydown', onSlash);
  }, []);

  // keep the active row scrolled into view
  React.useEffect(() => {
    const el = listRef.current && listRef.current.children[activeIdx];
    if (el && el.scrollIntoView) el.scrollIntoView({ block: 'nearest' });
  }, [activeIdx]);

  const choose = (s) => {
    if (!s) return;
    setScreen(s.id);
    setQuery('');
    setOpen(false);
    if (inputRef.current) inputRef.current.blur();
  };

  const onKey = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setOpen(true); setActiveIdx((i) => Math.min(i + 1, Math.max(results.length - 1, 0))); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIdx((i) => Math.max(i - 1, 0)); }
    else if (e.key === 'Enter') { e.preventDefault(); choose(results[activeIdx]); }
    else if (e.key === 'Escape') { e.preventDefault(); if (query) setQuery(''); else { setOpen(false); if (inputRef.current) inputRef.current.blur(); } }
  };

  const showResults = open && query.trim().length > 0;

  return (
    <div ref={boxRef} style={{ position: 'relative' }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 9,
        height: 38, padding: '0 12px', borderRadius: 8,
        background: 'var(--gl-input-bg)',
        border: `1px solid ${focused ? '#4A7CFF' : 'var(--gl-border)'}`,
        transition: 'border-color 150ms ease',
      }}>
        <Icon name="search" size={15} color="var(--gl-fg-3)" />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => { setFocused(true); setOpen(true); }}
          onBlur={() => setFocused(false)}
          onKeyDown={onKey}
          placeholder="Search tabs…"
          aria-label="Search tabs"
          style={{
            flex: 1, minWidth: 0, border: 'none', outline: 'none', background: 'transparent',
            color: 'var(--gl-fg-1)', fontFamily: 'var(--gl-font-body)', fontSize: 13,
          }} />
        {query
          ? <button onMouseDown={(e) => { e.preventDefault(); setQuery(''); if (inputRef.current) inputRef.current.focus(); }}
              aria-label="Clear search"
              style={{ display: 'flex', border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--gl-fg-3)', padding: 0 }}>
              <Icon name="close" size={14} />
            </button>
          : <kbd style={{ fontFamily: 'var(--gl-font-mono)', fontSize: 10, color: 'var(--gl-fg-4)', border: '1px solid var(--gl-border)', borderRadius: 4, padding: '1px 6px', lineHeight: 1.4 }}>/</kbd>}
      </div>

      {showResults && (
        <div role="listbox" ref={listRef} style={{
          position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, zIndex: 60,
          maxHeight: 360, overflowY: 'auto',
          background: 'var(--gl-surface)', border: '1px solid var(--gl-border-strong)',
          borderRadius: 8, boxShadow: 'var(--gl-shadow-pop)', padding: 6,
        }}>
          {results.length === 0
            ? <div style={{ padding: '16px 10px', fontSize: 12.5, color: 'var(--gl-fg-3)', textAlign: 'center' }}>No tabs match “{query.trim()}”</div>
            : results.map((s, i) => (
              <button key={s.id} role="option" aria-selected={i === activeIdx}
                onMouseEnter={() => setActiveIdx(i)}
                onMouseDown={(e) => { e.preventDefault(); choose(s); }}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                  padding: '8px 10px', borderRadius: 6, border: 'none', cursor: 'pointer',
                  textAlign: 'left', fontFamily: 'var(--gl-font-body)',
                  background: i === activeIdx ? 'var(--gl-hover)' : 'transparent',
                }}>
                <span style={{ display: 'flex', color: i === activeIdx ? '#4A7CFF' : 'var(--gl-fg-3)', flexShrink: 0 }}><Icon name={s.icon} size={15} /></span>
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--gl-fg-1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.label}</span>
                  <span style={{ display: 'block', fontSize: 10.5, fontFamily: 'var(--gl-font-mono)', color: 'var(--gl-fg-3)' }}>{SECTION_LABELS[s.section] || s.section}</span>
                </span>
                {i === activeIdx && <span style={{ display: 'flex', color: 'var(--gl-fg-4)', flexShrink: 0 }}><Icon name="chevRight" size={14} /></span>}
              </button>
            ))}
        </div>
      )}
    </div>
  );
}

function Sidebar({ screen, setScreen, theme, setTheme }) {
  const [tenantOpen, setTenantOpen] = React.useState(false);
  const [tenantId, setTenantId] = React.useState(9);
  return (
    <aside style={{
      background: 'var(--gl-surface)',
      borderRight: '1px solid var(--gl-border)',
      padding: '24px 16px',
      display: 'flex', flexDirection: 'column', gap: 20,
      position: 'sticky', top: 0, height: '100vh',
      boxSizing: 'border-box',
    }}>
      <div style={{ padding: '4px 8px' }}>
        <Logo size={24} />
      </div>

      {/* Workspace switcher chip */}
      <button onClick={() => setTenantOpen((v) => !v)}
        style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 8, background: 'var(--gl-input-bg)', border: '1px solid var(--gl-border)', cursor: 'pointer', textAlign: 'left' }}>
        <span style={{ width: 28, height: 28, borderRadius: 7, background: 'rgba(74,124,255,0.18)', color: '#4A7CFF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Icon name="building" size={15} /></span>
        <span style={{ flex: 1, minWidth: 0 }}>
          <span style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: 'var(--gl-fg-1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{TENANT_NAMES[tenantId]}</span>
          <span style={{ display: 'block', fontFamily: 'var(--gl-font-mono)', fontSize: 10, color: 'var(--gl-fg-3)' }}>Tenant {tenantId}</span>
        </span>
        <Icon name="switch2" size={14} color="var(--gl-fg-3)" />
      </button>
      {tenantOpen && window.TenantSwitcher && <window.TenantSwitcher onClose={() => setTenantOpen(false)} onNavigate={setScreen} currentId={tenantId} onSwitch={setTenantId} />}

      <div style={{ height: 1, background: 'var(--gl-border)' }} />

      <SidebarSearch setScreen={setScreen} />

      <nav style={{ display: 'flex', flexDirection: 'column', gap: 4, overflow: 'auto', flex: 1 }}>
        {/* Explicit grouped nav — modules collapse into hub entries */}
        {SIDEBAR_NAV.map((grp) => (
          <React.Fragment key={grp.group}>
            <div style={{
              fontWeight: 700, fontSize: 10, letterSpacing: '0.15em',
              textTransform: 'uppercase', color: 'var(--gl-fg-4)',
              padding: '12px 12px 6px',
            }}>{grp.group}</div>
            {grp.items.map((id) => {
              const s = SCREENS.find((x) => x.id === id);
              if (!s) return null;
              return (
                <NavItem key={s.id}
                         active={screen === s.id}
                         icon={s.icon}
                         label={s.label}
                         onClick={() => setScreen(s.id)} />
              );
            })}
          </React.Fragment>
        ))}
      </nav>

      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <ThemeToggle theme={theme} setTheme={setTheme} />
        <div style={{
          fontWeight: 700, fontSize: 10, letterSpacing: '0.15em',
          textTransform: 'uppercase', color: 'var(--gl-fg-4)',
          padding: '8px 12px', textAlign: 'center',
          borderTop: '1px solid var(--gl-border)',
        }}>UI Kit · v1.0</div>
      </div>
    </aside>
  );
}

function NavItem({ active, icon, label, onClick }) {
  const [hover, setHover] = React.useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '10px 12px', borderRadius: 4,
        background: active ? 'rgba(74,124,255,0.12)' : (hover ? 'var(--gl-hover)' : 'transparent'),
        color: active ? '#4A7CFF' : 'var(--gl-fg-2)',
        border: 'none', cursor: 'pointer', textAlign: 'left',
        fontFamily: 'var(--gl-font-body)', fontWeight: active ? 600 : 500, fontSize: 13,
        transition: 'background 150ms ease',
        position: 'relative',
      }}>
      {active && <div style={{
        position: 'absolute', left: 0, top: 8, bottom: 8, width: 3,
        background: '#4A7CFF', borderRadius: 12,
      }} />}
      <Icon name={icon} size={16} />
      {label}
    </button>
  );
}

function ThemeToggle({ theme, setTheme }) {
  const isLight = theme === 'light';
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4,
      background: 'var(--gl-input-bg)', padding: 4, borderRadius: 6,
      border: '1px solid var(--gl-border)',
    }}>
      {[
        { id: 'dark', label: 'Dark' },
        { id: 'light', label: 'Light' },
      ].map((opt) => (
        <button key={opt.id}
          onClick={() => setTheme(opt.id)}
          style={{
            padding: '8px 12px', borderRadius: 4,
            background: theme === opt.id ? 'var(--gl-surface)' : 'transparent',
            color: theme === opt.id ? 'var(--gl-fg-1)' : 'var(--gl-fg-3)',
            border: 'none', cursor: 'pointer',
            fontFamily: 'var(--gl-font-body)',
            fontWeight: 700, fontSize: 10,
            letterSpacing: '0.1em', textTransform: 'uppercase',
            boxShadow: theme === opt.id ? '0 1px 2px rgba(0,0,0,0.2)' : 'none',
            transition: 'background 150ms ease',
          }}>{opt.label}</button>
      ))}
    </div>
  );
}

const SCREEN_GLYPHS = {
  accounts:      'ledger',
  accountDetail: 'ledger',
  group:         'briefcase',
  groupDetail:   'briefcase',
  stores:        'store',
  storeDetail:   'store',
  createStore:   'store',
  inventory:     'scanner',
  journal:       'ledger',
};

const SCREEN_WORDS = {
  accounts:      'Chart of\nAccounts',
  accountDetail: 'Account',
  group:         'Account\nGroups',
  groupDetail:   'Group',
  stores:        'Stores',
  storeDetail:   'Store',
  createStore:   'New\nStore',
  inventory:     'Inventory',
  journal:       'Ledger',
};

function Watermark({ screen }) {
  const glyph = SCREEN_GLYPHS[screen] || 'ledger';
  const word = SCREEN_WORDS[screen] || '';
  return (
    <>
      {/* Big embossed wordmark */}
      <div style={{
        position: 'fixed', right: '8%', top: '50%', transform: 'translateY(-50%)',
        fontFamily: 'var(--gl-font-display)',
        fontWeight: 700, fontSize: 160, lineHeight: 0.95,
        color: 'var(--gl-fg-1)', opacity: 0.03,
        letterSpacing: '-0.04em', whiteSpace: 'pre-line',
        pointerEvents: 'none', textAlign: 'right',
        zIndex: 0,
      }}>{word}</div>
      {/* Corner pictogram */}
      <div style={{
        position: 'fixed', right: 64, bottom: 64,
        color: 'var(--gl-fg-1)', opacity: 0.06,
        pointerEvents: 'none', zIndex: 0,
      }}>
        <Icon name={glyph} size={150} stroke={1} />
      </div>
    </>
  );
}

function Toast({ children }) {
  return (
    <div style={{
      position: 'fixed', bottom: 32, left: '50%', transform: 'translateX(-50%)',
      background: 'var(--gl-surface)',
      border: '1px solid var(--gl-border-strong)',
      borderLeft: '3px solid #4A7CFF',
      borderRadius: 4,
      padding: '12px 20px',
      fontSize: 13, color: 'var(--gl-fg-1)',
      boxShadow: '0 12px 32px -8px rgba(0,0,0,0.45)',
      zIndex: 100,
      display: 'flex', alignItems: 'center', gap: 10,
    }}>
      <Icon name="check" size={14} color="#4A7CFF" />
      {children}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
