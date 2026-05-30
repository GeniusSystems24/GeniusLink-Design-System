/* global React, Page, Card, SectionHeader, Button, Icon, StatusPill, EditableTable */
// Screen: Stock Take — physical count session with live progress + variance

const STOCK_TAKE_COLS = [
  { key: 'sku',      label: 'SKU',         w: 120, type: 'text', mono: true, required: true },
  { key: 'name',     label: 'Product',     w: 220, type: 'text' },
  { key: 'expected', label: 'Expected',    w: 90,  type: 'num',  align: 'right', mono: true },
  { key: 'counted',  label: 'Counted',     w: 90,  type: 'num',  align: 'right', mono: true },
  { key: 'unit',     label: 'Unit',        w: 70,  type: 'enum', opts: ['PCS','BAG','TON','SHT','L','KG'] },
  { key: 'location', label: 'Bin',         w: 90,  type: 'text', mono: true },
  { key: 'notes',    label: 'Notes',       w: 200, type: 'text' },
];

function StockTake({ onCancel, onCreate }) {
  const { Static, SelectField } = window._invShared;
  const [items, setItems] = React.useState([
    { sku: 'STL-44021', name: 'Structural Steel I-Beam',  expected: '142',  counted: '140',  unit: 'PCS', location: 'A-12', notes: '2 units damaged' },
    { sku: 'CMT-90112', name: 'Portland Cement Type I',   expected: '1820', counted: '1820', unit: 'BAG', location: 'B-04', notes: '' },
    { sku: 'AGG-21044', name: 'Coarse Aggregate 20mm',    expected: '48',   counted: '46',   unit: 'TON', location: 'OUT-1',notes: 'Spillage 2t' },
    { sku: 'PLY-30022', name: 'Plywood Sheet 18mm',       expected: '312',  counted: '',     unit: 'SHT', location: 'C-08', notes: '' },
    { sku: 'PNT-55310', name: 'Epoxy Floor Coating',      expected: '88',   counted: '',     unit: 'L',   location: 'D-03', notes: '' },
    { sku: 'RBR-71203', name: 'Reinforcement Bar #6',     expected: '0',    counted: '',     unit: 'PCS', location: 'A-15', notes: '' },
  ]);

  const counted = items.filter(i => String(i.counted).trim() !== '').length;
  const total = items.length;
  const pct = total ? Math.round((counted / total) * 100) : 0;

  const variances = items
    .filter(i => String(i.counted).trim() !== '')
    .map(i => (parseFloat(i.counted) || 0) - (parseFloat(i.expected) || 0));
  const matches    = variances.filter(v => v === 0).length;
  const shortages  = variances.filter(v => v < 0).length;
  const overages   = variances.filter(v => v > 0).length;
  const netVar     = variances.reduce((s, v) => s + v, 0);

  return (
    <Page breadcrumb={['Commercial', 'Inventory', 'Stock Take']} title="Stock Take Session"
      titleRight={<StatusPill tone={pct === 100 ? 'success' : 'warning'}>{pct === 100 ? 'Ready to Post' : 'In Progress'}</StatusPill>}>
      <Card padding={20}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 24 }}>
          <Static label="Session No" value="STK-2024-0014" mono locked />
          <SelectField label="Store" value="King Fahd Warehouse"
                       options={['Downtown Central', 'King Fahd Warehouse', 'Jeddah Showroom', 'Dammam Distribution']} />
          <SelectField label="Count Type" value="Full Count" options={['Full Count', 'Cycle Count', 'Spot Check']} />
          <Static label="Started" value="Dec 18, 2025 · 09:14" mono />
        </div>
      </Card>

      {/* Progress + variance summary */}
      <Card>
        <SectionHeader title="Session Progress" subtitle="Live count progress and variance summary" marker="blue" />
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
            <span style={{ fontWeight: 700, fontSize: 11, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--gl-fg-2)' }}>
              {counted} of {total} lines counted
            </span>
            <span style={{ fontFamily: 'var(--gl-font-mono)', fontSize: 20, fontWeight: 700, color: pct === 100 ? '#1DB88A' : '#4A7CFF' }}>{pct}%</span>
          </div>
          <div style={{ height: 10, background: 'var(--gl-input-bg)', borderRadius: 999, overflow: 'hidden' }}>
            <div style={{ width: `${pct}%`, height: '100%', background: pct === 100 ? '#1DB88A' : '#4A7CFF', borderRadius: 999, transition: 'width 200ms ease' }} />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          <STile label="Lines Counted" value={counted} sub={`${total - counted} remaining`} />
          <STile label="Matches"       value={matches}  sub="no variance" color="#1DB88A" />
          <STile label="Shortages"     value={shortages} sub="under count" color="#EF4444" />
          <STile label="Overages"      value={overages}  sub="over count"  color="#F97316" />
        </div>
      </Card>

      <Card>
        <SectionHeader title="Count Sheet" subtitle="Enter counted quantities — Counted vs Expected shows live variance" marker="green" />
        <EditableTable
          columns={STOCK_TAKE_COLS}
          rows={items}
          onChange={setItems}
          addRowLabel="Add Line"
          emptyRow={() => ({ sku: '', name: '', expected: '0', counted: '', unit: 'PCS', location: '', notes: '' })}
          footer={
            <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
              <VarianceLegend label="Match"    color="#1DB88A" />
              <VarianceLegend label="Shortage" color="#EF4444" />
              <VarianceLegend label="Overage"  color="#F97316" />
              <span style={{ marginInlineStart: 'auto', fontWeight: 700, fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--gl-fg-3)' }}>Net Variance</span>
              <span style={{ fontFamily: 'var(--gl-font-mono)', fontSize: 18, fontWeight: 700, color: netVar < 0 ? '#EF4444' : (netVar > 0 ? '#F97316' : '#1DB88A') }}>{netVar > 0 ? '+' : ''}{netVar} units</span>
            </div>
          } />
      </Card>

      <div style={{ display: 'flex', gap: 12, justifyContent: 'space-between' }}>
        <Button variant="secondary" onClick={onCancel}>Save Draft</Button>
        <div style={{ display: 'flex', gap: 12 }}>
          <Button variant="secondary" icon="download">Export CSV</Button>
          <Button variant="primary" icon="check" onClick={onCreate} disabled={pct < 100}>
            {pct < 100 ? `Count ${total - counted} more to post` : 'Post Stock Take'}
          </Button>
        </div>
      </div>
    </Page>
  );
}

function STile({ label, value, sub, color }) {
  return (
    <div style={{ padding: 16, background: 'var(--gl-bg)', border: '1px solid var(--gl-border)', borderRadius: 6 }}>
      <div style={{ fontWeight: 700, fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--gl-fg-3)', marginBottom: 6 }}>{label}</div>
      <div style={{ fontFamily: 'var(--gl-font-mono)', fontSize: 22, fontWeight: 600, color: color || 'var(--gl-fg-1)' }}>{value}</div>
      <div style={{ fontFamily: 'var(--gl-font-mono)', fontSize: 11, color: 'var(--gl-fg-3)', marginTop: 4 }}>{sub}</div>
    </div>
  );
}

function VarianceLegend({ label, color }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <span style={{ width: 8, height: 8, borderRadius: 999, background: color }} />
      <span style={{ fontSize: 11, color: 'var(--gl-fg-3)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{label}</span>
    </div>
  );
}

window.StockTake = StockTake;
