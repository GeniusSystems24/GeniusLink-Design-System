/* global React */
// GeniusLink — V3 Stage A · Banking & Transfers (mobile).
// No mobile design existed in Figma for these, so built per the design system:
// mirrors the desktop CashMovement.jsx + Transfers.jsx data model, re-expressed
// in the mobile language (stacked cards, 44px targets, bilingual, light/dark via tokens).

const MB = window._mob;
const { C, MIcon, Pill, MCard, MField, MBtn, Scroll } = MB;

/* ───────── shared mobile banking primitives ───────── */

// Big money input — currency prefix + large mono figure
function MMoney({ label, value, currency = 'SAR', accent = C.blue, required, sign }) {
  return (
    <div>
      <div style={{ fontWeight: 700, fontSize: 10, letterSpacing: '0.05em', textTransform: 'uppercase', color: C.fg2, marginBottom: 7, fontFamily: C.body }}>
        {label}{required && <span style={{ color: C.red, marginInlineStart: 2 }}>*</span>}
      </div>
      <div style={{ height: 60, padding: '0 16px', background: C.input, border: `1px solid ${accent}`, borderRadius: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontFamily: C.mono, fontSize: 14, fontWeight: 600, color: C.fg3 }}>{currency}</span>
        <span style={{ fontFamily: C.mono, fontSize: 26, fontWeight: 700, color: accent, letterSpacing: '-0.01em' }}>{sign || ''}{value}</span>
      </div>
    </div>
  );
}

// Payment-method chips (Cash / Cheque / Wire / Card)
function MMethod({ value }) {
  const methods = [['cash', 'Cash'], ['cheque', 'Cheque'], ['wire', 'Wire'], ['card', 'Card']];
  return (
    <div>
      <div style={{ fontWeight: 700, fontSize: 10, letterSpacing: '0.05em', textTransform: 'uppercase', color: C.fg2, marginBottom: 7, fontFamily: C.body }}>Payment Method</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }}>
        {methods.map(([id, label]) => {
          const on = id === value;
          return (
            <div key={id} style={{ height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8, fontSize: 12.5, fontWeight: 700, fontFamily: C.body, background: on ? `${C.blue}1F` : C.input, border: `1px solid ${on ? C.blue : C.border}`, color: on ? C.blue : C.fg2 }}>{label}</div>
          );
        })}
      </div>
    </div>
  );
}

// Stacked double-entry journal preview
function MJournal({ rows }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {rows.map((r, i) => {
        const isDebit = !!r.debit;
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: i < rows.length - 1 ? `1px solid ${C.border}` : 'none' }}>
            <span style={{ fontFamily: C.mono, fontSize: 11, color: C.fg4, width: 20 }}>{String(i + 1).padStart(2, '0')}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.fg1, fontFamily: C.body }}>{r.account}</div>
              <div style={{ marginTop: 4 }}><Pill tone={isDebit ? 'info' : 'danger'}>{isDebit ? 'Debit' : 'Credit'}</Pill></div>
            </div>
            <span style={{ fontFamily: C.mono, fontSize: 13.5, fontWeight: 600, color: isDebit ? C.green : C.red }}>{r.debit || r.credit}</span>
          </div>
        );
      })}
    </div>
  );
}

// Vertical From → To flow
function MFlow({ from, to }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      <MFlowCard tone={C.orange} {...from} />
      <div style={{ display: 'flex', justifyContent: 'center', margin: '-6px 0', position: 'relative', zIndex: 1 }}>
        <div style={{ width: 36, height: 36, borderRadius: 999, background: C.blue, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: `0 6px 18px -6px ${C.blue}99`, transform: 'rotate(90deg)' }}>
          <MIcon name="chevR" size={18} color="#fff" />
        </div>
      </div>
      <MFlowCard tone={C.green} {...to} />
    </div>
  );
}
function MFlowCard({ tone, label, title, sub, meta, metaColor }) {
  return (
    <div style={{ padding: 14, background: `${tone}0F`, border: `1px solid ${tone}40`, borderRadius: 10, display: 'flex', gap: 12 }}>
      <div style={{ width: 4, alignSelf: 'stretch', borderRadius: 12, background: tone }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 700, fontSize: 9.5, letterSpacing: '0.08em', textTransform: 'uppercase', color: tone, marginBottom: 6, fontFamily: C.body }}>{label}</div>
        <div style={{ fontSize: 13.5, fontWeight: 600, color: C.fg1, fontFamily: C.body }}>{title}</div>
        {sub && <div style={{ fontFamily: C.mono, fontSize: 11, color: C.fg3, marginTop: 3 }}>{sub}</div>}
        {meta && <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${C.border}`, fontFamily: C.mono, fontSize: 11.5, fontWeight: 600, color: metaColor || C.fg2 }}>{meta}</div>}
      </div>
    </div>
  );
}

// FX mini tiles row
function MFx({ tiles }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
      {tiles.map((t, i) => (
        <div key={i} style={{ padding: 12, background: C.bg, border: `1px solid ${C.border}`, borderRadius: 10 }}>
          <div style={{ fontWeight: 700, fontSize: 8.5, letterSpacing: '0.06em', textTransform: 'uppercase', color: C.fg3, fontFamily: C.body }}>{t.label}</div>
          <div style={{ fontFamily: C.mono, fontSize: 17, fontWeight: 700, color: t.accent || C.fg1, marginTop: 6, letterSpacing: '-0.01em' }}>{t.value}</div>
          <div style={{ fontFamily: C.mono, fontSize: 9.5, color: C.fg3, marginTop: 3 }}>{t.sub}</div>
        </div>
      ))}
    </div>
  );
}

// Key/value rows
function BKV({ k, v, mono, ar }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
      <span style={{ fontWeight: 700, fontSize: 10, letterSpacing: '0.05em', textTransform: 'uppercase', color: C.fg3, fontFamily: C.body, flexShrink: 0 }}>{k}</span>
      <span dir={ar ? 'rtl' : 'ltr'} style={{ fontSize: 13, color: C.fg1, fontFamily: ar ? C.arabic : (mono ? C.mono : C.body), textAlign: 'right' }}>{v}</span>
    </div>
  );
}

// Audit grid
function MAudit({ rows }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
      {rows.map(([k, v, mono]) => (
        <div key={k}>
          <div style={{ fontWeight: 700, fontSize: 9.5, letterSpacing: '0.05em', textTransform: 'uppercase', color: C.fg3, marginBottom: 5, fontFamily: C.body }}>{k}</div>
          <div style={{ fontSize: 12.5, color: C.fg1, fontFamily: mono ? C.mono : C.body }}>{v}</div>
        </div>
      ))}
    </div>
  );
}

// Big headline amount block for detail screens
function MAmountHead({ currency = 'SAR', sign, value, accent, label, sub, status, statusTone }) {
  return (
    <MCard marker={accent} title={label} sub={sub} right={status && <Pill tone={statusTone}>{status}</Pill>}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
        <span style={{ fontFamily: C.mono, fontSize: 14, color: C.fg3 }}>{currency}</span>
        <span style={{ fontFamily: C.mono, fontSize: 34, fontWeight: 700, color: accent, letterSpacing: '-0.02em', lineHeight: 1 }}>{sign}{value}</span>
      </div>
    </MCard>
  );
}

// Compliance / info note strip
function MNote({ tone = C.orange, children }) {
  return (
    <div style={{ display: 'flex', gap: 10, padding: '12px 14px', background: `${tone}14`, border: `1px solid ${tone}40`, borderRadius: 8, fontSize: 11.5, color: C.fg2, lineHeight: 1.5, fontFamily: C.body }}>
      <span style={{ width: 7, height: 7, borderRadius: 999, background: tone, flexShrink: 0, marginTop: 4 }} />
      <span>{children}</span>
    </div>
  );
}

/* ═════════ 1 · CREATE DEPOSIT / WITHDRAWAL (shared) ═════════ */
function MCashMovement({ kind }) {
  const isDep = kind === 'deposit';
  const amount = '5,000.00';
  const accent = isDep ? C.green : C.orange;
  const serial = isDep ? 'DEP-2024-0182' : 'WDR-2024-0094';
  const journal = isDep
    ? [{ account: '1100 — Bank · NCB Main', debit: amount }, { account: '4001 — Sales Revenue', credit: amount }]
    : [{ account: '5200 — Operating Expense', debit: amount }, { account: '1100 — Bank · NCB Main', credit: amount }];
  return (
    <Scroll>
      <MCard marker={C.blue} title={isDep ? 'Deposit Details' : 'Withdrawal Details'} sub={isDep ? 'Funds received into a bank or cash account' : 'Funds disbursed from a bank or cash account'}>
        <MField label="Serial No" value={serial} mono />
        <MField label="Currency" value="SAR — Saudi Riyal" />
        <MField label="Value Date" placeholder="mm/dd/yyyy" mono />
        <MMoney label="Amount" value={amount} accent={accent} required sign={isDep ? '+' : '−'} />
        <MField label={isDep ? 'To Account' : 'From Account'} value="1100 — Bank · NCB Main" required />
        <MMethod value="cash" />
        <MField label="Reference No" placeholder="e.g. CHQ-44821 / Wire Ref" mono />
      </MCard>

      <MCard marker={accent} title={isDep ? 'Source' : 'Beneficiary'} sub={isDep ? 'Who the funds came from' : 'Who the funds were paid to'}>
        <MField label={isDep ? 'Depositor Name' : 'Payee Name'} placeholder={isDep ? 'e.g. Customer 102' : 'e.g. Riyadh Utilities Co.'} />
        <MField label="Linked Account" placeholder="Optional — select account" />
      </MCard>

      <MCard marker={C.green} title="Journal Preview" sub="The double-entry this operation will post" pad={16}>
        <MJournal rows={journal} />
      </MCard>

      <MCard marker={C.orange} title="Documentation">
        <MField label="Notes" placeholder="Internal memo or approval reference…" />
        <div style={{ height: 92, border: `1px dashed ${C.borderStrong}`, borderRadius: 8, background: C.input, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 5, color: C.fg3 }}>
          <MIcon name="download" size={20} />
          <div style={{ fontSize: 12, color: C.fg2, fontFamily: C.body }}><strong>Tap to upload</strong> receipt / slip</div>
        </div>
      </MCard>

      <div style={{ display: 'flex', gap: 10 }}>
        <MBtn variant="secondary" full>Cancel</MBtn>
        <MBtn variant="primary" icon="check" full>{isDep ? 'Post Deposit' : 'Post Withdrawal'}</MBtn>
      </div>
    </Scroll>
  );
}

/* ═════════ 2 · DEPOSIT / WITHDRAWAL DETAILS (shared) ═════════ */
function MCashDetails({ kind }) {
  const isDep = kind === 'deposit';
  const amount = '5,000.00';
  const accent = isDep ? C.green : C.orange;
  const serial = isDep ? 'DEP-2024-0182' : 'WDR-2024-0094';
  const journal = isDep
    ? [{ account: '1100 — Bank · NCB Main', debit: amount }, { account: '4001 — Sales Revenue', credit: amount }]
    : [{ account: '5200 — Operating Expense', debit: amount }, { account: '1100 — Bank · NCB Main', credit: amount }];
  return (
    <Scroll>
      <MAmountHead
        accent={accent} sign={isDep ? '+' : '−'} value={amount}
        label={isDep ? 'Amount Received' : 'Amount Disbursed'} sub="Value date · Dec 18, 2025"
        status="Completed" statusTone="success" />

      <MCard marker={C.blue} title="Transaction Information">
        <BKV k="Serial No" v={serial} mono />
        <BKV k="Method" v="Cash" />
        <BKV k={isDep ? 'To Account' : 'From Account'} v="1100 — Bank · NCB Main" />
        <BKV k={isDep ? 'Depositor' : 'Payee'} v={isDep ? 'Customer 102' : 'Riyadh Utilities Co.'} />
        <BKV k="Reference No" v="CHQ-44821" mono />
        <BKV k="Currency" v="SAR — Saudi Riyal" />
      </MCard>

      <MCard marker={C.green} title="Posted Journal" sub="Entry JV-2024-0204" pad={16}>
        <MJournal rows={journal} />
      </MCard>

      <MCard marker={C.orange} title="Audit Information">
        <MAudit rows={[
          ['Created By', 'Layla A. (ID: 12)'],
          ['Created At', 'Dec 18, 09:42 AM'],
          ['Approved By', 'Controller (ID: 3)'],
          ['Approved At', 'Dec 18, 10:05 AM'],
        ]} />
      </MCard>

      <div style={{ display: 'flex', gap: 10 }}>
        <MBtn variant="secondary" icon="download" full>Print</MBtn>
        <MBtn variant="danger" icon="trash" full>Void</MBtn>
      </div>
    </Scroll>
  );
}

/* ═════════ 3 · CREATE LOCAL TRANSFER ═════════ */
function MCreateLocalTransfer() {
  const amount = '1,800.00';
  return (
    <Scroll>
      <MCard marker={C.blue} title="Transfer Details">
        <MField label="Serial No" value="TR-9042" mono />
        <MField label="Currency" value="SAR — Saudi Riyal" />
        <MField label="Value Date" placeholder="mm/dd/yyyy" mono />
      </MCard>

      <MCard marker={C.blue} title="Transfer Route" sub="Move funds between two internal accounts">
        <MFlow
          from={{ label: 'From Account', title: '1001 — Cash Box', sub: 'OPS_NY_CHASE_442', meta: 'Balance after · 40,700.00', metaColor: C.red }}
          to={{ label: 'To Account', title: '1100 — Bank · NCB Main', sub: 'TREAS_HSBC_900', meta: 'Balance after · 188,220.00', metaColor: C.green }} />
      </MCard>

      <MCard marker={C.green} title="Amount">
        <MMoney label="Transfer Amount" value={amount} accent={C.green} required />
        <MField label="Reference No" placeholder="e.g. SETL-Q4-0042" mono />
      </MCard>

      <MCard marker={C.green} title="Journal Preview" sub="The double-entry this transfer will post" pad={16}>
        <MJournal rows={[{ account: '1100 — Bank · NCB Main', debit: amount }, { account: '1001 — Cash Box', credit: amount }]} />
      </MCard>

      <MCard marker={C.orange} title="Documentation">
        <MField label="Transfer Notes" placeholder="Reason for settlement or reconciliation context…" />
      </MCard>

      <div style={{ display: 'flex', gap: 10 }}>
        <MBtn variant="secondary" full>Cancel</MBtn>
        <MBtn variant="primary" icon="check" full>Post Transfer</MBtn>
      </div>
    </Scroll>
  );
}

/* ═════════ 4 · LOCAL TRANSFER DETAILS ═════════ */
function MLocalTransferDetails() {
  const lines = [
    { num: '01', name: '1100 — Bank · NCB Main', acc: 'OPS_NY_CHASE_442', amt: '+5,240.00', side: 'Debit', date: '15 Dec, 14:20' },
    { num: '02', name: '1001 — Cash Box', acc: 'TREAS_LN_HSBC_900', amt: '−5,240.00', side: 'Credit', date: '15 Dec, 14:21' },
  ];
  return (
    <Scroll>
      <MCard marker={C.blue} title="Operational Adjustment · Q4" right={<Pill tone="success">Reconciled</Pill>}>
        <div style={{ fontFamily: C.mono, fontSize: 12, color: C.blue, marginTop: -6 }}>TR-9042</div>
        <p style={{ margin: 0, fontSize: 12.5, lineHeight: 1.6, color: C.fg2, fontFamily: C.body }}>Operational adjustment for quarterly reconciliation — synchronizes domestic holdings and international reserves before the Q4 audit window.</p>
      </MCard>

      <MCard marker={C.blue} title="Settlement Route">
        <MFlow
          from={{ label: 'Debited From', title: '1100 — Bank · NCB Main', sub: 'OPS_NY_CHASE_442', meta: '15 Dec, 14:20' }}
          to={{ label: 'Credited To', title: '1001 — Cash Box', sub: 'TREAS_LN_HSBC_900', meta: '15 Dec, 14:21' }} />
      </MCard>

      <MCard marker={C.green} title="Transfer Lines" sub="2 lines · balanced" pad={16}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {lines.map((l, i) => {
            const pos = l.amt.startsWith('+');
            return (
              <div key={l.num} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: i < lines.length - 1 ? `1px solid ${C.border}` : 'none' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.fg1, fontFamily: C.body }}>{l.name}</div>
                  <div style={{ fontFamily: C.mono, fontSize: 10.5, color: C.fg3, marginTop: 2 }}>{l.acc} · {l.date}</div>
                  <div style={{ marginTop: 5 }}><Pill tone={pos ? 'info' : 'danger'}>{l.side}</Pill></div>
                </div>
                <span style={{ fontFamily: C.mono, fontSize: 14, fontWeight: 600, color: pos ? C.green : C.red }}>{l.amt}</span>
              </div>
            );
          })}
        </div>
      </MCard>

      <MCard marker={C.orange} title="Audit Information">
        <MAudit rows={[
          ['Initiated By', 'Layla A. (ID: 12)'],
          ['Initiated At', 'Dec 15, 14:18'],
          ['Reconciled By', 'Controller (ID: 3)'],
          ['Audit Hash', 'a7f8…b161', true],
        ]} />
      </MCard>

      <div style={{ display: 'flex', gap: 10 }}>
        <MBtn variant="secondary" icon="download" full>Export</MBtn>
        <MBtn variant="danger" icon="trash" full>Void</MBtn>
      </div>
    </Scroll>
  );
}

/* ═════════ 5 · CREATE EXTERNAL TRANSFER ═════════ */
function MCreateExternalTransfer() {
  const amount = '12,000.00';
  return (
    <Scroll>
      <MCard marker={C.blue} title="Transfer Details">
        <MField label="Serial No" value="EXT-2024-0311" mono />
        <MField label="Send Currency" value="SAR — Saudi Riyal" />
        <MField label="Value Date" placeholder="mm/dd/yyyy" mono />
      </MCard>

      <MCard marker={C.blue} title="Source Account" sub="Internal account funds are drawn from">
        <MMoney label="Amount" value={amount} accent={C.orange} required sign="−" />
        <MField label="From Account" value="1100 — Bank · NCB Main" required />
      </MCard>

      <MCard marker={C.green} title="Beneficiary" sub="External recipient — outside this tenant">
        <MField label="Beneficiary Name" placeholder="e.g. Global Steel Imports LLC" required />
        <MField label="Bank Name" placeholder="e.g. HSBC London" required />
        <MField label="IBAN" placeholder="GB29 NWBK 6016 1331 9268 19" mono required />
        <MField label="SWIFT / BIC" placeholder="HBUKGB4B" mono required />
      </MCard>

      <MCard marker={C.green} title="Exchange & Fees" sub="Cross-currency conversion and bank charges">
        <MFx tiles={[
          { label: 'Exchange Rate', value: '3.7502', sub: 'SAR → USD' },
          { label: 'Recipient Gets', value: '3,199.83', sub: 'USD', accent: C.green },
          { label: 'Bank Fees', value: '45.00', sub: 'SAR', accent: C.orange },
        ]} />
        <MField label="Purpose Code" placeholder="e.g. P0103 — Import Payment" mono required />
        <MField label="Charge Bearer" placeholder="OUR / SHA / BEN" />
      </MCard>

      <MCard marker={C.orange} title="Documentation & Compliance">
        <MField label="Notes" placeholder="Invoice reference, contract number, regulatory notes…" />
        <div style={{ height: 92, border: `1px dashed ${C.borderStrong}`, borderRadius: 8, background: C.input, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 5, color: C.fg3 }}>
          <MIcon name="download" size={20} />
          <div style={{ fontSize: 12, color: C.fg2, fontFamily: C.body }}><strong>Tap to upload</strong> invoice / contract</div>
        </div>
        <MNote>Cross-border transfers are screened against sanctions lists and require a valid purpose code before release.</MNote>
      </MCard>

      <div style={{ display: 'flex', gap: 10 }}>
        <MBtn variant="secondary" full>Cancel</MBtn>
        <MBtn variant="primary" icon="check" full>Submit for Approval</MBtn>
      </div>
    </Scroll>
  );
}

/* ═════════ 6 · EXTERNAL TRANSFER DETAILS ═════════ */
function MExternalTransferDetails() {
  return (
    <Scroll>
      <MAmountHead
        accent={C.orange} sign="−" value="12,000.00"
        label="Wire Amount" sub="Submitted Dec 18 · awaiting bank confirmation"
        status="In Transit" statusTone="warning" />

      <MCard marker={C.green} title="Exchange & Fees" pad={16}>
        <MFx tiles={[
          { label: 'Exchange Rate', value: '3.7502', sub: 'SAR → USD' },
          { label: 'Recipient Gets', value: '3,199.83', sub: 'USD', accent: C.green },
          { label: 'Bank Fees', value: '45.00', sub: 'SAR', accent: C.orange },
        ]} />
      </MCard>

      <MCard marker={C.blue} title="Beneficiary">
        <BKV k="Beneficiary" v="Global Steel Imports LLC" />
        <BKV k="Bank" v="HSBC London" />
        <BKV k="IBAN" v="GB29 NWBK 6016 1331 9268 19" mono />
        <BKV k="SWIFT / BIC" v="HBUKGB4B" mono />
        <BKV k="Purpose Code" v="P0103 — Import Payment" mono />
        <BKV k="Charge Bearer" v="OUR" />
      </MCard>

      <MCard marker={C.green} title="Posted Journal" sub="Entry JV-2024-0219" pad={16}>
        <MJournal rows={[
          { account: '2100 — Imports Payable', debit: '12,000.00' },
          { account: '5300 — Bank Charges', debit: '45.00' },
          { account: '1100 — Bank · NCB Main', credit: '12,045.00' },
        ]} />
      </MCard>

      <MCard marker={C.orange} title="Audit Information">
        <MAudit rows={[
          ['Initiated By', 'Layla A. (ID: 12)'],
          ['Submitted At', 'Dec 18, 11:02 AM'],
          ['Compliance Check', 'Passed · 11:04'],
          ['SWIFT Ref', 'FT24352098110', true],
        ]} />
      </MCard>

      <div style={{ display: 'flex', gap: 10 }}>
        <MBtn variant="secondary" icon="download" full>SWIFT Copy</MBtn>
        <MBtn variant="danger" icon="trash" full>Cancel Wire</MBtn>
      </div>
    </Scroll>
  );
}

/* ───────── register into MobileApp navigator ───────── */
Object.assign(window.MScreens = window.MScreens || {}, {
  createDeposit: () => <MCashMovement kind="deposit" />,
  depositDetail: () => <MCashDetails kind="deposit" />,
  createWithdrawal: () => <MCashMovement kind="withdrawal" />,
  withdrawalDetail: () => <MCashDetails kind="withdrawal" />,
  createLocalTransfer: MCreateLocalTransfer,
  localTransferDetail: MLocalTransferDetails,
  createExternalTransfer: MCreateExternalTransfer,
  externalTransferDetail: MExternalTransferDetails,
});
