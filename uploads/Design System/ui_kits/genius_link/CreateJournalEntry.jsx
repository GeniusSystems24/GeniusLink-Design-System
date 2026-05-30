/* global React, Page, Card, SectionHeader, Field, Textarea, Button, IconBtn, Icon, TotalsStrip, EditableTable */
// Screen: Create Journal Entry — general multi-line debit/credit entry

const JOURNAL_LINE_COLS = [
  { key: 'account', label: 'Account',     w: 280, type: 'text', required: true, placeholder: 'Select account…' },
  { key: 'debit',   label: 'Debit',       w: 140, type: 'num',  align: 'right', mono: true },
  { key: 'credit',  label: 'Credit',      w: 140, type: 'num',  align: 'right', mono: true },
  { key: 'desc',    label: 'Description', w: 260, type: 'text' },
];

function CreateJournalEntry({ onCancel, onCreate }) {
  const [lines, setLines] = React.useState([
    { account: '1100 — Bank · NCB Main',   debit: '3,400.00', credit: '',         desc: 'Cash collected' },
    { account: '1200 — Inventory (WIP)',   debit: '',         credit: '1,400.00', desc: 'Stock consumed' },
    { account: '4001 — Sales Revenue',     debit: '',         credit: '2,000.00', desc: 'Revenue recognized' },
  ]);
  const [note, setNote] = React.useState('');

  const sum = (key) => lines.reduce((s, l) => s + (parseFloat(String(l[key]).replace(/,/g, '')) || 0), 0);
  const totalDr = sum('debit');
  const totalCr = sum('credit');
  const diff = totalDr - totalCr;
  const balanced = Math.abs(diff) < 0.005;

  const fmt = (n) => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <Page breadcrumb={['Accounting', 'Ledger', 'New Entry']} title="Create Journal Entry">
      <Card padding={20}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 24 }}>
          <JStatic label="Serial No" value="JV-2024-0226" mono locked />
          <JSelect label="Currency" value="SAR — Saudi Riyal" options={['SAR — Saudi Riyal', 'USD — US Dollar']} />
          <JSelect label="Fiscal Year" value="2024" options={['2024', '2025', '2026']} />
          <Field label="Posting Date" placeholder="mm/dd/yyyy" mono />
        </div>
      </Card>

      <Card>
        <SectionHeader title="Entry Lines" subtitle="Each line is a single account debit or credit" marker="green" />
        <EditableTable
          columns={JOURNAL_LINE_COLS}
          rows={lines}
          onChange={setLines}
          addRowLabel="Add Line"
          emptyRow={() => ({ account: '', debit: '', credit: '', desc: '' })} />

        {/* Balance bar */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '16px 18px', borderRadius: 6,
          background: balanced ? 'rgba(29,184,138,0.08)' : 'rgba(239,68,68,0.08)',
          border: `1px solid ${balanced ? 'rgba(29,184,138,0.3)' : 'rgba(239,68,68,0.3)'}`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ color: balanced ? '#1DB88A' : '#EF4444', display: 'flex' }}>
              <Icon name={balanced ? 'check' : 'info'} size={16} />
            </span>
            <span style={{ fontSize: 13, fontWeight: 600, color: balanced ? '#1DB88A' : '#EF4444' }}>
              {balanced ? 'Entry is balanced' : `Out of balance by SAR ${fmt(Math.abs(diff))}`}
            </span>
          </div>
          <div style={{ display: 'flex', gap: 40 }}>
            {[['Total Debits', totalDr], ['Total Credits', totalCr]].map(([label, val]) => (
              <div key={label} style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 700, fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--gl-fg-3)' }}>{label}</div>
                <div style={{ fontFamily: 'var(--gl-font-mono)', fontSize: 16, fontWeight: 600, color: 'var(--gl-fg-1)', marginTop: 4 }}>SAR {fmt(val)}</div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <Card>
        <SectionHeader title="Documentation" marker="orange" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <Textarea label="Memo" placeholder="Reason for this entry, references, approvals…"
                    value={note} onChange={setNote} rows={5} />
          <div>
            <div style={{ fontWeight: 700, fontSize: 11, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--gl-fg-2)', marginBottom: 8 }}>Supporting Documents</div>
            <window._bankShared.UploadDropzone label="Invoices · Receipts · Approvals" />
          </div>
        </div>
      </Card>

      <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
        <Button variant="secondary" onClick={onCancel}>Save Draft</Button>
        <Button variant="primary" icon="check" onClick={onCreate} disabled={!balanced}>Post Entry</Button>
      </div>
    </Page>
  );
}

function JStatic({ label, value, mono, locked }) {
  return (
    <div>
      <div style={{ fontWeight: 700, fontSize: 11, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--gl-fg-2)', marginBottom: 8 }}>{label}</div>
      <div style={{
        height: 40, padding: '0 16px', background: 'var(--gl-input-bg)',
        border: '1px solid var(--gl-border-strong)', borderRadius: 4,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        fontFamily: mono ? 'var(--gl-font-mono)' : undefined, fontSize: 14, color: 'var(--gl-fg-1)',
      }}>
        <span>{value}</span>
        {locked && <Icon name="lock" size={13} color="var(--gl-fg-3)" />}
      </div>
    </div>
  );
}

function JSelect({ label, value, options }) {
  const [v, setV] = React.useState(value);
  return (
    <div>
      <div style={{ fontWeight: 700, fontSize: 11, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--gl-fg-2)', marginBottom: 8 }}>{label}</div>
      <div style={{ position: 'relative' }}>
        <select value={v} onChange={(e) => setV(e.target.value)}
          style={{
            width: '100%', height: 40, padding: '0 40px 0 16px',
            background: 'var(--gl-input-bg)', border: '1px solid var(--gl-border-strong)',
            borderRadius: 4, fontFamily: 'var(--gl-font-body)', fontSize: 14,
            color: 'var(--gl-fg-1)', appearance: 'none', cursor: 'pointer', outline: 'none',
          }}>
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        <div style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--gl-fg-3)', display: 'flex', pointerEvents: 'none' }}>
          <Icon name="chevDown" size={14} />
        </div>
      </div>
    </div>
  );
}

function JCell({ value, placeholder, mono, align }) {
  const [v, setV] = React.useState(value || '');
  return (
    <input value={v} placeholder={placeholder} onChange={(e) => setV(e.target.value)}
      style={{
        width: '100%', height: 34, padding: '0 10px',
        background: 'var(--gl-input-bg)', border: '1px solid var(--gl-border)',
        borderRadius: 4, fontFamily: mono ? 'var(--gl-font-mono)' : 'var(--gl-font-body)',
        fontSize: 13, color: 'var(--gl-fg-1)', textAlign: align || 'left',
        outline: 'none', boxSizing: 'border-box',
      }} />
  );
}

window.CreateJournalEntry = CreateJournalEntry;
