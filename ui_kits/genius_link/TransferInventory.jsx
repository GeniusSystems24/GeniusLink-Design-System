/* global React, Page, Card, SectionHeader, Field, Textarea, Button, IconBtn, Icon */
// Screen: Transfer Inventory — move stock between stores

function TransferInventory({ onCancel, onCreate }) {
  const { Static, SelectField, ItemsTable, UploadDropzone } = window._invShared;
  const [items, setItems] = React.useState([
    { product: 'Coarse Aggregate 20mm',    unit: 'TON', qty: 18, price: 125.00, freeQty: 0, expDate: '' },
    { product: 'Reinforcement Bar #6',     unit: 'PCS', qty: 240, price: 78.00, freeQty: 0, expDate: '' },
  ]);
  const [note, setNote] = React.useState('');

  const subtotal = items.reduce((s, it) => s + (it.qty * it.price), 0);
  const totalQty = items.reduce((s, it) => s + Number(it.qty || 0), 0);

  return (
    <Page
      breadcrumb={['Commercial', 'Inventory', 'Transfer']}
      title="Transfer Inventory">

      {/* Header row */}
      <Card padding={20}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <Static label="Serial No" value="INV-TRF-2024-0117" mono locked />
          <SelectField label="Currency" value="SAR — Saudi Riyal"
                       options={['SAR — Saudi Riyal', 'USD — US Dollar']} />
        </div>
      </Card>

      {/* Source → Destination — the unique pattern for transfers */}
      <Card>
        <SectionHeader
          title="Source &amp; Destination"
          subtitle="Stock moves from one store to another within the same tenant"
          marker="blue" />
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 56px 1fr', gap: 24,
          alignItems: 'center',
        }}>
          <StoreCard
            tone="orange"
            label="From Store"
            store="ST-001 · Downtown Central"
            ar="متجر وسط المدينة"
            city="Riyadh"
            stockAfter="−54,892 SAR" />

          <div style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            height: 56,
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: 999,
              background: '#4A7CFF',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#FFFFFF',
              boxShadow: '0 8px 24px -6px rgba(74,124,255,0.4)',
            }}>
              <Icon name="chevRight" size={18} />
            </div>
          </div>

          <StoreCard
            tone="green"
            label="To Store"
            store="ST-002 · King Fahd Warehouse"
            ar="مستودع الملك فهد"
            city="Riyadh"
            stockAfter="+54,892 SAR" />
        </div>
      </Card>

      {/* Items */}
      <Card>
        <SectionHeader
          title="Inventory Items"
          subtitle={`${items.length} line${items.length === 1 ? '' : 's'} · ${totalQty.toLocaleString()} units in transit`}
          marker="green" />
        <ItemsTable items={items} onChange={setItems} variant="receive" />
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          paddingTop: 8,
        }}>
          <div style={{ fontSize: 12, color: 'var(--gl-fg-3)', fontStyle: 'italic' }}>
            To add a new row, simply start entering data in the last empty row.
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{
              fontWeight: 700, fontSize: 10, letterSpacing: '0.08em',
              textTransform: 'uppercase', color: 'var(--gl-fg-3)',
            }}>Total Value in Transit</div>
            <div style={{
              fontFamily: 'var(--gl-font-mono)', fontSize: 22, fontWeight: 600,
              color: 'var(--gl-fg-1)', marginTop: 4,
            }}>{subtotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              <span style={{ fontSize: 12, color: 'var(--gl-fg-3)', fontWeight: 400, marginLeft: 8 }}>SAR</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Logistics */}
      <Card>
        <SectionHeader title="Logistics &amp; Tracking" marker="blue" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24 }}>
          <Field label="Vehicle / Carrier" placeholder="e.g. Plate 4892-RKD" />
          <Field label="Driver Name" placeholder="e.g. Mohammed S." />
          <Field label="Expected Arrival" placeholder="mm/dd/yyyy" mono />
        </div>
      </Card>

      {/* Notes & docs */}
      <Card>
        <SectionHeader title="Documentation &amp; Compliance" marker="orange" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <Textarea label="Transfer Notes"
                    placeholder="Reason for transfer, special handling, or destination instructions…"
                    value={note} onChange={setNote} rows={5} />
          <div>
            <div style={{
              fontWeight: 700, fontSize: 11, letterSpacing: '0.05em',
              textTransform: 'uppercase', color: 'var(--gl-fg-2)', marginBottom: 8,
            }}>Transfer Documents</div>
            <UploadDropzone label="Bill of Lading · Gate Pass · Photos" />
          </div>
        </div>
      </Card>

      <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
        <Button variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button variant="primary" icon="check" onClick={onCreate}>Transfer Inventory</Button>
      </div>
    </Page>
  );
}

/* The colored store card on each side of the arrow.
   Source uses orange (outflow), destination uses green (inflow). */
function StoreCard({ tone, label, store, ar, city, stockAfter }) {
  const colors = {
    orange: { marker: '#F97316', bg: 'rgba(249,115,22,0.06)', border: 'rgba(249,115,22,0.25)', deltaColor: '#EF4444' },
    green:  { marker: '#1DB88A', bg: 'rgba(29,184,138,0.06)', border: 'rgba(29,184,138,0.25)', deltaColor: '#1DB88A' },
  };
  const c = colors[tone];
  return (
    <div style={{
      padding: 20,
      background: c.bg,
      border: `1px solid ${c.border}`,
      borderRadius: 6,
      display: 'flex', gap: 14,
    }}>
      <div style={{
        width: 4, alignSelf: 'stretch', borderRadius: 12,
        background: c.marker,
      }} />
      <div style={{ flex: 1 }}>
        <div style={{
          fontWeight: 700, fontSize: 10, letterSpacing: '0.1em',
          textTransform: 'uppercase', color: c.marker, marginBottom: 8,
        }}>{label}</div>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--gl-fg-1)' }}>{store}</div>
        <div dir="rtl" style={{
          fontFamily: 'var(--gl-font-arabic)', fontSize: 12,
          color: 'var(--gl-fg-3)', marginTop: 2,
        }}>{ar}</div>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginTop: 12, paddingTop: 12,
          borderTop: '1px solid var(--gl-border)',
        }}>
          <span style={{ fontSize: 11, color: 'var(--gl-fg-3)' }}>{city}</span>
          <span style={{
            fontFamily: 'var(--gl-font-mono)', fontSize: 12, fontWeight: 600,
            color: c.deltaColor,
          }}>{stockAfter}</span>
        </div>
      </div>
    </div>
  );
}

window.TransferInventory = TransferInventory;
