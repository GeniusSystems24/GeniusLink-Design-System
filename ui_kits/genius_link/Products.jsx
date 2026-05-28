/* global React, Page, Card, SectionHeader, Field, Textarea, Button, Icon, StatusPill, LockedField */
// Stage 2 — Products: List + Create + Details

const PRODUCTS = [
  { sku: 'STL-44021', en: 'Structural Steel I-Beam', ar: 'كمرة فولاذية',     cat: 'Steel',     unit: 'PCS', cost: '450.00', stock: 142,  status: 'in-stock' },
  { sku: 'CMT-90112', en: 'Portland Cement Type I',  ar: 'إسمنت بورتلاند',   cat: 'Cement',    unit: 'BAG', cost: '24.50',  stock: 1820, status: 'in-stock' },
  { sku: 'AGG-21044', en: 'Coarse Aggregate 20mm',   ar: 'حصى خشن ٢٠ مم',    cat: 'Aggregate', unit: 'TON', cost: '125.00', stock: 46,   status: 'low' },
  { sku: 'RBR-71203', en: 'Reinforcement Bar #6',    ar: 'حديد تسليح ٦',      cat: 'Steel',     unit: 'PCS', cost: '78.00',  stock: 0,    status: 'out' },
  { sku: 'PLY-30022', en: 'Plywood Sheet 18mm',      ar: 'لوح خشب ١٨ مم',    cat: 'Timber',    unit: 'SHT', cost: '92.00',  stock: 312,  status: 'in-stock' },
  { sku: 'PNT-55310', en: 'Epoxy Floor Coating',     ar: 'طلاء إيبوكسي',      cat: 'Finishing', unit: 'L',   cost: '38.00',  stock: 88,   status: 'in-stock' },
];

function ProductsList({ onCreate, onOpen }) {
  const [query, setQuery] = React.useState('');
  const [cat, setCat] = React.useState('all');
  const cats = ['all', ...Array.from(new Set(PRODUCTS.map(p => p.cat)))];

  const visible = PRODUCTS.filter((p) => {
    if (cat !== 'all' && p.cat !== cat) return false;
    if (!query) return true;
    const q = query.toLowerCase();
    return p.en.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || p.ar.includes(query);
  });
  const grid = '120px 1.8fr 1fr 0.6fr 1fr 0.9fr 100px 40px';

  return (
    <Page breadcrumb={['Stores & Products', 'Products']} title="Products"
      titleRight={<Button variant="primary" icon="plus" onClick={onCreate}>Create Product</Button>}>
      <Card padding={20}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 4, background: 'var(--gl-input-bg)', padding: 4, borderRadius: 6, border: '1px solid var(--gl-border)', flexWrap: 'wrap' }}>
            {cats.map((c) => (
              <button key={c} onClick={() => setCat(c)}
                style={{
                  padding: '6px 14px', borderRadius: 4,
                  background: cat === c ? 'var(--gl-surface)' : 'transparent',
                  color: cat === c ? 'var(--gl-fg-1)' : 'var(--gl-fg-3)',
                  border: 'none', cursor: 'pointer', fontFamily: 'var(--gl-font-body)', fontWeight: 700,
                  fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase',
                  boxShadow: cat === c ? '0 1px 2px rgba(0,0,0,0.2)' : 'none', transition: 'background 150ms ease',
                }}>{c}</button>
            ))}
          </div>
          <div style={{ position: 'relative', flex: '0 0 280px' }}>
            <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--gl-fg-3)', display: 'flex', pointerEvents: 'none' }}>
              <Icon name="search" size={14} />
            </div>
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search product or SKU…"
              style={{ width: '100%', height: 40, padding: '0 16px 0 40px', background: 'var(--gl-input-bg)', border: '1px solid var(--gl-border-strong)', borderRadius: 4, fontFamily: 'var(--gl-font-body)', fontSize: 13, color: 'var(--gl-fg-1)', outline: 'none', boxSizing: 'border-box' }} />
          </div>
        </div>
      </Card>

      <Card padding={0}>
        <div style={{ padding: '20px 24px 0' }}>
          <SectionHeader title={`${visible.length} Product${visible.length === 1 ? '' : 's'}`} subtitle="Stock totals aggregated across all stores" marker="blue" />
        </div>
        <div style={{ padding: '20px 24px 24px' }}>
          <div style={{
            display: 'grid', gridTemplateColumns: grid, gap: 12, padding: '0 0 12px',
            borderBottom: '1px solid var(--gl-border)',
            fontWeight: 700, fontSize: 10, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--gl-fg-3)',
          }}>
            <span>SKU</span><span>Product</span><span>Category</span><span>Unit</span>
            <span style={{ textAlign: 'right' }}>Unit Cost</span>
            <span style={{ textAlign: 'right' }}>Stock</span>
            <span>Status</span><span></span>
          </div>
          {visible.map((p) => <ProductRow key={p.sku} p={p} grid={grid} onClick={() => onOpen && onOpen(p)} />)}
          {visible.length === 0 && <div style={{ padding: '48px 0', textAlign: 'center', color: 'var(--gl-fg-3)', fontSize: 13 }}>No products match.</div>}
        </div>
      </Card>
    </Page>
  );
}

function ProductRow({ p, grid, onClick }) {
  const [hover, setHover] = React.useState(false);
  return (
    <div onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        display: 'grid', gridTemplateColumns: grid, gap: 12, padding: '14px 8px', margin: '0 -8px',
        alignItems: 'center', borderBottom: '1px solid var(--gl-border)',
        background: hover ? 'var(--gl-hover)' : 'transparent', borderRadius: 4, cursor: 'pointer',
        fontSize: 13, color: 'var(--gl-fg-1)', transition: 'background 150ms ease',
      }}>
      <span style={{ fontFamily: 'var(--gl-font-mono)', color: 'var(--gl-fg-2)' }}>{p.sku}</span>
      <span>
        <div style={{ fontWeight: 600 }}>{p.en}</div>
        <div dir="rtl" style={{ fontFamily: 'var(--gl-font-arabic)', fontSize: 12, color: 'var(--gl-fg-3)', marginTop: 2 }}>{p.ar}</div>
      </span>
      <span style={{ color: 'var(--gl-fg-2)' }}>{p.cat}</span>
      <span style={{ fontFamily: 'var(--gl-font-mono)', fontSize: 11, color: 'var(--gl-fg-3)' }}>{p.unit}</span>
      <span style={{ fontFamily: 'var(--gl-font-mono)', textAlign: 'right', color: 'var(--gl-fg-2)' }}>{p.cost}</span>
      <span style={{ fontFamily: 'var(--gl-font-mono)', textAlign: 'right', fontWeight: 600, color: p.stock === 0 ? '#EF4444' : (p.status === 'low' ? '#F97316' : 'var(--gl-fg-1)') }}>{p.stock.toLocaleString()}</span>
      <span>
        {p.status === 'in-stock' && <StatusPill tone="success" size="sm">In Stock</StatusPill>}
        {p.status === 'low' && <StatusPill tone="warning" size="sm">Low</StatusPill>}
        {p.status === 'out' && <StatusPill tone="danger" size="sm">Out</StatusPill>}
      </span>
      <span style={{ justifySelf: 'end', color: 'var(--gl-fg-3)', display: 'flex' }}><Icon name="chevRight" size={14} /></span>
    </div>
  );
}

function CreateProduct({ onCancel, onCreate }) {
  const [name, setName] = React.useState({ en: '', ar: '' });
  return (
    <Page breadcrumb={['Stores & Products', 'Products', 'New']} title="Create Product">
      <Card>
        <SectionHeader title="Product Definition" subtitle="SKU, names and classification" marker="blue" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <Field label="SKU" required placeholder="e.g. STL-44021" mono />
          <Field label="Barcode" placeholder="Scan or type" mono />
          <Field label="Name English" required placeholder="e.g. Structural Steel I-Beam" value={name.en} onChange={(v) => setName({ ...name, en: v })} />
          <Field label="الاسم بالعربية" required placeholder="مثال: كمرة فولاذية" dir="rtl" value={name.ar} onChange={(v) => setName({ ...name, ar: v })} />
          <window._cfgShared.CurSelect label="Category" value="Steel" options={['Steel', 'Cement', 'Aggregate', 'Timber', 'Finishing']} />
          <window._cfgShared.CurSelect label="Unit of Measure" value="PCS" options={['PCS', 'BAG', 'TON', 'SHT', 'L', 'M']} />
        </div>
      </Card>

      <Card>
        <SectionHeader title="Costing &amp; Pricing" marker="green" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24 }}>
          <Field label="Unit Cost (SAR)" placeholder="0.00" mono />
          <Field label="Selling Price (SAR)" placeholder="0.00" mono />
          <window._cfgShared.CurSelect label="VAT Rate" value="15%" options={['0%', '5%', '15%']} />
        </div>
      </Card>

      <Card>
        <SectionHeader title="Inventory Settings" marker="orange" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24 }}>
          <Field label="Reorder Level" placeholder="e.g. 50" mono />
          <window._cfgShared.CurSelect label="Default Store" value="Downtown Central" options={['Downtown Central', 'King Fahd Warehouse', 'Jeddah Showroom']} />
          <Field label="Opening Stock" placeholder="0" mono />
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 11, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--gl-fg-2)', marginBottom: 8 }}>Product Image</div>
          <window._bankShared.UploadDropzone label="PNG or JPG · square preferred" />
        </div>
      </Card>

      <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
        <Button variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button variant="primary" icon="check" onClick={onCreate}>Create Product</Button>
      </div>
    </Page>
  );
}

function ProductDetails({ onBack, onEdit, onDelete }) {
  const byStore = [
    { store: 'Downtown Central', code: 'ST-001', qty: 88,  value: '39,600.00' },
    { store: 'King Fahd Warehouse', code: 'ST-002', qty: 42, value: '18,900.00' },
    { store: 'Jeddah Showroom', code: 'ST-003', qty: 12, value: '5,400.00' },
  ];
  const moves = [
    { ref: 'INV-ISS-0089', type: 'Issue',    qty: '−12', when: 'Dec 18' },
    { ref: 'INV-REC-0241', type: 'Receive',  qty: '+32', when: 'Dec 16' },
    { ref: 'INV-TRF-0117', type: 'Transfer', qty: '±18', when: 'Dec 14' },
  ];
  return (
    <Page breadcrumb={['Stores & Products', 'Products', 'Details']} title="Structural Steel I-Beam" titleArabic="كمرة فولاذية"
      titleRight={
        <div style={{ display: 'flex', gap: 8 }}>
          <Button variant="secondary" icon="edit" onClick={onEdit}>Edit</Button>
          <Button variant="danger" icon="trash" onClick={onDelete}>Delete</Button>
        </div>
      }>
      <Card>
        <SectionHeader title="Stock Summary" subtitle="Aggregated across all stores" marker="green"
                       right={<StatusPill tone="success">In Stock</StatusPill>} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
          <PTile label="Total On Hand" value="142" sub="PCS" highlight />
          <PTile label="Stock Value" value="63,900.00" sub="SAR" />
          <PTile label="Avg Unit Cost" value="450.00" sub="SAR" />
          <PTile label="Reorder Level" value="50" sub="PCS" />
        </div>
      </Card>

      <Card>
        <SectionHeader title="Product Information" marker="blue" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, rowGap: 20 }}>
          <LockedField label="SKU" value="STL-44021" mono />
          <LockedField label="Barcode" value="6 281000 044021" mono />
          <LockedField label="Category" value="Steel" />
          <LockedField label="Unit of Measure" value="PCS" />
          <LockedField label="Selling Price" value="540.00 SAR" />
          <LockedField label="VAT Rate" value="15%" />
        </div>
      </Card>

      <Card padding={0}>
        <div style={{ padding: '20px 24px 0' }}>
          <SectionHeader title="Stock by Store" marker="green" />
        </div>
        <div style={{ padding: '16px 24px 24px' }}>
          <div style={{
            display: 'grid', gridTemplateColumns: '110px 1.6fr 1fr 1.2fr', gap: 12, padding: '0 0 12px',
            borderBottom: '1px solid var(--gl-border)',
            fontWeight: 700, fontSize: 10, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--gl-fg-3)',
          }}>
            <span>Code</span><span>Store</span><span style={{ textAlign: 'right' }}>Qty</span><span style={{ textAlign: 'right' }}>Value</span>
          </div>
          {byStore.map((b, i) => (
            <div key={b.code} style={{
              display: 'grid', gridTemplateColumns: '110px 1.6fr 1fr 1.2fr', gap: 12, padding: '14px 0', alignItems: 'center',
              borderBottom: i < byStore.length - 1 ? '1px solid var(--gl-border)' : 'none', fontSize: 13, color: 'var(--gl-fg-1)',
            }}>
              <span style={{ fontFamily: 'var(--gl-font-mono)', color: 'var(--gl-fg-2)' }}>{b.code}</span>
              <span style={{ fontWeight: 600 }}>{b.store}</span>
              <span style={{ fontFamily: 'var(--gl-font-mono)', textAlign: 'right' }}>{b.qty}</span>
              <span style={{ fontFamily: 'var(--gl-font-mono)', textAlign: 'right', fontWeight: 600 }}>{b.value}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card padding={0}>
        <div style={{ padding: '20px 24px 0' }}>
          <SectionHeader title="Recent Movements" marker="orange" />
        </div>
        <div style={{ padding: '16px 24px 24px' }}>
          {moves.map((m, i) => (
            <div key={i} style={{
              display: 'grid', gridTemplateColumns: '150px 1fr 80px 80px', gap: 12, padding: '14px 0', alignItems: 'center',
              borderBottom: i < moves.length - 1 ? '1px solid var(--gl-border)' : 'none', fontSize: 13,
            }}>
              <span style={{ fontFamily: 'var(--gl-font-mono)', color: '#4A7CFF' }}>{m.ref}</span>
              <span style={{ color: 'var(--gl-fg-2)' }}>{m.type}</span>
              <span style={{ fontFamily: 'var(--gl-font-mono)', textAlign: 'right', fontWeight: 600, color: m.qty.startsWith('+') ? '#1DB88A' : (m.qty.startsWith('−') ? '#EF4444' : 'var(--gl-fg-2)') }}>{m.qty}</span>
              <span style={{ fontFamily: 'var(--gl-font-mono)', fontSize: 12, textAlign: 'right', color: 'var(--gl-fg-3)' }}>{m.when}</span>
            </div>
          ))}
        </div>
      </Card>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Button variant="secondary" icon="back" onClick={onBack}>Back to Products</Button>
      </div>
    </Page>
  );
}

function PTile({ label, value, sub, highlight }) {
  return (
    <div style={{ padding: 18, background: highlight ? 'rgba(29,184,138,0.08)' : 'var(--gl-bg)', border: `1px solid ${highlight ? 'rgba(29,184,138,0.3)' : 'var(--gl-border)'}`, borderRadius: 6 }}>
      <div style={{ fontWeight: 700, fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--gl-fg-3)', marginBottom: 8 }}>{label}</div>
      <div style={{ fontFamily: 'var(--gl-font-mono)', fontSize: 22, fontWeight: 600, color: highlight ? '#1DB88A' : 'var(--gl-fg-1)', lineHeight: 1.1 }}>{value}</div>
      <div style={{ fontFamily: 'var(--gl-font-mono)', fontSize: 11, color: 'var(--gl-fg-3)', marginTop: 6 }}>{sub}</div>
    </div>
  );
}

window.ProductsList = ProductsList;
window.CreateProduct = CreateProduct;
window.ProductDetails = ProductDetails;
