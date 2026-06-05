/* global React */
// GeniusLink mobile — Inventory Extras: Dashboard, Stock Take, Categories,
// Units of Measure, Price Lists, Barcode Print, Warehouses, Transfer List.
// Reuses the IC/IIcon/IPill/ICard/IBtn/IScroll/IMini primitives + window._minv.

const MIvX = window._mob;
const { C: IXC, MIcon: IXIcon, Pill: IXPill, MCard: IXCard, MBtn: IXBtn, Scroll: IXScroll, Mini: IXMini } = MIvX;
const { ISection: IXSection, IField: IXField, ITextarea: IXTextarea, InfoNote: IXInfoNote, ActionRow: IXActionRow } = window._minv;
const { useState: useIXState } = React;

/* ═════════ 1 · INVENTORY DASHBOARD ═════════ */
function MInventoryDashboard({ go }) {
  const kpis = [
    { label: 'Stock Value',  value: '2.82M',  sub: 'SAR · 5 stores',  tone: IXC.blue },
    { label: 'SKUs',         value: '4,891',  sub: '+18 this week',    tone: IXC.blue },
    { label: 'Low Stock',    value: '47',     sub: 'reorder needed',   tone: IXC.orange },
    { label: 'Out of Stock', value: '12',     sub: 'urgent',           tone: IXC.red },
  ];
  const ops = [
    { id: 'INV-REC-0241', type: 'Receive',    val: '+24,200', tone: IXC.green },
    { id: 'INV-ISS-0089', type: 'Issue',      val: '−5,400',  tone: IXC.red },
    { id: 'INV-TRF-0117', type: 'Transfer',   val: '±20,970', tone: IXC.blue },
    { id: 'INV-ADJ-0058', type: 'Adjustment', val: '−307',    tone: IXC.orange },
  ];
  const low = [
    { sku: 'AGG-21044', name: 'Coarse Aggregate 20mm', stock: 46, reorder: 80,  pct: 58 },
    { sku: 'TMR-19080', name: 'Timber 2×4 Treated',    stock: 24, reorder: 60,  pct: 40 },
    { sku: 'RBR-71203', name: 'Reinforcement Bar #6',  stock: 0,  reorder: 100, pct: 0 },
  ];
  return (
    <IXScroll>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {kpis.map((k) => (
          <div key={k.label} style={{ padding: 14, background: IXC.surface, border: `1px solid ${IXC.border}`, borderRadius: 10 }}>
            <div style={{ fontWeight: 700, fontSize: 9.5, letterSpacing: '0.08em', textTransform: 'uppercase', color: IXC.fg3 }}>{k.label}</div>
            <div style={{ fontFamily: IXC.mono, fontSize: 22, fontWeight: 700, color: k.tone, marginTop: 6, lineHeight: 1.1 }}>{k.value}</div>
            <div style={{ fontFamily: IXC.mono, fontSize: 10.5, color: IXC.fg3, marginTop: 4 }}>{k.sub}</div>
          </div>
        ))}
      </div>
      <IXCard marker={IXC.blue} title="Recent Operations" pad={8}>
        <div style={{ padding: '0 8px' }}>
          {ops.map((o, i) => (
            <div key={o.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 0', borderBottom: i < ops.length - 1 ? `1px solid ${IXC.border}` : 'none' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: IXC.mono, fontSize: 11, color: IXC.blue }}>{o.id}</div>
                <div style={{ fontSize: 12, color: IXC.fg3, marginTop: 2 }}>{o.type}</div>
              </div>
              <span style={{ fontFamily: IXC.mono, fontSize: 14, fontWeight: 700, color: o.tone }}>{o.val}</span>
            </div>
          ))}
        </div>
      </IXCard>
      <IXCard marker={IXC.orange} title="Reorder Alerts" sub={`${low.length} products at or below reorder level`}>
        {low.map((p) => {
          const tone = p.stock === 0 ? IXC.red : (p.pct < 50 ? IXC.orange : IXC.green);
          return (
            <div key={p.sku} style={{ padding: '4px 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: IXC.fg1, fontFamily: IXC.body }}>{p.name}</div>
                  <div style={{ fontFamily: IXC.mono, fontSize: 10.5, color: IXC.fg3, marginTop: 2 }}>{p.sku}</div>
                </div>
                <span style={{ fontFamily: IXC.mono, fontSize: 13, fontWeight: 700, color: tone }}>{p.stock}/{p.reorder}</span>
              </div>
              <div style={{ height: 5, background: IXC.input, borderRadius: 999, overflow: 'hidden' }}>
                <div style={{ width: `${p.pct}%`, height: '100%', background: tone }} />
              </div>
            </div>
          );
        })}
        <IXBtn variant="primary" icon="paperclip" full>Generate Purchase Order</IXBtn>
      </IXCard>
    </IXScroll>
  );
}

/* ═════════ 2 · STOCK TAKE ═════════ */
function MStockTake() {
  const total = 6;
  const counted = 3;
  const pct = Math.round((counted / total) * 100);
  const items = [
    { sku: 'STL-44021', name: 'Structural Steel I-Beam', exp: 142, ctd: 140, delta: -2 },
    { sku: 'CMT-90112', name: 'Portland Cement Type I',  exp: 1820, ctd: 1820, delta: 0 },
    { sku: 'AGG-21044', name: 'Coarse Aggregate 20mm',   exp: 48,  ctd: 46,  delta: -2 },
    { sku: 'PLY-30022', name: 'Plywood Sheet 18mm',      exp: 312, ctd: null, delta: null },
    { sku: 'PNT-55310', name: 'Epoxy Floor Coating',     exp: 88,  ctd: null, delta: null },
    { sku: 'RBR-71203', name: 'Reinforcement Bar #6',    exp: 0,   ctd: null, delta: null },
  ];
  return (
    <IXScroll>
      <IXCard marker={IXC.blue} title="STK-2024-0014" sub="King Fahd Warehouse · Started Dec 18, 09:14" right={<IXPill tone="warning">In Progress</IXPill>}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
            <span style={{ fontWeight: 700, fontSize: 10, letterSpacing: '0.05em', textTransform: 'uppercase', color: IXC.fg2 }}>{counted} of {total} counted</span>
            <span style={{ fontFamily: IXC.mono, fontSize: 22, fontWeight: 700, color: IXC.blue }}>{pct}%</span>
          </div>
          <div style={{ height: 8, background: IXC.input, borderRadius: 999, overflow: 'hidden' }}>
            <div style={{ width: `${pct}%`, height: '100%', background: IXC.blue }} />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginTop: 8 }}>
          <IXMini label="Match" value="1" />
          <IXMini label="Short" value="2" />
          <IXMini label="Over" value="0" />
        </div>
      </IXCard>
      <IXCard marker={IXC.green} title="Count Sheet" pad={8}>
        <div style={{ padding: '0 8px' }}>
          {items.map((it, i) => {
            const pending = it.ctd === null;
            const tone = pending ? IXC.fg3 : (it.delta === 0 ? IXC.green : (it.delta < 0 ? IXC.red : IXC.orange));
            return (
              <div key={it.sku} style={{ padding: '13px 0', borderBottom: i < items.length - 1 ? `1px solid ${IXC.border}` : 'none', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: IXC.fg1, fontFamily: IXC.body }}>{it.name}</div>
                  <div style={{ fontFamily: IXC.mono, fontSize: 11, color: IXC.fg3, marginTop: 2 }}>{it.sku} · exp {it.exp}</div>
                </div>
                {pending ? (
                  <span style={{ padding: '5px 10px', background: IXC.input, border: `1px solid ${IXC.border}`, borderRadius: 6, fontFamily: IXC.body, fontSize: 11, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: IXC.fg3 }}>Count</span>
                ) : (
                  <span style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: IXC.mono, fontSize: 14, fontWeight: 700, color: IXC.fg1 }}>{it.ctd}</div>
                    <div style={{ fontFamily: IXC.mono, fontSize: 11, fontWeight: 700, color: tone }}>{it.delta > 0 ? '+' : ''}{it.delta}</div>
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </IXCard>
      <IXActionRow primary="Post Stock Take" />
    </IXScroll>
  );
}

/* ═════════ 3 · CATEGORIES ═════════ */
function MCategories() {
  const [open, setOpen] = useIXState({ steel: true, cement: false, agg: false, timber: false, finish: false });
  const tree = [
    { id: 'steel',  code: 'CAT-001', name: 'Steel',               skus: 412, value: '1,820,420', children: [
      { code: 'CAT-001-01', name: 'Reinforcement Bars', skus: 88 },
      { code: 'CAT-001-02', name: 'Structural Beams',   skus: 142 },
      { code: 'CAT-001-03', name: 'Steel Plates',       skus: 64 },
    ]},
    { id: 'cement', code: 'CAT-002', name: 'Cement & Mortars',    skus: 96,  value: '188,640', children: [
      { code: 'CAT-002-01', name: 'Ordinary Portland', skus: 42 },
      { code: 'CAT-002-02', name: 'Sulfate Resistant', skus: 28 },
    ]},
    { id: 'agg',    code: 'CAT-003', name: 'Aggregates',          skus: 64,  value: '142,800', children: [] },
    { id: 'timber', code: 'CAT-004', name: 'Timber & Wood',       skus: 184, value: '484,210', children: [
      { code: 'CAT-004-01', name: 'Sawn Lumber', skus: 92 },
      { code: 'CAT-004-02', name: 'Plywood',     skus: 92 },
    ]},
    { id: 'finish', code: 'CAT-005', name: 'Finishing Materials', skus: 128, value: '184,390', children: [] },
  ];
  return (
    <IXScroll>
      <IXCard marker={IXC.blue} title="Category Tree" sub={`${tree.length} top-level groups`} pad={8}>
        <div style={{ padding: '0 4px' }}>
          {tree.map((node) => (
            <React.Fragment key={node.id}>
              <div onClick={() => setOpen(s => ({ ...s, [node.id]: !s[node.id] }))}
                   style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 8px', borderRadius: 6, cursor: 'pointer' }}>
                <span style={{
                  width: 22, height: 22, borderRadius: 6, background: `${IXC.blue}1F`, color: IXC.blue,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  transform: open[node.id] ? 'none' : 'rotate(-90deg)', transition: 'transform 150ms ease',
                }}>{node.children.length ? <IXIcon name="chevD" size={12} /> : <IXIcon name="doc" size={11} />}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: IXC.fg1, fontFamily: IXC.body }}>{node.name}</div>
                  <div style={{ fontFamily: IXC.mono, fontSize: 10.5, color: IXC.fg3, marginTop: 2 }}>{node.code} · {node.skus} SKUs</div>
                </div>
                <span style={{ fontFamily: IXC.mono, fontSize: 11, color: IXC.fg3 }}>{node.value}</span>
              </div>
              {open[node.id] && node.children.map((ch, j) => (
                <div key={ch.code} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 8px 10px 36px', borderBottom: j < node.children.length - 1 ? `1px solid ${IXC.border}` : 'none' }}>
                  <IXIcon name="doc" size={11} color={IXC.fg4} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12.5, color: IXC.fg2, fontFamily: IXC.body }}>{ch.name}</div>
                    <div style={{ fontFamily: IXC.mono, fontSize: 10, color: IXC.fg4, marginTop: 1 }}>{ch.code}</div>
                  </div>
                  <span style={{ fontFamily: IXC.mono, fontSize: 11, color: IXC.fg3 }}>{ch.skus}</span>
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </IXCard>
      <IXSection icon="briefcase" title="New Category" sub="Quick inline form" marker={IXC.green} defaultOpen={false}>
        <IXField label="Code" placeholder="e.g. CAT-006" mono required />
        <IXField label="Parent" value="— Top Level —" select />
        <IXField label="Name (English)" placeholder="e.g. Adhesives & Sealants" required />
        <IXField label="الاسم بالعربية" placeholder="مثال: لاصقات" ar required />
        <IXActionRow primary="Create Category" />
      </IXSection>
    </IXScroll>
  );
}

/* ═════════ 4 · UNITS OF MEASURE ═════════ */
function MUnitsOfMeasure() {
  const [active, setActive] = useIXState('count');
  const groups = [
    { id: 'count',  name: 'Count',  base: 'PCS', tone: IXC.blue,   units: [
      { code: 'PCS', name: 'Piece',  ratio: '1',   base: true },
      { code: 'DZN', name: 'Dozen',  ratio: '12',  base: false },
      { code: 'BOX', name: 'Box',    ratio: '24',  base: false },
      { code: 'CTN', name: 'Carton', ratio: '144', base: false },
      { code: 'PLT', name: 'Pallet', ratio: '600', base: false },
    ]},
    { id: 'weight', name: 'Weight', base: 'KG',  tone: IXC.green,  units: [
      { code: 'G',   name: 'Gram',     ratio: '0.001', base: false },
      { code: 'KG',  name: 'Kilogram', ratio: '1',     base: true },
      { code: 'TON', name: 'Tonne',    ratio: '1000',  base: false },
      { code: 'BAG', name: 'Bag 50kg', ratio: '50',    base: false },
    ]},
    { id: 'length', name: 'Length', base: 'M',   tone: IXC.orange, units: [
      { code: 'CM', name: 'Centimeter', ratio: '0.01', base: false },
      { code: 'M',  name: 'Meter',      ratio: '1',    base: true },
      { code: 'KM', name: 'Kilometer',  ratio: '1000', base: false },
    ]},
    { id: 'volume', name: 'Volume', base: 'L',  tone: IXC.blue,    units: [
      { code: 'ML', name: 'Milliliter',  ratio: '0.001', base: false },
      { code: 'L',  name: 'Liter',       ratio: '1',     base: true },
      { code: 'M3', name: 'Cubic Meter', ratio: '1000',  base: false },
    ]},
  ];
  const cur = groups.find(g => g.id === active);
  return (
    <IXScroll>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {groups.map((g) => {
          const isAct = active === g.id;
          return (
            <button key={g.id} onClick={() => setActive(g.id)} style={{
              padding: 14, borderRadius: 10, cursor: 'pointer', textAlign: 'left',
              background: isAct ? `${g.tone}14` : IXC.surface,
              border: `1px solid ${isAct ? g.tone : IXC.border}`,
              display: 'flex', flexDirection: 'column', gap: 6,
            }}>
              <div style={{ fontWeight: 700, fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: IXC.fg3 }}>{g.name}</div>
              <div style={{ fontFamily: IXC.mono, fontSize: 16, fontWeight: 700, color: g.tone }}>{g.units.length} units</div>
              <div style={{ fontFamily: IXC.mono, fontSize: 11, color: IXC.fg3 }}>base · {g.base}</div>
            </button>
          );
        })}
      </div>
      <IXCard marker={cur.tone} title={`${cur.name} Units`} sub={`Convert to base ${cur.base}`} pad={8}>
        <div style={{ padding: '0 8px' }}>
          {cur.units.map((u, i) => (
            <div key={u.code} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 0', borderBottom: i < cur.units.length - 1 ? `1px solid ${IXC.border}` : 'none' }}>
              <span style={{ fontFamily: IXC.mono, fontSize: 12, fontWeight: 700, color: u.base ? cur.tone : IXC.fg2, width: 50 }}>{u.code}</span>
              <span style={{ flex: 1, fontSize: 13, color: IXC.fg1, fontFamily: IXC.body }}>{u.name}</span>
              <span style={{ fontFamily: IXC.mono, fontSize: 13, fontWeight: 600, color: IXC.fg2 }}>×{u.ratio}</span>
              {u.base && <IXPill tone="info">Base</IXPill>}
            </div>
          ))}
        </div>
      </IXCard>
    </IXScroll>
  );
}

/* ═════════ 5 · PRICE LISTS ═════════ */
function MPriceLists() {
  const [active, setActive] = useIXState('whole');
  const lists = [
    { id: 'retail', name: 'Retail · Standard',     cur: 'SAR', kind: 'List',         items: 412, tone: IXC.blue },
    { id: 'whole',  name: 'Wholesale · Tier 1',    cur: 'SAR', kind: 'Discount 15%', items: 412, tone: IXC.green },
    { id: 'whole2', name: 'Wholesale · Tier 2',    cur: 'SAR', kind: 'Discount 25%', items: 412, tone: IXC.green },
    { id: 'export', name: 'Export · USD',          cur: 'USD', kind: 'Markup 8%',    items: 188, tone: IXC.orange },
  ];
  const items = [
    { sku: 'STL-44021', name: 'Structural Steel I-Beam', list: '540.00', net: '459.00' },
    { sku: 'CMT-90112', name: 'Portland Cement Type I',  list: '28.00',  net: '23.80'  },
    { sku: 'AGG-21044', name: 'Coarse Aggregate 20mm',   list: '140.00', net: '119.00' },
    { sku: 'PLY-30022', name: 'Plywood Sheet 18mm',      list: '105.00', net: '89.25'  },
    { sku: 'PNT-55310', name: 'Epoxy Floor Coating',     list: '44.00',  net: '37.40'  },
  ];
  return (
    <IXScroll>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {lists.map((l) => {
          const isAct = active === l.id;
          return (
            <button key={l.id} onClick={() => setActive(l.id)} style={{
              padding: 14, borderRadius: 10, cursor: 'pointer', textAlign: 'left',
              background: isAct ? `${l.tone}14` : IXC.surface,
              border: `1px solid ${isAct ? l.tone : IXC.border}`,
              display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <span style={{
                padding: '3px 7px', borderRadius: 4, fontSize: 9, fontWeight: 700,
                letterSpacing: '0.08em', color: l.tone, background: `${l.tone}1F`,
              }}>{l.cur}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 13.5, color: IXC.fg1, fontFamily: IXC.body }}>{l.name}</div>
                <div style={{ fontFamily: IXC.mono, fontSize: 11, color: IXC.fg3, marginTop: 2 }}>{l.kind} · {l.items} items</div>
              </div>
              {isAct && <IXIcon name="check" size={16} color={l.tone} />}
            </button>
          );
        })}
      </div>
      <IXCard marker={IXC.green} title="Item Prices" sub="5 items · 15% discount applied" pad={8}>
        <div style={{ padding: '0 8px' }}>
          {items.map((it, i) => (
            <div key={it.sku} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: i < items.length - 1 ? `1px solid ${IXC.border}` : 'none' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: IXC.fg1, fontFamily: IXC.body }}>{it.name}</div>
                <div style={{ fontFamily: IXC.mono, fontSize: 11, color: IXC.fg3, marginTop: 2 }}>{it.sku}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: IXC.mono, fontSize: 11, color: IXC.fg4, textDecoration: 'line-through' }}>{it.list}</div>
                <div style={{ fontFamily: IXC.mono, fontSize: 14, fontWeight: 700, color: IXC.green }}>{it.net}</div>
              </div>
            </div>
          ))}
        </div>
      </IXCard>
    </IXScroll>
  );
}

/* ═════════ 6 · BARCODE PRINT ═════════ */
function MBarcodePrint() {
  const [sym, setSym] = useIXState('Code 128');
  const [tpl, setTpl] = useIXState('md');
  const tpls = [
    { id: 'sm', name: 'Small Tag',    size: '38×19' },
    { id: 'md', name: 'Medium Label', size: '50×30' },
    { id: 'lg', name: 'Large Shelf',  size: '80×40' },
    { id: 'sh', name: 'Shipping',     size: '100×50' },
  ];
  return (
    <IXScroll>
      <IXCard marker={IXC.green} title="Preview" sub={`${sym} · ${tpls.find(t => t.id === tpl).size} mm`}>
        <div style={{
          padding: 20, background: '#FFFFFF', borderRadius: 8,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            width: '100%', maxWidth: 260, padding: 12, border: '1px solid #D4D4D8', borderRadius: 4,
            display: 'flex', flexDirection: 'column', gap: 8, color: '#0B0C10',
          }}>
            <div style={{ fontWeight: 700, fontSize: 12, lineHeight: 1.2 }}>Portland Cement Type I</div>
            <BarcodeSvg w={236} h={36} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontFamily: 'monospace', fontSize: 10 }}>CMT-90112</span>
              <span style={{ fontWeight: 800, fontSize: 16 }}>SAR 28.00</span>
            </div>
            <div style={{ fontFamily: 'monospace', fontSize: 9, textAlign: 'center', letterSpacing: '0.08em' }}>6 281000 901127</div>
          </div>
        </div>
      </IXCard>
      <IXSection icon="box" title="Label Template" marker={IXC.blue}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {tpls.map((t) => {
            const isAct = tpl === t.id;
            return (
              <button key={t.id} onClick={() => setTpl(t.id)} style={{
                padding: 12, borderRadius: 8, cursor: 'pointer', textAlign: 'left',
                background: isAct ? `${IXC.blue}14` : IXC.input,
                border: `1px solid ${isAct ? IXC.blue : IXC.border}`,
              }}>
                <div style={{ fontWeight: 600, fontSize: 13, color: IXC.fg1, fontFamily: IXC.body }}>{t.name}</div>
                <div style={{ fontFamily: IXC.mono, fontSize: 10.5, color: IXC.fg3, marginTop: 4 }}>{t.size} mm</div>
              </button>
            );
          })}
        </div>
      </IXSection>
      <IXSection icon="scan" title="Print Settings" marker={IXC.green}>
        <IXField label="Symbology" value={sym} select />
        <IXField label="Paper" value="A4 (210 × 297 mm)" select />
        <IXField label="Copies per Item" placeholder="1" mono />
      </IXSection>
      <IXSection icon="doc" title="Queue" sub="4 products · 12 labels · 1 sheet" marker={IXC.orange}>
        {[
          ['STL-44021', 'Structural Steel I-Beam', 4],
          ['CMT-90112', 'Portland Cement Type I',  12],
          ['AGG-21044', 'Coarse Aggregate 20mm',   2],
          ['PLY-30022', 'Plywood Sheet 18mm',      6],
        ].map(([sku, name, qty], i, arr) => (
          <div key={sku} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: i < arr.length - 1 ? `1px solid ${IXC.border}` : 'none' }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 12.5, color: IXC.fg1, fontFamily: IXC.body, fontWeight: 500 }}>{name}</div>
              <div style={{ fontFamily: IXC.mono, fontSize: 10.5, color: IXC.fg3, marginTop: 2 }}>{sku}</div>
            </div>
            <span style={{ fontFamily: IXC.mono, fontSize: 13, fontWeight: 700, color: IXC.fg1 }}>×{qty}</span>
          </div>
        ))}
      </IXSection>
      <IXActionRow primary="Print 24 Labels" icon="check" />
    </IXScroll>
  );
}

function BarcodeSvg({ w, h }) {
  const bars = [];
  let x = 0;
  while (x < w - 2) {
    const bw = Math.random() > 0.6 ? 3 : (Math.random() > 0.5 ? 2 : 1);
    bars.push({ x, w: bw });
    x += bw + (Math.random() > 0.55 ? 2 : 1);
  }
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: 'block' }}>
      {bars.map((b, i) => <rect key={i} x={b.x} y={0} width={b.w} height={h} fill="#0B0C10" />)}
    </svg>
  );
}

/* ═════════ 7 · WAREHOUSES LIST (capacity bars + manager) ═════════ */
function MWarehousesList({ go }) {
  const stores = [
    { code: 'ST-001', name: 'Downtown Central',  items: 1248, cap: 1800, mgr: 'Layla Ahmed',    value: '342.8K' },
    { code: 'ST-002', name: 'King Fahd Warehouse', items: 4892, cap: 6000, mgr: 'Mohammed Saleh', value: '1.82M' },
    { code: 'ST-003', name: 'Jeddah Showroom',   items: 412,  cap: 600,  mgr: 'Sara Al-Otaibi',  value: '128.6K' },
    { code: 'ST-004', name: 'Dammam Distribution', items: 2104, cap: 2400, mgr: 'Khalid Al-Rashid', value: '624.2K' },
    { code: 'ST-005', name: 'Madinah Outlet',    items: 0,    cap: 500,  mgr: '— Unassigned —',   value: '0.00' },
  ];
  return (
    <IXScroll>
      <IXCard marker={IXC.blue} title={`${stores.length} Warehouses`} sub="Capacity & assigned manager" pad={8}>
        <div style={{ padding: '0 4px' }}>
          {stores.map((s, i) => {
            const pct = Math.min(100, Math.round((s.items / s.cap) * 100));
            const tone = pct >= 90 ? IXC.red : (pct >= 70 ? IXC.orange : IXC.green);
            const initials = s.mgr.split(' ').slice(0, 2).map(p => p[0]).join('').toUpperCase();
            return (
              <div key={s.code} style={{ padding: '14px 4px', borderBottom: i < stores.length - 1 ? `1px solid ${IXC.border}` : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <span style={{ fontFamily: IXC.mono, fontSize: 11, color: IXC.fg3, width: 54, marginTop: 2 }}>{s.code}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 600, color: IXC.fg1, fontFamily: IXC.body }}>{s.name}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                      <span style={{
                        width: 18, height: 18, borderRadius: 999,
                        background: s.mgr.includes('—') ? IXC.input : `${IXC.blue}26`,
                        color: s.mgr.includes('—') ? IXC.fg4 : IXC.blue,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 8, fontWeight: 700, flexShrink: 0,
                      }}>{initials || '—'}</span>
                      <span style={{ fontSize: 11.5, color: IXC.fg3, fontFamily: IXC.body }}>{s.mgr}</span>
                    </div>
                  </div>
                  <span style={{ fontFamily: IXC.mono, fontSize: 13, fontWeight: 700, color: IXC.fg1 }}>{s.value}</span>
                </div>
                <div style={{ marginTop: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: IXC.mono, fontSize: 10.5, color: IXC.fg3, marginBottom: 4 }}>
                    <span>{s.items.toLocaleString()} / {s.cap.toLocaleString()}</span>
                    <span style={{ color: tone, fontWeight: 700 }}>{pct}%</span>
                  </div>
                  <div style={{ height: 5, background: IXC.input, borderRadius: 999, overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: tone }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </IXCard>
    </IXScroll>
  );
}

/* ═════════ 8 · TRANSFER LIST (status filters + date range) ═════════ */
function MTransferList({ go }) {
  const [status, setStatus] = useIXState('all');
  const transfers = [
    { ref: 'INV-TRF-2024-0117', from: 'ST-001', to: 'ST-002', value: '20,970', date: 'Dec 14', status: 'in-transit' },
    { ref: 'INV-TRF-2024-0116', from: 'ST-002', to: 'ST-003', value: '48,200', date: 'Dec 12', status: 'delivered' },
    { ref: 'INV-TRF-2024-0115', from: 'ST-004', to: 'ST-001', value: '12,840', date: 'Dec 10', status: 'delivered' },
    { ref: 'INV-TRF-2024-0114', from: 'ST-001', to: 'ST-005', value: '5,400',  date: 'Dec 09', status: 'draft' },
    { ref: 'INV-TRF-2024-0113', from: 'ST-002', to: 'ST-001', value: '88,400', date: 'Dec 07', status: 'delivered' },
    { ref: 'INV-TRF-2024-0112', from: 'ST-003', to: 'ST-002', value: '14,200', date: 'Dec 05', status: 'cancelled' },
  ];
  const filters = [
    { id: 'all',        label: 'All',        tone: IXC.fg2 },
    { id: 'draft',      label: 'Draft',      tone: IXC.fg2 },
    { id: 'in-transit', label: 'Transit',    tone: IXC.orange },
    { id: 'delivered',  label: 'Delivered',  tone: IXC.green },
    { id: 'cancelled',  label: 'Cancelled',  tone: IXC.red },
  ];
  const visible = transfers.filter(t => status === 'all' || t.status === status);
  const pillTone = (s) => s === 'delivered' ? 'success' : (s === 'in-transit' ? 'warning' : (s === 'cancelled' ? 'danger' : 'neutral'));
  return (
    <IXScroll>
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 2 }}>
        {filters.map((f) => {
          const isAct = status === f.id;
          return (
            <button key={f.id} onClick={() => setStatus(f.id)} style={{
              flexShrink: 0, padding: '7px 14px', borderRadius: 999,
              border: `1px solid ${isAct ? f.tone : IXC.border}`,
              background: isAct ? `${f.tone}1F` : IXC.input,
              color: isAct ? f.tone : IXC.fg3,
              fontSize: 11, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase',
              fontFamily: IXC.body, cursor: 'pointer',
            }}>{f.label}</button>
          );
        })}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: IXC.input, border: `1px solid ${IXC.border}`, borderRadius: 8 }}>
        <IXIcon name="clock" size={13} color={IXC.fg3} />
        <span style={{ fontFamily: IXC.mono, fontSize: 12, color: IXC.fg2 }}>Dec 01 – Dec 31, 2025</span>
        <IXIcon name="chevD" size={13} color={IXC.fg3} />
      </div>
      <IXCard marker={IXC.blue} title={`${visible.length} Transfers`} pad={8}>
        <div style={{ padding: '0 4px' }}>
          {visible.map((t, i) => (
            <div key={t.ref} onClick={() => go && go('transferDetail')} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 4px', borderBottom: i < visible.length - 1 ? `1px solid ${IXC.border}` : 'none', cursor: 'pointer' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: IXC.mono, fontSize: 11.5, color: IXC.blue }}>{t.ref}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4, fontFamily: IXC.body, fontSize: 12, color: IXC.fg2 }}>
                  <span>{t.from}</span>
                  <IXIcon name="chevR" size={11} color={IXC.fg4} />
                  <span>{t.to}</span>
                  <span style={{ color: IXC.fg4, marginLeft: 4 }}>· {t.date}</span>
                </div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontFamily: IXC.mono, fontSize: 13, fontWeight: 700, color: IXC.fg1 }}>{t.value}</div>
                <div style={{ marginTop: 4 }}><IXPill tone={pillTone(t.status)}>{t.status === 'in-transit' ? 'Transit' : t.status[0].toUpperCase() + t.status.slice(1)}</IXPill></div>
              </div>
            </div>
          ))}
        </div>
      </IXCard>
    </IXScroll>
  );
}

/* ───────── register ───────── */
Object.assign(window.MScreens = window.MScreens || {}, {
  invDashboard:  MInventoryDashboard,
  stockTake:     MStockTake,
  categories:    MCategories,
  uom:           MUnitsOfMeasure,
  priceLists:    MPriceLists,
  barcodePrint:  MBarcodePrint,
  warehousesList: MWarehousesList,
  transferList:  MTransferList,
});
