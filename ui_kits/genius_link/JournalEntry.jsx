/* global React, Card, SectionHeader, Field, Select, Textarea, Button, IconBtn, Page, Icon, TotalsStrip, LedgerTable */
// Screen: Opening Journal Entry

function OpeningJournalEntry({ onCancel, onCreate }) {
  const [lines, setLines] = React.useState([
    { account: 'Cash Box (1001)', currency: 'SAR', amount: '+5,000.00', description: 'Opening balance' },
    { account: 'Capital Account (3001)', currency: 'SAR', amount: '-5,000.00', description: 'Owner investment' },
  ]);
  const [note, setNote] = React.useState('');

  return (
    <Page
      breadcrumb={['Accounting', 'Ledger', 'New Entry']}
      title="Opening Journal Entry"
      titleArabic="قيد افتتاحي"
      titleRight={
        <IconBtn icon="back" onClick={onCancel} title="Back" size={36} />
      }>
      <Card>
        <SectionHeader title="Entry Details" marker="blue" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24 }}>
          <div>
            <Label>Serial No *</Label>
            <LockedInput value="JV-2024-0042" mono />
          </div>
          <div>
            <Label>Currency *</Label>
            <SelectInput value="SAR — Saudi Riyal"
                         options={['SAR — Saudi Riyal', 'USD — US Dollar', 'EUR — Euro']} />
          </div>
          <div>
            <Label>Fiscal Year *</Label>
            <SelectInput value="2024" options={['2024', '2025', '2026']} />
          </div>
        </div>
      </Card>

      <Card>
        <SectionHeader title="Transfer Lines" marker="green" />
        <TransferLinesTable lines={lines} onChange={setLines} />
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
          paddingTop: 8,
        }}>
          <div style={{
            fontSize: 12, color: 'var(--gl-fg-3)', fontStyle: 'italic', maxWidth: 320,
          }}>To add a new row, simply start entering data in the last empty row.</div>
          <TotalsStrip debits="5,000.00" credits="5,000.00" difference="0.00" />
        </div>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <Card padding={20}>
          <SectionHeader title="Internal Notes" marker="orange" />
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Type internal memo here…"
            rows={5}
            style={{
              width: '100%', padding: '12px 16px',
              background: 'var(--gl-input-bg)',
              border: '1px solid var(--gl-border-strong)',
              borderRadius: 4,
              fontFamily: 'var(--gl-font-body)', fontSize: 14,
              color: 'var(--gl-fg-1)', outline: 'none',
              resize: 'vertical', boxSizing: 'border-box',
            }} />
        </Card>
        <Card padding={20}>
          <SectionHeader title="Attachments" marker="orange" />
          <UploadDropzone />
        </Card>
      </div>

      <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
        <Button variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button variant="primary" onClick={onCreate}>Create Entry</Button>
      </div>
    </Page>
  );
}

function Label({ children }) {
  return (
    <div style={{
      fontWeight: 700, fontSize: 11, letterSpacing: '0.05em',
      textTransform: 'uppercase', color: 'var(--gl-fg-2)', marginBottom: 8,
    }}>{children}</div>
  );
}

function LockedInput({ value, mono }) {
  return (
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
      <Icon name="lock" size={13} color="var(--gl-fg-3)" />
    </div>
  );
}

function SelectInput({ value, options }) {
  const [v, setV] = React.useState(value);
  return (
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
  );
}

function TransferLinesTable({ lines, onChange }) {
  const cols = '40px 2fr 0.8fr 1.2fr 1.8fr 40px';
  return (
    <div>
      <div style={{
        display: 'grid', gridTemplateColumns: cols, gap: 10,
        padding: '0 0 12px',
        fontWeight: 700, fontSize: 10, letterSpacing: '0.05em',
        textTransform: 'uppercase', color: 'var(--gl-fg-3)',
        borderBottom: '1px solid var(--gl-border)',
      }}>
        <span>#</span><span>Account</span><span>Currency</span>
        <span style={{ textAlign: 'right' }}>Amount $</span>
        <span>Description</span><span style={{ textAlign: 'right' }}>Delete</span>
      </div>
      {lines.map((l, i) => {
        const amountNum = parseFloat(l.amount.replace(/[+,]/g, '')) || 0;
        const color = amountNum > 0 ? '#1DB88A' : '#EF4444';
        return (
          <div key={i} style={{
            display: 'grid', gridTemplateColumns: cols, gap: 10,
            padding: '14px 0', alignItems: 'center',
            fontSize: 13, color: 'var(--gl-fg-1)',
            borderBottom: '1px solid var(--gl-border)',
          }}>
            <span style={{ fontFamily: 'var(--gl-font-mono)', color: 'var(--gl-fg-3)' }}>
              {String(i + 1).padStart(2, '0')}
            </span>
            <span style={{ fontWeight: 600 }}>{l.account}</span>
            <span>{l.currency}</span>
            <span style={{ fontFamily: 'var(--gl-font-mono)', textAlign: 'right', color, fontWeight: 600 }}>
              {l.amount}
            </span>
            <span style={{ color: 'var(--gl-fg-2)' }}>{l.description}</span>
            <button style={{
              background: 'transparent', border: 'none', cursor: 'pointer',
              color: 'var(--gl-fg-3)', justifySelf: 'end', padding: 4,
            }}
              onClick={() => onChange(lines.filter((_, j) => j !== i))}>
              <Icon name="trash" size={16} />
            </button>
          </div>
        );
      })}
      {/* empty row */}
      <div style={{
        display: 'grid', gridTemplateColumns: cols, gap: 10,
        padding: '14px 0', alignItems: 'center',
        fontSize: 13, color: 'var(--gl-fg-3)', fontStyle: 'italic',
      }}>
        <span style={{ fontFamily: 'var(--gl-font-mono)', color: 'var(--gl-fg-4)' }}>
          {String(lines.length + 1).padStart(2, '0')}
        </span>
        <span>Select account…</span>
        <span>SAR</span>
        <span style={{ fontFamily: 'var(--gl-font-mono)', textAlign: 'right' }}>0.00</span>
        <span>—</span>
        <span></span>
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
        alignItems: 'center', justifyContent: 'center', gap: 6,
        cursor: 'pointer',
        transition: 'border-color 150ms ease',
      }}>
      <Icon name="doc" size={22} color="var(--gl-fg-3)" />
      <div style={{ fontSize: 14, color: 'var(--gl-fg-1)' }}>
        <strong>Click to upload</strong> or drag and drop
      </div>
      <div style={{ fontSize: 11, color: 'var(--gl-fg-3)' }}>PDF, JPG, PNG (Max 10MB)</div>
    </div>
  );
}

window.OpeningJournalEntry = OpeningJournalEntry;
