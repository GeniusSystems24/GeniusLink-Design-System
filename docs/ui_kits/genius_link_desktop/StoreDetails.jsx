/* global React, Page, Card, SectionHeader, Button, LockedField, Icon, StatusPill */
// Screen: Store Details

function StoreDetails({ onBack, onEdit, onDelete }) {
  const items = [
    { sku: 'STL-44021', name: 'Structural Steel I-Beam',  ar: 'كمرة فولاذية',       qty: 142, unit: 'PCS', cost: '450.00',    total: '63,900.00',  status: 'in-stock' },
    { sku: 'CMT-90112', name: 'Portland Cement Type I',   ar: 'إسمنت بورتلاند',     qty: 1820, unit: 'BAG', cost: '24.50',     total: '44,590.00',  status: 'in-stock' },
    { sku: 'AGG-21044', name: 'Coarse Aggregate 20mm',    ar: 'حصى خشن ٢٠ مم',     qty: 48,  unit: 'TON', cost: '125.00',    total: '6,000.00',   status: 'low' },
    { sku: 'RBR-71203', name: 'Reinforcement Bar #6',     ar: 'حديد تسليح ٦',       qty: 0,   unit: 'PCS', cost: '78.00',     total: '0.00',       status: 'out' },
    { sku: 'PLY-30022', name: 'Plywood Sheet 18mm',       ar: 'لوح خشب ١٨ مم',     qty: 312, unit: 'SHT', cost: '92.00',     total: '28,704.00',  status: 'in-stock' },
  ];

  const grid = '120px 1.7fr 0.7fr 0.5fr 0.9fr 1.1fr 100px';

  return (
    <Page
      breadcrumb={['Stores & Products', 'Stores', 'Details']}
      title="Downtown Central Store"
      titleArabic="متجر وسط المدينة"
      titleRight={
        <div style={{ display: 'flex', gap: 8 }}>
          <Button variant="secondary" icon="download">Export</Button>
          <Button variant="secondary" icon="edit" onClick={onEdit}>Edit</Button>
          <Button variant="danger" icon="trash" onClick={onDelete}>Delete</Button>
        </div>
      }>

      {/* KPIs */}
      <Card>
        <SectionHeader
          title="Store Summary"
          subtitle="Live snapshot of stock value and movement"
          marker="green"
          right={<StatusPill tone="success">Active</StatusPill>} />
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 16,
        }}>
          <StoreTile label="Total Stock Value" value="342,820.00" currency="SAR" highlight />
          <StoreTile label="SKUs" value="1,248" />
          <StoreTile label="Issues (30d)" value="184" sub="−54,892 SAR" subColor="#EF4444" />
          <StoreTile label="Receipts (30d)" value="92"  sub="+128,440 SAR" subColor="#1DB88A" />
        </div>
      </Card>

      {/* Identity */}
      <Card>
        <SectionHeader title="Store Information" marker="blue" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 24, rowGap: 20 }}>
          <LockedField label="Code" value="ST-001" mono />
          <LockedField label="Category" value="Retail" />
          <LockedField label="Name English" value="Downtown Central Store" />
          <LockedField label="Name Arabic" value="متجر وسط المدينة الرئيسي" dir="rtl" />
          <LockedField label="City" value="Riyadh" />
          <LockedField label="Manager" value="Khalid A. (ID: 21)" />
          <LockedField label="Default Currency" value="SAR — Saudi Riyal" />
          <LockedField label="Tenant ID" value="9" mono />
        </div>
      </Card>

      {/* Capacity + breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: 16, alignItems: 'start' }}>
        <Card>
          <SectionHeader title="Capacity" subtitle="Bin utilization" marker="orange" />
          <SDGauge used={1248} total={1800} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--gl-font-mono)', fontSize: 12, color: 'var(--gl-fg-3)' }}>
            <span>1,248 used</span><span>1,800 capacity</span>
          </div>
        </Card>
        <Card>
          <SectionHeader title="Stock by Category" subtitle="Value distribution at this store" marker="green" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { cat: 'Steel', val: 142400, pct: 42, c: '#4A7CFF' },
              { cat: 'Cement & Mortars', val: 88600, pct: 26, c: '#1DB88A' },
              { cat: 'Timber & Wood', val: 64200, pct: 19, c: '#F97316' },
              { cat: 'Finishing', val: 47620, pct: 13, c: '#38BDF8' },
            ].map((r) => (
              <div key={r.cat}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 5 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--gl-fg-1)' }}>{r.cat}</span>
                  <span style={{ fontFamily: 'var(--gl-font-mono)', fontSize: 12, color: 'var(--gl-fg-2)' }}>{r.val.toLocaleString()} <span style={{ color: 'var(--gl-fg-4)', fontSize: 10 }}>SAR</span></span>
                </div>
                <div style={{ height: 6, background: 'var(--gl-input-bg)', borderRadius: 999, overflow: 'hidden' }}>
                  <div style={{ width: `${r.pct}%`, height: '100%', background: r.c, borderRadius: 999 }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Stock table */}
      <Card padding={0}>
        <div style={{ padding: '20px 24px 0' }}>
          <SectionHeader
            title="Stock On Hand"
            subtitle="Real-time inventory across all SKUs at this store"
            marker="green"
            right={
              <div style={{ display: 'flex', gap: 8 }}>
                <Button variant="ghost" icon="search">Search SKU</Button>
                <Button variant="ghost" icon="chevRight">Open Full Inventory</Button>
              </div>
            } />
        </div>
        <div style={{ padding: '20px 24px 24px' }}>
          <div style={{
            display: 'grid', gridTemplateColumns: grid, gap: 12,
            padding: '0 0 12px',
            borderBottom: '1px solid var(--gl-border)',
            fontWeight: 700, fontSize: 10, letterSpacing: '0.05em',
            textTransform: 'uppercase', color: 'var(--gl-fg-3)',
          }}>
            <span>SKU</span><span>Product</span>
            <span style={{ textAlign: 'right' }}>Qty</span>
            <span>Unit</span>
            <span style={{ textAlign: 'right' }}>Unit Cost</span>
            <span style={{ textAlign: 'right' }}>Total Value</span>
            <span>Status</span>
          </div>
          {items.map((it, i) => (
            <div key={i} style={{
              display: 'grid', gridTemplateColumns: grid, gap: 12,
              padding: '14px 0', alignItems: 'center',
              borderBottom: i < items.length - 1 ? '1px solid var(--gl-border)' : 'none',
              fontSize: 13, color: 'var(--gl-fg-1)',
            }}>
              <span style={{ fontFamily: 'var(--gl-font-mono)', color: 'var(--gl-fg-2)' }}>{it.sku}</span>
              <span>
                <div style={{ fontWeight: 600 }}>{it.name}</div>
                <div dir="rtl" style={{
                  fontFamily: 'var(--gl-font-arabic)', fontSize: 12,
                  color: 'var(--gl-fg-3)', marginTop: 2,
                }}>{it.ar}</div>
              </span>
              <span style={{
                fontFamily: 'var(--gl-font-mono)', textAlign: 'right', fontWeight: 600,
                color: it.qty === 0 ? '#EF4444' : (it.status === 'low' ? '#F97316' : 'var(--gl-fg-1)'),
              }}>{it.qty.toLocaleString()}</span>
              <span style={{ color: 'var(--gl-fg-3)', fontFamily: 'var(--gl-font-mono)', fontSize: 11 }}>{it.unit}</span>
              <span style={{ fontFamily: 'var(--gl-font-mono)', textAlign: 'right', color: 'var(--gl-fg-2)' }}>{it.cost}</span>
              <span style={{ fontFamily: 'var(--gl-font-mono)', textAlign: 'right', fontWeight: 600 }}>{it.total}</span>
              <span>
                {it.status === 'in-stock' && <StatusPill tone="success" size="sm">In Stock</StatusPill>}
                {it.status === 'low'      && <StatusPill tone="warning" size="sm">Low</StatusPill>}
                {it.status === 'out'      && <StatusPill tone="danger"  size="sm">Out</StatusPill>}
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* Recent movements at this store */}
      <Card padding={0}>
        <div style={{ padding: '20px 24px 0' }}>
          <SectionHeader title="Recent Movements" subtitle="Latest stock activity at this store" marker="orange"
            right={<Button variant="ghost" icon="chevRight">View All</Button>} />
        </div>
        <div style={{ padding: '16px 24px 24px' }}>
          {[
            { ref: 'INV-REC-0241', type: 'Receive', tone: 'success', qty: '+32', when: '2h ago' },
            { ref: 'INV-ISS-0089', type: 'Issue', tone: 'danger', qty: '−12', when: '5h ago' },
            { ref: 'INV-TRF-0117', type: 'Transfer Out', tone: 'info', qty: '−18', when: 'Yesterday' },
            { ref: 'INV-ADJ-0058', type: 'Adjustment', tone: 'warning', qty: '−2', when: '2 days' },
          ].map((m, i, a) => (
            <div key={m.ref} style={{
              display: 'grid', gridTemplateColumns: '160px 150px 1fr 90px', gap: 12, padding: '13px 0', alignItems: 'center',
              borderBottom: i < a.length - 1 ? '1px solid var(--gl-border)' : 'none', fontSize: 13,
            }}>
              <span style={{ fontFamily: 'var(--gl-font-mono)', color: '#4A7CFF', fontSize: 12 }}>{m.ref}</span>
              <span><StatusPill tone={m.tone} size="sm">{m.type}</StatusPill></span>
              <span style={{ fontFamily: 'var(--gl-font-mono)', fontWeight: 600, color: m.qty.startsWith('+') ? '#1DB88A' : '#EF4444' }}>{m.qty}</span>
              <span style={{ fontFamily: 'var(--gl-font-mono)', fontSize: 11, textAlign: 'right', color: 'var(--gl-fg-3)' }}>{m.when}</span>
            </div>
          ))}
        </div>
      </Card>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Button variant="secondary" icon="back" onClick={onBack}>Back to List</Button>
      </div>
    </Page>
  );
}

function SDGauge({ used, total }) {
  const pct = total ? Math.min(100, Math.round((used / total) * 100)) : 0;
  const tone = pct >= 90 ? '#EF4444' : (pct >= 70 ? '#F97316' : '#1DB88A');
  const dash = (pct / 100) * 251.3;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <div style={{ position: 'relative', width: 96, height: 96, flexShrink: 0 }}>
        <svg width="96" height="96" viewBox="0 0 96 96" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="48" cy="48" r="40" fill="none" stroke="var(--gl-input-bg)" strokeWidth="10" />
          <circle cx="48" cy="48" r="40" fill="none" stroke={tone} strokeWidth="10" strokeLinecap="round" strokeDasharray={`${dash} 251.3`} />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontFamily: 'var(--gl-font-mono)', fontSize: 22, fontWeight: 700, color: tone }}>{pct}%</span>
        </div>
      </div>
      <div style={{ fontSize: 12, color: 'var(--gl-fg-3)', lineHeight: 1.6 }}>
        <div style={{ color: tone, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: 10 }}>{pct >= 90 ? 'Near full' : (pct >= 70 ? 'Filling up' : 'Healthy')}</div>
        <div>{(total - used).toLocaleString()} units free</div>
      </div>
    </div>
  );
}

function StoreTile({ label, value, currency, sub, subColor, highlight }) {
  return (
    <div style={{
      padding: 20,
      background: highlight ? 'rgba(29,184,138,0.08)' : 'var(--gl-bg)',
      border: `1px solid ${highlight ? 'rgba(29,184,138,0.3)' : 'var(--gl-border)'}`,
      borderRadius: 6,
    }}>
      <div style={{
        fontWeight: 700, fontSize: 10, letterSpacing: '0.08em',
        textTransform: 'uppercase', color: 'var(--gl-fg-3)', marginBottom: 8,
      }}>{label}</div>
      <div style={{
        fontFamily: 'var(--gl-font-mono)', fontSize: 22, fontWeight: 600,
        color: highlight ? '#1DB88A' : 'var(--gl-fg-1)',
        lineHeight: 1.1, letterSpacing: '-0.01em',
      }}>{value}</div>
      {currency && (
        <div style={{
          fontFamily: 'var(--gl-font-mono)', fontSize: 10,
          color: 'var(--gl-fg-3)', marginTop: 4,
        }}>{currency}</div>
      )}
      {sub && (
        <div style={{
          fontFamily: 'var(--gl-font-mono)', fontSize: 11,
          color: subColor || 'var(--gl-fg-3)', marginTop: 6, fontWeight: 600,
        }}>{sub}</div>
      )}
    </div>
  );
}

window.StoreDetails = StoreDetails;
