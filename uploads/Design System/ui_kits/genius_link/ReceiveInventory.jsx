/* global React, Page, Card, SectionHeader, Field, Textarea, Button, IconBtn, Icon, TotalsStrip, EditableTable */
// Screen: Receive Inventory — incoming stock from a supplier

const RECEIVE_ITEM_COLS = [
  { key: 'product', label: 'Product', w: 240, type: 'text', required: true },
  { key: 'unit',    label: 'Unit',    w: 90,  type: 'enum', opts: ['PCS','BAG','TON','SHT','L','M','KG'] },
  { key: 'qty',     label: 'Qty',     w: 100, type: 'num',  align: 'right', mono: true, required: true },
  { key: 'price',   label: 'Price',   w: 120, type: 'num',  align: 'right', mono: true, required: true },
  { key: 'freeQty', label: 'Free Qty',w: 100, type: 'num',  align: 'right', mono: true },
  { key: 'expDate', label: 'Exp Date',w: 130, type: 'text', mono: true, placeholder: 'mm/dd/yyyy' },
];
const RECEIVE_DIST_COLS = [
  { key: 'account',  label: 'Account',     w: 240, type: 'text', required: true },
  { key: 'currency', label: 'Currency',    w: 110, type: 'enum', opts: ['SAR','USD','EUR'] },
  { key: 'debit',    label: 'Debit',       w: 130, type: 'num',  align: 'right', mono: true },
  { key: 'credit',   label: 'Credit',      w: 130, type: 'num',  align: 'right', mono: true },
  { key: 'desc',     label: 'Description', w: 240, type: 'text' },
];

function ReceiveInventory({ onCancel, onCreate }) {
  const [items, setItems] = React.useState([
    { product: 'Portland Cement Type I',  unit: 'BAG', qty: '400', price: '24.50',  freeQty: '20', expDate: '06/30/2026' },
    { product: 'Structural Steel I-Beam', unit: 'PCS', qty: '32',  price: '450.00', freeQty: '0',  expDate: '' },
  ]);
  const [note, setNote] = React.useState('');

  const subtotal = items.reduce((s, it) => s + ((parseFloat(it.qty) || 0) * (parseFloat(it.price) || 0)), 0);
  const fmt = (n) => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const [dist, setDist] = React.useState([
    { account: '1200 — Inventory (WIP)',  currency: 'SAR', debit: fmt(subtotal), credit: '',           desc: 'Stock received' },
    { account: '2001 — Accounts Payable', currency: 'SAR', debit: '',           credit: fmt(subtotal),desc: 'Owed to supplier' },
  ]);
  React.useEffect(() => {
    setDist((prev) => prev.map((r, i) => i === 0 ? { ...r, debit: fmt(subtotal) } : (i === 1 ? { ...r, credit: fmt(subtotal) } : r)));
  }, [subtotal]);

  return (
    <Page
      breadcrumb={['Commercial', 'Inventory', 'Receive']}
      title="Receive Inventory">

      <Card padding={20}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 24 }}>
          <Static label="Serial No" value="INV-REC-2024-0241" mono locked />
          <SelectField label="Currency" value="SAR — Saudi Riyal"
                       options={['SAR — Saudi Riyal', 'USD — US Dollar', 'EUR — Euro']} />
          <Field label="Receiving Store" placeholder="Search store…" required />
          <Field label="Supplier Account" placeholder="e.g. ABC Trading Co." required />
        </div>
      </Card>

      {/* Items — green marker (financial flow) */}
      <Card>
        <SectionHeader
          title="Inventory Items"
          subtitle="Products being received into stock"
          marker="green"
          right={
            <div style={{
              display: 'flex', gap: 6, alignItems: 'center',
              padding: '6px 10px',
              background: 'rgba(74,124,255,0.12)',
              border: '1px solid rgba(74,124,255,0.25)',
              borderRadius: 4,
              color: '#4A7CFF', fontSize: 11, fontWeight: 700,
              letterSpacing: '0.05em', textTransform: 'uppercase',
            }}>
              <Icon name="scanner" size={13} /> Scan to Add
            </div>
          } />
        <EditableTable
          columns={RECEIVE_ITEM_COLS}
          rows={items}
          onChange={setItems}
          addRowLabel="Add Item"
          emptyRow={() => ({ product: '', unit: 'PCS', qty: '', price: '', freeQty: '', expDate: '' })}
          footer={
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontWeight: 700, fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--gl-fg-3)', marginRight: 12 }}>Subtotal</span>
              <span style={{ fontFamily: 'var(--gl-font-mono)', fontSize: 16, fontWeight: 600, color: 'var(--gl-fg-1)' }}>{fmt(subtotal)} <span style={{ fontSize: 11, color: 'var(--gl-fg-3)', fontWeight: 400 }}>SAR</span></span>
            </div>
          } />
      </Card>

      {/* Accounting */}
      <Card>
        <SectionHeader title="Accounting Distribution" marker="green" />
        <EditableTable
          columns={RECEIVE_DIST_COLS}
          rows={dist}
          onChange={setDist}
          addRowLabel="Add Line"
          emptyRow={() => ({ account: '', currency: 'SAR', debit: '', credit: '', desc: '' })} />
        <TotalsStrip
          debits={fmt(subtotal)}
          credits={fmt(subtotal)}
          difference="0.00" />
      </Card>

      <Card>
        <SectionHeader title="Documentation & Compliance" marker="orange" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <Textarea label="Receipt Notes"
                    placeholder="Reference PO number, delivery note number, or inspection results…"
                    value={note} onChange={setNote} rows={5} />
          <div>
            <div style={{
              fontWeight: 700, fontSize: 11, letterSpacing: '0.05em',
              textTransform: 'uppercase', color: 'var(--gl-fg-2)', marginBottom: 8,
            }}>Delivery Documents</div>
            <UploadDropzone label="Delivery Note · PO · Invoice" />
          </div>
        </div>
      </Card>

      <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
        <Button variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button variant="primary" icon="check" onClick={onCreate}>Receive Inventory</Button>
      </div>
    </Page>
  );
}

/* =========================================================
   Shared inventory subcomponents
   ========================================================= */

function Static({ label, value, mono, locked }) {
  return (
    <div>
      <div style={{
        fontWeight: 700, fontSize: 11, letterSpacing: '0.05em',
        textTransform: 'uppercase', color: 'var(--gl-fg-2)', marginBottom: 8,
      }}>{label}</div>
      <div style={{
        height: 40, padding: '0 16px',
        background: 'var(--gl-input-bg)',
        border: '1px solid var(--gl-border-strong)',
        borderRadius: 4,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        fontFamily: mono ? 'var(--gl-font-mono)' : undefined,
        fontSize: 14, color: 'var(--gl-fg-1)',
      }}>
        <span>{value}</span>
        {locked && <Icon name="lock" size={13} color="var(--gl-fg-3)" />}
      </div>
    </div>
  );
}

function SelectField({ label, value, options }) {
  const [v, setV] = React.useState(value);
  return (
    <div>
      <div style={{
        fontWeight: 700, fontSize: 11, letterSpacing: '0.05em',
        textTransform: 'uppercase', color: 'var(--gl-fg-2)', marginBottom: 8,
      }}>{label}</div>
      <div style={{ position: 'relative' }}>
        <select value={v} onChange={(e) => setV(e.target.value)}
          style={{
            width: '100%', height: 40, padding: '0 40px 0 16px',
            background: 'var(--gl-input-bg)',
            border: '1px solid var(--gl-border-strong)',
            borderRadius: 4,
            fontFamily: 'var(--gl-font-body)', fontSize: 14,
            color: 'var(--gl-fg-1)',
            appearance: 'none', cursor: 'pointer', outline: 'none',
          }}>
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        <div style={{
          position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
          color: 'var(--gl-fg-3)', display: 'flex', pointerEvents: 'none',
        }}>
          <Icon name="chevDown" size={14} />
        </div>
      </div>
    </div>
  );
}

function ItemsTable({ items, onChange, variant = 'issue' }) {
  const cols = variant === 'receive'
    ? '1.5fr 0.7fr 0.8fr 0.9fr 0.7fr 1fr 40px'
    : '1.4fr 1fr 0.7fr 0.9fr 0.8fr 0.8fr 1fr 40px';
  return (
    <div>
      <div style={{
        display: 'grid', gridTemplateColumns: cols, gap: 10,
        padding: '0 0 10px',
        fontWeight: 700, fontSize: 10, letterSpacing: '0.05em',
        textTransform: 'uppercase', color: 'var(--gl-fg-3)',
        borderBottom: '1px solid var(--gl-border)',
      }}>
        <span>Product*</span><span>Unit*</span><span>Qty*</span>
        <span>Price*</span><span>Free Qty</span><span>Exp Date</span><span></span>
      </div>
      {items.map((it, i) => (
        <div key={i} style={{
          display: 'grid', gridTemplateColumns: cols, gap: 10,
          padding: '12px 0', alignItems: 'center',
          borderBottom: '1px solid var(--gl-border)',
        }}>
          <CellInput value={it.product} />
          <CellInput value={it.unit} />
          <CellInput value={it.qty} mono align="right" />
          <CellInput value={it.price.toFixed(2)} mono align="right" />
          <CellInput value={it.freeQty} mono align="right" />
          <CellInput value={it.expDate} mono placeholder="mm/dd/yyyy" />
          <IconBtn icon="trash" variant="danger" size={32}
                   onClick={() => onChange(items.filter((_, j) => j !== i))} />
        </div>
      ))}
      <div style={{
        display: 'grid', gridTemplateColumns: cols, gap: 10,
        padding: '12px 0', alignItems: 'center',
      }}>
        <CellInput placeholder="Start typing…" />
        <CellInput /><CellInput /><CellInput /><CellInput />
        <CellInput placeholder="mm/dd/yyyy" />
        <IconBtn icon="plus" size={32} />
      </div>
    </div>
  );
}

function CellInput({ value, placeholder, mono, align }) {
  const [v, setV] = React.useState(value || '');
  return (
    <input
      value={v}
      placeholder={placeholder}
      onChange={(e) => setV(e.target.value)}
      style={{
        width: '100%', height: 34, padding: '0 10px',
        background: 'var(--gl-input-bg)',
        border: '1px solid var(--gl-border)',
        borderRadius: 4,
        fontFamily: mono ? 'var(--gl-font-mono)' : 'var(--gl-font-body)',
        fontSize: 13, color: 'var(--gl-fg-1)',
        textAlign: align || 'left', outline: 'none',
        boxSizing: 'border-box',
      }}
    />
  );
}

function DistributionTable({ amount, type = 'issue' }) {
  const cols = '40px 1.8fr 1fr 1fr 2fr 40px';
  const rows = type === 'receive'
    ? [
        { num: '01', account: '1200 — Inventory (WIP)',        currency: 'SAR', amount: amount.toFixed(2), desc: 'Stock received', side: 'dr' },
        { num: '02', account: '2001 — Accounts Payable',       currency: 'SAR', amount: amount.toFixed(2), desc: 'Owed to supplier', side: 'cr' },
      ]
    : [
        { num: '01', account: '5001 — Cost of Goods Sold',     currency: 'SAR', amount: amount.toFixed(2), desc: 'Issued for Project A-92', side: 'dr' },
        { num: '02', account: '1200 — Inventory (WIP)',        currency: 'SAR', amount: amount.toFixed(2), desc: 'Stock reduction',         side: 'cr' },
      ];
  return (
    <div>
      <div style={{
        display: 'grid', gridTemplateColumns: cols, gap: 10,
        padding: '0 0 10px',
        fontWeight: 700, fontSize: 10, letterSpacing: '0.05em',
        textTransform: 'uppercase', color: 'var(--gl-fg-3)',
        borderBottom: '1px solid var(--gl-border)',
      }}>
        <span>#</span><span>Account</span><span>Currency</span>
        <span style={{ textAlign: 'right' }}>Amount</span>
        <span>Description</span><span></span>
      </div>
      {rows.map((r) => (
        <div key={r.num} style={{
          display: 'grid', gridTemplateColumns: cols, gap: 10,
          padding: '14px 0', alignItems: 'center',
          fontSize: 13, color: 'var(--gl-fg-1)',
          borderBottom: '1px solid var(--gl-border)',
        }}>
          <span style={{ fontFamily: 'var(--gl-font-mono)', color: 'var(--gl-fg-3)' }}>{r.num}</span>
          <span style={{ fontWeight: 600 }}>{r.account}</span>
          <span style={{ color: 'var(--gl-fg-2)' }}>{r.currency}</span>
          <span style={{
            fontFamily: 'var(--gl-font-mono)', textAlign: 'right', fontWeight: 600,
            color: r.side === 'dr' ? '#1DB88A' : '#EF4444',
          }}>{r.side === 'dr' ? '+' : '-'}{r.amount}</span>
          <span style={{ color: 'var(--gl-fg-2)' }}>{r.desc}</span>
          <button style={{
            background: 'transparent', border: 'none', cursor: 'pointer',
            color: 'var(--gl-fg-3)', justifySelf: 'end', padding: 4,
          }}><Icon name="chevDown" size={14} /></button>
        </div>
      ))}
    </div>
  );
}

function UploadDropzone({ label }) {
  const [hover, setHover] = React.useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        height: 124,
        border: `1px dashed ${hover ? '#4A7CFF' : 'var(--gl-border-strong)'}`,
        borderRadius: 4,
        background: 'var(--gl-input-bg)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 6,
        cursor: 'pointer',
        transition: 'border-color 150ms ease',
      }}>
      <Icon name="upload" size={22} color="var(--gl-fg-3)" />
      <div style={{ fontSize: 14, color: 'var(--gl-fg-1)' }}>
        <strong>Drag & Drop</strong> or click to browse
      </div>
      <div style={{ fontSize: 11, color: 'var(--gl-fg-3)' }}>{label || 'PDF, JPG, PNG (Max 10MB)'}</div>
    </div>
  );
}

window.ReceiveInventory = ReceiveInventory;
// expose shared helpers for Transfer / Adjustment
window._invShared = { Static, SelectField, ItemsTable, CellInput, UploadDropzone };
