/* global React, Card, SectionHeader, Field, Select, Textarea, Button, IconBtn, Page, Icon, TotalsStrip */
// Screen: Issue Inventory

function IssueInventory({ onCancel, onIssue }) {
  const [items, setItems] = React.useState([
    { product: 'Structural Steel', unit: 'Unit', qty: 12, price: 450, freeQty: 0, recv: 12, expDate: '12/31/2025' },
  ]);
  const [note, setNote] = React.useState('');

  const subtotal = items.reduce((s, it) => s + (it.qty * it.price), 0);

  return (
    <Page
      breadcrumb={['Commercial', 'Inventory', 'Issue']}
      title="Issue Inventory">
      {/* Header strip — uses light/transparent surface */}
      <Card padding={20}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 24 }}>
          <LabeledStatic label="Serial No" value="INV-ISS-2024-0089" mono locked />
          <LabeledSelect label="Currency" value="USD — US Dollar" options={['USD — US Dollar', 'SAR — Saudi Riyal', 'EUR — Euro']} />
          <Field label="Store" placeholder="Search store…" required />
          <Field label="Customer Account" placeholder="Optional" />
        </div>
      </Card>

      {/* Inventory items — green marker */}
      <Card>
        <SectionHeader title="Inventory Items" marker="green" />
        <ItemsTable items={items} onChange={setItems} />
        <div style={{
          fontSize: 12, color: 'var(--gl-fg-3)', fontStyle: 'italic',
          paddingTop: 4,
        }}>To add a new row, simply start entering data in the last empty row.</div>
      </Card>

      {/* Accounting distribution */}
      <Card>
        <SectionHeader title="Accounting Distribution" marker="green" />
        <DistributionTable />
        <TotalsStrip debits={subtotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                     credits={subtotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                     difference="0.00" />
      </Card>

      {/* Documentation & compliance */}
      <Card>
        <SectionHeader title="Documentation & Compliance" marker="orange" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <Textarea label="Transaction Notes"
                    placeholder="Specify project reference, site manager approval, or specific handling instructions…"
                    value={note} onChange={setNote} rows={5} />
          <div>
            <div style={{
              fontWeight: 700, fontSize: 11, letterSpacing: '0.05em',
              textTransform: 'uppercase', color: 'var(--gl-fg-2)', marginBottom: 8,
            }}>Supporting Documents</div>
            <UploadDropzone />
          </div>
        </div>
      </Card>

      <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
        <Button variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button variant="primary" icon="check" onClick={onIssue}>Issue Inventory</Button>
      </div>
    </Page>
  );
}

/* ----- helpers ----- */
function LabeledStatic({ label, value, mono, locked }) {
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

function LabeledSelect({ label, value, options }) {
  const [v, setV] = React.useState(value);
  return (
    <div>
      <div style={{
        fontWeight: 700, fontSize: 11, letterSpacing: '0.05em',
        textTransform: 'uppercase', color: 'var(--gl-fg-2)', marginBottom: 8,
      }}>{label}</div>
      <div style={{
        position: 'relative',
      }}>
        <select value={v} onChange={(e) => setV(e.target.value)}
          style={{
            width: '100%', height: 40, padding: '0 40px 0 16px',
            background: 'var(--gl-input-bg)',
            border: '1px solid var(--gl-border-strong)',
            borderRadius: 4,
            fontFamily: 'var(--gl-font-body)',
            fontSize: 14, color: 'var(--gl-fg-1)',
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

function ItemsTable({ items, onChange }) {
  const cols = '1.4fr 1fr 0.7fr 0.9fr 0.8fr 0.8fr 1fr 40px';
  return (
    <div>
      {/* header */}
      <div style={{
        display: 'grid', gridTemplateColumns: cols, gap: 10,
        padding: '0 0 10px',
        fontWeight: 700, fontSize: 10, letterSpacing: '0.05em',
        textTransform: 'uppercase', color: 'var(--gl-fg-3)',
        borderBottom: '1px solid var(--gl-border)',
      }}>
        <span>Product*</span><span>Unit*</span><span>Qty*</span><span>Price*</span>
        <span>Free Qty</span><span>Recv Qty</span><span>Exp Date</span><span></span>
      </div>
      {/* rows */}
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
          <CellInput value={it.recv} mono align="right" />
          <CellInput value={it.expDate} mono />
          <IconBtn icon="trash" variant="danger" size={32}
                   onClick={() => onChange(items.filter((_, j) => j !== i))} />
        </div>
      ))}
      {/* empty row */}
      <div style={{
        display: 'grid', gridTemplateColumns: cols, gap: 10,
        padding: '12px 0', alignItems: 'center',
      }}>
        <CellInput placeholder="Start typing…" />
        <CellInput /><CellInput /><CellInput /><CellInput /><CellInput />
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

function DistributionTable() {
  const cols = '40px 1.8fr 1fr 1fr 2fr 40px';
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
        <span style={{ textAlign: 'right' }}>Amount $</span>
        <span>Description</span><span style={{ textAlign: 'right' }}>Actions</span>
      </div>
      <div style={{
        display: 'grid', gridTemplateColumns: cols, gap: 10,
        padding: '14px 0', alignItems: 'center',
        fontSize: 13, color: 'var(--gl-fg-1)',
      }}>
        <span style={{ fontFamily: 'var(--gl-font-mono)', color: 'var(--gl-fg-3)' }}>01</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          1200 — Inventory (WIP)
          <Icon name="search" size={12} color="var(--gl-fg-3)" />
        </span>
        <span>USD</span>
        <span style={{ fontFamily: 'var(--gl-font-mono)', textAlign: 'right' }}>5,400.00</span>
        <span style={{ color: 'var(--gl-fg-2)' }}>Issue for Project A-92</span>
        <button style={{
          background: 'transparent', border: 'none', cursor: 'pointer',
          color: 'var(--gl-fg-3)', display: 'flex', justifyContent: 'flex-end',
        }}>
          <Icon name="chevDown" size={16} />
        </button>
      </div>
    </div>
  );
}

function UploadDropzone() {
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
        alignItems: 'center', justifyContent: 'center', gap: 8,
        cursor: 'pointer',
        transition: 'border-color 150ms ease',
      }}>
      <Icon name="upload" size={22} color="var(--gl-fg-3)" />
      <div style={{ fontSize: 14, color: 'var(--gl-fg-1)' }}>
        <strong>Drag & Drop files</strong>
      </div>
      <div style={{ fontSize: 12, color: 'var(--gl-fg-3)' }}>or click to browse PDF, PNG, JPG</div>
    </div>
  );
}

window.IssueInventory = IssueInventory;
