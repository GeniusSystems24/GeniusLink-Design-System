/* global React, Page, Card, SectionHeader, Button, Icon, StatusPill */
// Screen: Stock Transfer List — all transfers with status filters + date range

const TRANSFERS = [
  { ref: 'INV-TRF-2024-0117', from: 'ST-001 Downtown', to: 'ST-002 King Fahd',  items: 2,  value: '20,970.00', date: 'Dec 14, 2025', status: 'in-transit' },
  { ref: 'INV-TRF-2024-0116', from: 'ST-002 King Fahd', to: 'ST-003 Jeddah',   items: 8,  value: '48,200.00', date: 'Dec 12, 2025', status: 'delivered' },
  { ref: 'INV-TRF-2024-0115', from: 'ST-004 Dammam',   to: 'ST-001 Downtown', items: 4,  value: '12,840.00', date: 'Dec 10, 2025', status: 'delivered' },
  { ref: 'INV-TRF-2024-0114', from: 'ST-001 Downtown', to: 'ST-005 Madinah',   items: 1,  value: '5,400.00',  date: 'Dec 09, 2025', status: 'draft' },
  { ref: 'INV-TRF-2024-0113', from: 'ST-002 King Fahd', to: 'ST-001 Downtown', items: 12, value: '88,400.00', date: 'Dec 07, 2025', status: 'delivered' },
  { ref: 'INV-TRF-2024-0112', from: 'ST-003 Jeddah',   to: 'ST-002 King Fahd', items: 3,  value: '14,200.00', date: 'Dec 05, 2025', status: 'cancelled' },
  { ref: 'INV-TRF-2024-0111', from: 'ST-001 Downtown', to: 'ST-004 Dammam',   items: 6,  value: '32,180.00', date: 'Dec 03, 2025', status: 'delivered' },
];

const FILTERS = [
  { id: 'all',        label: 'All',        tone: 'neutral' },
  { id: 'draft',      label: 'Draft',      tone: 'neutral' },
  { id: 'in-transit', label: 'In Transit', tone: 'warning' },
  { id: 'delivered',  label: 'Delivered',  tone: 'success' },
  { id: 'cancelled',  label: 'Cancelled',  tone: 'danger' },
];

function StockTransferList({ onCreate, onOpen }) {
  const [status, setStatus] = React.useState('all');
  const [from, setFrom] = React.useState('12/01/2025');
  const [to, setTo] = React.useState('12/31/2025');
  const [query, setQuery] = React.useState('');

  const visible = TRANSFERS.filter(t => {
    if (status !== 'all' && t.status !== status) return false;
    if (query) {
      const q = query.toLowerCase();
      if (!t.ref.toLowerCase().includes(q) && !t.from.toLowerCase().includes(q) && !t.to.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const counts = FILTERS.reduce((m, f) => {
    m[f.id] = f.id === 'all' ? TRANSFERS.length : TRANSFERS.filter(t => t.status === f.id).length;
    return m;
  }, {});

  const totalValue = visible.reduce((s, t) => s + parseFloat(t.value.replace(/,/g, '')), 0);

  return (
    <Page breadcrumb={['Commercial', 'Inventory', 'Transfers']} title="Stock Transfers"
      titleRight={<Button variant="primary" icon="plus" onClick={onCreate}>New Transfer</Button>}>

      {/* Filters bar */}
      <Card padding={20}>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: 4, background: 'var(--gl-input-bg)', padding: 4, borderRadius: 6, border: '1px solid var(--gl-border)' }}>
            {FILTERS.map(f => {
              const isActive = status === f.id;
              const colors = { neutral: 'var(--gl-fg-2)', warning: '#F97316', success: '#1DB88A', danger: '#EF4444' };
              return (
                <button key={f.id} onClick={() => setStatus(f.id)} style={{
                  padding: '7px 14px', borderRadius: 4,
                  background: isActive ? 'var(--gl-surface)' : 'transparent',
                  color: isActive ? colors[f.tone] : 'var(--gl-fg-3)',
                  border: 'none', cursor: 'pointer',
                  fontFamily: 'var(--gl-font-body)', fontWeight: 700,
                  fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase',
                  boxShadow: isActive ? '0 1px 2px rgba(0,0,0,0.2)' : 'none',
                  display: 'flex', gap: 8, alignItems: 'center',
                }}>
                  {f.label}
                  <span style={{
                    fontFamily: 'var(--gl-font-mono)', fontSize: 10, fontWeight: 700,
                    padding: '2px 6px', borderRadius: 999,
                    background: isActive ? `${colors[f.tone]}26` : 'var(--gl-input-bg)',
                    color: isActive ? colors[f.tone] : 'var(--gl-fg-3)',
                  }}>{counts[f.id]}</span>
                </button>
              );
            })}
          </div>

          {/* Date range */}
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <DateField label="From" value={from} onChange={setFrom} />
            <span style={{ color: 'var(--gl-fg-3)', fontWeight: 700, fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase' }}>to</span>
            <DateField label="To" value={to} onChange={setTo} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 16, marginTop: 16, alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ position: 'relative', flex: '0 0 320px' }}>
            <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--gl-fg-3)', display: 'flex', pointerEvents: 'none' }}>
              <Icon name="search" size={14} />
            </div>
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by reference or store…"
              style={{ width: '100%', height: 36, padding: '0 16px 0 40px', background: 'var(--gl-input-bg)', border: '1px solid var(--gl-border-strong)', borderRadius: 4, fontFamily: 'var(--gl-font-body)', fontSize: 13, color: 'var(--gl-fg-1)', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div style={{ display: 'flex', gap: 24 }}>
            <Summary label="Transfers" value={visible.length} />
            <Summary label="Value SAR" value={totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} accent="#1DB88A" />
          </div>
        </div>
      </Card>

      {/* List */}
      <Card padding={0}>
        <div style={{ padding: '20px 24px 0' }}>
          <SectionHeader title={`${visible.length} Transfer${visible.length === 1 ? '' : 's'}`}
                         subtitle={`${from} → ${to}`} marker="blue" />
        </div>
        <div style={{ padding: '20px 24px 24px' }}>
          <div style={{
            display: 'grid', gridTemplateColumns: '170px 1fr 1fr 70px 130px 110px 110px 40px', gap: 12,
            padding: '0 0 12px', borderBottom: '1px solid var(--gl-border)',
            fontWeight: 700, fontSize: 10, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--gl-fg-3)',
          }}>
            <span>Reference</span><span>From Store</span><span>To Store</span>
            <span style={{ textAlign: 'right' }}>Items</span>
            <span style={{ textAlign: 'right' }}>Value SAR</span>
            <span>Date</span><span>Status</span><span></span>
          </div>
          {visible.map((t) => <TransferRow key={t.ref} t={t} onClick={() => onOpen && onOpen(t)} />)}
          {visible.length === 0 && (
            <div style={{ padding: '48px 0', textAlign: 'center', color: 'var(--gl-fg-3)', fontSize: 13 }}>
              No transfers match the current filters.
            </div>
          )}
        </div>
      </Card>
    </Page>
  );
}

function TransferRow({ t, onClick }) {
  const [hover, setHover] = React.useState(false);
  const tone = t.status === 'delivered' ? 'success'
              : (t.status === 'in-transit' ? 'warning'
              : (t.status === 'cancelled' ? 'danger' : 'neutral'));
  const label = t.status === 'in-transit' ? 'In Transit'
              : (t.status[0].toUpperCase() + t.status.slice(1));
  return (
    <div onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        display: 'grid', gridTemplateColumns: '170px 1fr 1fr 70px 130px 110px 110px 40px', gap: 12,
        padding: '14px 8px', margin: '0 -8px', alignItems: 'center',
        borderBottom: '1px solid var(--gl-border)',
        background: hover ? 'var(--gl-hover)' : 'transparent', borderRadius: 4, cursor: 'pointer',
        fontSize: 13, color: 'var(--gl-fg-1)',
      }}>
      <span style={{ fontFamily: 'var(--gl-font-mono)', color: '#4A7CFF', fontSize: 12 }}>{t.ref}</span>
      <span style={{ color: 'var(--gl-fg-2)' }}>{t.from}</span>
      <span style={{ color: 'var(--gl-fg-2)' }}>{t.to}</span>
      <span style={{ fontFamily: 'var(--gl-font-mono)', textAlign: 'right' }}>{t.items}</span>
      <span style={{ fontFamily: 'var(--gl-font-mono)', textAlign: 'right', fontWeight: 600 }}>{t.value}</span>
      <span style={{ fontFamily: 'var(--gl-font-mono)', fontSize: 12, color: 'var(--gl-fg-3)' }}>{t.date}</span>
      <span><StatusPill tone={tone} size="sm">{label}</StatusPill></span>
      <span style={{ justifySelf: 'end', color: 'var(--gl-fg-3)', display: 'flex' }}><Icon name="chevRight" size={14} /></span>
    </div>
  );
}

function DateField({ label, value, onChange }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8, padding: '0 12px',
      background: 'var(--gl-input-bg)', border: '1px solid var(--gl-border-strong)',
      borderRadius: 4, height: 36,
    }}>
      <Icon name="clock" size={13} color="var(--gl-fg-3)" />
      <span style={{
        fontWeight: 700, fontSize: 10, letterSpacing: '0.08em',
        textTransform: 'uppercase', color: 'var(--gl-fg-3)',
      }}>{label}</span>
      <input value={value} onChange={(e) => onChange(e.target.value)}
        style={{
          background: 'transparent', border: 'none', outline: 'none',
          fontFamily: 'var(--gl-font-mono)', fontSize: 12, color: 'var(--gl-fg-1)',
          width: 96, padding: 0,
        }} />
    </div>
  );
}

function Summary({ label, value, accent }) {
  return (
    <div>
      <div style={{ fontWeight: 700, fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--gl-fg-3)' }}>{label}</div>
      <div style={{ fontSize: 18, fontWeight: 600, color: accent || 'var(--gl-fg-1)', marginTop: 4, fontFamily: 'var(--gl-font-mono)' }}>{value}</div>
    </div>
  );
}

window.StockTransferList = StockTransferList;
