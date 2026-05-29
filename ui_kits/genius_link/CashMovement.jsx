/* global React, Page, Card, SectionHeader, Field, Textarea, Button, Icon, LockedField, StatusPill */
// Banking — Cash Movements: Create Deposit / Create Withdrawal + their detail views.
// A deposit and a withdrawal are mirror operations, so they share one inner form.

/* =========================================================
   SHARED BANKING HELPERS  (exposed on window._bankShared)
   ========================================================= */

function MoneyField({ label, value, onChange, currency = 'SAR', required, accent = '#4A7CFF' }) {
  const [focused, setFocused] = React.useState(false);
  return (
    <div>
      <div style={{
        fontWeight: 700, fontSize: 11, letterSpacing: '0.05em',
        textTransform: 'uppercase', color: 'var(--gl-fg-2)', marginBottom: 8,
      }}>{label}{required && <span style={{ color: '#EF4444', marginLeft: 2 }}>*</span>}</div>
      <div style={{
        display: 'flex', alignItems: 'center',
        height: 56, padding: '0 18px',
        background: 'var(--gl-input-bg)',
        border: `${focused ? 2 : 1}px solid ${focused ? accent : 'var(--gl-border-strong)'}`,
        borderRadius: 4,
        transition: 'border-color 150ms ease',
      }}>
        <span style={{
          fontFamily: 'var(--gl-font-mono)', fontSize: 18, fontWeight: 600,
          color: 'var(--gl-fg-3)', marginRight: 12,
        }}>{currency}</span>
        <input
          value={value}
          onChange={(e) => onChange && onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="0.00"
          style={{
            flex: 1, background: 'transparent', border: 'none', outline: 'none',
            fontFamily: 'var(--gl-font-mono)', fontSize: 28, fontWeight: 600,
            color: 'var(--gl-fg-1)', letterSpacing: '-0.01em', width: '100%',
          }} />
      </div>
    </div>
  );
}

function BankSelect({ label, value, options, required }) {
  const [v, setV] = React.useState(value);
  return (
    <div>
      <div style={{
        fontWeight: 700, fontSize: 11, letterSpacing: '0.05em',
        textTransform: 'uppercase', color: 'var(--gl-fg-2)', marginBottom: 8,
      }}>{label}{required && <span style={{ color: '#EF4444', marginLeft: 2 }}>*</span>}</div>
      <div style={{ position: 'relative' }}>
        <select value={v} onChange={(e) => setV(e.target.value)}
          style={{
            width: '100%', height: 40, padding: '0 40px 0 16px',
            background: 'var(--gl-input-bg)',
            border: '1px solid var(--gl-border-strong)',
            borderRadius: 4,
            fontFamily: 'var(--gl-font-body)', fontSize: 14,
            color: 'var(--gl-fg-1)', appearance: 'none', cursor: 'pointer', outline: 'none',
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

function PaymentMethodPicker({ value, onChange }) {
  const methods = [
    { id: 'cash',   label: 'Cash',     icon: 'ledger' },
    { id: 'cheque', label: 'Cheque',   icon: 'doc' },
    { id: 'wire',   label: 'Wire',     icon: 'paperclip' },
    { id: 'card',   label: 'Card',     icon: 'briefcase' },
  ];
  return (
    <div>
      <div style={{
        fontWeight: 700, fontSize: 11, letterSpacing: '0.05em',
        textTransform: 'uppercase', color: 'var(--gl-fg-2)', marginBottom: 8,
      }}>Payment Method</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }}>
        {methods.map((m) => {
          const active = value === m.id;
          return (
            <button key={m.id} type="button"
              onClick={() => onChange(m.id)}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                padding: '14px 8px', borderRadius: 4,
                background: active ? 'rgba(74,124,255,0.12)' : 'var(--gl-input-bg)',
                border: `1px solid ${active ? '#4A7CFF' : 'var(--gl-border)'}`,
                color: active ? '#4A7CFF' : 'var(--gl-fg-2)',
                cursor: 'pointer', transition: 'all 150ms ease',
              }}>
              <Icon name={m.icon} size={18} />
              <span style={{ fontSize: 12, fontWeight: 600 }}>{m.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Double-entry preview strip — shows the journal that will post
function JournalPreview({ rows }) {
  return (
    <div style={{
      border: '1px solid var(--gl-border)', borderRadius: 6, overflow: 'hidden',
    }}>
      <div style={{
        display: 'grid', gridTemplateColumns: '40px 1.8fr 1fr 1fr',
        padding: '10px 16px', gap: 12,
        background: 'var(--gl-bg)',
        fontWeight: 700, fontSize: 10, letterSpacing: '0.05em',
        textTransform: 'uppercase', color: 'var(--gl-fg-3)',
        borderBottom: '1px solid var(--gl-border)',
      }}>
        <span>#</span><span>Account</span>
        <span style={{ textAlign: 'right' }}>Debit</span>
        <span style={{ textAlign: 'right' }}>Credit</span>
      </div>
      {rows.map((r, i) => (
        <div key={i} style={{
          display: 'grid', gridTemplateColumns: '40px 1.8fr 1fr 1fr',
          padding: '14px 16px', gap: 12, alignItems: 'center',
          borderBottom: i < rows.length - 1 ? '1px solid var(--gl-border)' : 'none',
          fontSize: 13, color: 'var(--gl-fg-1)',
        }}>
          <span style={{ fontFamily: 'var(--gl-font-mono)', color: 'var(--gl-fg-3)' }}>{String(i + 1).padStart(2, '0')}</span>
          <span style={{ fontWeight: 600 }}>{r.account}</span>
          <span style={{ fontFamily: 'var(--gl-font-mono)', textAlign: 'right', color: r.debit ? '#1DB88A' : 'var(--gl-fg-4)' }}>{r.debit || '—'}</span>
          <span style={{ fontFamily: 'var(--gl-font-mono)', textAlign: 'right', color: r.credit ? '#EF4444' : 'var(--gl-fg-4)' }}>{r.credit || '—'}</span>
        </div>
      ))}
    </div>
  );
}

/* =========================================================
   CREATE — inner shared form
   ========================================================= */
function CashMovementForm({ kind, onCancel, onCreate }) {
  const isDeposit = kind === 'deposit';
  const [amount, setAmount] = React.useState('5,000.00');
  const [method, setMethod] = React.useState('cash');
  const [note, setNote] = React.useState('');

  const accountLabel = isDeposit ? 'To Account' : 'From Account';
  const serial = isDeposit ? 'DEP-2024-0182' : 'WDR-2024-0094';
  const title = isDeposit ? 'Create Deposit' : 'Create Withdrawal';
  const action = isDeposit ? 'Post Deposit' : 'Post Withdrawal';
  const accent = isDeposit ? '#1DB88A' : '#F97316';

  const journal = isDeposit
    ? [
        { account: '1100 — Bank · NCB Main', debit: amount, credit: '' },
        { account: '4001 — Sales Revenue',    debit: '',     credit: amount },
      ]
    : [
        { account: '5200 — Operating Expense', debit: amount, credit: '' },
        { account: '1100 — Bank · NCB Main',   debit: '',     credit: amount },
      ];

  return (
    <Page
      breadcrumb={['Banking', isDeposit ? 'Cash Deposits' : 'Cash Withdrawals']}
      title={title}>

      <Card padding={20}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24 }}>
          <window._bankShared.Static label="Serial No" value={serial} mono locked />
          <window._bankShared.BankSelect label="Currency" value="SAR — Saudi Riyal"
                      options={['SAR — Saudi Riyal', 'USD — US Dollar', 'EUR — Euro']} />
          <Field label="Value Date" placeholder="mm/dd/yyyy" mono />
        </div>
      </Card>

      {/* Amount + account — the headline */}
      <Card>
        <SectionHeader
          title={isDeposit ? 'Deposit Details' : 'Withdrawal Details'}
          subtitle={isDeposit ? 'Funds being received into a bank or cash account' : 'Funds being disbursed from a bank or cash account'}
          marker="green" />
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 24, alignItems: 'start' }}>
          <MoneyField label="Amount" value={amount} onChange={setAmount} required accent={accent} />
          <window._bankShared.BankSelect label={accountLabel} required
                      value="1100 — Bank · NCB Main"
                      options={['1100 — Bank · NCB Main', '1001 — Cash Box', '1101 — Bank · Al Rajhi']} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 24 }}>
          <PaymentMethodPicker value={method} onChange={setMethod} />
          <Field label="Reference No" placeholder="e.g. CHQ-44821 / Wire Ref" mono />
        </div>
      </Card>

      {/* Counterparty */}
      <Card>
        <SectionHeader
          title={isDeposit ? 'Source' : 'Beneficiary'}
          subtitle={isDeposit ? 'Who the funds came from' : 'Who the funds were paid to'}
          marker="blue" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 24 }}>
          <Field label={isDeposit ? 'Depositor Name' : 'Payee Name'}
                 placeholder={isDeposit ? 'e.g. Customer 102' : 'e.g. Riyadh Utilities Co.'} />
          <Field label="Linked Account" placeholder="Optional — select account" />
        </div>
      </Card>

      {/* Journal preview */}
      <Card>
        <SectionHeader title="Journal Preview" subtitle="The double-entry this operation will post" marker="green" />
        <JournalPreview rows={journal} />
      </Card>

      {/* Docs */}
      <Card>
        <SectionHeader title="Documentation" marker="orange" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 24 }}>
          <Textarea label="Notes" placeholder="Internal memo, approval reference, or context…"
                    value={note} onChange={setNote} rows={5} />
          <div>
            <div style={{
              fontWeight: 700, fontSize: 11, letterSpacing: '0.05em',
              textTransform: 'uppercase', color: 'var(--gl-fg-2)', marginBottom: 8,
            }}>Receipt / Slip</div>
            <window._bankShared.UploadDropzone label="Deposit slip · Cheque scan · Wire confirmation" />
          </div>
        </div>
      </Card>

      <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
        <Button variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button variant="primary" icon="check" onClick={onCreate}>{action}</Button>
      </div>
    </Page>
  );
}

/* =========================================================
   DETAILS — inner shared detail view
   ========================================================= */
function CashMovementDetails({ kind, onBack, onEdit, onDelete }) {
  const isDeposit = kind === 'deposit';
  const serial = isDeposit ? 'DEP-2024-0182' : 'WDR-2024-0094';
  const amount = '5,000.00';
  const accent = isDeposit ? '#1DB88A' : '#F97316';

  const journal = isDeposit
    ? [
        { account: '1100 — Bank · NCB Main', debit: amount, credit: '' },
        { account: '4001 — Sales Revenue',    debit: '',     credit: amount },
      ]
    : [
        { account: '5200 — Operating Expense', debit: amount, credit: '' },
        { account: '1100 — Bank · NCB Main',   debit: '',     credit: amount },
      ];

  return (
    <Page
      breadcrumb={['Banking', isDeposit ? 'Cash Deposits' : 'Cash Withdrawals', 'Details']}
      title={isDeposit ? 'Deposit Receipt' : 'Withdrawal Voucher'}
      titleRight={
        <div style={{ display: 'flex', gap: 8 }}>
          <Button variant="secondary" icon="download">Print</Button>
          <Button variant="secondary" icon="edit" onClick={onEdit}>Edit</Button>
          <Button variant="danger" icon="trash" onClick={onDelete}>Void</Button>
        </div>
      }>

      <Card>
        <SectionHeader
          title={isDeposit ? 'Amount Received' : 'Amount Disbursed'}
          subtitle={`Value date · Dec 18, 2025`}
          marker="green"
          right={<StatusPill tone="success">Completed</StatusPill>} />
        <div style={{
          display: 'flex', alignItems: 'baseline', gap: 12,
          padding: '4px 0',
        }}>
          <span style={{ fontFamily: 'var(--gl-font-mono)', fontSize: 16, color: 'var(--gl-fg-3)' }}>SAR</span>
          <span style={{
            fontFamily: 'var(--gl-font-mono)', fontSize: 44, fontWeight: 700,
            color: accent, letterSpacing: '-0.02em', lineHeight: 1,
          }}>{isDeposit ? '+' : '−'}{amount}</span>
        </div>
      </Card>

      <Card>
        <SectionHeader title="Transaction Information" marker="blue" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 24, rowGap: 20 }}>
          <LockedField label="Serial No" value={serial} mono />
          <LockedField label="Method" value="Cash" />
          <LockedField label={isDeposit ? 'To Account' : 'From Account'} value="1100 — Bank · NCB Main" />
          <LockedField label={isDeposit ? 'Depositor' : 'Payee'} value={isDeposit ? 'Customer 102' : 'Riyadh Utilities Co.'} />
          <LockedField label="Reference No" value="CHQ-44821" mono />
          <LockedField label="Currency" value="SAR — Saudi Riyal" />
        </div>
      </Card>

      <Card>
        <SectionHeader title="Posted Journal" subtitle="Entry JV-2024-0204" marker="green" />
        <JournalPreview rows={journal} />
      </Card>

      <Card>
        <SectionHeader title="Audit Information" marker="orange" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 24, rowGap: 16 }}>
          {[
            ['Created By', 'Layla A. (ID: 12)'],
            ['Created At', 'Dec 18, 2025 09:42 AM'],
            ['Approved By', 'Controller (ID: 3)'],
            ['Approved At', 'Dec 18, 2025 10:05 AM'],
          ].map(([k, v]) => (
            <div key={k}>
              <div style={{
                fontWeight: 700, fontSize: 11, letterSpacing: '0.05em',
                textTransform: 'uppercase', color: 'var(--gl-fg-3)', marginBottom: 6,
              }}>{k}</div>
              <div style={{ fontSize: 14, color: 'var(--gl-fg-1)' }}>{v}</div>
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
   Static / dropzone helpers reused from inventory if present,
   else define locally; expose a banking-shared bundle.
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

function UploadDropzone({ label }) {
  const [hover, setHover] = React.useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        height: 124,
        border: `1px dashed ${hover ? '#4A7CFF' : 'var(--gl-border-strong)'}`,
        borderRadius: 4, background: 'var(--gl-input-bg)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 6,
        cursor: 'pointer', transition: 'border-color 150ms ease',
      }}>
      <Icon name="upload" size={22} color="var(--gl-fg-3)" />
      <div style={{ fontSize: 14, color: 'var(--gl-fg-1)' }}><strong>Drag & Drop</strong> or click to browse</div>
      <div style={{ fontSize: 11, color: 'var(--gl-fg-3)' }}>{label || 'PDF, JPG, PNG (Max 10MB)'}</div>
    </div>
  );
}

window._bankShared = { Static, BankSelect, MoneyField, JournalPreview, UploadDropzone, PaymentMethodPicker };

window.CreateDeposit     = (p) => <CashMovementForm    kind="deposit"    {...p} />;
window.CreateWithdrawal  = (p) => <CashMovementForm    kind="withdrawal" {...p} />;
window.DepositDetails    = (p) => <CashMovementDetails kind="deposit"    {...p} />;
window.WithdrawalDetails = (p) => <CashMovementDetails kind="withdrawal" {...p} />;
