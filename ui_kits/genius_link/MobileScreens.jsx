/* global React */
// GeniusLink mobile screens + MobileApp navigator. Uses window._mob primitives.

const M = window._mob;
const { C, MIcon, Pill, MCard, MField, MBtn, AppBar, TabBar, Scroll } = M;
const { useState: useS } = React;

/* ───────── Login (full screen) ───────── */
function MLogin({ onLogin }) {
  return (
    <div style={{ minHeight: '100%', background: C.bg, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '72px 28px 40px', boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 40 }}>
        <img src="../../assets/logo-mark.png" style={{ width: 28, height: 28 }} alt="" />
        <span style={{ fontFamily: C.display, fontWeight: 800, fontSize: 20, color: C.fg1, letterSpacing: '-0.01em' }}>GeniusLink</span>
      </div>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontWeight: 700, fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.blue, marginBottom: 14, fontFamily: C.body }}>Sign In</div>
        <h1 style={{ fontFamily: C.display, fontWeight: 700, fontSize: 28, lineHeight: 1.25, letterSpacing: '-0.025em', color: C.fg1, margin: 0 }}>Access your workspace</h1>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <MField label="Email" placeholder="you@company.com" value="layla.a@geniuslink.sa" />
        <MField label="Password" placeholder="••••••••" value="••••••••••" mono />
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <span style={{ fontSize: 12.5, color: C.blue, fontWeight: 600, fontFamily: C.body }}>Forgot password?</span>
        </div>
        <MBtn full onClick={onLogin}>Sign In to GeniusLink</MBtn>
        <div style={{ display: 'flex', gap: 9, padding: '12px 14px', background: C.input, border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 11.5, color: C.fg3, lineHeight: 1.5, fontFamily: C.body }}>
          <span style={{ color: C.blue, flexShrink: 0, marginTop: 1 }}><MIcon name="lock" size={14} /></span>
          Sessions are recorded in the audit log with timestamp and device.
        </div>
      </div>
    </div>
  );
}

/* ───────── Dashboard ───────── */
function MDashboard({ go }) {
  const recent = [
    { ref: 'JV-2024-0226', desc: 'Mixed sale', amt: '+3,400.00', tone: C.green },
    { ref: 'EXT-2024-0311', desc: 'Wire · Global Steel', amt: '−12,045.00', tone: C.red },
    { ref: 'DEP-2024-0182', desc: 'Deposit · Cust 102', amt: '+5,000.00', tone: C.green },
  ];
  return (
    <Scroll>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Kpi label="Total Assets" value="289,050" delta="+4.2%" up />
        <Kpi label="Cash" value="235,160" delta="+1.8%" up />
        <Kpi label="Revenue MTD" value="89,200" delta="+12.4%" up accent={C.green} />
        <Kpi label="Net Income" value="34,120" delta="−2.1%" up={false} />
      </div>
      <MCard marker={C.green} title="Recent Operations" right={<span onClick={() => go('accounts')} style={{ color: C.blue, fontSize: 12, fontWeight: 600 }}>All</span>}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {recent.map((r, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: i < recent.length - 1 ? `1px solid ${C.border}` : 'none' }}>
              <div>
                <div style={{ fontFamily: C.mono, fontSize: 12, color: C.blue }}>{r.ref}</div>
                <div style={{ fontSize: 12, color: C.fg3, marginTop: 2, fontFamily: C.body }}>{r.desc}</div>
              </div>
              <span style={{ fontFamily: C.mono, fontSize: 13, fontWeight: 600, color: r.tone }}>{r.amt}</span>
            </div>
          ))}
        </div>
      </MCard>
      <MCard marker={C.orange} title="Needs Attention">
        {[['1 entry out of balance', C.orange], ['2 SKUs out of stock', C.red], ['3 wires await approval', C.blue]].map(([t, c], i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0' }}>
            <span style={{ width: 8, height: 8, borderRadius: 999, background: c }} />
            <span style={{ fontSize: 13, color: C.fg1, fontFamily: C.body }}>{t}</span>
          </div>
        ))}
      </MCard>
    </Scroll>
  );
}
function Kpi({ label, value, delta, up, accent }) {
  return (
    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 14 }}>
      <div style={{ fontWeight: 700, fontSize: 9.5, letterSpacing: '0.06em', textTransform: 'uppercase', color: C.fg3, fontFamily: C.body }}>{label}</div>
      <div style={{ fontFamily: C.mono, fontSize: 20, fontWeight: 700, color: accent || C.fg1, marginTop: 8, letterSpacing: '-0.02em' }}>{value}</div>
      <div style={{ fontFamily: C.mono, fontSize: 11, color: up ? C.green : C.red, marginTop: 4 }}>{up ? '▲' : '▼'} {delta}</div>
    </div>
  );
}

/* ───────── Accounts list ───────── */
function MAccounts({ go }) {
  const rows = [
    { code: '1001', name: 'Cash Box', ar: 'الصندوق', bal: '42,500.00', neg: false },
    { code: '1100', name: 'Bank · NCB Main', ar: 'البنك الأهلي', bal: '186,420.00', neg: false },
    { code: '1200', name: 'Inventory (WIP)', ar: 'مخزون', bal: '54,890.00', neg: false },
    { code: '2001', name: 'Accounts Payable', ar: 'الموردون', bal: '-23,140.00', neg: true },
    { code: '4001', name: 'Sales Revenue', ar: 'المبيعات', bal: '-89,200.00', neg: true },
  ];
  return (
    <Scroll>
      <div style={{ height: 44, padding: '0 14px', background: C.input, border: `1px solid ${C.borderStrong}`, borderRadius: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
        <MIcon name="searchO" size={16} color={C.fg3} /><MIcon name="search" size={16} color={C.fg3} style={{ marginLeft: -22 }} />
        <span style={{ color: C.fg3, fontSize: 14, fontFamily: C.body }}>Search accounts…</span>
      </div>
      <MCard pad={8}>
        {rows.map((r, i) => (
          <div key={r.code} onClick={() => go('accountDetail')} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 8px', borderBottom: i < rows.length - 1 ? `1px solid ${C.border}` : 'none', cursor: 'pointer' }}>
            <span style={{ fontFamily: C.mono, fontSize: 12, color: C.fg3, width: 36 }}>{r.code}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: C.fg1, fontFamily: C.body }}>{r.name}</div>
              <div dir="rtl" style={{ fontFamily: C.arabic, fontSize: 12, color: C.fg3 }}>{r.ar}</div>
            </div>
            <span style={{ fontFamily: C.mono, fontSize: 13, fontWeight: 600, color: r.neg ? C.red : C.fg1 }}>{r.bal}</span>
            <MIcon name="chevR" size={15} color={C.fg4} />
          </div>
        ))}
      </MCard>
    </Scroll>
  );
}

/* ───────── Create Account ───────── */
function MCreateAccount() {
  return (
    <Scroll>
      <MCard marker={C.blue} title="Account Details" sub="Identify and place in the tree">
        <MField label="Account Code" placeholder="e.g. 1102" mono required />
        <MField label="Account Type" value="Asset" />
        <MField label="Name English" placeholder="e.g. Bank · Al Rajhi" required />
        <MField label="الاسم بالعربية" placeholder="مثال: بنك الراجحي" ar required />
        <MField label="Parent Group" value="Current Assets (1000)" />
      </MCard>
      <MCard marker={C.green} title="Settings">
        <MField label="Currency" value="SAR — Saudi Riyal" />
        <MField label="Opening Balance" placeholder="0.00" mono />
        <div>
          <div style={{ fontWeight: 700, fontSize: 10, letterSpacing: '0.05em', textTransform: 'uppercase', color: C.fg2, marginBottom: 7, fontFamily: C.body }}>Normal Balance</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <div style={{ padding: 12, textAlign: 'center', borderRadius: 8, background: `${C.green}14`, border: `1px solid ${C.green}`, color: C.green, fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.04em', fontFamily: C.body }}>Debit</div>
            <div style={{ padding: 12, textAlign: 'center', borderRadius: 8, background: C.input, border: `1px solid ${C.border}`, color: C.fg2, fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.04em', fontFamily: C.body }}>Credit</div>
          </div>
        </div>
      </MCard>
      <div style={{ display: 'flex', gap: 10 }}>
        <MBtn variant="secondary" full>Cancel</MBtn>
        <MBtn variant="primary" icon="check" full>Create</MBtn>
      </div>
    </Scroll>
  );
}

/* ───────── Account Group Details ───────── */
function MGroupDetails() {
  return (
    <Scroll>
      <MCard marker={C.blue} title="Group Information" right={<Pill tone="success">Active</Pill>}>
        <KV k="ID" v="1042" mono /><KV k="Name English" v="Current Assets" />
        <KV k="Name Arabic" v="الأصول المتداولة" ar /><KV k="Account Tree" v="Assets Tree (1)" />
      </MCard>
      <MCard marker={C.orange} title="Notes">
        <div dir="rtl" style={{ fontFamily: C.arabic, fontSize: 14, color: C.fg2, padding: '10px 14px', background: C.input, border: `1px solid ${C.border}`, borderRadius: 8 }}>تشمل النقدية والحسابات المدينة والمخزون</div>
      </MCard>
      <MCard marker={C.green} title="Audit">
        <KV k="Created By" v="Admin User (ID: 5)" /><KV k="Created At" v="Dec 04, 2025 11:58 PM" />
      </MCard>
      <MBtn variant="secondary" icon="back" full>Back to List</MBtn>
    </Scroll>
  );
}
function KV({ k, v, mono, ar }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
      <span style={{ fontWeight: 700, fontSize: 10, letterSpacing: '0.05em', textTransform: 'uppercase', color: C.fg3, fontFamily: C.body }}>{k}</span>
      <span dir={ar ? 'rtl' : 'ltr'} style={{ fontSize: 13.5, color: C.fg1, fontFamily: ar ? C.arabic : (mono ? C.mono : C.body), textAlign: 'right' }}>{v}</span>
    </div>
  );
}

/* ───────── Create Store ───────── */
function MCreateStore() {
  return (
    <Scroll>
      <MCard marker={C.blue} title="Store Details" sub="Name and location">
        <MField label="Name English" placeholder="e.g. Downtown Central Store" required />
        <MField label="الاسم بالعربية" placeholder="مثال: متجر وسط المدينة" ar required />
        <MField label="Location Code" value="ST-001" mono />
        <MField label="Store Category" value="Retail" />
        <MField label="Note" placeholder="Add internal notes…" />
      </MCard>
      <div style={{ display: 'flex', gap: 10 }}>
        <MBtn variant="secondary" full>Cancel</MBtn>
        <MBtn variant="primary" icon="check" full>Create</MBtn>
      </div>
    </Scroll>
  );
}

/* ───────── Store Details ───────── */
function MStoreDetails() {
  const items = [
    { sku: 'STL-44021', name: 'Steel I-Beam', qty: 142, st: 'in' },
    { sku: 'AGG-21044', name: 'Aggregate 20mm', qty: 46, st: 'low' },
    { sku: 'RBR-71203', name: 'Rebar #6', qty: 0, st: 'out' },
  ];
  return (
    <Scroll>
      <MCard marker={C.green} title="Store Summary" right={<Pill tone="success">Active</Pill>}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Mini label="Stock Value" value="342,820" sub="SAR" hi /><Mini label="SKUs" value="1,248" />
        </div>
      </MCard>
      <MCard marker={C.green} title="Stock On Hand" pad={8}>
        <div style={{ padding: '0 8px' }}>
          {items.map((it, i) => (
            <div key={it.sku} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: i < items.length - 1 ? `1px solid ${C.border}` : 'none' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: C.fg1, fontFamily: C.body }}>{it.name}</div>
                <div style={{ fontFamily: C.mono, fontSize: 11, color: C.fg3, marginTop: 2 }}>{it.sku}</div>
              </div>
              <span style={{ fontFamily: C.mono, fontSize: 14, fontWeight: 600, color: it.qty === 0 ? C.red : (it.st === 'low' ? C.orange : C.fg1) }}>{it.qty}</span>
              <Pill tone={it.st === 'in' ? 'success' : (it.st === 'low' ? 'warning' : 'danger')}>{it.st === 'in' ? 'In' : (it.st === 'low' ? 'Low' : 'Out')}</Pill>
            </div>
          ))}
        </div>
      </MCard>
      <MBtn variant="secondary" icon="back" full>Back to List</MBtn>
    </Scroll>
  );
}
function Mini({ label, value, sub, hi }) {
  return (
    <div style={{ padding: 14, background: hi ? `${C.green}14` : C.bg, border: `1px solid ${hi ? C.green + '4D' : C.border}`, borderRadius: 10 }}>
      <div style={{ fontWeight: 700, fontSize: 9.5, letterSpacing: '0.06em', textTransform: 'uppercase', color: C.fg3, fontFamily: C.body }}>{label}</div>
      <div style={{ fontFamily: C.mono, fontSize: 20, fontWeight: 600, color: hi ? C.green : C.fg1, marginTop: 6 }}>{value}</div>
      {sub && <div style={{ fontFamily: C.mono, fontSize: 10, color: C.fg3, marginTop: 3 }}>{sub}</div>}
    </div>
  );
}

/* ───────── Issue Inventory ───────── */
function MIssueInventory() {
  return (
    <Scroll>
      <MCard marker={C.blue} title="Issue Details">
        <MField label="Serial No" value="INV-ISS-2024-0089" mono />
        <MField label="Store" placeholder="Search store…" required />
        <MField label="Currency" value="USD — US Dollar" />
      </MCard>
      <MCard marker={C.green} title="Items" sub="1 line · 12 units">
        <div style={{ padding: 12, background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: C.fg1, fontFamily: C.body }}>Structural Steel</div>
              <div style={{ fontFamily: C.mono, fontSize: 11, color: C.fg3, marginTop: 2 }}>12 PCS × 450.00</div>
            </div>
            <span style={{ fontFamily: C.mono, fontSize: 15, fontWeight: 600, color: C.fg1 }}>5,400.00</span>
          </div>
        </div>
        <button style={{ height: 44, background: 'transparent', border: `1px dashed ${C.borderStrong}`, borderRadius: 8, color: C.blue, fontWeight: 600, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: C.body, cursor: 'pointer' }}>
          <MIcon name="scan" size={16} /> Scan to Add Item
        </button>
      </MCard>
      <MCard marker={C.green} title="Total">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span style={{ fontSize: 12, color: C.fg3, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: C.body }}>Total Value</span>
          <span style={{ fontFamily: C.mono, fontSize: 24, fontWeight: 700, color: C.fg1 }}>5,400.00 <span style={{ fontSize: 12, color: C.fg3 }}>USD</span></span>
        </div>
      </MCard>
      <MBtn variant="primary" icon="check" full>Issue Inventory</MBtn>
    </Scroll>
  );
}

/* ───────── More menu ───────── */
function MMore({ go }) {
  const groups = [
    { title: 'Accounts', items: [['Create Account Group', 'createGroup']] },
    { title: 'Ledger', items: [['Opening Journal Entry', 'journal'], ['Financial Operation', 'opDetail']] },
    { title: 'Banking', items: [['Create Deposit', null], ['Local Transfer', null]] },
    { title: 'Reports', items: [['Trial Balance', null], ['Audit Log', null]] },
    { title: 'Admin', items: [['Users', null], ['Roles & Permissions', null]] },
  ];
  return (
    <Scroll>
      {groups.map((g) => (
        <MCard key={g.title} title={g.title} marker={C.blue} pad={8}>
          <div style={{ padding: '0 8px' }}>
            {g.items.map(([label, id], i) => (
              <div key={label} onClick={() => id && go(id)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 0', borderBottom: i < g.items.length - 1 ? `1px solid ${C.border}` : 'none', cursor: id ? 'pointer' : 'default', opacity: id ? 1 : 0.45 }}>
                <span style={{ fontSize: 14, color: C.fg1, fontFamily: C.body }}>{label}</span>
                <MIcon name="chevR" size={16} color={C.fg4} />
              </div>
            ))}
          </div>
        </MCard>
      ))}
    </Scroll>
  );
}

/* ───────── App navigator ───────── */
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
};

function MobileApp() {
  const [authed, setAuthed] = useS(false);
  const [tab, setTab] = useS('dashboard');
  const [sub, setSub] = useS(null); // sub-screen id or null

  if (!authed) return <MLogin onLogin={() => setAuthed(true)} />;

  const go = (id) => setSub(id);
  const home = () => setSub(null);

  // sub-screen routing
  if (sub) {
    const meta = SUB_TITLES[sub] || { t: sub, back: tab };
    const screens = {
      accountDetail: <MAccountDetail />, createAccount: <MCreateAccount />,
      groupDetail: <MGroupDetails />, createStore: <MCreateStore />,
      storeDetail: <MStoreDetails />, issue: <MIssueInventory />,
      createGroup: <MCreateGroup />, journal: <MJournalEntry />, opDetail: <MOpDetails />,
    };
    return (
      <div style={{ minHeight: '100%', background: C.bg, display: 'flex', flexDirection: 'column' }}>
        <AppBar title={meta.t} ar={meta.ar} onBack={home} />
        <div style={{ flex: 1 }}>{screens[sub] || <MCreateAccount />}</div>
      </div>
    );
  }

  const tabs = {
    dashboard: { title: 'Dashboard', body: <MDashboard go={go} />, action: <span style={{ color: C.blue, display: 'flex' }}><MIcon name="bell" size={20} /></span> },
    accounts: { title: 'Accounts', body: <MAccounts go={go} />, action: <button onClick={() => go('createAccount')} style={{ background: 'none', border: 'none', color: C.blue, display: 'flex', cursor: 'pointer' }}><MIcon name="plus" size={22} /></button> },
    stores: { title: 'Stores', body: <MStores go={go} />, action: <button onClick={() => go('createStore')} style={{ background: 'none', border: 'none', color: C.blue, display: 'flex', cursor: 'pointer' }}><MIcon name="plus" size={22} /></button> },
    more: { title: 'More', body: <MMore go={go} /> },
  };
  const cur = tabs[tab];

  return (
    <div style={{ minHeight: '100%', background: C.bg, display: 'flex', flexDirection: 'column' }}>
      <AppBar title={cur.title} action={cur.action} />
      <div style={{ flex: 1 }}>{cur.body}</div>
      <TabBar active={tab} onChange={(t) => { setTab(t); setSub(null); }} />
    </div>
  );
}

/* Account detail (mobile) */
function MAccountDetail() {
  const tx = [
    { ref: 'JV-2024-0042', amt: '+5,000.00', tone: C.green },
    { ref: 'TR-9042', amt: '-1,800.00', tone: C.red },
    { ref: 'JV-2024-0071', amt: '+650.00', tone: C.green },
  ];
  return (
    <Scroll>
      <MCard marker={C.green} title="Current Balance" right={<Pill tone="success">Active</Pill>}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span style={{ fontFamily: C.mono, fontSize: 14, color: C.fg3 }}>SAR</span>
          <span style={{ fontFamily: C.mono, fontSize: 32, fontWeight: 700, color: C.green, letterSpacing: '-0.02em' }}>42,500.00</span>
        </div>
      </MCard>
      <MCard marker={C.blue} title="Information">
        <KV k="Code" v="1001" mono /><KV k="Type" v="Asset · Cash" />
        <KV k="Tree" v="Assets Tree (1)" /><KV k="Currency" v="SAR" />
      </MCard>
      <MCard marker={C.green} title="Recent Transactions" pad={8}>
        <div style={{ padding: '0 8px' }}>
          {tx.map((t, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: i < tx.length - 1 ? `1px solid ${C.border}` : 'none' }}>
              <span style={{ fontFamily: C.mono, fontSize: 12.5, color: C.blue }}>{t.ref}</span>
              <span style={{ fontFamily: C.mono, fontSize: 13, fontWeight: 600, color: t.tone }}>{t.amt}</span>
            </div>
          ))}
        </div>
      </MCard>
      <MBtn variant="secondary" icon="back" full>Back to List</MBtn>
    </Scroll>
  );
}

/* Stores list (mobile) */
function MStores({ go }) {
  const rows = [
    { code: 'ST-001', name: 'Downtown Central', ar: 'وسط المدينة', val: '342,820', skus: 1248 },
    { code: 'ST-002', name: 'King Fahd Warehouse', ar: 'مستودع الملك فهد', val: '1,820,460', skus: 4892 },
    { code: 'ST-003', name: 'Jeddah Showroom', ar: 'صالة عرض جدة', val: '128,640', skus: 412 },
  ];
  return (
    <Scroll>
      {rows.map((r) => (
        <div key={r.code} onClick={() => go('storeDetail')} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 16, cursor: 'pointer' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600, color: C.fg1, fontFamily: C.body }}>{r.name}</div>
              <div dir="rtl" style={{ fontFamily: C.arabic, fontSize: 12.5, color: C.fg3, marginTop: 2 }}>{r.ar}</div>
            </div>
            <span style={{ fontFamily: C.mono, fontSize: 11, color: C.fg3 }}>{r.code}</span>
          </div>
          <div style={{ display: 'flex', gap: 20, marginTop: 14, paddingTop: 14, borderTop: `1px solid ${C.border}` }}>
            <div><div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: C.fg3, fontFamily: C.body }}>Value</div><div style={{ fontFamily: C.mono, fontSize: 15, fontWeight: 600, color: C.fg1, marginTop: 3 }}>{r.val} <span style={{ fontSize: 10, color: C.fg3 }}>SAR</span></div></div>
            <div><div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: C.fg3, fontFamily: C.body }}>SKUs</div><div style={{ fontFamily: C.mono, fontSize: 15, fontWeight: 600, color: C.fg1, marginTop: 3 }}>{r.skus.toLocaleString()}</div></div>
          </div>
        </div>
      ))}
    </Scroll>
  );
}

window.MobileApp = MobileApp;

/* ───────── Create Account Group (mobile) ───────── */
function MCreateGroup() {
  return (
    <Scroll>
      <MCard marker={C.blue} title="Group Details" sub="Name and tree association">
        <MField label="Name English" placeholder="e.g. Current Assets" required />
        <MField label="الاسم بالعربية" placeholder="مثال: الأصول المتداولة" ar required />
        <MField label="Account Tree" value="Assets Tree (1)" />
      </MCard>
      <MCard marker={C.orange} title="Additional Information">
        <MField label="Note" placeholder="Add any notes about this group…" />
      </MCard>
      <div style={{ display: 'flex', gap: 10 }}>
        <MBtn variant="secondary" full>Cancel</MBtn>
        <MBtn variant="primary" icon="check" full>Create</MBtn>
      </div>
    </Scroll>
  );
}

/* ───────── Opening Journal Entry (mobile) ───────── */
function MJournalEntry() {
  const lines = [
    { acc: 'Cash Box (1001)', amt: '+5,000.00', tone: C.green, desc: 'Opening balance' },
    { acc: 'Capital Account (3001)', amt: '-5,000.00', tone: C.red, desc: 'Owner investment' },
  ];
  return (
    <Scroll>
      <MCard marker={C.blue} title="Entry Details">
        <MField label="Serial No" value="JV-2024-0042" mono />
        <MField label="Currency" value="SAR — Saudi Riyal" />
        <MField label="Fiscal Year" value="2024" mono />
      </MCard>
      <MCard marker={C.green} title="Transfer Lines" sub="2 lines · balanced" pad={8}>
        <div style={{ padding: '0 8px' }}>
          {lines.map((l, i) => (
            <div key={i} style={{ padding: '12px 0', borderBottom: i < lines.length - 1 ? `1px solid ${C.border}` : 'none' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13.5, fontWeight: 600, color: C.fg1, fontFamily: C.body }}>{l.acc}</span>
                <span style={{ fontFamily: C.mono, fontSize: 14, fontWeight: 600, color: l.tone }}>{l.amt}</span>
              </div>
              <div style={{ fontSize: 12, color: C.fg3, marginTop: 3, fontFamily: C.body }}>{l.desc}</div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 8px 0', marginTop: 4, borderTop: `2px solid ${C.borderStrong}` }}>
          <span style={{ fontWeight: 700, fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase', color: C.green, fontFamily: C.body }}>Balanced · Diff 0.00</span>
          <span style={{ fontFamily: C.mono, fontSize: 15, fontWeight: 700, color: C.fg1 }}>5,000.00</span>
        </div>
      </MCard>
      <MBtn variant="primary" icon="check" full>Create Entry</MBtn>
    </Scroll>
  );
}

/* ───────── Financial Operation Details (mobile) ───────── */
function MOpDetails() {
  const lines = [
    { acc: '1200 — Inventory (WIP)', amt: '+5,400.00', tone: C.green, side: 'Debit' },
    { acc: '5001 — Cost of Goods Sold', amt: '+1,200.00', tone: C.green, side: 'Debit' },
    { acc: '1100 — Bank · NCB Main', amt: '−6,600.00', tone: C.red, side: 'Credit' },
  ];
  const timeline = [
    ['Operation created', 'Layla A. · Dec 18, 09:21'],
    ['Submitted for review', 'Layla A. · Dec 18, 09:24'],
    ['Approved & posted', 'Controller · Dec 18, 10:05'],
  ];
  return (
    <Scroll>
      <MCard marker={C.green} title="Operation Summary" right={<Pill tone="success">Posted</Pill>}>
        <div style={{ fontFamily: C.mono, fontSize: 12, color: C.blue }}>OP-2024-0883</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Mini label="Total Debits" value="6,600.00" sub="SAR" />
          <Mini label="Difference" value="0.00" sub="SAR" hi />
        </div>
      </MCard>
      <MCard marker={C.green} title="Ledger Lines" pad={8}>
        <div style={{ padding: '0 8px' }}>
          {lines.map((l, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: i < lines.length - 1 ? `1px solid ${C.border}` : 'none' }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.fg1, fontFamily: C.body }}>{l.acc}</div>
                <div style={{ marginTop: 3 }}><Pill tone={l.side === 'Debit' ? 'info' : 'danger'}>{l.side}</Pill></div>
              </div>
              <span style={{ fontFamily: C.mono, fontSize: 13.5, fontWeight: 600, color: l.tone }}>{l.amt}</span>
            </div>
          ))}
        </div>
      </MCard>
      <MCard marker={C.blue} title="Activity">
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {timeline.map(([t, w], i) => (
            <div key={i} style={{ display: 'flex', gap: 12 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ width: 12, height: 12, borderRadius: 999, background: C.green, border: `2px solid ${C.green}` }} />
                {i < timeline.length - 1 && <div style={{ width: 2, flex: 1, minHeight: 22, background: C.borderStrong }} />}
              </div>
              <div style={{ paddingBottom: 14 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.fg1, fontFamily: C.body }}>{t}</div>
                <div style={{ fontFamily: C.mono, fontSize: 11, color: C.fg3, marginTop: 2 }}>{w}</div>
              </div>
            </div>
          ))}
        </div>
      </MCard>
      <MBtn variant="secondary" icon="back" full>Back to Operations</MBtn>
    </Scroll>
  );
}
