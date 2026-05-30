/* global React */
// GeniusLink mobile — Stores: list, create, details, issue inventory.
// Registers into window.MScreens.

const MS = window._mob;
const { C: MSC, MIcon: MSIcon, Pill: MSPill, MCard: MSCard, MField: MSField, MBtn: MSBtn, Scroll: MSScroll, Mini: MSMini } = MS;

/* ───────── Stores list ───────── */
function MStores({ go }) {
  const rows = [
    { code: 'ST-001', name: 'Downtown Central', ar: 'وسط المدينة', val: '342,820', skus: 1248 },
    { code: 'ST-002', name: 'King Fahd Warehouse', ar: 'مستودع الملك فهد', val: '1,820,460', skus: 4892 },
    { code: 'ST-003', name: 'Jeddah Showroom', ar: 'صالة عرض جدة', val: '128,640', skus: 412 },
  ];
  return (
    <MSScroll>
      {rows.map((r) => (
        <div key={r.code} onClick={() => go('storeDetail')} style={{ background: MSC.surface, border: `1px solid ${MSC.border}`, borderRadius: 12, padding: 16, cursor: 'pointer' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600, color: MSC.fg1, fontFamily: MSC.body }}>{r.name}</div>
              <div dir="rtl" style={{ fontFamily: MSC.arabic, fontSize: 12.5, color: MSC.fg3, marginTop: 2 }}>{r.ar}</div>
            </div>
            <span style={{ fontFamily: MSC.mono, fontSize: 11, color: MSC.fg3 }}>{r.code}</span>
          </div>
          <div style={{ display: 'flex', gap: 20, marginTop: 14, paddingTop: 14, borderTop: `1px solid ${MSC.border}` }}>
            <div><div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: MSC.fg3, fontFamily: MSC.body }}>Value</div><div style={{ fontFamily: MSC.mono, fontSize: 15, fontWeight: 600, color: MSC.fg1, marginTop: 3 }}>{r.val} <span style={{ fontSize: 10, color: MSC.fg3 }}>SAR</span></div></div>
            <div><div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: MSC.fg3, fontFamily: MSC.body }}>SKUs</div><div style={{ fontFamily: MSC.mono, fontSize: 15, fontWeight: 600, color: MSC.fg1, marginTop: 3 }}>{r.skus.toLocaleString()}</div></div>
          </div>
        </div>
      ))}
    </MSScroll>
  );
}

/* ───────── Create Store ───────── */
function MCreateStore() {
  return (
    <MSScroll>
      <MSCard marker={MSC.blue} title="Store Details" sub="Name and location">
        <MSField label="Name English" placeholder="e.g. Downtown Central Store" required />
        <MSField label="الاسم بالعربية" placeholder="مثال: متجر وسط المدينة" ar required />
        <MSField label="Location Code" value="ST-001" mono />
        <MSField label="Store Category" value="Retail" />
        <MSField label="Note" placeholder="Add internal notes…" />
      </MSCard>
      <div style={{ display: 'flex', gap: 10 }}>
        <MSBtn variant="secondary" full>Cancel</MSBtn>
        <MSBtn variant="primary" icon="check" full>Create</MSBtn>
      </div>
    </MSScroll>
  );
}

/* ───────── Store Details ───────── */
function MStoreDetails() {
  const items = [
    { sku: 'STL-44021', name: 'Steel I-Beam', qty: 142, st: 'in' },
    { sku: 'AGG-21044', name: 'Aggregate 20mm', qty: 46, st: 'low' },
    { sku: 'RBR-71203', name: 'Rebar #6', qty: 0, st: 'out' },
  ];
  return (
    <MSScroll>
      <MSCard marker={MSC.green} title="Store Summary" right={<MSPill tone="success">Active</MSPill>}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <MSMini label="Stock Value" value="342,820" sub="SAR" hi /><MSMini label="SKUs" value="1,248" />
        </div>
      </MSCard>
      <MSCard marker={MSC.green} title="Stock On Hand" pad={8}>
        <div style={{ padding: '0 8px' }}>
          {items.map((it, i) => (
            <div key={it.sku} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: i < items.length - 1 ? `1px solid ${MSC.border}` : 'none' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: MSC.fg1, fontFamily: MSC.body }}>{it.name}</div>
                <div style={{ fontFamily: MSC.mono, fontSize: 11, color: MSC.fg3, marginTop: 2 }}>{it.sku}</div>
              </div>
              <span style={{ fontFamily: MSC.mono, fontSize: 14, fontWeight: 600, color: it.qty === 0 ? MSC.red : (it.st === 'low' ? MSC.orange : MSC.fg1) }}>{it.qty}</span>
              <MSPill tone={it.st === 'in' ? 'success' : (it.st === 'low' ? 'warning' : 'danger')}>{it.st === 'in' ? 'In' : (it.st === 'low' ? 'Low' : 'Out')}</MSPill>
            </div>
          ))}
        </div>
      </MSCard>
      <MSBtn variant="secondary" icon="back" full>Back to List</MSBtn>
    </MSScroll>
  );
}

/* ───────── Issue Inventory ───────── */
function MIssueInventory() {
  return (
    <MSScroll>
      <MSCard marker={MSC.blue} title="Issue Details">
        <MSField label="Serial No" value="INV-ISS-2024-0089" mono />
        <MSField label="Store" placeholder="Search store…" required />
        <MSField label="Currency" value="USD — US Dollar" />
      </MSCard>
      <MSCard marker={MSC.green} title="Items" sub="1 line · 12 units">
        <div style={{ padding: 12, background: MSC.bg, border: `1px solid ${MSC.border}`, borderRadius: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: MSC.fg1, fontFamily: MSC.body }}>Structural Steel</div>
              <div style={{ fontFamily: MSC.mono, fontSize: 11, color: MSC.fg3, marginTop: 2 }}>12 PCS × 450.00</div>
            </div>
            <span style={{ fontFamily: MSC.mono, fontSize: 15, fontWeight: 600, color: MSC.fg1 }}>5,400.00</span>
          </div>
        </div>
        <button style={{ height: 44, background: 'transparent', border: `1px dashed ${MSC.borderStrong}`, borderRadius: 8, color: MSC.blue, fontWeight: 600, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: MSC.body, cursor: 'pointer' }}>
          <MSIcon name="scan" size={16} /> Scan to Add Item
        </button>
      </MSCard>
      <MSCard marker={MSC.green} title="Total">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span style={{ fontSize: 12, color: MSC.fg3, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: MSC.body }}>Total Value</span>
          <span style={{ fontFamily: MSC.mono, fontSize: 24, fontWeight: 700, color: MSC.fg1 }}>5,400.00 <span style={{ fontSize: 12, color: MSC.fg3 }}>USD</span></span>
        </div>
      </MSCard>
      <MSBtn variant="primary" icon="check" full>Issue Inventory</MSBtn>
    </MSScroll>
  );
}

Object.assign(window.MScreens = window.MScreens || {}, {
  stores: MStores,
  createStore: MCreateStore,
  storeDetail: MStoreDetails,
  issue: MIssueInventory,
});
