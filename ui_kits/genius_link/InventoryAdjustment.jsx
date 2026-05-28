/* global React, Page, Card, SectionHeader, Field, Textarea, Button, IconBtn, Icon, StatusPill */
// Screen: Inventory Adjustment — physical stock-take reconciliation

function InventoryAdjustment({ onCancel, onCreate }) {
  const { Static, SelectField, UploadDropzone } = window._invShared;
  const [items, setItems] = React.useState([
    { sku: 'STL-44021', name: 'Structural Steel I-Beam',  unit: 'PCS', system: 142, counted: 140, cost: 450.00,  reason: 'Damaged · 2 units' },
    { sku: 'CMT-90112', name: 'Portland Cement Type I',   unit: 'BAG', system: 1820, counted: 1834, cost: 24.50, reason: 'Receiving miscount · +14' },
    { sku: 'AGG-21044', name: 'Coarse Aggregate 20mm',    unit: 'TON', system: 48, counted: 46, cost: 125.00,    reason: 'Spillage · 2 tons' },
  ]);
  const [note, setNote] = React.useState('');

  const totalDelta = items.reduce((s, it) => s + ((it.counted - it.system) * it.cost), 0);

  return (
    <Page
      breadcrumb={['Commercial', 'Inventory', 'Adjustment']}
      title="Inventory Adjustment">

      <Card padding={20}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 24 }}>
          <Static label="Serial No" value="INV-ADJ-2024-0058" mono locked />
          <SelectField label="Reason" value="Physical Stock Count"
                       options={['Physical Stock Count', 'Damage / Loss', 'System Correction', 'Theft / Shrinkage']} />
          <Field label="Store" placeholder="Search store…" required />
          <Field label="Count Date" placeholder="mm/dd/yyyy" mono />
        </div>
      </Card>

      {/* Variance summary */}
      <Card>
        <SectionHeader
          title="Variance Summary"
          subtitle="Net financial impact of this stock reconciliation"
          marker="orange" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
          <Tile label="Lines Adjusted" value={items.length} />
          <Tile label="Items Lost" value={items.filter(it => it.counted < it.system).length}
                color="#EF4444" />
          <Tile label="Net Adjustment" value={fmt(totalDelta)}
                color={totalDelta >= 0 ? '#1DB88A' : '#EF4444'}
                currency="SAR"
                big />
        </div>
      </Card>

      {/* Lines */}
      <Card padding={0}>
        <div style={{ padding: '20px 24px 0' }}>
          <SectionHeader title="Adjustment Lines" marker="green" />
        </div>
        <div style={{ padding: '16px 24px 24px' }}>
          <AdjustmentTable items={items} onChange={setItems} />
        </div>
      </Card>

      <Card>
        <SectionHeader title="Documentation &amp; Approval" marker="orange" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <Textarea label="Adjustment Notes"
                    placeholder="Auditor name, witness, count session reference…"
                    value={note} onChange={setNote} rows={5} />
          <div>
            <div style={{
              fontWeight: 700, fontSize: 11, letterSpacing: '0.05em',
              textTransform: 'uppercase', color: 'var(--gl-fg-2)', marginBottom: 8,
            }}>Count Sheet &amp; Photos</div>
            <UploadDropzone label="Signed count sheet · Damage photos" />
          </div>
        </div>
        <div style={{
          display: 'flex', gap: 12, padding: '14px 16px',
          background: 'rgba(249,115,22,0.08)',
          border: '1px solid rgba(249,115,22,0.25)',
          borderRadius: 4,
          fontSize: 12, color: 'var(--gl-fg-2)', lineHeight: 1.5,
        }}>
          <span style={{ color: '#F97316', flexShrink: 0 }}>
            <Icon name="info" size={14} />
          </span>
          <span>Adjustments above 1,000 SAR require dual approval. This entry will post to the audit log immediately and notify the controller.</span>
        </div>
      </Card>

      <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
        <Button variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button variant="primary" icon="check" onClick={onCreate}>Post Adjustment</Button>
      </div>
    </Page>
  );
}

function AdjustmentTable({ items, onChange }) {
  const cols = '110px 1.6fr 0.6fr 0.8fr 0.8fr 0.9fr 0.9fr 1.4fr 40px';
  return (
    <div>
      <div style={{
        display: 'grid', gridTemplateColumns: cols, gap: 10,
        padding: '0 0 12px',
        fontWeight: 700, fontSize: 10, letterSpacing: '0.05em',
        textTransform: 'uppercase', color: 'var(--gl-fg-3)',
        borderBottom: '1px solid var(--gl-border)',
      }}>
        <span>SKU</span><span>Product</span><span>Unit</span>
        <span style={{ textAlign: 'right' }}>System</span>
        <span style={{ textAlign: 'right' }}>Counted</span>
        <span style={{ textAlign: 'right' }}>Δ Qty</span>
        <span style={{ textAlign: 'right' }}>Δ Value</span>
        <span>Reason</span><span></span>
      </div>
      {items.map((it, i) => {
        const delta = it.counted - it.system;
        const dValue = delta * it.cost;
        const positive = delta > 0;
        const negative = delta < 0;
        const tone = negative ? '#EF4444' : (positive ? '#1DB88A' : 'var(--gl-fg-2)');
        return (
          <div key={i} style={{
            display: 'grid', gridTemplateColumns: cols, gap: 10,
            padding: '14px 0', alignItems: 'center',
            borderBottom: i < items.length - 1 ? '1px solid var(--gl-border)' : 'none',
            fontSize: 13, color: 'var(--gl-fg-1)',
          }}>
            <span style={{ fontFamily: 'var(--gl-font-mono)', color: 'var(--gl-fg-2)' }}>{it.sku}</span>
            <span style={{ fontWeight: 600 }}>{it.name}</span>
            <span style={{ fontFamily: 'var(--gl-font-mono)', fontSize: 11, color: 'var(--gl-fg-3)' }}>{it.unit}</span>
            <span style={{ fontFamily: 'var(--gl-font-mono)', textAlign: 'right', color: 'var(--gl-fg-2)' }}>{it.system}</span>
            <span style={{ fontFamily: 'var(--gl-font-mono)', textAlign: 'right', fontWeight: 600 }}>{it.counted}</span>
            <span style={{
              fontFamily: 'var(--gl-font-mono)', textAlign: 'right',
              fontWeight: 600, color: tone,
            }}>{positive ? '+' : ''}{delta}</span>
            <span style={{
              fontFamily: 'var(--gl-font-mono)', textAlign: 'right',
              fontWeight: 600, color: tone,
            }}>{positive ? '+' : ''}{fmt(dValue)}</span>
            <span style={{ color: 'var(--gl-fg-2)', fontSize: 12 }}>{it.reason}</span>
            <button onClick={() => onChange(items.filter((_, j) => j !== i))} style={{
              background: 'transparent', border: 'none', cursor: 'pointer',
              color: 'var(--gl-fg-3)', justifySelf: 'end', padding: 4,
            }}><Icon name="trash" size={14} /></button>
          </div>
        );
      })}
    </div>
  );
}

function Tile({ label, value, currency, color, big }) {
  return (
    <div style={{
      padding: 20,
      background: 'var(--gl-bg)',
      border: '1px solid var(--gl-border)',
      borderRadius: 6,
    }}>
      <div style={{
        fontWeight: 700, fontSize: 10, letterSpacing: '0.08em',
        textTransform: 'uppercase', color: 'var(--gl-fg-3)', marginBottom: 8,
      }}>{label}</div>
      <div style={{
        fontFamily: 'var(--gl-font-mono)',
        fontSize: big ? 26 : 22, fontWeight: 600,
        color: color || 'var(--gl-fg-1)',
        lineHeight: 1.1, letterSpacing: '-0.01em',
      }}>{value}</div>
      {currency && (
        <div style={{
          fontFamily: 'var(--gl-font-mono)', fontSize: 11,
          color: 'var(--gl-fg-3)', marginTop: 6,
        }}>{currency}</div>
      )}
    </div>
  );
}

function fmt(n) {
  const sign = n < 0 ? '-' : '';
  return sign + Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

window.InventoryAdjustment = InventoryAdjustment;
