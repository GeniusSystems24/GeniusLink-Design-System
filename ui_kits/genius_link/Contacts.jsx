/* global React, Page, Card, SectionHeader, Field, Textarea, Button, Icon, StatusPill, LockedField */
// Stage 8 — Customers & Suppliers (shared "contact" entity, kind = customer | supplier)

const CONTACT_DATA = {
  customer: {
    label: 'Customer', labelPl: 'Customers', crumb: 'Sales',
    balanceLabel: 'Receivable', balanceTone: '#1DB88A',
    rows: [
      { code: 'CUST-102', name: 'Riyadh Construction Co.', ar: 'شركة الرياض للإنشاءات', city: 'Riyadh', balance: '24,500.00', orders: 18, status: 'active' },
      { code: 'CUST-118', name: 'Najd Developers',          ar: 'مطوّرو نجد',           city: 'Riyadh', balance: '8,200.00',  orders: 6,  status: 'active' },
      { code: 'CUST-134', name: 'Coastal Projects LLC',     ar: 'مشاريع الساحل',        city: 'Jeddah', balance: '0.00',      orders: 2,  status: 'active' },
      { code: 'CUST-141', name: 'Eastern Build Group',      ar: 'مجموعة البناء الشرقية',city: 'Dammam', balance: '52,140.00', orders: 31, status: 'active' },
      { code: 'CUST-150', name: 'Madinah Estates',          ar: 'عقارات المدينة',       city: 'Madinah',balance: '0.00',      orders: 0,  status: 'pending' },
    ],
  },
  supplier: {
    label: 'Supplier', labelPl: 'Suppliers', crumb: 'Procurement',
    balanceLabel: 'Payable', balanceTone: '#EF4444',
    rows: [
      { code: 'SUP-201', name: 'Global Steel Imports LLC', ar: 'الاستيراد العالمي للصلب', city: 'London', balance: '12,000.00', orders: 9,  status: 'active' },
      { code: 'SUP-210', name: 'Saudi Cement Company',     ar: 'شركة الأسمنت السعودية',  city: 'Riyadh', balance: '34,890.00', orders: 22, status: 'active' },
      { code: 'SUP-218', name: 'Gulf Aggregates',          ar: 'حصى الخليج',             city: 'Dammam', balance: '4,200.00',  orders: 14, status: 'active' },
      { code: 'SUP-225', name: 'Timber & Ply Trading',     ar: 'تجارة الأخشاب',          city: 'Jeddah', balance: '0.00',      orders: 5,  status: 'inactive' },
    ],
  },
};

function ContactsList({ kind, onCreate, onOpen }) {
  const d = CONTACT_DATA[kind];
  const grid = '110px 1.8fr 1fr 1.1fr 70px 90px 40px';
  return (
    <Page breadcrumb={[d.crumb, d.labelPl]} title={d.labelPl}
      titleRight={<Button variant="primary" icon="plus" onClick={onCreate}>Add {d.label}</Button>}>
      <Card padding={0}>
        <div style={{ padding: '20px 24px 0' }}>
          <SectionHeader title={`${d.rows.length} ${d.labelPl}`} subtitle={`Outstanding ${d.balanceLabel.toLowerCase()} shown per account`} marker="blue" />
        </div>
        <div style={{ padding: '20px 24px 24px' }}>
          <div style={{
            display: 'grid', gridTemplateColumns: grid, gap: 12, padding: '0 0 12px',
            borderBottom: '1px solid var(--gl-border)',
            fontWeight: 700, fontSize: 10, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--gl-fg-3)',
          }}>
            <span>Code</span><span>{d.label}</span><span>City</span>
            <span style={{ textAlign: 'right' }}>{d.balanceLabel}</span>
            <span style={{ textAlign: 'right' }}>Orders</span>
            <span>Status</span><span></span>
          </div>
          {d.rows.map((c) => <ContactRow key={c.code} c={c} d={d} grid={grid} onClick={() => onOpen && onOpen(c)} />)}
        </div>
      </Card>
    </Page>
  );
}

function ContactRow({ c, d, grid, onClick }) {
  const [hover, setHover] = React.useState(false);
  const zero = parseFloat(c.balance.replace(/,/g, '')) === 0;
  const toneMap = { active: 'success', inactive: 'neutral', pending: 'warning' };
  return (
    <div onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        display: 'grid', gridTemplateColumns: grid, gap: 12, padding: '14px 8px', margin: '0 -8px',
        alignItems: 'center', borderBottom: '1px solid var(--gl-border)',
        background: hover ? 'var(--gl-hover)' : 'transparent', borderRadius: 4, cursor: 'pointer',
        fontSize: 13, color: 'var(--gl-fg-1)', transition: 'background 150ms ease',
      }}>
      <span style={{ fontFamily: 'var(--gl-font-mono)', color: 'var(--gl-fg-2)' }}>{c.code}</span>
      <span>
        <div style={{ fontWeight: 600 }}>{c.name}</div>
        <div dir="rtl" style={{ fontFamily: 'var(--gl-font-arabic)', fontSize: 12, color: 'var(--gl-fg-3)', marginTop: 2 }}>{c.ar}</div>
      </span>
      <span style={{ color: 'var(--gl-fg-2)' }}>{c.city}</span>
      <span style={{ fontFamily: 'var(--gl-font-mono)', textAlign: 'right', fontWeight: 600, color: zero ? 'var(--gl-fg-4)' : d.balanceTone }}>
        {c.balance} <span style={{ color: 'var(--gl-fg-3)', fontWeight: 400, fontSize: 11 }}>SAR</span>
      </span>
      <span style={{ fontFamily: 'var(--gl-font-mono)', textAlign: 'right', color: 'var(--gl-fg-3)' }}>{c.orders}</span>
      <span><StatusPill tone={toneMap[c.status]} size="sm">{c.status}</StatusPill></span>
      <span style={{ justifySelf: 'end', color: 'var(--gl-fg-3)', display: 'flex' }}><Icon name="chevRight" size={14} /></span>
    </div>
  );
}

function CreateContact({ kind, onCancel, onCreate }) {
  const d = CONTACT_DATA[kind];
  const [name, setName] = React.useState({ en: '', ar: '' });
  return (
    <Page breadcrumb={[d.crumb, d.labelPl, 'New']} title={`Add ${d.label}`}>
      <Card>
        <SectionHeader title={`${d.label} Identity`} subtitle="Legal name and contact details" marker="blue" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <Field label="Name English" required placeholder={`e.g. ${kind === 'customer' ? 'Riyadh Construction Co.' : 'Global Steel Imports LLC'}`} value={name.en} onChange={(v) => setName({ ...name, en: v })} />
          <Field label="الاسم بالعربية" placeholder="مثال: شركة الرياض للإنشاءات" dir="rtl" value={name.ar} onChange={(v) => setName({ ...name, ar: v })} />
          <Field label="Contact Person" placeholder="e.g. Ahmed K." />
          <Field label="Phone" placeholder="+966 5X XXX XXXX" mono />
          <Field label="Email" placeholder="name@company.com" type="email" />
          <Field label="City" placeholder="e.g. Riyadh" />
        </div>
      </Card>

      <Card>
        <SectionHeader title="Financial" subtitle="Linked control account and terms" marker="green" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <window._cfgShared.CurSelect label="Control Account" value={kind === 'customer' ? '1300 — Accounts Receivable' : '2001 — Accounts Payable'} options={kind === 'customer' ? ['1300 — Accounts Receivable'] : ['2001 — Accounts Payable']} />
          <window._cfgShared.CurSelect label="Payment Terms" value="Net 30" options={['Net 15', 'Net 30', 'Net 60', 'On Receipt']} />
          <Field label="Tax / VAT Number" placeholder="3XXXXXXXXXXXXX3" mono />
          <Field label="Credit Limit (SAR)" placeholder="e.g. 100,000.00" mono />
        </div>
      </Card>

      <Card>
        <SectionHeader title="Notes" marker="orange" />
        <Textarea label="Notes" placeholder={`Internal notes about this ${d.label.toLowerCase()}…`} rows={4} />
      </Card>

      <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
        <Button variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button variant="primary" icon="check" onClick={onCreate}>Add {d.label}</Button>
      </div>
    </Page>
  );
}

function ContactDetails({ kind, onBack, onEdit, onDelete }) {
  const d = CONTACT_DATA[kind];
  const c = d.rows[0];
  const history = kind === 'customer'
    ? [
        { ref: 'INV-2024-0412', desc: 'Sales invoice', amount: '+12,400.00', when: 'Dec 14' },
        { ref: 'DEP-2024-0182', desc: 'Payment received', amount: '−5,000.00', when: 'Dec 18' },
        { ref: 'INV-2024-0388', desc: 'Sales invoice', amount: '+17,100.00', when: 'Dec 02' },
      ]
    : [
        { ref: 'PO-2024-0211', desc: 'Purchase order', amount: '+12,000.00', when: 'Dec 10' },
        { ref: 'EXT-2024-0311', desc: 'Wire payment', amount: '−12,000.00', when: 'Dec 18' },
        { ref: 'PO-2024-0198', desc: 'Purchase order', amount: '+34,890.00', when: 'Nov 28' },
      ];
  return (
    <Page breadcrumb={[d.crumb, d.labelPl, 'Details']} title={c.name} titleArabic={c.ar}
      titleRight={
        <div style={{ display: 'flex', gap: 8 }}>
          <Button variant="secondary" icon="edit" onClick={onEdit}>Edit</Button>
          <Button variant="danger" icon="trash" onClick={onDelete}>Archive</Button>
        </div>
      }>
      <Card>
        <SectionHeader title={`Outstanding ${d.balanceLabel}`} subtitle={`${c.orders} orders · since Apr 2024`} marker="green"
                       right={<StatusPill tone="success">Active</StatusPill>} />
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
          <span style={{ fontFamily: 'var(--gl-font-mono)', fontSize: 16, color: 'var(--gl-fg-3)' }}>SAR</span>
          <span style={{ fontFamily: 'var(--gl-font-mono)', fontSize: 40, fontWeight: 700, color: d.balanceTone, letterSpacing: '-0.02em' }}>{c.balance}</span>
        </div>
      </Card>

      <Card>
        <SectionHeader title={`${d.label} Information`} marker="blue" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, rowGap: 20 }}>
          <LockedField label="Code" value={c.code} mono />
          <LockedField label="City" value={c.city} />
          <LockedField label="Contact Person" value="Ahmed K." />
          <LockedField label="Phone" value="+966 55 124 9020" mono />
          <LockedField label="Control Account" value={kind === 'customer' ? '1300 — A/R' : '2001 — A/P'} />
          <LockedField label="Payment Terms" value="Net 30" />
        </div>
      </Card>

      <Card padding={0}>
        <div style={{ padding: '20px 24px 0' }}>
          <SectionHeader title="Transaction History" subtitle="Recent invoices and payments" marker="orange" />
        </div>
        <div style={{ padding: '16px 24px 24px' }}>
          <div style={{
            display: 'grid', gridTemplateColumns: '150px 1.6fr 1fr 90px', gap: 12, padding: '0 0 12px',
            borderBottom: '1px solid var(--gl-border)',
            fontWeight: 700, fontSize: 10, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--gl-fg-3)',
          }}>
            <span>Reference</span><span>Description</span><span style={{ textAlign: 'right' }}>Amount</span><span style={{ textAlign: 'right' }}>Date</span>
          </div>
          {history.map((h, i) => (
            <div key={i} style={{
              display: 'grid', gridTemplateColumns: '150px 1.6fr 1fr 90px', gap: 12, padding: '14px 0', alignItems: 'center',
              borderBottom: i < history.length - 1 ? '1px solid var(--gl-border)' : 'none', fontSize: 13, color: 'var(--gl-fg-1)',
            }}>
              <span style={{ fontFamily: 'var(--gl-font-mono)', color: '#4A7CFF' }}>{h.ref}</span>
              <span style={{ color: 'var(--gl-fg-2)' }}>{h.desc}</span>
              <span style={{ fontFamily: 'var(--gl-font-mono)', textAlign: 'right', fontWeight: 600, color: h.amount.startsWith('+') ? '#1DB88A' : '#EF4444' }}>{h.amount}</span>
              <span style={{ fontFamily: 'var(--gl-font-mono)', fontSize: 12, textAlign: 'right', color: 'var(--gl-fg-3)' }}>{h.when}</span>
            </div>
          ))}
        </div>
      </Card>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Button variant="secondary" icon="back" onClick={onBack}>Back to {d.labelPl}</Button>
      </div>
    </Page>
  );
}

window.CustomersList   = (p) => <ContactsList   kind="customer" {...p} />;
window.CreateCustomer  = (p) => <CreateContact  kind="customer" {...p} />;
window.CustomerDetails = (p) => <ContactDetails kind="customer" {...p} />;
window.SuppliersList   = (p) => <ContactsList   kind="supplier" {...p} />;
window.CreateSupplier  = (p) => <CreateContact  kind="supplier" {...p} />;
window.SupplierDetails = (p) => <ContactDetails kind="supplier" {...p} />;
