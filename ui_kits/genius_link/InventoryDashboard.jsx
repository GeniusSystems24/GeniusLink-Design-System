/* global React, Page, Card, SectionHeader, Button, Icon, StatusPill */
// Screen: Inventory Dashboard — operations overview KPIs + activity feed

function InventoryDashboard({ onNavigate }) {
  const kpis = [
    { label: 'Stock On Hand', value: '2,820,460', sub: 'SAR · across 5 stores', tone: 'blue', icon: 'briefcase' },
    { label: 'SKUs Tracked',  value: '4,891',     sub: '+18 this week',         tone: 'blue', icon: 'scanner' },
    { label: 'Low Stock',     value: '47',        sub: 'below reorder level',    tone: 'orange', icon: 'info' },
    { label: 'Out of Stock',  value: '12',        sub: 'requires attention',     tone: 'danger', icon: 'close' },
  ];
  const ops = [
    { id: 'INV-REC-0241', type: 'Receive',    store: 'King Fahd Warehouse',  value: '+24,200', when: '2h ago', tone: 'success' },
    { id: 'INV-ISS-0089', type: 'Issue',      store: 'Downtown Central',     value: '−5,400',  when: '5h ago', tone: 'danger' },
    { id: 'INV-TRF-0117', type: 'Transfer',   store: 'ST-001 → ST-002',      value: '±20,970', when: 'Yesterday', tone: 'info' },
    { id: 'INV-ADJ-0058', type: 'Adjustment', store: 'King Fahd Warehouse',  value: '−307',    when: 'Yesterday', tone: 'warning' },
    { id: 'INV-REC-0240', type: 'Receive',    store: 'Jeddah Showroom',      value: '+12,840', when: '2 days', tone: 'success' },
  ];
  const lowStock = [
    { sku: 'AGG-21044', name: 'Coarse Aggregate 20mm', stock: 46,  reorder: 80,  unit: 'TON' },
    { sku: 'PNT-55310', name: 'Epoxy Floor Coating',   stock: 88,  reorder: 120, unit: 'L' },
    { sku: 'TMR-19080', name: 'Timber 2×4 Treated',    stock: 24,  reorder: 60,  unit: 'PCS' },
    { sku: 'RBR-71203', name: 'Reinforcement Bar #6',  stock: 0,   reorder: 100, unit: 'PCS' },
  ];
  const topMovers = [
    { sku: 'CMT-90112', name: 'Portland Cement Type I', moved: 1820, pct: 92 },
    { sku: 'STL-44021', name: 'Structural Steel I-Beam', moved: 142, pct: 68 },
    { sku: 'PLY-30022', name: 'Plywood Sheet 18mm',     moved: 312, pct: 54 },
    { sku: 'AGG-21044', name: 'Coarse Aggregate 20mm',  moved: 46,  pct: 38 },
  ];

  return (
    <Page breadcrumb={['Commercial', 'Inventory', 'Dashboard']} title="Inventory Dashboard"
      titleRight={
        <div style={{ display: 'flex', gap: 8 }}>
          <Button variant="secondary" icon="download">Export</Button>
          <Button variant="primary" icon="plus" onClick={() => onNavigate && onNavigate('receive')}>Receive Stock</Button>
        </div>
      }>

      {/* KPI tiles */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {kpis.map((k) => <KpiTile key={k.label} {...k} />)}
      </div>

      {/* Activity + Top movers */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 16 }}>
        <Card padding={0}>
          <div style={{ padding: '20px 24px 0' }}>
            <SectionHeader title="Recent Operations" subtitle="Newest stock movements across all stores" marker="blue"
              right={<Button variant="ghost" icon="refresh">Refresh</Button>} />
          </div>
          <div style={{ padding: '16px 24px 24px' }}>
            {ops.map((op, i) => (
              <div key={op.id} style={{
                display: 'grid', gridTemplateColumns: '140px 1fr 1fr 110px 70px', gap: 12,
                padding: '13px 0', alignItems: 'center',
                borderBottom: i < ops.length - 1 ? '1px solid var(--gl-border)' : 'none',
                fontSize: 13,
              }}>
                <span style={{ fontFamily: 'var(--gl-font-mono)', color: '#4A7CFF', fontSize: 12 }}>{op.id}</span>
                <span><StatusPill tone={op.tone} size="sm">{op.type}</StatusPill></span>
                <span style={{ color: 'var(--gl-fg-2)' }}>{op.store}</span>
                <span style={{
                  fontFamily: 'var(--gl-font-mono)', textAlign: 'right', fontWeight: 600,
                  color: op.value.startsWith('+') ? '#1DB88A' : (op.value.startsWith('−') ? '#EF4444' : 'var(--gl-fg-1)'),
                }}>{op.value}</span>
                <span style={{ fontFamily: 'var(--gl-font-mono)', fontSize: 11, textAlign: 'right', color: 'var(--gl-fg-3)' }}>{op.when}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card padding={0}>
          <div style={{ padding: '20px 24px 0' }}>
            <SectionHeader title="Top Movers" subtitle="Units moved · 30 day window" marker="green" />
          </div>
          <div style={{ padding: '16px 24px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            {topMovers.map((p) => (
              <div key={p.sku}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--gl-fg-1)' }}>{p.name}</span>
                  <span style={{ fontFamily: 'var(--gl-font-mono)', fontSize: 12, color: 'var(--gl-fg-2)', fontWeight: 600 }}>{p.moved.toLocaleString()}</span>
                </div>
                <div style={{ height: 6, background: 'var(--gl-input-bg)', borderRadius: 999, overflow: 'hidden' }}>
                  <div style={{ width: `${p.pct}%`, height: '100%', background: '#1DB88A', borderRadius: 999 }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Stock value by category + pending actions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 16 }}>
        <Card padding={0}>
          <div style={{ padding: '20px 24px 0' }}>
            <SectionHeader title="Stock Value by Category" subtitle="Share of total on-hand value · SAR" marker="blue" />
          </div>
          <div style={{ padding: '16px 24px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              { cat: 'Steel', val: '1,820,420', pct: 65, c: '#4A7CFF' },
              { cat: 'Timber & Wood', val: '484,210', pct: 17, c: '#1DB88A' },
              { cat: 'Cement & Mortars', val: '188,640', pct: 7, c: '#F97316' },
              { cat: 'Finishing', val: '184,390', pct: 6, c: '#38BDF8' },
              { cat: 'Aggregates', val: '142,800', pct: 5, c: '#A78BFA' },
            ].map((r) => (
              <div key={r.cat}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600, color: 'var(--gl-fg-1)' }}>
                    <span style={{ width: 8, height: 8, borderRadius: 999, background: r.c }} />{r.cat}
                  </span>
                  <span style={{ fontFamily: 'var(--gl-font-mono)', fontSize: 12, color: 'var(--gl-fg-2)', fontWeight: 600 }}>{r.val} <span style={{ color: 'var(--gl-fg-4)', fontWeight: 400 }}>· {r.pct}%</span></span>
                </div>
                <div style={{ height: 6, background: 'var(--gl-input-bg)', borderRadius: 999, overflow: 'hidden' }}>
                  <div style={{ width: `${r.pct}%`, height: '100%', background: r.c, borderRadius: 999 }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card padding={0}>
          <div style={{ padding: '20px 24px 0' }}>
            <SectionHeader title="Pending Actions" subtitle="Items needing attention" marker="orange" />
          </div>
          <div style={{ padding: '8px 16px 16px' }}>
            {[
              { icon: 'paperclip', label: 'Transfers in transit', count: 1, tone: '#F97316', go: 'transferList' },
              { icon: 'download', label: 'Reorder POs to approve', count: 3, tone: '#4A7CFF', go: 'receive' },
              { icon: 'check', label: 'Stock takes due', count: 2, tone: '#1DB88A', go: 'stockTake' },
              { icon: 'info', label: 'Low / out of stock', count: 59, tone: '#EF4444', go: null },
            ].map((a) => <PendingAction key={a.label} {...a} onNavigate={onNavigate} />)}
          </div>
        </Card>
      </div>

      {/* Low stock alerts */}
      <Card padding={0}>
        <div style={{ padding: '20px 24px 0' }}>
          <SectionHeader title="Reorder Alerts" subtitle="Products at or below reorder level" marker="orange"
            right={<Button variant="secondary" icon="paperclip">Generate PO</Button>} />
        </div>
        <div style={{ padding: '16px 24px 24px' }}>
          <div style={{
            display: 'grid', gridTemplateColumns: '120px 1.6fr 1fr 1fr 100px 130px', gap: 12,
            padding: '0 0 12px', borderBottom: '1px solid var(--gl-border)',
            fontWeight: 700, fontSize: 10, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--gl-fg-3)',
          }}>
            <span>SKU</span><span>Product</span>
            <span style={{ textAlign: 'right' }}>On Hand</span>
            <span style={{ textAlign: 'right' }}>Reorder At</span>
            <span>Coverage</span><span></span>
          </div>
          {lowStock.map((p, i) => {
            const pct = Math.min(100, (p.stock / p.reorder) * 100);
            const tone = p.stock === 0 ? '#EF4444' : (pct < 50 ? '#F97316' : '#1DB88A');
            return (
              <div key={p.sku} style={{
                display: 'grid', gridTemplateColumns: '120px 1.6fr 1fr 1fr 100px 130px', gap: 12,
                padding: '14px 0', alignItems: 'center', fontSize: 13,
                borderBottom: i < lowStock.length - 1 ? '1px solid var(--gl-border)' : 'none',
              }}>
                <span style={{ fontFamily: 'var(--gl-font-mono)', color: 'var(--gl-fg-2)' }}>{p.sku}</span>
                <span style={{ fontWeight: 600, color: 'var(--gl-fg-1)' }}>{p.name}</span>
                <span style={{ fontFamily: 'var(--gl-font-mono)', textAlign: 'right', fontWeight: 700, color: tone }}>
                  {p.stock} <span style={{ fontSize: 10, color: 'var(--gl-fg-3)', fontWeight: 400 }}>{p.unit}</span>
                </span>
                <span style={{ fontFamily: 'var(--gl-font-mono)', textAlign: 'right', color: 'var(--gl-fg-3)' }}>{p.reorder} {p.unit}</span>
                <span>
                  <div style={{ height: 5, background: 'var(--gl-input-bg)', borderRadius: 999, overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: tone }} />
                  </div>
                </span>
                <span style={{ justifySelf: 'end' }}>
                  <Button variant="secondary" icon="download">Order</Button>
                </span>
              </div>
            );
          })}
        </div>
      </Card>
    </Page>
  );
}

function PendingAction({ icon, label, count, tone, go, onNavigate }) {
  const [hover, setHover] = React.useState(false);
  return (
    <div
      onClick={() => go && onNavigate && onNavigate(go)}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 12, padding: '12px 10px', borderRadius: 6,
        cursor: go ? 'pointer' : 'default', background: hover && go ? 'var(--gl-hover)' : 'transparent',
        transition: 'background 120ms ease',
      }}>
      <span style={{ width: 32, height: 32, borderRadius: 8, background: `${tone}1F`, color: tone, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon name={icon} size={15} />
      </span>
      <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: 'var(--gl-fg-1)' }}>{label}</span>
      <span style={{ fontFamily: 'var(--gl-font-mono)', fontSize: 13, fontWeight: 700, color: tone, background: `${tone}1F`, borderRadius: 999, padding: '2px 10px' }}>{count}</span>
      {go && <span style={{ color: 'var(--gl-fg-4)', display: 'flex' }}><Icon name="chevRight" size={14} /></span>}
    </div>
  );
}

function KpiTile({ label, value, sub, tone, icon }) {
  const colors = { blue: '#4A7CFF', orange: '#F97316', danger: '#EF4444', success: '#1DB88A' };
  const c = colors[tone] || colors.blue;
  return (
    <div style={{
      padding: 20, background: 'var(--gl-surface)',
      border: '1px solid var(--gl-border)', borderRadius: 8,
      display: 'flex', gap: 14, alignItems: 'flex-start',
    }}>
      <div style={{
        width: 40, height: 40, borderRadius: 8,
        background: `${c}1F`, color: c,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <Icon name={icon} size={18} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontWeight: 700, fontSize: 10, letterSpacing: '0.08em',
          textTransform: 'uppercase', color: 'var(--gl-fg-3)',
        }}>{label}</div>
        <div style={{
          fontFamily: 'var(--gl-font-mono)', fontSize: 24, fontWeight: 600,
          color: 'var(--gl-fg-1)', lineHeight: 1.1, marginTop: 6, letterSpacing: '-0.01em',
        }}>{value}</div>
        <div style={{
          fontFamily: 'var(--gl-font-mono)', fontSize: 11,
          color: 'var(--gl-fg-3)', marginTop: 4,
        }}>{sub}</div>
      </div>
    </div>
  );
}

window.InventoryDashboard = InventoryDashboard;
