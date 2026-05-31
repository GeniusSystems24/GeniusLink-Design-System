/* global React, Page, Card, SectionHeader, Button, Icon, StatusPill, EditableTable, Field */
// Screen: Price Lists — multi-currency lists with discount tiers

const PRICE_COLS = [
  { key: 'sku',      label: 'SKU',         w: 110, type: 'text', mono: true },
  { key: 'name',     label: 'Product',     w: 200, type: 'text' },
  { key: 'list',     label: 'List Price',  w: 110, type: 'num',  align: 'right', mono: true, required: true },
  { key: 'discount', label: 'Discount %',  w: 100, type: 'num',  align: 'right', mono: true },
  { key: 'net',      label: 'Net Price',   w: 110, type: 'num',  align: 'right', mono: true },
  { key: 'minQty',   label: 'Min Qty',     w: 90,  type: 'num',  align: 'right', mono: true },
];

const LISTS = [
  { id: 'retail', name: 'Retail · Standard',     currency: 'SAR', kind: 'List', tone: '#4A7CFF', items: 412, customers: 184, updated: 'Dec 12' },
  { id: 'whole',  name: 'Wholesale · Tier 1',    currency: 'SAR', kind: 'Discount 15%', tone: '#1DB88A', items: 412, customers: 28,  updated: 'Dec 10' },
  { id: 'whole2', name: 'Wholesale · Tier 2',    currency: 'SAR', kind: 'Discount 25%', tone: '#1DB88A', items: 412, customers: 12,  updated: 'Dec 10' },
  { id: 'export', name: 'Export · USD',          currency: 'USD', kind: 'Markup 8%',    tone: '#F97316', items: 188, customers: 6,   updated: 'Dec 08' },
  { id: 'proj',   name: 'Project · Cost Plus',   currency: 'SAR', kind: 'Markup 12%',   tone: '#F97316', items: 64,  customers: 2,   updated: 'Dec 14' },
];

function PriceLists({ onCreate }) {
  const [active, setActive] = React.useState('whole');
  const [rows, setRows] = React.useState([
    { sku: 'STL-44021', name: 'Structural Steel I-Beam', list: '540.00', discount: '15.0', net: '459.00', minQty: '10' },
    { sku: 'CMT-90112', name: 'Portland Cement Type I',  list: '28.00',  discount: '15.0', net: '23.80',  minQty: '50' },
    { sku: 'AGG-21044', name: 'Coarse Aggregate 20mm',   list: '140.00', discount: '15.0', net: '119.00', minQty: '5' },
    { sku: 'PLY-30022', name: 'Plywood Sheet 18mm',      list: '105.00', discount: '15.0', net: '89.25',  minQty: '20' },
    { sku: 'PNT-55310', name: 'Epoxy Floor Coating',     list: '44.00',  discount: '15.0', net: '37.40',  minQty: '12' },
  ]);

  // live recompute net when list or discount change
  const applyComputed = (next) => next.map(r => {
    const list = parseFloat(r.list) || 0;
    const disc = parseFloat(r.discount) || 0;
    const net = (list * (1 - disc / 100));
    return { ...r, net: net ? net.toFixed(2) : '' };
  });

  const cur = LISTS.find(l => l.id === active);

  return (
    <Page breadcrumb={['Commercial', 'Inventory', 'Price Lists']} title="Price Lists"
      titleRight={<Button variant="primary" icon="plus" onClick={onCreate}>New Price List</Button>}>

      {/* Lists picker */}
      <Card padding={0}>
        <div style={{ padding: '20px 24px 0' }}>
          <SectionHeader title="Available Price Lists" subtitle={`${LISTS.length} lists · ${LISTS.reduce((s,l) => s + l.customers, 0)} customers assigned`} marker="blue" />
        </div>
        <div style={{ padding: '16px 24px 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
            {LISTS.map((l) => {
              const isActive = active === l.id;
              return (
                <button key={l.id} onClick={() => setActive(l.id)} style={{
                  padding: 16, borderRadius: 8, cursor: 'pointer', textAlign: 'left',
                  background: isActive ? `${l.tone}14` : 'var(--gl-bg)',
                  border: `1px solid ${isActive ? l.tone : 'var(--gl-border)'}`,
                  display: 'flex', flexDirection: 'column', gap: 8,
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                    <span style={{
                      padding: '3px 8px', borderRadius: 4, fontSize: 9, fontWeight: 700,
                      letterSpacing: '0.08em', textTransform: 'uppercase',
                      color: l.tone, background: `${l.tone}1F`,
                    }}>{l.currency}</span>
                    {isActive && <StatusPill tone="info" size="sm">Active</StatusPill>}
                  </div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--gl-fg-1)' }}>{l.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--gl-fg-3)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{l.kind}</div>
                  <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    marginTop: 4, paddingTop: 8, borderTop: '1px solid var(--gl-border)',
                    fontFamily: 'var(--gl-font-mono)', fontSize: 11, color: 'var(--gl-fg-3)',
                  }}>
                    <span>{l.items} items · {l.customers} customers</span>
                    <span>{l.updated}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </Card>

      {/* List metadata */}
      <Card>
        <SectionHeader title="List Settings" subtitle={`Edit pricing rules for "${cur.name}"`} marker="green" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 20 }}>
          <Field label="List Name" required value={cur.name} />
          <window._cfgShared.CurSelect label="Currency" value={cur.currency} options={['SAR — Saudi Riyal', 'USD — US Dollar', 'EUR — Euro', 'AED — UAE Dirham']} />
          <window._cfgShared.CurSelect label="Discount Type" value="Percentage" options={['Percentage', 'Fixed Amount', 'Margin Markup', 'Cost Plus']} />
          <Field label="Default Discount %" placeholder="e.g. 15" mono value="15.0" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 20 }}>
          <Field label="Effective From" placeholder="mm/dd/yyyy" mono value="01/01/2025" />
          <Field label="Effective To" placeholder="mm/dd/yyyy" mono value="12/31/2025" />
          <Field label="Min. Order Qty" placeholder="0" mono value="1" />
          <window._cfgShared.CurSelect label="Round Mode" value="2 decimals" options={['No rounding', '2 decimals', '0 decimals', 'Round to .99']} />
        </div>
      </Card>

      <Card>
        <SectionHeader
          title="Item Prices"
          subtitle="Edit list price or discount — net price recalculates automatically"
          marker="green" />
        <EditableTable
          columns={PRICE_COLS}
          rows={rows}
          onChange={(next) => setRows(applyComputed(next))}
          addRowLabel="Add Item"
          emptyRow={() => ({ sku: '', name: '', list: '', discount: '0.0', net: '', minQty: '1' })}
          footer={
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <span style={{ fontWeight: 700, fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--gl-fg-3)' }}>Avg Discount</span>
              <span style={{ fontFamily: 'var(--gl-font-mono)', fontSize: 16, fontWeight: 600, color: '#1DB88A' }}>
                {(rows.reduce((s, r) => s + (parseFloat(r.discount) || 0), 0) / rows.length).toFixed(1)}%
              </span>
              <span style={{ marginInlineStart: 24, fontWeight: 700, fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--gl-fg-3)' }}>Items</span>
              <span style={{ fontFamily: 'var(--gl-font-mono)', fontSize: 16, fontWeight: 600, color: 'var(--gl-fg-1)' }}>{rows.length}</span>
            </div>
          } />
      </Card>

      <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
        <Button variant="secondary" icon="download">Export CSV</Button>
        <Button variant="danger" icon="trash">Delete List</Button>
        <Button variant="primary" icon="check">Save Changes</Button>
      </div>
    </Page>
  );
}

window.PriceLists = PriceLists;
