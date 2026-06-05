/* global React, Page, Card, SectionHeader, Field, Textarea, Button, Icon, StatusPill */
// Stage 1 — Create Account (full form) + Account Tree (hierarchy)

function CreateAccount({ onCancel, onCreate }) {
  const [name, setName] = React.useState({ en: '', ar: '' });
  const [nature, setNature] = React.useState('debit');
  const [active, setActive] = React.useState(true);
  const { CurSelect, Toggle } = window._cfgShared;

  return (
    <Page breadcrumb={['Account Management', 'Accounts', 'New']} title="Create Account">
      <Card>
        <SectionHeader title="Account Details" subtitle="Identify the account and place it in the tree" marker="blue" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 24 }}>
          <Field label="Account Code" required placeholder="e.g. 1102" mono />
          <CurSelect label="Account Type" value="Asset" options={['Asset', 'Liability', 'Equity', 'Income', 'Expense']} />
          <Field label="Name English" required placeholder="e.g. Bank · Al Rajhi" value={name.en} onChange={(v) => setName({ ...name, en: v })} />
          <Field label="الاسم بالعربية" required placeholder="مثال: بنك الراجحي" dir="rtl" value={name.ar} onChange={(v) => setName({ ...name, ar: v })} />
          <CurSelect label="Parent Group" value="Current Assets (1000)" options={['Current Assets (1000)', 'Fixed Assets (1500)', 'Liabilities (2000)', 'Equity (3000)', 'Revenue (4000)', 'Expenses (5000)']} />
          <CurSelect label="Account Tree" value="Assets Tree (1)" options={['Assets Tree (1)', 'Liabilities Tree (2)', 'Equity Tree (3)']} />
        </div>
      </Card>

      <Card>
        <SectionHeader title="Settings" subtitle="Currency, normal balance and opening figure" marker="green" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 24 }}>
          <CurSelect label="Currency" value="SAR — Saudi Riyal" options={['SAR — Saudi Riyal', 'USD — US Dollar', 'EUR — Euro']} />
          <Field label="Opening Balance (SAR)" placeholder="0.00" mono />
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 11, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--gl-fg-2)', marginBottom: 8 }}>Normal Balance</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 8 }}>
            {[{ id: 'debit', label: 'Debit', tone: '#1DB88A' }, { id: 'credit', label: 'Credit', tone: '#EF4444' }].map((o) => {
              const on = nature === o.id;
              return (
                <button key={o.id} type="button" onClick={() => setNature(o.id)}
                  style={{
                    padding: '12px', borderRadius: 4, cursor: 'pointer',
                    background: on ? `${o.tone}14` : 'var(--gl-input-bg)',
                    border: `1px solid ${on ? o.tone : 'var(--gl-border)'}`,
                    color: on ? o.tone : 'var(--gl-fg-2)', fontFamily: 'var(--gl-font-body)',
                    fontWeight: 700, fontSize: 12, letterSpacing: '0.04em', textTransform: 'uppercase',
                    transition: 'all 150ms ease',
                  }}>{o.label}</button>
              );
            })}
          </div>
        </div>
        <Toggle label="Account is active" checked={active} onChange={setActive} />
      </Card>

      <Card>
        <SectionHeader title="Notes" marker="orange" />
        <Textarea label="Note" placeholder="Add internal notes about this account…" rows={4} />
      </Card>

      <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
        <Button variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button variant="primary" icon="check" onClick={onCreate}>Create Account</Button>
      </div>
    </Page>
  );
}

window.CreateAccount = CreateAccount;

/* =========================================================
   ACCOUNT TREE — interactive 5-level hierarchy
   Wrapped in an IIFE: these top-level scripts share one global
   scope, so generic names (TREE, TreeNode, fmt…) would clobber
   other screens. Only AccountTree/CreateAccount escape to window.
   ========================================================= */
(function () {
// Leaf nodes carry an explicit `bal`; group balances are summed from leaves
// so every figure reconciles. Depth runs 0 → 4 (five levels).
const TREE = [
  { code: '1000', name: 'Assets', ar: 'الأصول', type: 'Asset', children: [
    { code: '1100', name: 'Current Assets', ar: 'الأصول المتداولة', type: 'Asset', children: [
      { code: '1110', name: 'Cash & Cash Equivalents', ar: 'النقد وما في حكمه', type: 'Asset', children: [
        { code: '1111', name: 'Bank Accounts', ar: 'الحسابات البنكية', type: 'Asset', children: [
          { code: '1111-01', name: 'Al Rajhi Bank — Main', ar: 'مصرف الراجحي — الرئيسي', type: 'Asset', bal: 186420 },
          { code: '1111-02', name: 'NCB — Riyadh Branch', ar: 'الأهلي — فرع الرياض', type: 'Asset', bal: 92300 },
          { code: '1111-03', name: 'Riyad Bank — USD', ar: 'بنك الرياض — دولار', type: 'Asset', bal: 41250 },
        ] },
        { code: '1112', name: 'Cash on Hand', ar: 'النقد في الصندوق', type: 'Asset', children: [
          { code: '1112-01', name: 'Main Cash Box', ar: 'الصندوق الرئيسي', type: 'Asset', bal: 18500 },
          { code: '1112-02', name: 'Petty Cash', ar: 'المصروفات النثرية', type: 'Asset', bal: 3200 },
        ] },
      ] },
      { code: '1120', name: 'Trade Receivables', ar: 'الذمم المدينة', type: 'Asset', children: [
        { code: '1121', name: 'Local Customers', ar: 'عملاء محليون', type: 'Asset', children: [
          { code: '1121-01', name: 'Retail Customers', ar: 'عملاء التجزئة', type: 'Asset', bal: 64800 },
          { code: '1121-02', name: 'Wholesale Customers', ar: 'عملاء الجملة', type: 'Asset', bal: 88600 },
        ] },
        { code: '1122', name: 'Export Customers', ar: 'عملاء التصدير', type: 'Asset', children: [
          { code: '1122-01', name: 'GCC Customers', ar: 'عملاء دول الخليج', type: 'Asset', bal: 37400 },
        ] },
      ] },
      { code: '1130', name: 'Inventory', ar: 'المخزون', type: 'Asset', children: [
        { code: '1131', name: 'Finished Goods', ar: 'بضائع تامة الصنع', type: 'Asset', children: [
          { code: '1131-01', name: 'Warehouse A', ar: 'المستودع أ', type: 'Asset', bal: 124000 },
          { code: '1131-02', name: 'Warehouse B', ar: 'المستودع ب', type: 'Asset', bal: 76500 },
        ] },
        { code: '1132', name: 'Raw Materials', ar: 'المواد الخام', type: 'Asset', children: [
          { code: '1132-01', name: 'Steel & Metals', ar: 'الحديد والمعادن', type: 'Asset', bal: 54200 },
        ] },
      ] },
    ] },
    { code: '1500', name: 'Non-Current Assets', ar: 'الأصول غير المتداولة', type: 'Asset', children: [
      { code: '1510', name: 'Property & Equipment', ar: 'الممتلكات والمعدات', type: 'Asset', children: [
        { code: '1511', name: 'Machinery', ar: 'الآلات', type: 'Asset', children: [
          { code: '1511-01', name: 'Production Line 1', ar: 'خط الإنتاج 1', type: 'Asset', bal: 210000 },
          { code: '1511-02', name: 'Production Line 2', ar: 'خط الإنتاج 2', type: 'Asset', bal: 145000 },
        ] },
        { code: '1512', name: 'Vehicles', ar: 'المركبات', type: 'Asset', children: [
          { code: '1512-01', name: 'Delivery Fleet', ar: 'أسطول التوصيل', type: 'Asset', bal: 88000 },
          { code: '1512-02', name: 'Company Cars', ar: 'سيارات الشركة', type: 'Asset', bal: 52000 },
        ] },
      ] },
      { code: '1520', name: 'Intangible Assets', ar: 'الأصول غير الملموسة', type: 'Asset', children: [
        { code: '1521', name: 'Software Licenses', ar: 'تراخيص البرمجيات', type: 'Asset', children: [
          { code: '1521-01', name: 'ERP License', ar: 'رخصة نظام تخطيط الموارد', type: 'Asset', bal: 36000 },
        ] },
      ] },
    ] },
  ] },
  { code: '2000', name: 'Liabilities', ar: 'الخصوم', type: 'Liability', children: [
    { code: '2100', name: 'Current Liabilities', ar: 'الخصوم المتداولة', type: 'Liability', children: [
      { code: '2110', name: 'Trade Payables', ar: 'الذمم الدائنة', type: 'Liability', children: [
        { code: '2111', name: 'Local Suppliers', ar: 'موردون محليون', type: 'Liability', children: [
          { code: '2111-01', name: 'Material Suppliers', ar: 'موردو المواد', type: 'Liability', bal: 92400 },
          { code: '2111-02', name: 'Service Providers', ar: 'مزودو الخدمات', type: 'Liability', bal: 38600 },
        ] },
        { code: '2112', name: 'Foreign Suppliers', ar: 'موردون أجانب', type: 'Liability', children: [
          { code: '2112-01', name: 'Asia Imports', ar: 'واردات آسيا', type: 'Liability', bal: 64200 },
        ] },
      ] },
      { code: '2120', name: 'Accrued Expenses', ar: 'المصروفات المستحقة', type: 'Liability', children: [
        { code: '2121', name: 'Payroll Accruals', ar: 'مستحقات الرواتب', type: 'Liability', children: [
          { code: '2121-01', name: 'Salaries Payable', ar: 'رواتب مستحقة', type: 'Liability', bal: 48500 },
          { code: '2121-02', name: 'End of Service', ar: 'مكافأة نهاية الخدمة', type: 'Liability', bal: 31200 },
        ] },
        { code: '2122', name: 'Tax Accruals', ar: 'المستحقات الضريبية', type: 'Liability', children: [
          { code: '2122-01', name: 'VAT Payable', ar: 'ضريبة القيمة المضافة', type: 'Liability', bal: 27800 },
        ] },
      ] },
    ] },
    { code: '2500', name: 'Non-Current Liabilities', ar: 'الخصوم غير المتداولة', type: 'Liability', children: [
      { code: '2510', name: 'Long-Term Loans', ar: 'القروض طويلة الأجل', type: 'Liability', children: [
        { code: '2511', name: 'Bank Loans', ar: 'القروض البنكية', type: 'Liability', children: [
          { code: '2511-01', name: 'Equipment Loan', ar: 'قرض المعدات', type: 'Liability', bal: 180000 },
          { code: '2511-02', name: 'Expansion Loan', ar: 'قرض التوسعة', type: 'Liability', bal: 120000 },
        ] },
      ] },
    ] },
  ] },
  { code: '3000', name: 'Equity', ar: 'حقوق الملكية', type: 'Equity', children: [
    { code: '3100', name: 'Paid-In Capital', ar: 'رأس المال المدفوع', type: 'Equity', children: [
      { code: '3110', name: 'Share Capital', ar: 'رأس مال الأسهم', type: 'Equity', children: [
        { code: '3111', name: 'Founders', ar: 'المؤسسون', type: 'Equity', children: [
          { code: '3111-01', name: 'Founder A', ar: 'المؤسس أ', type: 'Equity', bal: 300000 },
          { code: '3111-02', name: 'Founder B', ar: 'المؤسس ب', type: 'Equity', bal: 200000 },
        ] },
      ] },
    ] },
    { code: '3200', name: 'Retained Earnings', ar: 'الأرباح المحتجزة', type: 'Equity', children: [
      { code: '3210', name: 'Prior Years', ar: 'سنوات سابقة', type: 'Equity', children: [
        { code: '3211', name: 'Accumulated', ar: 'المتراكمة', type: 'Equity', children: [
          { code: '3211-01', name: 'Accumulated Profit', ar: 'أرباح متراكمة', type: 'Equity', bal: 154470 },
        ] },
      ] },
      { code: '3220', name: 'Current Year', ar: 'السنة الحالية', type: 'Equity', children: [
        { code: '3221', name: 'Net Income', ar: 'صافي الدخل', type: 'Equity', children: [
          { code: '3221-01', name: 'YTD Profit', ar: 'ربح حتى تاريخه', type: 'Equity', bal: 61000 },
        ] },
      ] },
    ] },
  ] },
  { code: '4000', name: 'Income', ar: 'الإيرادات', type: 'Income', children: [
    { code: '4100', name: 'Operating Revenue', ar: 'إيرادات التشغيل', type: 'Income', children: [
      { code: '4110', name: 'Product Sales', ar: 'مبيعات المنتجات', type: 'Income', children: [
        { code: '4111', name: 'Domestic Sales', ar: 'المبيعات المحلية', type: 'Income', children: [
          { code: '4111-01', name: 'Retail Sales', ar: 'مبيعات التجزئة', type: 'Income', bal: 642000 },
          { code: '4111-02', name: 'Wholesale Sales', ar: 'مبيعات الجملة', type: 'Income', bal: 388000 },
        ] },
        { code: '4112', name: 'Export Sales', ar: 'مبيعات التصدير', type: 'Income', children: [
          { code: '4112-01', name: 'GCC Exports', ar: 'صادرات دول الخليج', type: 'Income', bal: 214000 },
        ] },
      ] },
      { code: '4120', name: 'Service Revenue', ar: 'إيرادات الخدمات', type: 'Income', children: [
        { code: '4121', name: 'Maintenance Contracts', ar: 'عقود الصيانة', type: 'Income', children: [
          { code: '4121-01', name: 'Annual Contracts', ar: 'عقود سنوية', type: 'Income', bal: 96000 },
        ] },
      ] },
    ] },
  ] },
  { code: '5000', name: 'Expenses', ar: 'المصروفات', type: 'Expense', children: [
    { code: '5100', name: 'Cost of Goods Sold', ar: 'تكلفة البضاعة المباعة', type: 'Expense', children: [
      { code: '5110', name: 'Direct Materials', ar: 'المواد المباشرة', type: 'Expense', children: [
        { code: '5111', name: 'Raw Material Cost', ar: 'تكلفة المواد الخام', type: 'Expense', children: [
          { code: '5111-01', name: 'Steel Purchases', ar: 'مشتريات الحديد', type: 'Expense', bal: 318000 },
        ] },
      ] },
      { code: '5120', name: 'Direct Labor', ar: 'العمالة المباشرة', type: 'Expense', children: [
        { code: '5121', name: 'Factory Wages', ar: 'أجور المصنع', type: 'Expense', children: [
          { code: '5121-01', name: 'Production Staff', ar: 'موظفو الإنتاج', type: 'Expense', bal: 142000 },
        ] },
      ] },
    ] },
    { code: '5500', name: 'Operating Expenses', ar: 'المصروفات التشغيلية', type: 'Expense', children: [
      { code: '5510', name: 'Administrative', ar: 'إدارية', type: 'Expense', children: [
        { code: '5511', name: 'Salaries & Benefits', ar: 'الرواتب والمزايا', type: 'Expense', children: [
          { code: '5511-01', name: 'Admin Salaries', ar: 'رواتب إدارية', type: 'Expense', bal: 188000 },
        ] },
        { code: '5512', name: 'Rent & Utilities', ar: 'الإيجار والمرافق', type: 'Expense', children: [
          { code: '5512-01', name: 'Office Rent', ar: 'إيجار المكتب', type: 'Expense', bal: 72000 },
        ] },
      ] },
    ] },
  ] },
];

const TYPE_DOT = { Asset: '#4A7CFF', Liability: '#F97316', Equity: '#1DB88A', Income: '#38BDF8', Expense: '#EF4444' };
const TYPE_NATURE = { Asset: 'debit', Expense: 'debit', Liability: 'credit', Equity: 'credit', Income: 'credit' };
const TYPE_ORDER = ['Asset', 'Liability', 'Equity', 'Income', 'Expense'];

/* ---- tree maths -------------------------------------------------------- */
function nodeTotal(n) {
  return n.children ? n.children.reduce((s, c) => s + nodeTotal(c), 0) : (n.bal || 0);
}
function leafCount(n) {
  return n.children ? n.children.reduce((s, c) => s + leafCount(c), 0) : 1;
}
function maxDepth(n, d = 0) {
  return n.children ? Math.max(...n.children.map((c) => maxDepth(c, d + 1))) : d;
}
const fmt = (n) => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtShort = (n) => {
  if (n >= 1e6) return (n / 1e6).toFixed(2) + 'M';
  if (n >= 1e3) return Math.round(n / 1e3) + 'K';
  return String(n);
};
// codes of every group node up to a given depth (for default-expand / expand-all)
function groupCodes(nodes, maxD = Infinity, d = 0, out = []) {
  nodes.forEach((n) => {
    if (n.children && n.children.length) {
      if (d <= maxD) out.push(n.code);
      groupCodes(n.children, maxD, d + 1, out);
    }
  });
  return out;
}
// recursive search filter — keeps a node if it (or any descendant) matches q
function filterTree(nodes, q) {
  const needle = q.trim().toLowerCase();
  if (!needle) return nodes;
  const walk = (n) => {
    const self = (n.code + ' ' + n.name + ' ' + n.ar).toLowerCase().includes(needle);
    const kids = n.children ? n.children.map(walk).filter(Boolean) : null;
    if (self) return n;                       // keep whole subtree under a match
    if (kids && kids.length) return { ...n, children: kids };
    return null;
  };
  return nodes.map(walk).filter(Boolean);
}

/* ---- row --------------------------------------------------------------- */
function TreeNode({ node, depth, expanded, toggle, onOpen, rootTotal, forceOpen }) {
  const [hover, setHover] = React.useState(false);
  const hasKids = node.children && node.children.length > 0;
  const open = forceOpen || expanded.has(node.code);
  const total = nodeTotal(node);
  const share = rootTotal > 0 ? total / rootTotal : 0;
  const dot = TYPE_DOT[node.type];
  const nature = TYPE_NATURE[node.type];
  const indent = 14 + depth * 22;

  return (
    <div>
      <div
        onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
        onClick={() => hasKids ? toggle(node.code) : (onOpen && onOpen(node))}
        style={{
          display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 78px 168px 28px', gap: 12, alignItems: 'center',
          padding: '9px 12px', paddingLeft: indent,
          borderRadius: 5, cursor: 'pointer',
          background: hover ? 'var(--gl-hover)' : 'transparent',
          transition: 'background 120ms ease',
        }}>
        {/* account cell */}
        <span style={{ display: 'flex', alignItems: 'center', gap: 9, minWidth: 0 }}>
          <span style={{ width: 14, display: 'flex', color: 'var(--gl-fg-3)', flexShrink: 0 }}>
            {hasKids ? <Icon name={open ? 'chevDown' : 'chevRight'} size={13} /> : null}
          </span>
          <span style={{ width: 7, height: 7, borderRadius: 999, background: dot, flexShrink: 0, boxShadow: depth === 0 ? `0 0 0 3px ${dot}22` : 'none' }} />
          <span style={{ fontFamily: 'var(--gl-font-mono)', fontSize: 11.5, color: 'var(--gl-fg-3)', flexShrink: 0, minWidth: depth === 0 ? 34 : undefined }}>{node.code}</span>
          <span style={{ fontSize: 13, fontWeight: depth === 0 ? 700 : (depth === 1 ? 600 : 500), color: depth >= 3 ? 'var(--gl-fg-2)' : 'var(--gl-fg-1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{node.name}</span>
          <span dir="rtl" style={{ fontFamily: 'var(--gl-font-arabic)', fontSize: 12, color: 'var(--gl-fg-4)', flexShrink: 0 }}>{node.ar}</span>
          {hasKids && (
            <span style={{
              fontFamily: 'var(--gl-font-mono)', fontSize: 9.5, fontWeight: 700, letterSpacing: '0.02em',
              color: 'var(--gl-fg-3)', background: 'var(--gl-input-bg)', border: '1px solid var(--gl-border)',
              borderRadius: 999, padding: '1px 7px', flexShrink: 0,
            }}>{leafCount(node)}</span>
          )}
        </span>
        {/* nature */}
        <span style={{ display: 'flex' }}>
          <StatusPill tone={nature === 'debit' ? 'info' : 'warning'} size="sm">{nature === 'debit' ? 'DR' : 'CR'}</StatusPill>
        </span>
        {/* balance + share bar */}
        <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
          <span style={{ fontFamily: 'var(--gl-font-mono)', fontSize: 12.5, fontWeight: depth === 0 ? 700 : 500, color: 'var(--gl-fg-1)' }}>{fmt(total)}</span>
          <span style={{ width: '100%', height: 3, borderRadius: 999, background: 'var(--gl-input-bg)', overflow: 'hidden' }}>
            <span style={{ display: 'block', height: '100%', width: `${Math.max(share * 100, 1.5)}%`, background: dot, opacity: depth === 0 ? 0.9 : 0.55, borderRadius: 999 }} />
          </span>
        </span>
        {/* open affordance */}
        <span style={{ display: 'flex', justifyContent: 'flex-end', color: 'var(--gl-fg-4)' }}>
          {!hasKids && hover && <Icon name="chevRight" size={13} />}
        </span>
      </div>
      {hasKids && open && (
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', left: indent + 7, top: 0, bottom: 13, width: 1, background: 'var(--gl-border)' }} />
          {node.children.map((c) => (
            <TreeNode key={c.code} node={c} depth={depth + 1} expanded={expanded} toggle={toggle} onOpen={onOpen} rootTotal={rootTotal} forceOpen={forceOpen} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ---- KPI card ---------------------------------------------------------- */
function KpiCard({ label, ar, value, accent, sub }) {
  return (
    <div style={{
      background: 'var(--gl-surface)', border: '1px solid var(--gl-border)', borderRadius: 8,
      boxShadow: 'var(--gl-shadow)', padding: '16px 18px', position: 'relative', overflow: 'hidden',
      display: 'flex', flexDirection: 'column', gap: 10,
    }}>
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: accent }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
        <span style={{ fontWeight: 700, fontSize: 10, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--gl-fg-3)' }}>{label}</span>
        <span dir="rtl" style={{ fontFamily: 'var(--gl-font-arabic)', fontSize: 11, color: 'var(--gl-fg-4)' }}>{ar}</span>
      </div>
      <div style={{ fontFamily: 'var(--gl-font-mono)', fontSize: 21, fontWeight: 700, color: 'var(--gl-fg-1)', letterSpacing: '-0.01em' }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: 'var(--gl-fg-3)' }}>{sub}</div>}
    </div>
  );
}

function FilterChip({ active, color, onClick, children }) {
  const [hover, setHover] = React.useState(false);
  return (
    <button type="button" onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 7, height: 30, padding: '0 12px',
        borderRadius: 999, cursor: 'pointer', fontFamily: 'var(--gl-font-body)',
        fontWeight: 700, fontSize: 11, letterSpacing: '0.03em',
        background: active ? (color ? `${color}1F` : 'var(--gl-hover)') : (hover ? 'var(--gl-hover)' : 'transparent'),
        border: `1px solid ${active ? (color || 'var(--gl-border-strong)') : 'var(--gl-border)'}`,
        color: active ? (color || 'var(--gl-fg-1)') : 'var(--gl-fg-2)',
        transition: 'all 120ms ease',
      }}>
      {color && <span style={{ width: 7, height: 7, borderRadius: 999, background: color }} />}
      {children}
    </button>
  );
}

function AccountTree({ onCreate, onOpen }) {
  const [expanded, setExpanded] = React.useState(() => new Set(groupCodes(TREE, 1)));
  const [query, setQuery] = React.useState('');
  const [typeFilter, setTypeFilter] = React.useState('all');
  const [searchFocus, setSearchFocus] = React.useState(false);

  const toggle = (code) => setExpanded((prev) => {
    const next = new Set(prev);
    next.has(code) ? next.delete(code) : next.add(code);
    return next;
  });
  const expandAll = () => setExpanded(new Set(groupCodes(TREE)));
  const collapseAll = () => setExpanded(new Set());

  // type filter then search filter
  const byType = typeFilter === 'all' ? TREE : TREE.filter((n) => n.type === typeFilter);
  const visible = filterTree(byType, query);
  const searching = query.trim().length > 0;

  // balance-sheet figures
  const totalOf = (t) => TREE.filter((n) => n.type === t).reduce((s, n) => s + nodeTotal(n), 0);
  const assets = totalOf('Asset'), liabilities = totalOf('Liability'), equity = totalOf('Equity');
  const income = totalOf('Income'), expense = totalOf('Expense');
  const balanced = Math.abs(assets - (liabilities + equity)) < 0.01;
  const totalAccounts = TREE.reduce((s, n) => s + leafCount(n), 0);
  const visibleAccounts = visible.reduce((s, n) => s + leafCount(n), 0);

  const types = [
    { id: 'all', label: 'All', color: null },
    ...TYPE_ORDER.map((t) => ({ id: t, label: t, color: TYPE_DOT[t] })),
  ];

  return (
    <Page breadcrumb={['Account Management', 'Account Tree']} title="Account Tree" titleArabic="شجرة الحسابات"
      titleRight={<Button variant="primary" icon="plus" onClick={onCreate}>Create Account</Button>}>

      {/* KPI summary — live balance-sheet snapshot */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 16 }}>
        <KpiCard label="Total Assets" ar="الأصول" value={fmt(assets)} accent={TYPE_DOT.Asset} sub="SAR · debit balance" />
        <KpiCard label="Total Liabilities" ar="الخصوم" value={fmt(liabilities)} accent={TYPE_DOT.Liability} sub="SAR · credit balance" />
        <KpiCard label="Total Equity" ar="حقوق الملكية" value={fmt(equity)} accent={TYPE_DOT.Equity} sub="SAR · credit balance" />
        <KpiCard label="Net Income" ar="صافي الدخل" value={fmt(income - expense)} accent={TYPE_DOT.Income}
          sub={`Income ${fmtShort(income)} − Expense ${fmtShort(expense)} SAR`} />
      </div>

      {/* Toolbar: search · type chips · expand controls · equation check */}
      <Card padding={18}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
            {/* search */}
            <div style={{
              position: 'relative', flex: '1 1 280px', minWidth: 220, height: 40,
              display: 'flex', alignItems: 'center',
              background: 'var(--gl-input-bg)', borderRadius: 4,
              border: `${searchFocus ? 2 : 1}px solid ${searchFocus ? '#4A7CFF' : 'var(--gl-border-strong)'}`,
              padding: `0 ${searchFocus ? 13 : 14}px`, transition: 'border-color 150ms ease',
            }}>
              <Icon name="search" size={15} color="var(--gl-fg-3)" />
              <input
                value={query} onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setSearchFocus(true)} onBlur={() => setSearchFocus(false)}
                placeholder="Search by code, English or Arabic name…"
                style={{
                  flex: 1, height: '100%', border: 'none', outline: 'none', background: 'transparent',
                  color: 'var(--gl-fg-1)', fontFamily: 'var(--gl-font-body)', fontSize: 13.5, padding: '0 10px',
                }} />
              {query && (
                <button type="button" onClick={() => setQuery('')} title="Clear"
                  style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--gl-fg-3)', display: 'flex', padding: 4 }}>
                  <Icon name="close" size={13} />
                </button>
              )}
            </div>
            {/* expand controls */}
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <Button variant="secondary" icon="chevDown" onClick={expandAll}>Expand all</Button>
              <Button variant="ghost" icon="chevUp" onClick={collapseAll}>Collapse</Button>
            </div>
          </div>

          {/* type filter chips */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            {types.map((t) => (
              <FilterChip key={t.id} active={typeFilter === t.id} color={t.color} onClick={() => setTypeFilter(t.id)}>
                {t.label}
              </FilterChip>
            ))}
            <span style={{ flex: 1 }} />
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 11, fontWeight: 700,
              letterSpacing: '0.04em', textTransform: 'uppercase',
              color: balanced ? '#1DB88A' : '#EF4444',
              background: balanced ? 'rgba(29,184,138,.12)' : 'rgba(239,68,68,.12)',
              border: `1px solid ${balanced ? 'rgba(29,184,138,.4)' : 'rgba(239,68,68,.4)'}`,
              borderRadius: 999, padding: '6px 12px',
            }}>
              <Icon name={balanced ? 'check' : 'info'} size={13} />
              {balanced ? 'Balanced · A = L + E' : 'Out of balance'}
            </span>
          </div>
        </div>
      </Card>

      {/* The tree */}
      <Card padding={0}>
        <div style={{ padding: '20px 24px 0' }}>
          <SectionHeader title="Chart of Accounts Hierarchy" subtitle="5 levels · click a group to expand, click a leaf account to open its ledger" marker="blue"
            right={
              <span style={{ fontWeight: 700, fontSize: 10, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--gl-fg-3)' }}>
                {searching ? `${visibleAccounts} of ${totalAccounts}` : `${totalAccounts} accounts`}
              </span>
            } />
        </div>
        {/* column header */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 78px 168px 28px', gap: 12, alignItems: 'center',
          padding: '14px 28px 12px', margin: '14px 16px 0', borderBottom: '1px solid var(--gl-border)',
          fontWeight: 700, fontSize: 9.5, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--gl-fg-3)',
        }}>
          <span>Account · الحساب</span>
          <span>Nature</span>
          <span style={{ textAlign: 'right' }}>Balance (SAR)</span>
          <span />
        </div>
        <div style={{ padding: '8px 16px 20px' }}>
          {visible.length === 0 ? (
            <div style={{ padding: '48px 16px', textAlign: 'center', color: 'var(--gl-fg-3)' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12, color: 'var(--gl-fg-4)' }}>
                <Icon name="search" size={26} />
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--gl-fg-2)' }}>No accounts match “{query}”</div>
              <div style={{ fontSize: 12, marginTop: 4 }}>Try a different code or name, or clear the filters.</div>
            </div>
          ) : (
            visible.map((n) => (
              <TreeNode key={n.code} node={n} depth={0} expanded={expanded} toggle={toggle} onOpen={onOpen}
                rootTotal={nodeTotal(n)} forceOpen={searching} />
            ))
          )}
        </div>
      </Card>
    </Page>
  );
}

window.AccountTree = AccountTree;
})();
