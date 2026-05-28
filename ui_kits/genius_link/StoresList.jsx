/* global React, Page, Card, SectionHeader, Button, Icon, StatusPill */
// Screen: Stores List

function StoresList({ onCreate, onOpenStore }) {
  const [query, setQuery] = React.useState('');

  const stores = [
    { code: 'ST-001', name: 'Downtown Central Store',  ar: 'متجر وسط المدينة',     city: 'Riyadh',    type: 'Retail',             items: 1248, value: '342,820.00', status: 'active' },
    { code: 'ST-002', name: 'King Fahd Warehouse',     ar: 'مستودع الملك فهد',    city: 'Riyadh',    type: 'Warehouse',          items: 4892, value: '1,820,460.00', status: 'active' },
    { code: 'ST-003', name: 'Jeddah Showroom',         ar: 'صالة عرض جدة',         city: 'Jeddah',    type: 'Showroom',           items: 412,  value: '128,640.00', status: 'active' },
    { code: 'ST-004', name: 'Dammam Distribution',     ar: 'توزيع الدمام',         city: 'Dammam',    type: 'Distribution Center', items: 2104, value: '624,180.00', status: 'active' },
    { code: 'ST-005', name: 'Madinah Outlet',          ar: 'منفذ المدينة',         city: 'Madinah',   type: 'Retail',             items: 0,    value: '0.00', status: 'draft' },
  ];

  const visible = stores.filter((s) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q) || s.ar.includes(query);
  });

  const grid = '100px 1.8fr 1fr 1.2fr 0.8fr 1.2fr 100px 40px';

  return (
    <Page
      breadcrumb={['Stores & Products', 'Stores']}
      title="Stores"
      titleRight={
        <Button variant="primary" icon="plus" onClick={onCreate}>Create Store</Button>
      }>

      <Card padding={20}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{
            position: 'relative', flex: '0 0 320px',
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
              placeholder="Search store name or code…"
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
          <div style={{
            display: 'flex', gap: 24, fontFamily: 'var(--gl-font-mono)', fontSize: 11,
          }}>
            <Stat label="Stores" value={stores.length} />
            <Stat label="Active" value={stores.filter(s => s.status === 'active').length} accent="#1DB88A" />
            <Stat label="Total SKUs" value={stores.reduce((s, x) => s + x.items, 0).toLocaleString()} />
          </div>
        </div>
      </Card>

      <Card padding={0}>
        <div style={{ padding: '20px 24px 0' }}>
          <SectionHeader
            title={`${visible.length} Store${visible.length === 1 ? '' : 's'}`}
            subtitle="Click any row to open its detail view"
            marker="blue" />
        </div>
        <div style={{ padding: '20px 24px 24px' }}>
          <div style={{
            display: 'grid', gridTemplateColumns: grid, gap: 12,
            padding: '0 0 12px',
            borderBottom: '1px solid var(--gl-border)',
            fontWeight: 700, fontSize: 10, letterSpacing: '0.05em',
            textTransform: 'uppercase', color: 'var(--gl-fg-3)',
          }}>
            <span>Code</span><span>Store</span><span>City</span><span>Type</span>
            <span style={{ textAlign: 'right' }}>SKUs</span>
            <span style={{ textAlign: 'right' }}>Stock Value</span>
            <span>Status</span><span></span>
          </div>
          {visible.map((s) => (
            <StoreRow key={s.code} s={s} grid={grid} onClick={() => onOpenStore && onOpenStore(s)} />
          ))}
        </div>
      </Card>
    </Page>
  );
}

function StoreRow({ s, grid, onClick }) {
  const [hover, setHover] = React.useState(false);
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
        margin: '0 -8px', borderRadius: 4, cursor: 'pointer',
        fontSize: 13, color: 'var(--gl-fg-1)',
        transition: 'background 150ms ease',
      }}>
      <span style={{ fontFamily: 'var(--gl-font-mono)', color: 'var(--gl-fg-2)' }}>{s.code}</span>
      <span>
        <div style={{ fontWeight: 600 }}>{s.name}</div>
        <div dir="rtl" style={{
          fontFamily: 'var(--gl-font-arabic)', fontSize: 12,
          color: 'var(--gl-fg-3)', marginTop: 2,
        }}>{s.ar}</div>
      </span>
      <span style={{ color: 'var(--gl-fg-2)' }}>{s.city}</span>
      <span style={{ color: 'var(--gl-fg-2)' }}>{s.type}</span>
      <span style={{ fontFamily: 'var(--gl-font-mono)', textAlign: 'right' }}>{s.items.toLocaleString()}</span>
      <span style={{ fontFamily: 'var(--gl-font-mono)', textAlign: 'right', fontWeight: 600 }}>
        {s.value} <span style={{ color: 'var(--gl-fg-3)', fontWeight: 400, fontSize: 11 }}>SAR</span>
      </span>
      <span>
        <StatusPill tone={s.status === 'active' ? 'success' : 'neutral'} size="sm">{s.status}</StatusPill>
      </span>
      <span style={{ justifySelf: 'end', color: 'var(--gl-fg-3)', display: 'flex' }}>
        <Icon name="chevRight" size={14} />
      </span>
    </div>
  );
}

function Stat({ label, value, accent }) {
  return (
    <div>
      <div style={{
        fontWeight: 700, fontSize: 9, letterSpacing: '0.1em',
        textTransform: 'uppercase', color: 'var(--gl-fg-3)',
      }}>{label}</div>
      <div style={{
        fontSize: 18, fontWeight: 600, color: accent || 'var(--gl-fg-1)',
        marginTop: 4,
      }}>{value}</div>
    </div>
  );
}

window.StoresList = StoresList;
