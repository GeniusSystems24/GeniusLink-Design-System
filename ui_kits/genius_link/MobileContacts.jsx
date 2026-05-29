/* global React */
// GeniusLink mobile — V3 Stage G · Customers & Suppliers.
// Shared "contact" entity (kind = customer | supplier). Interactive: live search +
// status filter on lists, real form inputs on create. Mirrors desktop Contacts.jsx.

const MK = window._mob;
const { C: KC, MIcon: KIcon, Pill: KPill, MCard: KCard, MBtn: KBtn, Scroll: KScroll } = MK;
const { ISection: KSection } = window._minv;
const { TInput: KInput, TSelect: KSelect, Segmented: KSeg, SearchInput: KSearch } = window._mui;
const { useState: useKState } = React;

const CONTACT = {
  customer: {
    label: 'Customer', labelPl: 'Customers', balanceLabel: 'Receivable', tone: '#1DB88A', control: '1300 — Accounts Receivable',
    rows: [
      { code: 'CUST-102', name: 'Riyadh Construction Co.', ar: 'شركة الرياض للإنشاءات', city: 'Riyadh', balance: '24,500.00', orders: 18, status: 'active' },
      { code: 'CUST-118', name: 'Najd Developers', ar: 'مطوّرو نجد', city: 'Riyadh', balance: '8,200.00', orders: 6, status: 'active' },
      { code: 'CUST-134', name: 'Coastal Projects LLC', ar: 'مشاريع الساحل', city: 'Jeddah', balance: '0.00', orders: 2, status: 'active' },
      { code: 'CUST-141', name: 'Eastern Build Group', ar: 'مجموعة البناء الشرقية', city: 'Dammam', balance: '52,140.00', orders: 31, status: 'active' },
      { code: 'CUST-150', name: 'Madinah Estates', ar: 'عقارات المدينة', city: 'Madinah', balance: '0.00', orders: 0, status: 'pending' },
    ],
    history: [
      { ref: 'INV-2024-0412', desc: 'Sales invoice', amount: '+12,400.00', when: 'Dec 14' },
      { ref: 'DEP-2024-0182', desc: 'Payment received', amount: '−5,000.00', when: 'Dec 18' },
      { ref: 'INV-2024-0388', desc: 'Sales invoice', amount: '+17,100.00', when: 'Dec 02' },
    ],
  },
  supplier: {
    label: 'Supplier', labelPl: 'Suppliers', balanceLabel: 'Payable', tone: '#EF4444', control: '2001 — Accounts Payable',
    rows: [
      { code: 'SUP-201', name: 'Global Steel Imports LLC', ar: 'الاستيراد العالمي للصلب', city: 'London', balance: '12,000.00', orders: 9, status: 'active' },
      { code: 'SUP-210', name: 'Saudi Cement Company', ar: 'شركة الأسمنت السعودية', city: 'Riyadh', balance: '34,890.00', orders: 22, status: 'active' },
      { code: 'SUP-218', name: 'Gulf Aggregates', ar: 'حصى الخليج', city: 'Dammam', balance: '4,200.00', orders: 14, status: 'active' },
      { code: 'SUP-225', name: 'Timber & Ply Trading', ar: 'تجارة الأخشاب', city: 'Jeddah', balance: '0.00', orders: 5, status: 'inactive' },
    ],
    history: [
      { ref: 'PO-2024-0211', desc: 'Purchase order', amount: '+12,000.00', when: 'Dec 10' },
      { ref: 'EXT-2024-0311', desc: 'Wire payment', amount: '−12,000.00', when: 'Dec 18' },
      { ref: 'PO-2024-0198', desc: 'Purchase order', amount: '+34,890.00', when: 'Nov 28' },
    ],
  },
};
const kTone = { active: 'success', inactive: 'neutral', pending: 'warning' };

/* ═════════ LIST (live search + status filter) ═════════ */
function ContactList({ kind, go, detailKey }) {
  const d = CONTACT[kind];
  const [q, setQ] = useKState('');
  const [st, setSt] = useKState('All');
  const visible = d.rows.filter((c) => (st === 'All' || c.status === st.toLowerCase()) && (!q || c.name.toLowerCase().includes(q.toLowerCase()) || c.code.toLowerCase().includes(q.toLowerCase()) || c.ar.includes(q)));
  return (
    <KScroll>
      <KSearch placeholder={`Search ${d.labelPl.toLowerCase()}…`} value={q} onChange={setQ} />
      <KSeg options={['All', 'Active', 'Pending', 'Inactive']} value={st} onChange={setSt} />
      <KCard pad={8}>
        {visible.map((c, i) => {
          const zero = parseFloat(c.balance.replace(/,/g, '')) === 0;
          return (
            <div key={c.code} onClick={() => go(detailKey)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 8px', borderBottom: i < visible.length - 1 ? `1px solid ${KC.border}` : 'none', cursor: 'pointer' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: KC.fg1, fontFamily: KC.body }}>{c.name}</div>
                <div dir="rtl" style={{ fontFamily: KC.arabic, fontSize: 12, color: KC.fg3, marginTop: 1 }}>{c.ar}</div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 3 }}>
                  <span style={{ fontFamily: KC.mono, fontSize: 10.5, color: KC.fg3 }}>{c.code}</span>
                  <span style={{ fontSize: 10.5, color: KC.fg4 }}>·</span>
                  <span style={{ fontSize: 10.5, color: KC.fg3, fontFamily: KC.body }}>{c.city}</span>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: KC.mono, fontSize: 13, fontWeight: 600, color: zero ? KC.fg4 : d.tone }}>{c.balance}</div>
                <div style={{ marginTop: 4 }}><KPill tone={kTone[c.status]}>{c.status}</KPill></div>
              </div>
            </div>
          );
        })}
        {visible.length === 0 && <div style={{ padding: '36px 0', textAlign: 'center', color: KC.fg3, fontSize: 13, fontFamily: KC.body }}>No {d.labelPl.toLowerCase()} match.</div>}
      </KCard>
    </KScroll>
  );
}

/* ═════════ CREATE ═════════ */
function CreateContact({ kind }) {
  const d = CONTACT[kind];
  return (
    <KScroll>
      <KSection icon="user" title={`${d.label} Identity`} sub="Legal name and contact details" marker={KC.blue}>
        <KInput label="Name English" placeholder={kind === 'customer' ? 'e.g. Riyadh Construction Co.' : 'e.g. Global Steel Imports LLC'} required />
        <KInput label="الاسم بالعربية" placeholder="مثال: شركة الرياض للإنشاءات" ar />
        <KInput label="Contact Person" placeholder="e.g. Ahmed K." />
        <KInput label="Phone" placeholder="+966 5X XXX XXXX" mono />
        <KInput label="Email" placeholder="name@company.com" type="email" />
        <KInput label="City" placeholder="e.g. Riyadh" />
      </KSection>
      <KSection icon="swap" title="Financial" sub="Linked control account and terms" marker={KC.green}>
        <KSelect label="Control Account" value={d.control} options={[d.control]} />
        <KSelect label="Payment Terms" value="Net 30" options={['Net 15', 'Net 30', 'Net 60', 'On Receipt']} />
        <KInput label="Tax / VAT Number" placeholder="3XXXXXXXXXXXXX3" mono />
        <KInput label="Credit Limit (SAR)" placeholder="e.g. 100,000.00" mono />
      </KSection>
      <KSection icon="doc" title="Notes" marker={KC.orange}>
        <div style={{ minHeight: 80, padding: '12px 14px', background: KC.input, border: `1px solid ${KC.borderStrong}`, borderRadius: 8, fontSize: 14, color: KC.fg3, fontFamily: KC.body }}>Internal notes about this {d.label.toLowerCase()}…</div>
      </KSection>
      <div style={{ display: 'flex', gap: 10 }}>
        <KBtn variant="secondary" full>Cancel</KBtn>
        <KBtn variant="primary" icon="check" full>Add {d.label}</KBtn>
      </div>
    </KScroll>
  );
}

/* ═════════ DETAILS ═════════ */
function ContactDetails({ kind }) {
  const d = CONTACT[kind];
  const c = d.rows[0];
  return (
    <KScroll>
      <KCard marker={KC.green} title={`Outstanding ${d.balanceLabel}`} sub={`${c.orders} orders · since Apr 2024`} right={<KPill tone="success">Active</KPill>}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span style={{ fontFamily: KC.mono, fontSize: 14, color: KC.fg3 }}>SAR</span>
          <span style={{ fontFamily: KC.mono, fontSize: 32, fontWeight: 700, color: d.tone, letterSpacing: '-0.02em' }}>{c.balance}</span>
        </div>
      </KCard>
      <KCard marker={KC.blue} title={`${d.label} Information`}>
        {[['Code', c.code, true], ['City', c.city], ['Contact Person', 'Ahmed K.'], ['Phone', '+966 55 124 9020', true], ['Control Account', kind === 'customer' ? '1300 — A/R' : '2001 — A/P'], ['Payment Terms', 'Net 30']].map(([k, v, mono]) => (
          <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
            <span style={{ fontWeight: 700, fontSize: 10, letterSpacing: '0.05em', textTransform: 'uppercase', color: KC.fg3, fontFamily: KC.body }}>{k}</span>
            <span style={{ fontSize: 13, color: KC.fg1, fontFamily: mono ? KC.mono : KC.body, textAlign: 'right' }}>{v}</span>
          </div>
        ))}
      </KCard>
      <KCard marker={KC.orange} title="Transaction History" sub="Recent invoices and payments" pad={8}>
        <div style={{ padding: '0 8px' }}>
          {d.history.map((h, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: i < d.history.length - 1 ? `1px solid ${KC.border}` : 'none' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: KC.mono, fontSize: 12, color: KC.blue }}>{h.ref}</div>
                <div style={{ fontSize: 12, color: KC.fg3, fontFamily: KC.body, marginTop: 2 }}>{h.desc} · {h.when}</div>
              </div>
              <span style={{ fontFamily: KC.mono, fontSize: 13.5, fontWeight: 600, color: h.amount.startsWith('+') ? KC.green : KC.red }}>{h.amount}</span>
            </div>
          ))}
        </div>
      </KCard>
      <div style={{ display: 'flex', gap: 10 }}>
        <KBtn variant="secondary" icon="edit" full>Edit</KBtn>
        <KBtn variant="danger" icon="trash" full>Archive</KBtn>
      </div>
    </KScroll>
  );
}

/* ───────── register ───────── */
Object.assign(window.MScreens = window.MScreens || {}, {
  customersList: ({ go }) => <ContactList kind="customer" go={go} detailKey="customerDetail" />,
  createCustomer: () => <CreateContact kind="customer" />,
  customerDetail: () => <ContactDetails kind="customer" />,
  suppliersList: ({ go }) => <ContactList kind="supplier" go={go} detailKey="supplierDetail" />,
  createSupplier: () => <CreateContact kind="supplier" />,
  supplierDetail: () => <ContactDetails kind="supplier" />,
});
