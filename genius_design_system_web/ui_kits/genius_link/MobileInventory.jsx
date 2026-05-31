/* global React */
// GeniusLink mobile — V3 Stage B · Products & Inventory Operations.
// The Products section + collapsible-section/scanner/product-row pattern follows the
// Figma "Transfer-Inventory---Create-Mobile" design; other screens reuse that pattern
// and mirror the desktop data model (Products / ReceiveInventory / TransferInventory /
// InventoryAdjustment / IssueInventory).
// Exposes shared inventory-mobile primitives on window._minv (reused by Journal + Currencies).

const MIv = window._mob;
const { C: IC, MIcon: IIcon, Pill: IPill, MCard: ICard, MBtn: IBtn, Scroll: IScroll, Mini: IMini } = MIv;
const { useState: useIState } = React;

/* ═════════ shared inventory-mobile primitives (window._minv) ═════════ */

// Collapsible section card with icon + colored marker + chevron header
function ISection({ icon, title, marker = IC.blue, sub, defaultOpen = true, children, right }) {
  const [open, setOpen] = useIState(defaultOpen);
  return (
    <div style={{ background: IC.surface, border: `1px solid ${IC.border}`, borderRadius: 12, overflow: 'hidden' }}>
      <div onClick={() => setOpen(!open)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px 14px 0', cursor: 'pointer', position: 'relative' }}>
        <div style={{ width: 4, alignSelf: 'stretch', borderRadius: '0 12px 12px 0', background: marker }} />
        <div style={{ width: 30, height: 30, borderRadius: 8, background: `${marker}1F`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: marker, flexShrink: 0 }}>
          <IIcon name={icon} size={16} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: 12.5, letterSpacing: '0.06em', textTransform: 'uppercase', color: IC.fg1, fontFamily: IC.body }}>{title}</div>
          {sub && <div style={{ fontSize: 11.5, color: IC.fg3, marginTop: 3, fontFamily: IC.body, textTransform: 'none', letterSpacing: 0 }}>{sub}</div>}
        </div>
        {right}
        <span style={{ color: IC.fg3, display: 'flex', transform: open ? 'none' : 'rotate(-90deg)', transition: 'transform 150ms ease', paddingRight: 16 }}><IIcon name="chevD" size={18} /></span>
      </div>
      {open && <div style={{ padding: '4px 16px 18px', display: 'flex', flexDirection: 'column', gap: 14 }}>{children}</div>}
    </div>
  );
}

// Flexible field: plain / locked / select / leading-icon / arabic
function IField({ label, value, placeholder, icon, locked, select, mono, ar, required }) {
  return (
    <div dir={ar ? 'rtl' : 'ltr'}>
      <div style={{ fontWeight: 700, fontSize: 10, letterSpacing: '0.05em', textTransform: 'uppercase', color: IC.fg2, marginBottom: 7, fontFamily: IC.body }}>{label}{required && <span style={{ color: IC.red, marginInlineStart: 2 }}>*</span>}</div>
      <div style={{ height: 46, padding: '0 14px', background: IC.input, border: `1px solid ${IC.borderStrong}`, borderRadius: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
        {icon && <IIcon name={icon} size={16} color={IC.fg3} />}
        <span style={{ flex: 1, fontFamily: mono ? IC.mono : (ar ? IC.arabic : IC.body), fontSize: 14, color: value ? IC.fg1 : IC.fg3, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value || placeholder}</span>
        {locked && <IIcon name="lock" size={14} color={IC.fg3} />}
        {select && <IIcon name="chevD" size={15} color={IC.fg3} />}
      </div>
    </div>
  );
}

function ITextarea({ label, placeholder }) {
  return (
    <div>
      <div style={{ fontWeight: 700, fontSize: 10, letterSpacing: '0.05em', textTransform: 'uppercase', color: IC.fg2, marginBottom: 7, fontFamily: IC.body }}>{label}</div>
      <div style={{ minHeight: 88, padding: '12px 14px', background: IC.input, border: `1px solid ${IC.borderStrong}`, borderRadius: 8, fontFamily: IC.body, fontSize: 14, color: IC.fg3 }}>{placeholder}</div>
    </div>
  );
}

// Barcode scanner box with corner brackets + Scan Manually button
function Scanner() {
  const bracket = (pos) => {
    const s = { position: 'absolute', width: 26, height: 26, borderColor: `${IC.blue}99`, borderStyle: 'solid', borderWidth: 0 };
    const m = 18;
    if (pos === 'tl') return { ...s, top: m, left: m, borderTopWidth: 2, borderLeftWidth: 2, borderTopLeftRadius: 4 };
    if (pos === 'tr') return { ...s, top: m, right: m, borderTopWidth: 2, borderRightWidth: 2, borderTopRightRadius: 4 };
    if (pos === 'bl') return { ...s, bottom: m, left: m, borderBottomWidth: 2, borderLeftWidth: 2, borderBottomLeftRadius: 4 };
    return { ...s, bottom: m, right: m, borderBottomWidth: 2, borderRightWidth: 2, borderBottomRightRadius: 4 };
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ position: 'relative', height: 168, background: IC.card2, borderRadius: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
        {['tl', 'tr', 'bl', 'br'].map((p) => <div key={p} style={bracket(p)} />)}
        <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke={IC.fg4} strokeWidth="1.4" strokeLinecap="round">
          {['M4 6v12', 'M7 6v12', 'M10 6v12', 'M13 6v12', 'M16 6v12', 'M20 6v12'].map((d, i) => <path key={i} d={d} />)}
        </svg>
        <span style={{ fontSize: 12, color: IC.fg3, fontFamily: IC.body }}>Point your camera at a barcode to scan</span>
      </div>
      <button style={{ height: 46, background: 'transparent', border: `1px solid ${IC.borderStrong}`, borderRadius: 10, color: IC.fg1, fontWeight: 700, fontSize: 12.5, letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: IC.body, cursor: 'pointer' }}>Scan Manually</button>
    </div>
  );
}

function QtyStepper({ value }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', background: IC.input, border: `1px solid ${IC.border}`, borderRadius: 8, overflow: 'hidden' }}>
      <span style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', color: IC.fg2, cursor: 'pointer' }}><IIcon name="minus" size={15} /></span>
      <span style={{ minWidth: 34, textAlign: 'center', fontFamily: IC.mono, fontSize: 14, fontWeight: 600, color: IC.fg1 }}>{value}</span>
      <span style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', color: IC.fg2, cursor: 'pointer' }}><IIcon name="plus" size={15} /></span>
    </div>
  );
}

// Product line row with qty stepper (Figma pattern)
function ProductRow({ name, sku, qty, price, total, currency = '$', last }) {
  return (
    <div style={{ padding: '14px 0', borderBottom: last ? 'none' : `1px solid ${IC.border}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: IC.fg1, fontFamily: IC.body }}>{name}</div>
          <div style={{ fontFamily: IC.mono, fontSize: 11, color: IC.fg3, marginTop: 2 }}>SKU: {sku}</div>
        </div>
        <span style={{ color: IC.fg3, cursor: 'pointer', display: 'flex', flexShrink: 0 }}><IIcon name="trash" size={16} /></span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontWeight: 700, fontSize: 9.5, letterSpacing: '0.06em', textTransform: 'uppercase', color: IC.fg3, fontFamily: IC.body }}>Qty</span>
          <QtyStepper value={qty} />
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: IC.mono, fontSize: 11, color: IC.fg3 }}>{currency}{price} / unit</div>
          <div style={{ fontFamily: IC.mono, fontSize: 16, fontWeight: 700, color: IC.fg1, marginTop: 2 }}>{currency}{total}</div>
        </div>
      </div>
    </div>
  );
}

function AddProductBtn() {
  return (
    <button style={{ height: 46, background: 'transparent', border: `2px dashed ${IC.borderStrong}`, borderRadius: 10, color: IC.blue, fontWeight: 700, fontSize: 12, letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: IC.body, cursor: 'pointer' }}>+ Add Another Product</button>
  );
}

function UploadBox() {
  return (
    <div style={{ minHeight: 110, border: `2px dashed ${IC.borderStrong}`, borderRadius: 10, background: IC.input, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, color: IC.fg3, cursor: 'pointer' }}>
      <IIcon name="cloud" size={26} color={IC.fg3} />
      <div style={{ fontSize: 13, color: IC.fg1, fontFamily: IC.body, fontWeight: 600 }}>Click to upload or drag and drop</div>
      <div style={{ fontFamily: IC.mono, fontSize: 10.5, color: IC.fg3 }}>PDF, JPG, PNG (MAX 10MB)</div>
    </div>
  );
}

function IKV({ k, v, mono, ar }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
      <span style={{ fontWeight: 700, fontSize: 10, letterSpacing: '0.05em', textTransform: 'uppercase', color: IC.fg3, fontFamily: IC.body, flexShrink: 0 }}>{k}</span>
      <span dir={ar ? 'rtl' : 'ltr'} style={{ fontSize: 13, color: IC.fg1, fontFamily: ar ? IC.arabic : (mono ? IC.mono : IC.body), textAlign: 'right' }}>{v}</span>
    </div>
  );
}

function IToggle({ label, on }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 0' }}>
      <span style={{ fontWeight: 700, fontSize: 10, letterSpacing: '0.05em', textTransform: 'uppercase', color: IC.fg2, fontFamily: IC.body }}>{label}</span>
      <div style={{ width: 42, height: 24, borderRadius: 999, background: on ? IC.blue : IC.input, border: `1px solid ${IC.borderStrong}`, position: 'relative' }}>
        <span style={{ position: 'absolute', top: 2, left: on ? 20 : 2, width: 18, height: 18, borderRadius: 999, background: '#fff', boxShadow: '0 1px 2px rgba(0,0,0,0.3)', transition: 'left 150ms ease' }} />
      </div>
    </div>
  );
}

function InfoNote({ tone = IC.orange, children }) {
  return (
    <div style={{ display: 'flex', gap: 10, padding: '12px 14px', background: `${tone}14`, border: `1px solid ${tone}40`, borderRadius: 8, fontSize: 11.5, color: IC.fg2, lineHeight: 1.5, fontFamily: IC.body }}>
      <span style={{ color: tone, flexShrink: 0, marginTop: 1 }}><IIcon name="info" size={14} /></span>
      <span>{children}</span>
    </div>
  );
}

function ActionRow({ secondary = 'Cancel', primary, icon = 'check' }) {
  return (
    <div style={{ display: 'flex', gap: 10 }}>
      <IBtn variant="secondary" full>{secondary}</IBtn>
      <IBtn variant="primary" icon={icon} full>{primary}</IBtn>
    </div>
  );
}

window._minv = { ISection, IField, ITextarea, Scanner, QtyStepper, ProductRow, AddProductBtn, UploadBox, IKV, IToggle, InfoNote, ActionRow };

/* ═════════ data ═════════ */
const PRODUCTS = [
  { sku: 'STL-44021', en: 'Structural Steel I-Beam', ar: 'كمرة فولاذية', cat: 'Steel', unit: 'PCS', cost: '450.00', stock: 142, status: 'in' },
  { sku: 'CMT-90112', en: 'Portland Cement Type I', ar: 'إسمنت بورتلاند', cat: 'Cement', unit: 'BAG', cost: '24.50', stock: 1820, status: 'in' },
  { sku: 'AGG-21044', en: 'Coarse Aggregate 20mm', ar: 'حصى خشن ٢٠ مم', cat: 'Aggregate', unit: 'TON', cost: '125.00', stock: 46, status: 'low' },
  { sku: 'RBR-71203', en: 'Reinforcement Bar #6', ar: 'حديد تسليح ٦', cat: 'Steel', unit: 'PCS', cost: '78.00', stock: 0, status: 'out' },
  { sku: 'PLY-30022', en: 'Plywood Sheet 18mm', ar: 'لوح خشب ١٨ مم', cat: 'Timber', unit: 'SHT', cost: '92.00', stock: 312, status: 'in' },
  { sku: 'PNT-55310', en: 'Epoxy Floor Coating', ar: 'طلاء إيبوكسي', cat: 'Finishing', unit: 'L', cost: '38.00', stock: 88, status: 'in' },
];
const statusPill = (s) => s === 'in' ? <IPill tone="success">In Stock</IPill> : (s === 'low' ? <IPill tone="warning">Low</IPill> : <IPill tone="danger">Out</IPill>);

/* ═════════ 1 · PRODUCTS LIST ═════════ */
function MProductsList({ go }) {
  const cats = ['All', 'Steel', 'Cement', 'Aggregate', 'Timber', 'Finishing'];
  return (
    <IScroll>
      <div style={{ height: 44, padding: '0 14px', background: IC.input, border: `1px solid ${IC.borderStrong}`, borderRadius: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
        <IIcon name="searchO" size={16} color={IC.fg3} />
        <span style={{ color: IC.fg3, fontSize: 14, fontFamily: IC.body }}>Search product or SKU…</span>
      </div>
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 2 }}>
        {cats.map((c, i) => (
          <span key={c} style={{ flexShrink: 0, padding: '7px 14px', borderRadius: 999, fontSize: 11, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', fontFamily: IC.body, background: i === 0 ? IC.blue : IC.input, color: i === 0 ? '#fff' : IC.fg3, border: `1px solid ${i === 0 ? IC.blue : IC.border}` }}>{c}</span>
        ))}
      </div>
      <ICard pad={8}>
        {PRODUCTS.map((p, i) => (
          <div key={p.sku} onClick={() => go('productDetail')} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 8px', borderBottom: i < PRODUCTS.length - 1 ? `1px solid ${IC.border}` : 'none', cursor: 'pointer' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: IC.fg1, fontFamily: IC.body }}>{p.en}</div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 3 }}>
                <span style={{ fontFamily: IC.mono, fontSize: 11, color: IC.fg3 }}>{p.sku}</span>
                <span style={{ fontSize: 11, color: IC.fg4 }}>·</span>
                <span style={{ fontSize: 11, color: IC.fg3, fontFamily: IC.body }}>{p.cat}</span>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: IC.mono, fontSize: 13, fontWeight: 600, color: p.stock === 0 ? IC.red : (p.status === 'low' ? IC.orange : IC.fg1) }}>{p.stock.toLocaleString()} <span style={{ fontSize: 10, color: IC.fg3 }}>{p.unit}</span></div>
              <div style={{ marginTop: 4 }}>{statusPill(p.status)}</div>
            </div>
          </div>
        ))}
      </ICard>
    </IScroll>
  );
}

/* ═════════ 2 · PRODUCT DETAILS ═════════ */
function MProductDetails() {
  const byStore = [
    { store: 'Downtown Central', code: 'ST-001', qty: 88, value: '39,600.00' },
    { store: 'King Fahd Warehouse', code: 'ST-002', qty: 42, value: '18,900.00' },
    { store: 'Jeddah Showroom', code: 'ST-003', qty: 12, value: '5,400.00' },
  ];
  const moves = [
    { ref: 'INV-ISS-0089', type: 'Issue', qty: '−12', when: 'Dec 18' },
    { ref: 'INV-REC-0241', type: 'Receive', qty: '+32', when: 'Dec 16' },
    { ref: 'INV-TRF-0117', type: 'Transfer', qty: '±18', when: 'Dec 14' },
  ];
  return (
    <IScroll>
      <ICard marker={IC.green} title="Stock Summary" sub="Aggregated across all stores" right={statusPill('in')}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <IMini label="Total On Hand" value="142" sub="PCS" hi />
          <IMini label="Stock Value" value="63,900" sub="SAR" />
          <IMini label="Avg Unit Cost" value="450.00" sub="SAR" />
          <IMini label="Reorder Level" value="50" sub="PCS" />
        </div>
      </ICard>
      <ICard marker={IC.blue} title="Product Information">
        <IKV k="SKU" v="STL-44021" mono /><IKV k="Barcode" v="6 281000 044021" mono />
        <IKV k="Category" v="Steel" /><IKV k="Unit" v="PCS" />
        <IKV k="Selling Price" v="540.00 SAR" /><IKV k="VAT Rate" v="15%" />
      </ICard>
      <ICard marker={IC.green} title="Stock by Store" pad={8}>
        <div style={{ padding: '0 8px' }}>
          {byStore.map((b, i) => (
            <div key={b.code} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: i < byStore.length - 1 ? `1px solid ${IC.border}` : 'none' }}>
              <span style={{ fontFamily: IC.mono, fontSize: 11, color: IC.fg3, width: 54 }}>{b.code}</span>
              <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: IC.fg1, fontFamily: IC.body }}>{b.store}</span>
              <span style={{ fontFamily: IC.mono, fontSize: 13, color: IC.fg2 }}>{b.qty}</span>
              <span style={{ fontFamily: IC.mono, fontSize: 13, fontWeight: 600, color: IC.fg1, width: 80, textAlign: 'right' }}>{b.value}</span>
            </div>
          ))}
        </div>
      </ICard>
      <ICard marker={IC.orange} title="Recent Movements" pad={8}>
        <div style={{ padding: '0 8px' }}>
          {moves.map((m, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: i < moves.length - 1 ? `1px solid ${IC.border}` : 'none' }}>
              <span style={{ fontFamily: IC.mono, fontSize: 12, color: IC.blue, flex: 1 }}>{m.ref}</span>
              <span style={{ fontSize: 12, color: IC.fg3, fontFamily: IC.body }}>{m.type}</span>
              <span style={{ fontFamily: IC.mono, fontSize: 13, fontWeight: 600, width: 48, textAlign: 'right', color: m.qty.startsWith('+') ? IC.green : (m.qty.startsWith('−') ? IC.red : IC.fg2) }}>{m.qty}</span>
              <span style={{ fontFamily: IC.mono, fontSize: 11, color: IC.fg3, width: 44, textAlign: 'right' }}>{m.when}</span>
            </div>
          ))}
        </div>
      </ICard>
      <IBtn variant="secondary" icon="back" full>Back to Products</IBtn>
    </IScroll>
  );
}

/* ═════════ 3 · CREATE PRODUCT ═════════ */
function MCreateProduct() {
  return (
    <IScroll>
      <ISection icon="box" title="Product Definition" sub="SKU, names and classification" marker={IC.blue}>
        <IField label="SKU" placeholder="e.g. STL-44021" mono required />
        <IField label="Barcode" placeholder="Scan or type" mono icon="scan" />
        <IField label="Name English" placeholder="e.g. Structural Steel I-Beam" required />
        <IField label="الاسم بالعربية" placeholder="مثال: كمرة فولاذية" ar required />
        <IField label="Category" value="Steel" select />
        <IField label="Unit of Measure" value="PCS" select />
      </ISection>
      <ISection icon="swap" title="Costing & Pricing" marker={IC.green}>
        <IField label="Unit Cost (SAR)" placeholder="0.00" mono />
        <IField label="Selling Price (SAR)" placeholder="0.00" mono />
        <IField label="VAT Rate" value="15%" select />
      </ISection>
      <ISection icon="store" title="Inventory Settings" marker={IC.orange}>
        <IField label="Reorder Level" placeholder="e.g. 50" mono />
        <IField label="Default Store" value="Downtown Central" select />
        <IField label="Opening Stock" placeholder="0" mono />
        <UploadBox />
      </ISection>
      <ActionRow primary="Create Product" />
    </IScroll>
  );
}

/* ═════════ 4 · ISSUE INVENTORY DETAILS ═════════ */
function MIssueDetails() {
  const items = [{ name: 'Structural Steel', sku: 'STL-44021', qty: 12, unit: 'PCS', total: '5,400.00' }];
  return (
    <IScroll>
      <ICard marker={IC.green} title="Issued Value" sub="INV-ISS-2024-0089 · Dec 18, 2025" right={<IPill tone="success">Posted</IPill>}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span style={{ fontFamily: IC.mono, fontSize: 14, color: IC.fg3 }}>USD</span>
          <span style={{ fontFamily: IC.mono, fontSize: 32, fontWeight: 700, color: IC.fg1, letterSpacing: '-0.02em' }}>5,400.00</span>
        </div>
      </ICard>
      <ICard marker={IC.blue} title="Issue Information">
        <IKV k="Serial No" v="INV-ISS-2024-0089" mono /><IKV k="Store" v="Downtown Central" />
        <IKV k="Customer" v="Project A-92" /><IKV k="Currency" v="USD — US Dollar" />
      </ICard>
      <ICard marker={IC.green} title="Items" sub="1 line · 12 units" pad={8}>
        <div style={{ padding: '0 8px' }}>
          {items.map((it, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0' }}>
              <div>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: IC.fg1, fontFamily: IC.body }}>{it.name}</div>
                <div style={{ fontFamily: IC.mono, fontSize: 11, color: IC.fg3, marginTop: 2 }}>{it.sku} · {it.qty} {it.unit}</div>
              </div>
              <span style={{ fontFamily: IC.mono, fontSize: 14, fontWeight: 600, color: IC.fg1 }}>{it.total}</span>
            </div>
          ))}
        </div>
      </ICard>
      <ICard marker={IC.green} title="Accounting Distribution" pad={8}>
        <div style={{ padding: '0 8px' }}>
          {[{ acc: '1200 — Inventory (WIP)', side: 'Debit', amt: '+5,400.00', tone: IC.green }, { acc: '5001 — Cost of Goods Sold', side: 'Credit', amt: '−5,400.00', tone: IC.red }].map((l, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: i === 0 ? `1px solid ${IC.border}` : 'none' }}>
              <div><div style={{ fontSize: 13, fontWeight: 600, color: IC.fg1, fontFamily: IC.body }}>{l.acc}</div><div style={{ marginTop: 4 }}><IPill tone={l.side === 'Debit' ? 'info' : 'danger'}>{l.side}</IPill></div></div>
              <span style={{ fontFamily: IC.mono, fontSize: 13.5, fontWeight: 600, color: l.tone }}>{l.amt}</span>
            </div>
          ))}
        </div>
      </ICard>
      <IBtn variant="secondary" icon="back" full>Back to Operations</IBtn>
    </IScroll>
  );
}

/* ═════════ 5 · RECEIVE INVENTORY — CREATE ═════════ */
function MReceiveCreate() {
  return (
    <IScroll>
      <ISection icon="box" title="Receive Details" marker={IC.blue}>
        <IField label="Serial No" value="INV-REC-2024-0241" mono locked />
        <IField label="Currency" value="SAR — Saudi Riyal" select />
        <IField label="Receiving Store" placeholder="Search store…" icon="store" required />
        <IField label="Supplier Account" placeholder="e.g. ABC Trading Co." required />
      </ISection>
      <ISection icon="cart" title="Inventory Items" sub="2 lines · received into stock" marker={IC.green}>
        <Scanner />
        <ProductRow name="Portland Cement Type I" sku="CMT-90112" qty={400} price="24.50" total="9,800.00" currency="" />
        <ProductRow name="Structural Steel I-Beam" sku="STL-44021" qty={32} price="450.00" total="14,400.00" currency="" last />
        <AddProductBtn />
      </ISection>
      <ISection icon="swap" title="Accounting Distribution" marker={IC.green}>
        {[{ acc: '1200 — Inventory (WIP)', side: 'Debit', amt: '+24,200.00', tone: IC.green }, { acc: '2001 — Accounts Payable', side: 'Credit', amt: '−24,200.00', tone: IC.red }].map((l, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: i === 0 ? `1px solid ${IC.border}` : 'none' }}>
            <div><div style={{ fontSize: 13, fontWeight: 600, color: IC.fg1, fontFamily: IC.body }}>{l.acc}</div><div style={{ marginTop: 4 }}><IPill tone={l.side === 'Debit' ? 'info' : 'danger'}>{l.side}</IPill></div></div>
            <span style={{ fontFamily: IC.mono, fontSize: 13.5, fontWeight: 600, color: l.tone }}>{l.amt}</span>
          </div>
        ))}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, borderTop: `2px solid ${IC.borderStrong}` }}>
          <span style={{ fontWeight: 700, fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase', color: IC.green, fontFamily: IC.body }}>Balanced · Diff 0.00</span>
          <span style={{ fontFamily: IC.mono, fontSize: 15, fontWeight: 700, color: IC.fg1 }}>24,200.00</span>
        </div>
      </ISection>
      <ISection icon="doc" title="Notes & Docs" marker={IC.orange}>
        <ITextarea label="Receipt Notes" placeholder="PO number, delivery note, inspection results…" />
        <UploadBox />
      </ISection>
      <ActionRow primary="Receive Inventory" />
    </IScroll>
  );
}

/* ═════════ 6 · RECEIVE INVENTORY — DETAILS ═════════ */
function MReceiveDetails() {
  return (
    <IScroll>
      <ICard marker={IC.green} title="Received Value" sub="INV-REC-2024-0241 · Dec 16, 2025" right={<IPill tone="success">Posted</IPill>}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span style={{ fontFamily: IC.mono, fontSize: 14, color: IC.fg3 }}>SAR</span>
          <span style={{ fontFamily: IC.mono, fontSize: 32, fontWeight: 700, color: IC.green, letterSpacing: '-0.02em' }}>+24,200.00</span>
        </div>
      </ICard>
      <ICard marker={IC.blue} title="Receipt Information">
        <IKV k="Serial No" v="INV-REC-2024-0241" mono /><IKV k="Receiving Store" v="King Fahd Warehouse" />
        <IKV k="Supplier" v="ABC Trading Co." /><IKV k="PO Reference" v="PO-2024-1182" mono />
      </ICard>
      <ICard marker={IC.green} title="Items" sub="2 lines · 432 units" pad={8}>
        <div style={{ padding: '0 8px' }}>
          {[{ n: 'Portland Cement Type I', q: '400 BAG × 24.50', t: '9,800.00' }, { n: 'Structural Steel I-Beam', q: '32 PCS × 450.00', t: '14,400.00' }].map((it, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: i === 0 ? `1px solid ${IC.border}` : 'none' }}>
              <div><div style={{ fontSize: 13.5, fontWeight: 600, color: IC.fg1, fontFamily: IC.body }}>{it.n}</div><div style={{ fontFamily: IC.mono, fontSize: 11, color: IC.fg3, marginTop: 2 }}>{it.q}</div></div>
              <span style={{ fontFamily: IC.mono, fontSize: 14, fontWeight: 600, color: IC.fg1 }}>{it.t}</span>
            </div>
          ))}
        </div>
      </ICard>
      <ICard marker={IC.orange} title="Audit Information">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {[['Received By', 'Layla A. (ID: 12)'], ['Received At', 'Dec 16, 14:32'], ['Linked Journal', 'JV-2024-0241'], ['Audit Hash', 'b3e1…a072']].map(([k, v]) => (
            <div key={k}><div style={{ fontWeight: 700, fontSize: 9.5, letterSpacing: '0.05em', textTransform: 'uppercase', color: IC.fg3, marginBottom: 5, fontFamily: IC.body }}>{k}</div><div style={{ fontSize: 12.5, color: IC.fg1, fontFamily: k === 'Audit Hash' || k === 'Linked Journal' ? IC.mono : IC.body }}>{v}</div></div>
          ))}
        </div>
      </ICard>
      <IBtn variant="secondary" icon="back" full>Back to List</IBtn>
    </IScroll>
  );
}

/* ═════════ 7 · TRANSFER INVENTORY — CREATE (Figma) ═════════ */
function MTransferCreate() {
  return (
    <IScroll>
      <ISection icon="box" title="Transfer Details" marker={IC.blue}>
        <IField label="Serial No" value="INV-TRF-2024-0117" mono locked />
        <IField label="Currency" value="SAR — Saudi Riyal" select />
        <IField label="From Store" placeholder="Search origin warehouse…" icon="store" required />
        <IField label="To Store" placeholder="Search destination…" icon="pin" required />
      </ISection>
      <ISection icon="cart" title="Products" marker={IC.blue}>
        <Scanner />
        <ProductRow name="Coarse Aggregate 20mm" sku="AGG-21044" qty={18} price="125.00" total="2,250.00" currency="" />
        <ProductRow name="Reinforcement Bar #6" sku="RBR-71203" qty={240} price="78.00" total="18,720.00" currency="" last />
        <AddProductBtn />
      </ISection>
      <ISection icon="doc" title="Notes & Docs" marker={IC.orange}>
        <ITextarea label="Notes" placeholder="Enter transfer notes or internal instructions…" />
        <UploadBox />
      </ISection>
      <ActionRow primary="Transfer Inventory" />
    </IScroll>
  );
}

/* ═════════ 8 · TRANSFER INVENTORY — DETAILS ═════════ */
function MTransferDetails() {
  const StoreCard = ({ tone, label, store, ar, delta, deltaColor }) => (
    <div style={{ padding: 14, background: `${tone}0F`, border: `1px solid ${tone}40`, borderRadius: 10, display: 'flex', gap: 12 }}>
      <div style={{ width: 4, alignSelf: 'stretch', borderRadius: 12, background: tone }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 700, fontSize: 9.5, letterSpacing: '0.08em', textTransform: 'uppercase', color: tone, marginBottom: 6, fontFamily: IC.body }}>{label}</div>
        <div style={{ fontSize: 13.5, fontWeight: 600, color: IC.fg1, fontFamily: IC.body }}>{store}</div>
        <div dir="rtl" style={{ fontFamily: IC.arabic, fontSize: 12, color: IC.fg3, marginTop: 2 }}>{ar}</div>
        <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${IC.border}`, fontFamily: IC.mono, fontSize: 11.5, fontWeight: 600, color: deltaColor }}>{delta}</div>
      </div>
    </div>
  );
  return (
    <IScroll>
      <ICard marker={IC.blue} title="In Transit" right={<IPill tone="warning">In Transit</IPill>}>
        <div style={{ fontFamily: IC.mono, fontSize: 12, color: IC.blue, marginTop: -6 }}>INV-TRF-2024-0117</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          <StoreCard tone={IC.orange} label="From Store" store="ST-001 · Downtown Central" ar="متجر وسط المدينة" delta="−54,892 SAR" deltaColor={IC.red} />
          <div style={{ display: 'flex', justifyContent: 'center', margin: '-6px 0', position: 'relative', zIndex: 1 }}>
            <div style={{ width: 36, height: 36, borderRadius: 999, background: IC.blue, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 6px 18px -6px ${IC.blue}99`, transform: 'rotate(90deg)' }}><IIcon name="chevR" size={18} color="#fff" /></div>
          </div>
          <StoreCard tone={IC.green} label="To Store" store="ST-002 · King Fahd Warehouse" ar="مستودع الملك فهد" delta="+54,892 SAR" deltaColor={IC.green} />
        </div>
      </ICard>
      <ICard marker={IC.green} title="Items in Transit" sub="2 lines · 258 units" pad={8}>
        <div style={{ padding: '0 8px' }}>
          {[{ n: 'Coarse Aggregate 20mm', q: '18 TON × 125.00', t: '2,250.00' }, { n: 'Reinforcement Bar #6', q: '240 PCS × 78.00', t: '18,720.00' }].map((it, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: i === 0 ? `1px solid ${IC.border}` : 'none' }}>
              <div><div style={{ fontSize: 13.5, fontWeight: 600, color: IC.fg1, fontFamily: IC.body }}>{it.n}</div><div style={{ fontFamily: IC.mono, fontSize: 11, color: IC.fg3, marginTop: 2 }}>{it.q}</div></div>
              <span style={{ fontFamily: IC.mono, fontSize: 14, fontWeight: 600, color: IC.fg1 }}>{it.t}</span>
            </div>
          ))}
        </div>
      </ICard>
      <ICard marker={IC.blue} title="Logistics & Tracking">
        <IKV k="Carrier" v="Plate 4892-RKD" /><IKV k="Driver" v="Mohammed S." />
        <IKV k="Expected Arrival" v="Dec 20, 2025" mono />
      </ICard>
      <IBtn variant="secondary" icon="back" full>Back to List</IBtn>
    </IScroll>
  );
}

/* ═════════ 9 · INVENTORY ADJUSTMENT ═════════ */
function MAdjustment() {
  const items = [
    { sku: 'STL-44021', name: 'Structural Steel I-Beam', system: 142, counted: 140, reason: 'Damaged · 2 units' },
    { sku: 'CMT-90112', name: 'Portland Cement Type I', system: 1820, counted: 1834, reason: 'Receiving miscount · +14' },
    { sku: 'AGG-21044', name: 'Coarse Aggregate 20mm', system: 48, counted: 46, reason: 'Spillage · 2 tons' },
  ];
  return (
    <IScroll>
      <ISection icon="box" title="Adjustment Details" marker={IC.blue}>
        <IField label="Serial No" value="INV-ADJ-2024-0058" mono locked />
        <IField label="Reason" value="Physical Stock Count" select />
        <IField label="Store" placeholder="Search store…" icon="store" required />
        <IField label="Count Date" placeholder="mm/dd/yyyy" mono icon="calendar" />
      </ISection>
      <ICard marker={IC.orange} title="Variance Summary" sub="Net financial impact of this reconciliation">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <IMini label="Lines Adjusted" value="3" />
          <IMini label="Net Adjustment" value="−307.00" sub="SAR" />
        </div>
      </ICard>
      <ICard marker={IC.green} title="Adjustment Lines" pad={8}>
        <div style={{ padding: '0 8px' }}>
          {items.map((it, i) => {
            const delta = it.counted - it.system;
            const pos = delta > 0;
            const tone = delta === 0 ? IC.fg2 : (pos ? IC.green : IC.red);
            return (
              <div key={it.sku} style={{ padding: '12px 0', borderBottom: i < items.length - 1 ? `1px solid ${IC.border}` : 'none' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 600, color: IC.fg1, fontFamily: IC.body }}>{it.name}</div>
                    <div style={{ fontFamily: IC.mono, fontSize: 11, color: IC.fg3, marginTop: 2 }}>{it.sku} · {it.reason}</div>
                  </div>
                  <span style={{ fontFamily: IC.mono, fontSize: 15, fontWeight: 700, color: tone, flexShrink: 0 }}>{pos ? '+' : ''}{delta}</span>
                </div>
                <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
                  <span style={{ fontFamily: IC.mono, fontSize: 11, color: IC.fg3 }}>System <span style={{ color: IC.fg2 }}>{it.system}</span></span>
                  <span style={{ fontFamily: IC.mono, fontSize: 11, color: IC.fg3 }}>Counted <span style={{ color: IC.fg1, fontWeight: 600 }}>{it.counted}</span></span>
                </div>
              </div>
            );
          })}
        </div>
      </ICard>
      <ISection icon="doc" title="Documentation & Approval" marker={IC.orange}>
        <ITextarea label="Adjustment Notes" placeholder="Auditor name, witness, count session reference…" />
        <UploadBox />
        <InfoNote>Adjustments above 1,000 SAR require dual approval. This entry posts to the audit log immediately and notifies the controller.</InfoNote>
      </ISection>
      <ActionRow primary="Post Adjustment" />
    </IScroll>
  );
}

/* ───────── register ───────── */
Object.assign(window.MScreens = window.MScreens || {}, {
  productsList: MProductsList,
  productDetail: MProductDetails,
  createProduct: MCreateProduct,
  issueDetail: MIssueDetails,
  receiveCreate: MReceiveCreate,
  receiveDetail: MReceiveDetails,
  transferCreate: MTransferCreate,
  transferDetail: MTransferDetails,
  adjustment: MAdjustment,
});
