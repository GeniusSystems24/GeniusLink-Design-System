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
  // Accounts
  { id: 'accounts',      label: 'Chart of Accounts',       icon: 'ledger',     comp: 'AccountsList',         section: 'Accounts' },
  { id: 'accountTree',   label: 'Account Tree',            icon: 'briefcase',  comp: 'AccountTree',          section: 'Accounts' },
  { id: 'createAccount', label: 'Create Account',          icon: 'plus',       comp: 'CreateAccount',        section: 'Accounts' },
  { id: 'accountDetail', label: 'Account · View',          icon: 'doc',        comp: 'AccountDetails',       section: 'Accounts' },
  { id: 'group',         label: 'Create Account Group',    icon: 'briefcase',  comp: 'CreateAccountGroup',   section: 'Accounts' },
  { id: 'groupDetail',   label: 'Account Group · View',    icon: 'doc',        comp: 'AccountGroupDetails',  section: 'Accounts' },
  // Stores
  { id: 'stores',        label: 'Stores',                  icon: 'store',      comp: 'StoresList',           section: 'Stores' },
  { id: 'storeDetail',   label: 'Store · View',            icon: 'doc',        comp: 'StoreDetails',         section: 'Stores' },
  { id: 'createStore',   label: 'Create Store',            icon: 'plus',       comp: 'CreateStore',          section: 'Stores' },
  { id: 'products',      label: 'Products',                icon: 'scanner',    comp: 'ProductsList',         section: 'Stores' },
  { id: 'createProduct', label: 'Create Product',          icon: 'plus',       comp: 'CreateProduct',        section: 'Stores' },
  { id: 'productDetail', label: 'Product · View',          icon: 'doc',        comp: 'ProductDetails',       section: 'Stores' },
  { id: 'inventory',     label: 'Issue Inventory',         icon: 'scanner',    comp: 'IssueInventory',       section: 'Stores' },
  { id: 'receive',       label: 'Receive Inventory',       icon: 'download',   comp: 'ReceiveInventory',     section: 'Stores' },
  { id: 'transfer',      label: 'Transfer Inventory',      icon: 'paperclip',  comp: 'TransferInventory',    section: 'Stores' },
  { id: 'adjust',        label: 'Inventory Adjustment',    icon: 'tool',       comp: 'InventoryAdjustment',  section: 'Stores' },
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
];

// Controlled browser-style tab strip for the workspace view.
function WorkspaceTab({ tab, active, onSelect, onClose, first, drag }) {
  const [hover, setHover] = React.useState(false);
  const dragging = drag.dragId === tab.id;
  const isOver = drag.overId === tab.id && drag.dragId !== tab.id;
  return (
    <div role="tab" aria-selected={active} title={tab.label} draggable
      onDragStart={(e) => { drag.onDragStart(tab.id); e.dataTransfer.effectAllowed = 'move'; }}
      onDragOver={(e) => { e.preventDefault(); drag.onDragOver(tab.id); }}
      onDrop={(e) => { e.preventDefault(); drag.onDrop(tab.id); }}
      onDragEnd={drag.onDragEnd}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      onClick={() => onSelect(tab.id)}
      style={{
        position: 'relative', display: 'flex', alignItems: 'center', gap: 8,
        height: 36, paddingInline: '12px 8px', maxWidth: 190, minWidth: 110, flexShrink: 0,
        borderRadius: '9px 9px 0 0', cursor: dragging ? 'grabbing' : 'pointer', userSelect: 'none',
        background: active ? 'var(--gl-bg)' : (hover ? 'var(--gl-hover)' : 'transparent'),
        color: active ? 'var(--gl-fg-1)' : 'var(--gl-fg-3)', opacity: dragging ? 0.4 : 1,
        transition: 'background 150ms ease, color 150ms ease, opacity 100ms ease',
      }}>
      {isOver && <span style={{ position: 'absolute', insetInlineStart: -1, top: 6, bottom: 6, width: 2, borderRadius: 2, background: '#4A7CFF' }} />}
      {!active && !first && !isOver && <span style={{ position: 'absolute', insetInlineStart: 0, top: 9, bottom: 9, width: 1, background: 'var(--gl-border)' }} />}
      <span style={{ display: 'flex', color: active ? '#4A7CFF' : 'var(--gl-fg-3)', flexShrink: 0 }}><Icon name={tab.icon} size={14} /></span>
      <span style={{ flex: 1, fontSize: 12.5, fontWeight: active ? 600 : 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{tab.label}</span>
      <span role="button" aria-label="Close tab"
        onClick={(e) => { e.stopPropagation(); onClose(tab.id); }}
        onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--gl-input-bg)'; e.currentTarget.style.color = 'var(--gl-fg-1)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--gl-fg-3)'; }}
        style={{ width: 18, height: 18, borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: 'var(--gl-fg-3)', visibility: (hover || active) ? 'visible' : 'hidden' }}>
        <Icon name="close" size={12} />
      </span>
    </div>
  );
}

function WorkspaceTabs({ tabs, activeId, onSelect, onClose, onAdd, onReorder }) {
  const [dragId, setDragId] = React.useState(null);
  const [overId, setOverId] = React.useState(null);
  const drag = {
    dragId, overId,
    onDragStart: setDragId, onDragOver: setOverId,
    onDrop: (toId) => {
      const from = tabs.findIndex(t => t.id === dragId);
      const to = tabs.findIndex(t => t.id === toId);
      if (from > -1 && to > -1 && from !== to) onReorder(from, to);
      setDragId(null); setOverId(null);
    },
    onDragEnd: () => { setDragId(null); setOverId(null); },
  };
  return (
    <div role="tablist" style={{
      display: 'flex', alignItems: 'flex-end', gap: 0, padding: '8px 8px 0',
      background: 'var(--gl-surface)', borderBottom: '1px solid var(--gl-border)',
      minHeight: 44, flexShrink: 0,
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, overflowX: 'auto', flex: 1, scrollbarWidth: 'none' }}>
        {tabs.map((t, i) => <WorkspaceTab key={t.id} tab={t} first={i === 0} active={t.id === activeId} onSelect={onSelect} onClose={onClose} drag={drag} />)}
      </div>
      <button aria-label="New tab" title="New tab" onClick={onAdd}
        onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--gl-hover)'; e.currentTarget.style.color = 'var(--gl-fg-1)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--gl-fg-3)'; }}
        style={{ width: 32, height: 32, marginInlineStart: 4, marginBottom: 2, borderRadius: 7, border: 'none', background: 'transparent', color: 'var(--gl-fg-3)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon name="plus" size={16} />
      </button>
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
  const [screen, setActive] = React.useState(() => localStorage.getItem('gl-screen') || 'dashboard');
  const [openTabs, setOpenTabs] = React.useState(() => ['dashboard']);
  const [theme, setTheme] = React.useState(() => localStorage.getItem('gl-theme') || 'dark');
  const [toast, setToast] = React.useState(null);

  // Opening a screen = focus its tab (creating it if needed). Full-bleed
  // (auth) screens take over the whole view and are NOT tabbed.
  const setScreen = (id) => {
    const sc = SCREENS.find(s => s.id === id);
    if (!(sc && sc.fullBleed)) setOpenTabs(prev => prev.includes(id) ? prev : [...prev, id]);
    setActive(id);
  };
  const closeTab = (id) => setOpenTabs(prev => {
    const idx = prev.indexOf(id);
    const next = prev.filter(x => x !== id);
    if (id === screen && next.length) setActive(next[Math.min(idx, next.length - 1)]);
    return next;
  });
  const reorderTabs = (from, to) => setOpenTabs(prev => {
    const a = [...prev]; const [m] = a.splice(from, 1); a.splice(to, 0, m); return a;
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
      };
      if (toCreate[current.id]) return setScreen(toCreate[current.id]);
      handleAction('Created successfully');
    },
    onIssue:       () => handleAction('Inventory issued'),
    onEdit:        () => handleAction('Entering edit mode…'),
    onDelete:      () => handleAction('Delete confirmation required'),
    onBack:        () => {
      const map = { Stores: 'stores', Accounts: 'accounts', Banking: 'localTransfer', Ledger: 'journals', Config: 'currencies', Admin: 'users', Sales: 'customers', Procurement: 'suppliers' };
      setScreen(map[current.section] || 'accounts');
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
          tabs={openTabs.map(id => SCREENS.find(s => s.id === id)).filter(Boolean)}
          activeId={screen}
          onSelect={setActive}
          onClose={closeTab}
          onAdd={() => setScreen('dashboard')}
          onReorder={reorderTabs} />
        <div style={{ position: 'relative', overflow: 'auto', flex: 1, background: 'var(--gl-bg)' }}>
          <Watermark screen={screen} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            {openTabs.length === 0 ? <EmptyWorkspace /> : <Comp {...screenProps} />}
          </div>
        </div>
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

function Sidebar({ screen, setScreen, theme, setTheme }) {
  return (
    <aside style={{
      background: 'var(--gl-surface)',
      borderRight: '1px solid var(--gl-border)',
      padding: '24px 16px',
      display: 'flex', flexDirection: 'column', gap: 24,
      position: 'sticky', top: 0, height: '100vh',
      boxSizing: 'border-box',
    }}>
      <div style={{ padding: '4px 8px' }}>
        <Logo size={24} />
      </div>

      <div style={{ height: 1, background: 'var(--gl-border)' }} />

      <nav style={{ display: 'flex', flexDirection: 'column', gap: 4, overflow: 'auto', flex: 1 }}>
        {/* Group screens by section */}
        {Array.from(new Set(SCREENS.map(s => s.section))).map((section) => (
          <React.Fragment key={section}>
            <div style={{
              fontWeight: 700, fontSize: 10, letterSpacing: '0.15em',
              textTransform: 'uppercase', color: 'var(--gl-fg-4)',
              padding: '12px 12px 6px',
            }}>{section}</div>
            {SCREENS.filter(s => s.section === section).map((s) => (
              <NavItem key={s.id}
                       active={screen === s.id}
                       icon={s.icon}
                       label={s.label}
                       onClick={() => setScreen(s.id)} />
            ))}
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
