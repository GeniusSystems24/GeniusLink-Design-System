/* global React, Page, Card, SectionHeader, Button, IconBtn, Icon, StatusPill */
// Screen: Accounts List — master list view pattern

function AccountsList({ onCreate, onOpenAccount }) {
  const [query, setQuery] = React.useState('');
  const [tab, setTab] = React.useState('all');

  const accounts = [
    { id: '1001', name: 'Cash Box',                ar: 'الصندوق',          tree: 'Assets',      type: 'Asset',     balance: '42,500.00', currency: 'SAR', status: 'active' },
    { id: '1100', name: 'Bank — NCB Main',         ar: 'البنك الأهلي',     tree: 'Assets',      type: 'Asset',     balance: '186,420.00', currency: 'SAR', status: 'active' },
    { id: '1200', name: 'Inventory (WIP)',         ar: 'مخزون قيد التشغيل',tree: 'Assets',      type: 'Asset',     balance: '54,890.00', currency: 'SAR', status: 'active' },
    { id: '2001', name: 'Accounts Payable',        ar: 'الموردون',          tree: 'Liabilities', type: 'Liability', balance: '-23,140.00', currency: 'SAR', status: 'active' },
    { id: '3001', name: 'Owner Capital',           ar: 'رأس المال',         tree: 'Equity',      type: 'Equity',    balance: '-260,670.00', currency: 'SAR', status: 'active' },
    { id: '4001', name: 'Sales Revenue',           ar: 'إيرادات المبيعات',  tree: 'Revenue',     type: 'Income',    balance: '-89,200.00', currency: 'SAR', status: 'active' },
    { id: '4002', name: 'Service Revenue',         ar: 'إيرادات الخدمات',   tree: 'Revenue',     type: 'Income',    balance: '0.00',       currency: 'SAR', status: 'draft' },
    { id: '5001', name: 'Cost of Goods Sold',      ar: 'تكلفة البضاعة',     tree: 'Expenses',    type: 'Expense',   balance: '34,120.00',  currency: 'SAR', status: 'active' },
  ];

  const visible = accounts.filter((a) => {
    if (tab !== 'all' && a.type.toLowerCase() !== tab) return false;
    if (!query) return true;
    const q = query.toLowerCase();
    return a.name.toLowerCase().includes(q) || a.id.includes(q) || a.ar.includes(query);
  });

  const grid = '90px 1.8fr 1fr 1fr 1fr 100px 40px';

  return (
    <Page
      breadcrumb={['Account Management', 'Accounts']}
      title="Chart of Accounts"
      titleRight={
        <Button variant="primary" icon="plus" onClick={onCreate}>Create Account</Button>
      }>

      {/* Filter row */}
      <Card padding={20}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 4, background: 'var(--gl-input-bg)', padding: 4, borderRadius: 6, border: '1px solid var(--gl-border)' }}>
            {[
              { id: 'all',       label: 'All' },
              { id: 'asset',     label: 'Assets' },
              { id: 'liability', label: 'Liabilities' },
              { id: 'equity',    label: 'Equity' },
              { id: 'income',    label: 'Income' },
              { id: 'expense',   label: 'Expenses' },
            ].map((t) => (
              <button key={t.id}
                onClick={() => setTab(t.id)}
                style={{
                  padding: '6px 14px', borderRadius: 4,
                  background: tab === t.id ? 'var(--gl-surface)' : 'transparent',
                  color: tab === t.id ? 'var(--gl-fg-1)' : 'var(--gl-fg-3)',
                  border: 'none', cursor: 'pointer',
                  fontFamily: 'var(--gl-font-body)',
                  fontWeight: 700, fontSize: 10,
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                  boxShadow: tab === t.id ? '0 1px 2px rgba(0,0,0,0.2)' : 'none',
                  transition: 'background 150ms ease',
                }}>{t.label}</button>
            ))}
          </div>
          <div style={{
            position: 'relative', flex: '0 0 280px',
          }}>
            <div style={{
              position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
              color: 'var(--gl-fg-3)', display: 'flex', pointerEvents: 'none',
            }}>
              <Icon name="search" size={14} />
            </div>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search account name or code…"
              style={{
                width: '100%', height: 40, padding: '0 16px 0 40px',
                background: 'var(--gl-input-bg)',
                border: '1px solid var(--gl-border-strong)',
                borderRadius: 4,
                fontFamily: 'var(--gl-font-body)', fontSize: 13,
                color: 'var(--gl-fg-1)', outline: 'none',
                boxSizing: 'border-box',
              }}/>
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card padding={0}>
        <div style={{ padding: '20px 24px 0' }}>
          <SectionHeader
            title={`${visible.length} Account${visible.length === 1 ? '' : 's'}`}
            subtitle="Click any row to open its detail view"
            marker="blue" />
        </div>

        <div style={{ padding: '20px 24px 24px' }}>
          {/* head */}
          <div style={{
            display: 'grid', gridTemplateColumns: grid, gap: 12,
            padding: '0 0 12px',
            borderBottom: '1px solid var(--gl-border)',
            fontWeight: 700, fontSize: 10, letterSpacing: '0.05em',
            textTransform: 'uppercase', color: 'var(--gl-fg-3)',
          }}>
            <span>Code</span><span>Account</span><span>Tree</span><span>Type</span>
            <span style={{ textAlign: 'right' }}>Balance</span>
            <span>Status</span><span></span>
          </div>
          {visible.map((a) => (
            <AccountRow key={a.id} a={a} grid={grid} onClick={() => onOpenAccount && onOpenAccount(a)} />
          ))}
          {visible.length === 0 && (
            <div style={{
              padding: '48px 0', textAlign: 'center',
              color: 'var(--gl-fg-3)', fontSize: 13,
            }}>No accounts match your search.</div>
          )}
        </div>
      </Card>
    </Page>
  );
}

function AccountRow({ a, grid, onClick }) {
  const [hover, setHover] = React.useState(false);
  const amt = parseFloat(a.balance.replace(/,/g, ''));
  const amtColor = a.status === 'draft'
    ? 'var(--gl-fg-3)'
    : (amt < 0 ? '#EF4444' : 'var(--gl-fg-1)');
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'grid', gridTemplateColumns: grid, gap: 12,
        padding: '14px 8px', alignItems: 'center',
        borderBottom: '1px solid var(--gl-border)',
        background: hover ? 'var(--gl-hover)' : 'transparent',
        margin: '0 -8px',
        borderRadius: 4,
        cursor: 'pointer',
        fontSize: 13, color: 'var(--gl-fg-1)',
        transition: 'background 150ms ease',
      }}>
      <span style={{ fontFamily: 'var(--gl-font-mono)', color: 'var(--gl-fg-2)' }}>{a.id}</span>
      <span>
        <div style={{ fontWeight: 600 }}>{a.name}</div>
        <div dir="rtl" style={{
          fontFamily: 'var(--gl-font-arabic)', fontSize: 12,
          color: 'var(--gl-fg-3)', marginTop: 2,
        }}>{a.ar}</div>
      </span>
      <span style={{ color: 'var(--gl-fg-2)' }}>{a.tree}</span>
      <span style={{ color: 'var(--gl-fg-2)' }}>{a.type}</span>
      <span style={{
        fontFamily: 'var(--gl-font-mono)', fontWeight: 600,
        textAlign: 'right', color: amtColor,
      }}>{a.balance} <span style={{ color: 'var(--gl-fg-3)', fontWeight: 400, fontSize: 11 }}>{a.currency}</span></span>
      <span>
        <StatusPill tone={a.status === 'active' ? 'success' : 'neutral'} size="sm">
          {a.status}
        </StatusPill>
      </span>
      <span style={{ justifySelf: 'end', color: 'var(--gl-fg-3)', display: 'flex' }}>
        <Icon name="chevRight" size={14} />
      </span>
    </div>
  );
}

window.AccountsList = AccountsList;
