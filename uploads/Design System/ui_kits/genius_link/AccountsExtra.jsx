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
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
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
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <CurSelect label="Currency" value="SAR — Saudi Riyal" options={['SAR — Saudi Riyal', 'USD — US Dollar', 'EUR — Euro']} />
          <Field label="Opening Balance (SAR)" placeholder="0.00" mono />
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 11, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--gl-fg-2)', marginBottom: 8 }}>Normal Balance</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
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

/* =========================================================
   ACCOUNT TREE — interactive hierarchy
   ========================================================= */
const TREE = [
  { code: '1000', name: 'Assets', ar: 'الأصول', type: 'Asset', balance: '425,790.00', children: [
    { code: '1001', name: 'Current Assets', ar: 'أصول متداولة', type: 'Asset', balance: '283,790.00', children: [
      { code: '1010', name: 'Cash Box', ar: 'الصندوق', type: 'Asset', balance: '42,500.00' },
      { code: '1100', name: 'Bank · NCB Main', ar: 'البنك الأهلي', type: 'Asset', balance: '186,420.00' },
      { code: '1200', name: 'Inventory (WIP)', ar: 'مخزون قيد التشغيل', type: 'Asset', balance: '54,890.00' },
    ] },
    { code: '1500', name: 'Fixed Assets', ar: 'أصول ثابتة', type: 'Asset', balance: '142,000.00', children: [
      { code: '1510', name: 'Equipment', ar: 'معدات', type: 'Asset', balance: '98,000.00' },
      { code: '1520', name: 'Vehicles', ar: 'مركبات', type: 'Asset', balance: '44,000.00' },
    ] },
  ] },
  { code: '2000', name: 'Liabilities', ar: 'الخصوم', type: 'Liability', balance: '103,140.00', children: [
    { code: '2001', name: 'Accounts Payable', ar: 'الموردون', type: 'Liability', balance: '23,140.00' },
    { code: '2100', name: 'Long-Term Debt', ar: 'ديون طويلة الأجل', type: 'Liability', balance: '80,000.00' },
  ] },
  { code: '3000', name: 'Equity', ar: 'حقوق الملكية', type: 'Equity', balance: '322,650.00', children: [
    { code: '3001', name: 'Owner Capital', ar: 'رأس المال', type: 'Equity', balance: '260,670.00' },
    { code: '3100', name: 'Retained Earnings', ar: 'أرباح محتجزة', type: 'Equity', balance: '61,980.00' },
  ] },
];

const TYPE_DOT = { Asset: '#4A7CFF', Liability: '#F97316', Equity: '#1DB88A', Income: '#1DB88A', Expense: '#EF4444' };

function TreeNode({ node, depth, onOpen }) {
  const [open, setOpen] = React.useState(depth < 1);
  const [hover, setHover] = React.useState(false);
  const hasKids = node.children && node.children.length > 0;
  return (
    <div>
      <div
        onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
        onClick={() => hasKids ? setOpen(!open) : (onOpen && onOpen(node))}
        style={{
          display: 'grid', gridTemplateColumns: '1fr 140px 24px', gap: 12, alignItems: 'center',
          padding: '11px 12px', paddingLeft: 12 + depth * 26,
          borderRadius: 4, cursor: 'pointer',
          background: hover ? 'var(--gl-hover)' : 'transparent',
          transition: 'background 120ms ease',
        }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
          <span style={{ width: 16, display: 'flex', color: 'var(--gl-fg-3)', flexShrink: 0 }}>
            {hasKids ? <Icon name={open ? 'chevDown' : 'chevRight'} size={14} /> : null}
          </span>
          <span style={{ width: 7, height: 7, borderRadius: 999, background: TYPE_DOT[node.type], flexShrink: 0 }} />
          <span style={{ fontFamily: 'var(--gl-font-mono)', fontSize: 12, color: 'var(--gl-fg-3)', flexShrink: 0 }}>{node.code}</span>
          <span style={{ fontSize: 13, fontWeight: depth === 0 ? 700 : 600, color: 'var(--gl-fg-1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{node.name}</span>
          <span dir="rtl" style={{ fontFamily: 'var(--gl-font-arabic)', fontSize: 12, color: 'var(--gl-fg-3)' }}>{node.ar}</span>
        </span>
        <span style={{ fontFamily: 'var(--gl-font-mono)', fontSize: 13, fontWeight: depth === 0 ? 700 : 500, textAlign: 'right', color: 'var(--gl-fg-1)' }}>{node.balance}</span>
        <span style={{ display: 'flex', justifyContent: 'flex-end', color: 'var(--gl-fg-4)' }}>
          {!hasKids && hover && <Icon name="chevRight" size={13} />}
        </span>
      </div>
      {hasKids && open && (
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', left: 12 + depth * 26 + 7, top: 0, bottom: 14, width: 1, background: 'var(--gl-border)' }} />
          {node.children.map((c) => <TreeNode key={c.code} node={c} depth={depth + 1} onOpen={onOpen} />)}
        </div>
      )}
    </div>
  );
}

function AccountTree({ onCreate, onOpen }) {
  return (
    <Page breadcrumb={['Account Management', 'Account Tree']} title="Account Tree"
      titleRight={<Button variant="primary" icon="plus" onClick={onCreate}>Create Account</Button>}>
      <Card padding={20}>
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontWeight: 700, fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--gl-fg-3)' }}>Legend</span>
          {Object.entries(TYPE_DOT).filter(([k]) => ['Asset', 'Liability', 'Equity', 'Income', 'Expense'].includes(k)).map(([k, v]) => (
            <span key={k} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--gl-fg-2)' }}>
              <span style={{ width: 8, height: 8, borderRadius: 999, background: v }} />{k}
            </span>
          ))}
        </div>
      </Card>

      <Card padding={0}>
        <div style={{ padding: '20px 24px 0' }}>
          <SectionHeader title="Chart of Accounts Hierarchy" subtitle="Click a group to expand · click a leaf account to open" marker="blue"
            right={<span style={{ fontWeight: 700, fontSize: 10, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--gl-fg-3)' }}>Balance</span>} />
        </div>
        <div style={{ padding: '16px 16px 20px' }}>
          {TREE.map((n) => <TreeNode key={n.code} node={n} depth={0} onOpen={onOpen} />)}
        </div>
      </Card>
    </Page>
  );
}

window.CreateAccount = CreateAccount;
window.AccountTree = AccountTree;
