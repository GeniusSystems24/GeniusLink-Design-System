/* global React, Page, Card, SectionHeader, Field, Textarea, Button, Icon, LockedField, StatusPill */
// Banking — Transfers: Local (inter-account) + External (cross-bank/cross-border)
// Local Transfer Details recreates the "Inter-Account Settlement [TR-9042]" master template.

const { MoneyField, BankSelect, Static, UploadDropzone, JournalPreview } = window._bankShared;

/* =========================================================
   FLOW VISUAL — From → To card pair with arrow
   ========================================================= */
function FlowPair({ from, to }) {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '1fr 56px 1fr', gap: 24, alignItems: 'center',
    }}>
      <FlowCard tone="orange" {...from} />
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 56 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 999, background: '#4A7CFF',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#FFFFFF', boxShadow: '0 8px 24px -6px rgba(74,124,255,0.4)',
        }}>
          <Icon name="chevRight" size={18} />
        </div>
      </div>
      <FlowCard tone="green" {...to} />
    </div>
  );
}

function FlowCard({ tone, label, title, sub, meta, metaColor }) {
  const colors = {
    orange: { marker: '#F97316', bg: 'rgba(249,115,22,0.06)', border: 'rgba(249,115,22,0.25)' },
    green:  { marker: '#1DB88A', bg: 'rgba(29,184,138,0.06)', border: 'rgba(29,184,138,0.25)' },
  };
  const c = colors[tone];
  return (
    <div style={{
      padding: 20, background: c.bg, border: `1px solid ${c.border}`,
      borderRadius: 6, display: 'flex', gap: 14,
    }}>
      <div style={{ width: 4, alignSelf: 'stretch', borderRadius: 12, background: c.marker }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontWeight: 700, fontSize: 10, letterSpacing: '0.1em',
          textTransform: 'uppercase', color: c.marker, marginBottom: 8,
        }}>{label}</div>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--gl-fg-1)' }}>{title}</div>
        {sub && <div style={{
          fontFamily: 'var(--gl-font-mono)', fontSize: 12, color: 'var(--gl-fg-3)', marginTop: 4,
        }}>{sub}</div>}
        {meta && (
          <div style={{
            marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--gl-border)',
            fontFamily: 'var(--gl-font-mono)', fontSize: 12, fontWeight: 600,
            color: metaColor || 'var(--gl-fg-2)',
          }}>{meta}</div>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   CREATE LOCAL TRANSFER
   ========================================================= */
function CreateLocalTransfer({ onCancel, onCreate }) {
  const [amount, setAmount] = React.useState('1,800.00');
  const [note, setNote] = React.useState('');

  return (
    <Page breadcrumb={['Banking', 'Local Transfers']} title="Create Local Transfer">
      <Card padding={20}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24 }}>
          <Static label="Serial No" value="TR-9042" mono locked />
          <BankSelect label="Currency" value="SAR — Saudi Riyal" options={['SAR — Saudi Riyal', 'USD — US Dollar']} />
          <Field label="Value Date" placeholder="mm/dd/yyyy" mono />
        </div>
      </Card>

      <Card>
        <SectionHeader title="Transfer Route" subtitle="Move funds between two internal accounts" marker="blue" />
        <FlowPair
          from={{ label: 'From Account', title: '1001 — Cash Box', sub: 'OPS_NY_CHASE_442', meta: 'Balance after · 40,700.00', metaColor: '#EF4444' }}
          to={{ label: 'To Account', title: '1100 — Bank · NCB Main', sub: 'TREAS_HSBC_900', meta: 'Balance after · 188,220.00', metaColor: '#1DB88A' }} />
      </Card>

      <Card>
        <SectionHeader title="Amount" marker="green" />
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 24, alignItems: 'start' }}>
          <MoneyField label="Transfer Amount" value={amount} onChange={setAmount} required accent="#1DB88A" />
          <Field label="Reference No" placeholder="e.g. SETL-Q4-0042" mono />
        </div>
      </Card>

      <Card>
        <SectionHeader title="Journal Preview" subtitle="The double-entry this transfer will post" marker="green" />
        <JournalPreview rows={[
          { account: '1100 — Bank · NCB Main', debit: amount, credit: '' },
          { account: '1001 — Cash Box',         debit: '',     credit: amount },
        ]} />
      </Card>

      <Card>
        <SectionHeader title="Documentation" marker="orange" />
        <Textarea label="Transfer Notes"
                  placeholder="Reason for settlement, approval reference, or reconciliation context…"
                  value={note} onChange={setNote} rows={4} />
      </Card>

      <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
        <Button variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button variant="primary" icon="check" onClick={onCreate}>Post Transfer</Button>
      </div>
    </Page>
  );
}

/* =========================================================
   LOCAL TRANSFER DETAILS — "Inter-Account Settlement [TR-9042]"
   (the Financial-Operation-Details master template)
   ========================================================= */
function LocalTransferDetails({ onBack, onEdit, onDelete }) {
  const lines = [
    { num: '01', account: 'OPS_NY_CHASE_442',  name: '1100 — Bank · NCB Main', currency: 'USD', amount: '+5,240.00', side: 'Debit',  date: '15 Dec, 14:20' },
    { num: '02', account: 'TREAS_LN_HSBC_900', name: '1001 — Cash Box',        currency: 'USD', amount: '−5,240.00', side: 'Credit', date: '15 Dec, 14:21' },
  ];
  const grid = '40px 1.6fr 0.8fr 1.1fr 0.9fr 1fr';

  return (
    <Page
      breadcrumb={['Banking', 'Local Transfers', 'Details']}
      title="Inter-Account Settlement"
      titleArabic="تسوية بين الحسابات"
      titleRight={
        <div style={{ display: 'flex', gap: 8 }}>
          <Button variant="secondary" icon="download">Export</Button>
          <Button variant="secondary" icon="edit" onClick={onEdit}>Edit</Button>
          <Button variant="danger" icon="trash" onClick={onDelete}>Void</Button>
        </div>
      }>

      {/* Headline */}
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ width: 4, borderRadius: 12, background: '#4A7CFF' }} />
            <div>
              <div style={{ fontFamily: 'var(--gl-font-mono)', fontSize: 13, color: '#4A7CFF' }}>TR-9042</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--gl-fg-1)', marginTop: 4 }}>Operational Adjustment · Q4</div>
            </div>
          </div>
          <StatusPill tone="success">Reconciled</StatusPill>
        </div>
        <p style={{
          margin: 0, fontSize: 14, lineHeight: 1.6, color: 'var(--gl-fg-2)',
          maxWidth: 620,
        }}>Operational adjustment for quarterly reconciliation. The transfer ensures synchronization between domestic holdings and international reserves prior to the Q4 audit window.</p>
      </Card>

      {/* Route */}
      <Card>
        <SectionHeader title="Settlement Route" marker="blue" />
        <FlowPair
          from={{ label: 'Debited From', title: '1100 — Bank · NCB Main', sub: 'OPS_NY_CHASE_442', meta: '15 Dec, 14:20', metaColor: 'var(--gl-fg-2)' }}
          to={{ label: 'Credited To', title: '1001 — Cash Box', sub: 'TREAS_LN_HSBC_900', meta: '15 Dec, 14:21', metaColor: 'var(--gl-fg-2)' }} />
      </Card>

      {/* Distribution table */}
      <Card padding={0}>
        <div style={{ padding: '20px 24px 0' }}>
          <SectionHeader title="Transfer Lines" subtitle="2 lines · balanced" marker="green" />
        </div>
        <div style={{ padding: '16px 24px 24px' }}>
          <div style={{
            display: 'grid', gridTemplateColumns: grid, gap: 12, padding: '0 0 12px',
            borderBottom: '1px solid var(--gl-border)',
            fontWeight: 700, fontSize: 10, letterSpacing: '0.05em',
            textTransform: 'uppercase', color: 'var(--gl-fg-3)',
          }}>
            <span>#</span><span>Account</span><span>Currency</span>
            <span style={{ textAlign: 'right' }}>Amount</span><span>Side</span>
            <span style={{ textAlign: 'right' }}>Posted</span>
          </div>
          {lines.map((l) => {
            const positive = l.amount.startsWith('+');
            return (
              <div key={l.num} style={{
                display: 'grid', gridTemplateColumns: grid, gap: 12,
                padding: '14px 0', alignItems: 'center',
                borderBottom: '1px solid var(--gl-border)',
                fontSize: 13, color: 'var(--gl-fg-1)',
              }}>
                <span style={{ fontFamily: 'var(--gl-font-mono)', color: 'var(--gl-fg-3)' }}>{l.num}</span>
                <span>
                  <div style={{ fontWeight: 600 }}>{l.name}</div>
                  <div style={{ fontFamily: 'var(--gl-font-mono)', fontSize: 11, color: 'var(--gl-fg-3)', marginTop: 2 }}>{l.account}</div>
                </span>
                <span style={{ color: 'var(--gl-fg-2)' }}>{l.currency}</span>
                <span style={{ fontFamily: 'var(--gl-font-mono)', textAlign: 'right', fontWeight: 600, color: positive ? '#1DB88A' : '#EF4444' }}>{l.amount}</span>
                <span><StatusPill tone={positive ? 'info' : 'danger'} size="sm">{l.side}</StatusPill></span>
                <span style={{ fontFamily: 'var(--gl-font-mono)', fontSize: 12, textAlign: 'right', color: 'var(--gl-fg-2)' }}>{l.date}</span>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Audit */}
      <Card>
        <SectionHeader title="Audit Information" marker="orange" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, rowGap: 16 }}>
          {[
            ['Initiated By', 'Layla A. (ID: 12)'],
            ['Initiated At', 'Dec 15, 2025 14:18'],
            ['Reconciled By', 'Controller (ID: 3)'],
            ['Audit Hash', 'a7f8…b161'],
          ].map(([k, v]) => (
            <div key={k}>
              <div style={{
                fontWeight: 700, fontSize: 11, letterSpacing: '0.05em',
                textTransform: 'uppercase', color: 'var(--gl-fg-3)', marginBottom: 6,
              }}>{k}</div>
              <div style={{
                fontSize: 14, color: 'var(--gl-fg-1)',
                fontFamily: k === 'Audit Hash' ? 'var(--gl-font-mono)' : undefined,
              }}>{v}</div>
            </div>
          ))}
        </div>
      </Card>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Button variant="secondary" icon="back" onClick={onBack}>Back to List</Button>
      </div>
    </Page>
  );
}

/* =========================================================
   CREATE EXTERNAL TRANSFER
   ========================================================= */
function CreateExternalTransfer({ onCancel, onCreate }) {
  const [amount, setAmount] = React.useState('12,000.00');
  const [note, setNote] = React.useState('');

  return (
    <Page breadcrumb={['Banking', 'External Transfers']} title="Create External Transfer">
      <Card padding={20}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24 }}>
          <Static label="Serial No" value="EXT-2024-0311" mono locked />
          <BankSelect label="Send Currency" value="SAR — Saudi Riyal" options={['SAR — Saudi Riyal', 'USD — US Dollar']} />
          <Field label="Value Date" placeholder="mm/dd/yyyy" mono />
        </div>
      </Card>

      <Card>
        <SectionHeader title="Source Account" subtitle="Internal account funds are drawn from" marker="blue" />
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 24, alignItems: 'start' }}>
          <MoneyField label="Amount" value={amount} onChange={setAmount} required accent="#F97316" />
          <BankSelect label="From Account" required value="1100 — Bank · NCB Main"
                      options={['1100 — Bank · NCB Main', '1101 — Bank · Al Rajhi']} />
        </div>
      </Card>

      <Card>
        <SectionHeader title="Beneficiary" subtitle="External recipient — outside this tenant" marker="green" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <Field label="Beneficiary Name" required placeholder="e.g. Global Steel Imports LLC" />
          <Field label="Bank Name" required placeholder="e.g. HSBC London" />
          <Field label="IBAN" required placeholder="GB29 NWBK 6016 1331 9268 19" mono />
          <Field label="SWIFT / BIC" required placeholder="HBUKGB4B" mono />
        </div>
      </Card>

      {/* FX + fees */}
      <Card>
        <SectionHeader title="Exchange &amp; Fees" subtitle="Cross-currency conversion and bank charges" marker="green" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
          <FxTile label="Exchange Rate" value="3.7502" sub="SAR → USD" />
          <FxTile label="Recipient Gets" value="3,199.83" sub="USD" accent="#1DB88A" />
          <FxTile label="Bank Fees" value="45.00" sub="SAR" accent="#F97316" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <Field label="Purpose Code" required placeholder="e.g. P0103 — Import Payment" mono />
          <Field label="Charge Bearer" placeholder="OUR / SHA / BEN" />
        </div>
      </Card>

      <Card>
        <SectionHeader title="Documentation &amp; Compliance" marker="orange" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <Textarea label="Notes" placeholder="Invoice reference, contract number, regulatory notes…"
                    value={note} onChange={setNote} rows={5} />
          <div>
            <div style={{
              fontWeight: 700, fontSize: 11, letterSpacing: '0.05em',
              textTransform: 'uppercase', color: 'var(--gl-fg-2)', marginBottom: 8,
            }}>Supporting Documents</div>
            <UploadDropzone label="Invoice · Contract · Compliance forms" />
          </div>
        </div>
        <div style={{
          display: 'flex', gap: 12, padding: '14px 16px',
          background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.25)',
          borderRadius: 4, fontSize: 12, color: 'var(--gl-fg-2)', lineHeight: 1.5,
        }}>
          <span style={{ color: '#F97316', flexShrink: 0 }}><Icon name="info" size={14} /></span>
          <span>Cross-border transfers are screened against sanctions lists and require a valid purpose code before release.</span>
        </div>
      </Card>

      <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
        <Button variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button variant="primary" icon="check" onClick={onCreate}>Submit for Approval</Button>
      </div>
    </Page>
  );
}

function FxTile({ label, value, sub, accent }) {
  return (
    <div style={{
      padding: 18, background: 'var(--gl-bg)',
      border: '1px solid var(--gl-border)', borderRadius: 6,
    }}>
      <div style={{
        fontWeight: 700, fontSize: 10, letterSpacing: '0.08em',
        textTransform: 'uppercase', color: 'var(--gl-fg-3)', marginBottom: 8,
      }}>{label}</div>
      <div style={{
        fontFamily: 'var(--gl-font-mono)', fontSize: 22, fontWeight: 600,
        color: accent || 'var(--gl-fg-1)', lineHeight: 1.1,
      }}>{value}</div>
      <div style={{ fontFamily: 'var(--gl-font-mono)', fontSize: 11, color: 'var(--gl-fg-3)', marginTop: 6 }}>{sub}</div>
    </div>
  );
}

/* =========================================================
   EXTERNAL TRANSFER DETAILS
   ========================================================= */
function ExternalTransferDetails({ onBack, onEdit, onDelete }) {
  return (
    <Page
      breadcrumb={['Banking', 'External Transfers', 'Details']}
      title="External Wire"
      titleArabic="تحويل خارجي"
      titleRight={
        <div style={{ display: 'flex', gap: 8 }}>
          <Button variant="secondary" icon="download">SWIFT Copy</Button>
          <Button variant="secondary" icon="edit" onClick={onEdit}>Edit</Button>
          <Button variant="danger" icon="trash" onClick={onDelete}>Cancel Wire</Button>
        </div>
      }>

      <Card>
        <SectionHeader
          title="Wire Amount"
          subtitle="Submitted Dec 18, 2025 · awaiting bank confirmation"
          marker="green"
          right={<StatusPill tone="warning">In Transit</StatusPill>} />
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
          <span style={{ fontFamily: 'var(--gl-font-mono)', fontSize: 16, color: 'var(--gl-fg-3)' }}>SAR</span>
          <span style={{ fontFamily: 'var(--gl-font-mono)', fontSize: 44, fontWeight: 700, color: '#F97316', letterSpacing: '-0.02em', lineHeight: 1 }}>−12,000.00</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
          <FxTile label="Exchange Rate" value="3.7502" sub="SAR → USD" />
          <FxTile label="Recipient Gets" value="3,199.83" sub="USD" accent="#1DB88A" />
          <FxTile label="Bank Fees" value="45.00" sub="SAR" accent="#F97316" />
        </div>
      </Card>

      <Card>
        <SectionHeader title="Beneficiary" marker="blue" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, rowGap: 20 }}>
          <LockedField label="Beneficiary" value="Global Steel Imports LLC" />
          <LockedField label="Bank" value="HSBC London" />
          <LockedField label="IBAN" value="GB29 NWBK 6016 1331 9268 19" mono />
          <LockedField label="SWIFT / BIC" value="HBUKGB4B" mono />
          <LockedField label="Purpose Code" value="P0103 — Import Payment" mono />
          <LockedField label="Charge Bearer" value="OUR" />
        </div>
      </Card>

      <Card>
        <SectionHeader title="Posted Journal" subtitle="Entry JV-2024-0219" marker="green" />
        <JournalPreview rows={[
          { account: '2100 — Imports Payable', debit: '12,000.00', credit: '' },
          { account: '5300 — Bank Charges',    debit: '45.00',     credit: '' },
          { account: '1100 — Bank · NCB Main', debit: '',          credit: '12,045.00' },
        ]} />
      </Card>

      <Card>
        <SectionHeader title="Audit Information" marker="orange" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, rowGap: 16 }}>
          {[
            ['Initiated By', 'Layla A. (ID: 12)'],
            ['Submitted At', 'Dec 18, 2025 11:02 AM'],
            ['Compliance Check', 'Passed · Dec 18 11:04'],
            ['SWIFT Ref', 'FT24352098110'],
          ].map(([k, v]) => (
            <div key={k}>
              <div style={{
                fontWeight: 700, fontSize: 11, letterSpacing: '0.05em',
                textTransform: 'uppercase', color: 'var(--gl-fg-3)', marginBottom: 6,
              }}>{k}</div>
              <div style={{
                fontSize: 14, color: 'var(--gl-fg-1)',
                fontFamily: k === 'SWIFT Ref' ? 'var(--gl-font-mono)' : undefined,
              }}>{v}</div>
            </div>
          ))}
        </div>
      </Card>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Button variant="secondary" icon="back" onClick={onBack}>Back to List</Button>
      </div>
    </Page>
  );
}

Object.assign(window, {
  CreateLocalTransfer, LocalTransferDetails,
  CreateExternalTransfer, ExternalTransferDetails,
});
