/* global React */
// GeniusLink mobile — App navigator: More menu, sub-screen titles, and the
// MobileApp shell that ties tabs + sub-screen routing together. All screens are
// pulled from window.MScreens, populated by the feature files (Mobile*.jsx).

const MApp = window._mob;
const { C: MAppC, MIcon: MAppIcon, MCard: MAppCard, AppBar: MAppBar, TabBar: MAppTabBar, Scroll: MAppScroll } = MApp;
const { useState: useMState } = React;
const MAppSearch = (window._mui || {}).SearchInput;

/* ───────── More menu (with live search) ───────── */
function MMore({ go }) {
  const [q, setQ] = useMState('');
  const groups = [
    { title: 'Workspace', items: [['Settings', 'settingsHub']] },
    { title: 'Accounts', items: [['Account Tree', 'accountTree'], ['Create Account Group', 'createGroup']] },
    { title: 'Products', items: [['Products List', 'productsList'], ['Create Product', 'createProduct']] },
    { title: 'Inventory', items: [['Inventory Dashboard', 'invDashboard'], ['Warehouses', 'warehousesList'], ['Stock Transfers', 'transferList'], ['Issue — Details', 'issueDetail'], ['Receive Inventory', 'receiveCreate'], ['Receive — Details', 'receiveDetail'], ['Transfer Inventory', 'transferCreate'], ['Transfer — Details', 'transferDetail'], ['Inventory Adjustment', 'adjustment'], ['Stock Take', 'stockTake'], ['Categories', 'categories'], ['Units of Measure', 'uom'], ['Price Lists', 'priceLists'], ['Barcode Print', 'barcodePrint']] },
    { title: 'Ledger', items: [['Journal Entries', 'journalList'], ['Create Journal Entry', 'createJournalEntry'], ['Journal Entry Details', 'journalEntryDetail'], ['Opening Journal Entry', 'journal'], ['Financial Operation', 'opDetail']] },
    { title: 'Sales · Customers', items: [['Customers', 'customersList'], ['Add Customer', 'createCustomer']] },
    { title: 'Procurement · Suppliers', items: [['Suppliers', 'suppliersList'], ['Add Supplier', 'createSupplier']] },
    { title: 'Configuration', items: [['Currencies', 'currenciesList'], ['Add Currency', 'createCurrency'], ['Exchange Rates', 'exchangeRateSetup'], ['Fiscal Year', 'fiscalYearSetup']] },
    { title: 'Banking · Cash', items: [['Create Deposit', 'createDeposit'], ['Deposit Receipt', 'depositDetail'], ['Create Withdrawal', 'createWithdrawal'], ['Withdrawal Voucher', 'withdrawalDetail']] },
    { title: 'Banking · Transfers', items: [['Create Local Transfer', 'createLocalTransfer'], ['Local Transfer Details', 'localTransferDetail'], ['Create External Transfer', 'createExternalTransfer'], ['External Wire Details', 'externalTransferDetail']] },
    { title: 'Reports', items: [['Trial Balance', 'trialBalance'], ['Income Statement', 'incomeStatement'], ['Balance Sheet', 'balanceSheet'], ['Inventory Valuation', 'inventoryValuation'], ['Audit Log', 'auditLog']] },
    { title: 'Administration', items: [['Users', 'usersList'], ['Invite User', 'createUser'], ['Roles & Permissions', 'rolesPermissions']] },
  ];
  const ql = q.trim().toLowerCase();
  const filtered = groups
    .map((g) => {
      const groupHit = g.title.toLowerCase().includes(ql);
      const items = ql && !groupHit ? g.items.filter(([label]) => label.toLowerCase().includes(ql)) : g.items;
      return { ...g, items };
    })
    .filter((g) => g.items.length > 0);
  return (
    <MAppScroll>
      {MAppSearch && <MAppSearch placeholder="Search menu…" value={q} onChange={setQ} />}
      {filtered.map((g) => (
        <MAppCard key={g.title} title={g.title} marker={MAppC.blue} pad={8}>
          <div style={{ padding: '0 8px' }}>
            {g.items.map(([label, id], i) => (
              <div key={label} onClick={() => id && go(id)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 0', borderBottom: i < g.items.length - 1 ? `1px solid ${MAppC.border}` : 'none', cursor: id ? 'pointer' : 'default', opacity: id ? 1 : 0.45 }}>
                <span style={{ fontSize: 14, color: MAppC.fg1, fontFamily: MAppC.body }}>{label}</span>
                <MAppIcon name="chevR" size={16} color={MAppC.fg4} />
              </div>
            ))}
          </div>
        </MAppCard>
      ))}
      {filtered.length === 0 && <div style={{ padding: '40px 0', textAlign: 'center', color: MAppC.fg3, fontSize: 13, fontFamily: MAppC.body }}>No menu items match “{q}”.</div>}
    </MAppScroll>
  );
}

/* ───────── sub-screen metadata (title + back target) ───────── */
const SUB_TITLES = {
  accountDetail: { t: 'Cash Box', ar: 'الصندوق', back: 'accounts' },
  createAccount: { t: 'Create Account', back: 'accounts' },
  groupDetail: { t: 'Current Assets', ar: 'الأصول المتداولة', back: 'accounts' },
  createStore: { t: 'Create Store', back: 'stores' },
  storeDetail: { t: 'Downtown Central', ar: 'متجر وسط المدينة', back: 'stores' },
  issue: { t: 'Issue Inventory', back: 'stores' },
  createGroup: { t: 'Create Account Group', back: 'more' },
  journal: { t: 'Opening Journal', ar: 'قيد افتتاحي', back: 'more' },
  opDetail: { t: 'Material Issuance', ar: 'عملية صرف مواد', back: 'more' },
  createDeposit: { t: 'Create Deposit', ar: 'إيداع نقدي', back: 'more' },
  depositDetail: { t: 'Deposit Receipt', ar: 'سند قبض', back: 'more' },
  createWithdrawal: { t: 'Create Withdrawal', ar: 'سحب نقدي', back: 'more' },
  withdrawalDetail: { t: 'Withdrawal Voucher', ar: 'سند صرف', back: 'more' },
  createLocalTransfer: { t: 'Local Transfer', ar: 'تحويل محلي', back: 'more' },
  localTransferDetail: { t: 'Inter-Account Settlement', ar: 'تسوية بين الحسابات', back: 'more' },
  createExternalTransfer: { t: 'External Transfer', ar: 'تحويل خارجي', back: 'more' },
  externalTransferDetail: { t: 'External Wire', ar: 'تحويل خارجي', back: 'more' },
  productsList: { t: 'Products', ar: 'المنتجات', back: 'more' },
  invDashboard: { t: 'Inventory Dashboard', ar: 'لوحة المخزون', back: 'more' },
  warehousesList: { t: 'Warehouses', ar: 'المستودعات', back: 'more' },
  transferList: { t: 'Stock Transfers', ar: 'التحويلات', back: 'more' },
  stockTake: { t: 'Stock Take', ar: 'جرد فعلي', back: 'more' },
  categories: { t: 'Categories', ar: 'التصنيفات', back: 'more' },
  uom: { t: 'Units of Measure', ar: 'وحدات القياس', back: 'more' },
  priceLists: { t: 'Price Lists', ar: 'قوائم الأسعار', back: 'more' },
  barcodePrint: { t: 'Barcode Print', ar: 'طباعة باركود', back: 'more' },
  productDetail: { t: 'Structural Steel I-Beam', ar: 'كمرة فولاذية', back: 'productsList' },
  createProduct: { t: 'Create Product', ar: 'منتج جديد', back: 'more' },
  issueDetail: { t: 'Issue Details', ar: 'تفاصيل الصرف', back: 'more' },
  receiveCreate: { t: 'Receive Inventory', ar: 'استلام مخزون', back: 'more' },
  receiveDetail: { t: 'Receive Details', ar: 'تفاصيل الاستلام', back: 'more' },
  transferCreate: { t: 'New Transfer', ar: 'تحويل مخزون', back: 'more' },
  transferDetail: { t: 'Transfer Details', ar: 'تفاصيل التحويل', back: 'more' },
  adjustment: { t: 'Inventory Adjustment', ar: 'تسوية مخزون', back: 'more' },
  journalList: { t: 'Journal Entries', ar: 'القيود', back: 'more' },
  createJournalEntry: { t: 'Create Journal Entry', ar: 'قيد جديد', back: 'more' },
  journalEntryDetail: { t: 'Journal Entry', ar: 'قيد محاسبي', back: 'journalList' },
  currenciesList: { t: 'Currencies', ar: 'العملات', back: 'more' },
  createCurrency: { t: 'Add Currency', ar: 'إضافة عملة', back: 'more' },
  currencyDetail: { t: 'US Dollar', ar: 'دولار أمريكي', back: 'currenciesList' },
  exchangeRateSetup: { t: 'Exchange Rates', ar: 'أسعار الصرف', back: 'more' },
  fiscalYearSetup: { t: 'Fiscal Year', ar: 'السنة المالية', back: 'more' },
  usersList: { t: 'Users', ar: 'المستخدمون', back: 'more' },
  userDetail: { t: 'Layla Ahmed', ar: 'ليلى أحمد', back: 'usersList' },
  createUser: { t: 'Invite User', ar: 'دعوة مستخدم', back: 'more' },
  rolesPermissions: { t: 'Roles & Permissions', ar: 'الأدوار والصلاحيات', back: 'more' },
  trialBalance: { t: 'Trial Balance', ar: 'ميزان المراجعة', back: 'more' },
  incomeStatement: { t: 'Income Statement', ar: 'قائمة الدخل', back: 'more' },
  balanceSheet: { t: 'Balance Sheet', ar: 'الميزانية العمومية', back: 'more' },
  inventoryValuation: { t: 'Inventory Valuation', ar: 'تقييم المخزون', back: 'more' },
  auditLog: { t: 'Audit Log', ar: 'سجل التدقيق', back: 'more' },
  customersList: { t: 'Customers', ar: 'العملاء', back: 'more' },
  customerDetail: { t: 'Riyadh Construction Co.', ar: 'شركة الرياض للإنشاءات', back: 'customersList' },
  createCustomer: { t: 'Add Customer', ar: 'إضافة عميل', back: 'more' },
  suppliersList: { t: 'Suppliers', ar: 'الموردون', back: 'more' },
  supplierDetail: { t: 'Global Steel Imports', ar: 'الاستيراد العالمي للصلب', back: 'suppliersList' },
  createSupplier: { t: 'Add Supplier', ar: 'إضافة مورد', back: 'more' },
  accountTree: { t: 'Account Tree', ar: 'شجرة الحسابات', back: 'more' },
  settingsHub: { t: 'Settings', ar: 'الإعدادات', back: 'more' },
  setCompany: { t: 'Company Profile', ar: 'ملف الشركة', back: 'settingsHub' },
  setFinancial: { t: 'Financial Settings', ar: 'الإعدادات المالية', back: 'settingsHub' },
  setTaxes: { t: 'Taxes', ar: 'الضرائب', back: 'settingsHub' },
  setCurrencies: { t: 'Currencies', ar: 'العملات', back: 'settingsHub' },
  setNumbering: { t: 'Numbering', ar: 'الترقيم', back: 'settingsHub' },
  setBranches: { t: 'Branches & Stores', ar: 'الفروع والمتاجر', back: 'settingsHub' },
  tenants: { t: 'Workspaces', ar: 'مساحات العمل', back: 'settingsHub' },
  rolesList: { t: 'Roles & Permissions', ar: 'الأدوار والصلاحيات', back: 'settingsHub' },
  roleEditor: { t: 'Edit Role · Accountant', ar: 'تعديل دور', back: 'rolesList' },
  setIntegrations: { t: 'Integrations', ar: 'التكاملات', back: 'settingsHub' },
  setWebhooks: { t: 'Webhooks', ar: 'Webhooks', back: 'settingsHub' },
  setApiKeys: { t: 'API Keys', ar: 'مفاتيح API', back: 'settingsHub' },
  setNotifications: { t: 'Notifications', ar: 'الإشعارات', back: 'settingsHub' },
  setBilling: { t: 'Billing & Plan', ar: 'الفوترة والخطة', back: 'settingsHub' },
  setBackup: { t: 'Backup & Export', ar: 'النسخ والتصدير', back: 'settingsHub' },
};

/* ───────── App navigator ───────── */
function MobileApp() {
  const [authed, setAuthed] = useMState(false);
  const [authScreen, setAuthScreen] = useMState('login'); // login | signup | forgot
  const [tab, setTab] = useMState('dashboard');
  const [sub, setSub] = useMState(null); // sub-screen id or null

  const S = window.MScreens || {};

  if (!authed) {
    if (authScreen === 'signup') { const SignUp = S.signup; return <SignUp onLogin={() => setAuthed(true)} onBack={() => setAuthScreen('login')} />; }
    if (authScreen === 'forgot') { const Forgot = S.forgot; return <Forgot onBack={() => setAuthScreen('login')} />; }
    const Login = S.login;
    return <Login onLogin={() => setAuthed(true)} onForgot={() => setAuthScreen('forgot')} onSignup={() => setAuthScreen('signup')} />;
  }

  const go = (id) => setSub(id);
  const home = () => setSub(null);
  const back = (meta) => () => { if (meta.back && (window.MScreens || {})[meta.back]) setSub(meta.back); else home(); };

  // sub-screen routing
  if (sub) {
    const meta = SUB_TITLES[sub] || { t: sub, back: tab };
    const Screen = S[sub] || S.createAccount;
    return (
      <div style={{ minHeight: '100%', background: MAppC.bg, display: 'flex', flexDirection: 'column' }}>
        <MAppBar title={meta.t} ar={meta.ar} onBack={back(meta)} />
        <div style={{ flex: 1 }}><Screen go={go} /></div>
      </div>
    );
  }

  const tabs = {
    dashboard: { title: 'Dashboard', action: <span style={{ color: MAppC.blue, display: 'flex' }}><MAppIcon name="bell" size={20} /></span> },
    accounts: { title: 'Accounts', action: <button onClick={() => go('createAccount')} style={{ background: 'none', border: 'none', color: MAppC.blue, display: 'flex', cursor: 'pointer' }}><MAppIcon name="plus" size={22} /></button> },
    stores: { title: 'Stores', action: <button onClick={() => go('createStore')} style={{ background: 'none', border: 'none', color: MAppC.blue, display: 'flex', cursor: 'pointer' }}><MAppIcon name="plus" size={22} /></button> },
    more: { title: 'More' },
  };
  const cur = tabs[tab];
  const Body = tab === 'more' ? MMore : S[tab];

  return (
    <div style={{ minHeight: '100%', background: MAppC.bg, display: 'flex', flexDirection: 'column' }}>
      <MAppBar title={cur.title} action={cur.action} />
      <div style={{ flex: 1 }}><Body go={go} /></div>
      <MAppTabBar active={tab} onChange={(t) => { setTab(t); setSub(null); }} />
    </div>
  );
}

window.MobileApp = MobileApp;
