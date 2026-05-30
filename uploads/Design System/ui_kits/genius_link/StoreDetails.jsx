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
          <Tile label="Total Stock Value" value="342,820.00" currency="SAR" highlight />
          <Tile label="SKUs" value="1,248" />
          <Tile label="Issues (30d)" value="184" sub="−54,892 SAR" subColor="#EF4444" />
          <Tile label="Receipts (30d)" value="92"  sub="+128,440 SAR" subColor="#1DB88A" />
        </div>
      </Card>

      {/* Identity */}
      <Card>
        <SectionHeader title="Store Information" marker="blue" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, rowGap: 20 }}>
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

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Button variant="secondary" icon="back" onClick={onBack}>Back to List</Button>
      </div>
    </Page>
  );
}

function Tile({ label, value, currency, sub, subColor, highlight }) {
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
