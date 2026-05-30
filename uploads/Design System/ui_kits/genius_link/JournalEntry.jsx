/* global React, Card, SectionHeader, Field, Select, Textarea, Button, IconBtn, Page, Icon, TotalsStrip, LedgerTable, EditableTable */
// Screen: Opening Journal Entry

const OPENING_LINE_COLS = [
  { key: 'account',     label: 'Account',     w: 280, type: 'text', required: true, placeholder: 'Select account…' },
  { key: 'currency',    label: 'Currency',    w: 110, type: 'enum', opts: ['SAR','USD','EUR'] },
  { key: 'debit',       label: 'Debit',       w: 140, type: 'num',  align: 'right', mono: true },
  { key: 'credit',      label: 'Credit',      w: 140, type: 'num',  align: 'right', mono: true },
  { key: 'description', label: 'Description', w: 240, type: 'text' },
];

function OpeningJournalEntry({ onCancel, onCreate }) {
  const [lines, setLines] = React.useState([
    { account: 'Cash Box (1001)',         currency: 'SAR', debit: '5,000.00', credit: '',         description: 'Opening balance' },
    { account: 'Capital Account (3001)',  currency: 'SAR', debit: '',         credit: '5,000.00', description: 'Owner investment' },
  ]);
  const [note, setNote] = React.useState('');

  const sum = (key) => lines.reduce((s, l) => s + (parseFloat(String(l[key]).replace(/,/g, '')) || 0), 0);
  const fmt = (n) => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const totalDr = sum('debit');
  const totalCr = sum('credit');
  const diff = totalDr - totalCr;

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
        <EditableTable
          columns={OPENING_LINE_COLS}
          rows={lines}
          onChange={setLines}
          addRowLabel="Add Line"
          emptyRow={() => ({ account: '', currency: 'SAR', debit: '', credit: '', description: '' })} />
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
          paddingTop: 4,
        }}>
          <div style={{
            fontSize: 12, color: 'var(--gl-fg-3)', fontStyle: 'italic', maxWidth: 320,
          }}>Debits must equal credits before this entry can be posted.</div>
          <TotalsStrip debits={fmt(totalDr)} credits={fmt(totalCr)} difference={fmt(Math.abs(diff))} />
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
