/* global React, Page, Card, SectionHeader, Button, Icon, StatusPill */
// Screen: Stores List

function StoresList({ onCreate, onOpenStore }) {
  const [query, setQuery] = React.useState('');
  const [typeF, setTypeF] = React.useState('all');
  const [statusF, setStatusF] = React.useState('all');

  const stores = [
    { code: 'ST-001', name: 'Downtown Central Store',  ar: 'متجر وسط المدينة',     city: 'Riyadh',    type: 'Retail',             items: 1248, value: '342,820.00',   capacity: 1800, manager: 'Layla Ahmed',     status: 'active' },
    { code: 'ST-002', name: 'King Fahd Warehouse',     ar: 'مستودع الملك فهد',    city: 'Riyadh',    type: 'Warehouse',          items: 4892, value: '1,820,460.00', capacity: 6000, manager: 'Mohammed Saleh',   status: 'active' },
    { code: 'ST-003', name: 'Jeddah Showroom',         ar: 'صالة عرض جدة',         city: 'Jeddah',    type: 'Showroom',           items: 412,  value: '128,640.00',   capacity: 600,  manager: 'Sara Al-Otaibi',   status: 'active' },
    { code: 'ST-004', name: 'Dammam Distribution',     ar: 'توزيع الدمام',         city: 'Dammam',    type: 'Distribution Center', items: 2104, value: '624,180.00',   capacity: 2400, manager: 'Khalid Al-Rashid',  status: 'active' },
    { code: 'ST-005', name: 'Madinah Outlet',          ar: 'منفذ المدينة',         city: 'Madinah',   type: 'Retail',             items: 0,    value: '0.00',         capacity: 500,  manager: '— Unassigned —',     status: 'draft' },
  ];

  const types = ['all', ...Array.from(new Set(stores.map(s => s.type)))];
  const visible = stores.filter((s) => {
    if (typeF !== 'all' && s.type !== typeF) return false;
    if (statusF !== 'all' && s.status !== statusF) return false;
    if (!query) return true;
    const q = query.toLowerCase();
    return s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q) || s.ar.includes(query);
  });
  const totalCap = stores.reduce((a, s) => a + (s.capacity || 0), 0);
  const totalUsed = stores.reduce((a, s) => a + s.items, 0);
  const utilPct = totalCap ? Math.round((totalUsed / totalCap) * 100) : 0;

  const grid = '92px 1.6fr 1fr 1.2fr 110px 1.1fr 1.1fr 90px 30px';

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
            <Stat label="Total SKUs" value={totalUsed.toLocaleString()} />
            <Stat label="Utilization" value={`${utilPct}%`} accent={utilPct >= 85 ? '#F97316' : '#4A7CFF'} />
          </div>
        </div>

        {/* filter chips */}
        <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', alignItems: 'center', marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--gl-border)' }}>
          <ChipGroupSL legend="Type" value={typeF} onChange={setTypeF}
            options={types.map(t => ({ id: t, label: t === 'all' ? 'All' : t }))} />
          <span style={{ width: 1, alignSelf: 'stretch', background: 'var(--gl-border)' }} />
          <ChipGroupSL legend="Status" value={statusF} onChange={setStatusF}
            options={[{ id: 'all', label: 'All' }, { id: 'active', label: 'Active', color: '#1DB88A' }, { id: 'draft', label: 'Draft', color: '#8D90A0' }]} />
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
            <span style={{ textAlign: 'right' }}>Stock Value</span>
            <span>Capacity</span><span>Manager</span>
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
  const cap = s.capacity || 0;
  const usedPct = cap ? Math.min(100, Math.round((s.items / cap) * 100)) : 0;
  const capTone = usedPct >= 90 ? '#EF4444' : (usedPct >= 70 ? '#F97316' : '#1DB88A');
  const initials = (s.manager || '').split(' ').slice(0, 2).map(p => p[0]).join('').toUpperCase();
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'grid', gridTemplateColumns: grid, gap: 12,
        padding: '16px 8px', alignItems: 'center',
        borderBottom: '1px solid var(--gl-border)',
        background: hover ? 'var(--gl-hover)' : 'transparent',
        margin: '0 -8px', borderRadius: 4, cursor: 'pointer',
        fontSize: 13, color: 'var(--gl-fg-1)',
        transition: 'background 150ms ease',
      }}>
      <span style={{ fontFamily: 'var(--gl-font-mono)', color: 'var(--gl-fg-2)' }}>{s.code}</span>
      <span>
        <div style={{ fontWeight: 600 }}>{s.name}</div>
        <div dir="rtl" style={{ fontFamily: 'var(--gl-font-arabic)', fontSize: 12, color: 'var(--gl-fg-3)', marginTop: 2 }}>{s.ar}</div>
      </span>
      <span style={{ color: 'var(--gl-fg-2)' }}>{s.city}</span>
      <span style={{ color: 'var(--gl-fg-2)' }}>{s.type}</span>
      <span style={{ fontFamily: 'var(--gl-font-mono)', textAlign: 'right', fontWeight: 600 }}>
        {s.value} <span style={{ color: 'var(--gl-fg-3)', fontWeight: 400, fontSize: 11 }}>SAR</span>
      </span>
      <span>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--gl-font-mono)', fontSize: 11, color: 'var(--gl-fg-3)', marginBottom: 4 }}>
          <span>{s.items.toLocaleString()} <span style={{ color: 'var(--gl-fg-4)' }}>/ {cap.toLocaleString()}</span></span>
          <span style={{ color: capTone, fontWeight: 600 }}>{usedPct}%</span>
        </div>
        <div style={{ height: 5, background: 'var(--gl-input-bg)', borderRadius: 999, overflow: 'hidden' }}>
          <div style={{ width: `${usedPct}%`, height: '100%', background: capTone, borderRadius: 999 }} />
        </div>
      </span>
      <span style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
        <span style={{
          width: 26, height: 26, borderRadius: 999, flexShrink: 0,
          background: s.status === 'draft' ? 'var(--gl-input-bg)' : 'rgba(74,124,255,0.18)',
          color: s.status === 'draft' ? 'var(--gl-fg-3)' : '#4A7CFF',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 700, fontSize: 10, letterSpacing: '0.02em',
        }}>{initials || '—'}</span>
        <span style={{ fontSize: 12, color: 'var(--gl-fg-2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.manager}</span>
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

function ChipGroupSL({ legend, value, onChange, options }) {
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
      <span style={{ fontWeight: 700, fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--gl-fg-4)' }}>{legend}</span>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {options.map((o) => {
          const on = value === o.id;
          const c = o.color || '#4A7CFF';
          return (
            <button key={o.id} type="button" onClick={() => onChange(o.id)} style={{
              display: 'inline-flex', alignItems: 'center', gap: 6, height: 28, padding: '0 12px', borderRadius: 999,
              cursor: 'pointer', fontFamily: 'var(--gl-font-body)', fontWeight: 700, fontSize: 11, letterSpacing: '0.02em',
              background: on ? `${c}1F` : 'transparent',
              border: `1px solid ${on ? c : 'var(--gl-border)'}`,
              color: on ? c : 'var(--gl-fg-2)', transition: 'all 120ms ease',
            }}>
              {o.color && <span style={{ width: 7, height: 7, borderRadius: 999, background: o.color }} />}
              {o.label}
            </button>
          );
        })}
      </div>
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
