/* global React */
// GeniusLink mobile — V3 Stage C · Ledger & Journal.
// Mirrors desktop CreateJournalEntry / JournalDetails / JournalList. Uses _minv primitives.

const MJ = window._mob;
const { C: JC, MIcon: JIcon, Pill: JPill, MCard: JCard, MBtn: JBtn, Scroll: JScroll } = MJ;
const { ISection: JSection, IField: JField, ITextarea: JTextarea, UploadBox: JUpload, ActionRow: JAction } = window._minv;

/* ═════════ 1 · JOURNAL LIST ═════════ */
function MJournalList({ go }) {
  const filters = ['All', 'Posted', 'Draft', 'Reversed'];
  const entries = [
    { ref: 'JV-2024-0042', date: 'Dec 15', desc: 'Opening balance — fiscal 2024', amt: '5,000.00', status: 'posted', lines: 2, type: 'Opening' },
    { ref: 'JV-2024-0058', date: 'Dec 16', desc: 'Cash sale — Customer 102', amt: '1,250.00', status: 'posted', lines: 2, type: 'Sales' },
    { ref: 'JV-2024-0071', date: 'Dec 18', desc: 'Petty cash reimbursement', amt: '650.00', status: 'posted', lines: 3, type: 'Expense' },
    { ref: 'JV-2024-0204', date: 'Dec 18', desc: 'Bank deposit DEP-2024-0182', amt: '5,000.00', status: 'posted', lines: 2, type: 'Banking' },
    { ref: 'JV-2024-0225', date: 'Dec 19', desc: 'Depreciation — Q4 accrual', amt: '3,400.00', status: 'draft', lines: 4, type: 'Adjustment' },
    { ref: 'JV-2024-0188', date: 'Dec 12', desc: 'Reversal of JV-2024-0150', amt: '880.00', status: 'reversed', lines: 2, type: 'Reversal' },
  ];
  const tone = { posted: 'success', draft: 'neutral', reversed: 'danger' };
  return (
    <JScroll>
      <div style={{ height: 44, padding: '0 14px', background: JC.input, border: `1px solid ${JC.borderStrong}`, borderRadius: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
        <JIcon name="searchO" size={16} color={JC.fg3} />
        <span style={{ color: JC.fg3, fontSize: 14, fontFamily: JC.body }}>Search reference or description…</span>
      </div>
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 2 }}>
        {filters.map((f, i) => (
          <span key={f} style={{ flexShrink: 0, padding: '7px 14px', borderRadius: 999, fontSize: 11, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', fontFamily: JC.body, background: i === 0 ? JC.blue : JC.input, color: i === 0 ? '#fff' : JC.fg3, border: `1px solid ${i === 0 ? JC.blue : JC.border}` }}>{f}</span>
        ))}
      </div>
      <JCard pad={8}>
        {entries.map((e, i) => (
          <div key={e.ref} onClick={() => go('journalEntryDetail')} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 8px', borderBottom: i < entries.length - 1 ? `1px solid ${JC.border}` : 'none', cursor: 'pointer' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span style={{ fontFamily: JC.mono, fontSize: 12, color: JC.blue }}>{e.ref}</span>
                <span style={{ fontFamily: JC.mono, fontSize: 10.5, color: JC.fg3 }}>{e.date}</span>
              </div>
              <div style={{ fontSize: 13, color: JC.fg1, fontFamily: JC.body, marginTop: 3 }}>{e.desc}</div>
              <div style={{ fontSize: 11, color: JC.fg3, fontFamily: JC.body, marginTop: 2 }}>{e.type} · {e.lines} lines</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: JC.mono, fontSize: 13, fontWeight: 600, color: JC.fg1 }}>{e.amt}</div>
              <div style={{ marginTop: 5 }}><JPill tone={tone[e.status]}>{e.status}</JPill></div>
            </div>
          </div>
        ))}
      </JCard>
    </JScroll>
  );
}

/* ═════════ 2 · CREATE JOURNAL ENTRY ═════════ */
function MCreateJournalEntry() {
  const lines = [
    { acc: '1100 — Bank · NCB Main', debit: '3,400.00', credit: '', desc: 'Cash collected' },
    { acc: '1200 — Inventory (WIP)', debit: '', credit: '1,400.00', desc: 'Stock consumed' },
    { acc: '4001 — Sales Revenue', debit: '', credit: '2,000.00', desc: 'Revenue recognized' },
  ];
  return (
    <JScroll>
      <JSection icon="doc" title="Entry Details" marker={JC.blue}>
        <JField label="Serial No" value="JV-2024-0226" mono locked />
        <JField label="Currency" value="SAR — Saudi Riyal" select />
        <JField label="Fiscal Year" value="2024" select />
        <JField label="Posting Date" placeholder="mm/dd/yyyy" mono icon="calendar" />
      </JSection>
      <JSection icon="ledger" title="Entry Lines" sub="Each line is a single account debit or credit" marker={JC.green}>
        {lines.map((l, i) => {
          const isDr = !!l.debit;
          return (
            <div key={i} style={{ padding: 12, background: JC.bg, border: `1px solid ${JC.border}`, borderRadius: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: JC.fg1, fontFamily: JC.body }}>{l.acc}</span>
                <span style={{ fontFamily: JC.mono, fontSize: 13.5, fontWeight: 600, color: isDr ? JC.green : JC.red }}>{isDr ? '+' : '−'}{l.debit || l.credit}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 7 }}>
                <span style={{ fontSize: 12, color: JC.fg3, fontFamily: JC.body }}>{l.desc}</span>
                <JPill tone={isDr ? 'info' : 'danger'}>{isDr ? 'Debit' : 'Credit'}</JPill>
              </div>
            </div>
          );
        })}
        <button style={{ height: 44, background: 'transparent', border: `2px dashed ${JC.borderStrong}`, borderRadius: 10, color: JC.blue, fontWeight: 700, fontSize: 12, letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: JC.body, cursor: 'pointer' }}>+ Add Line</button>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', borderRadius: 8, background: `${JC.green}14`, border: `1px solid ${JC.green}4D` }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, fontWeight: 600, color: JC.green, fontFamily: JC.body }}><JIcon name="check" size={15} /> Entry is balanced</span>
          <span style={{ fontFamily: JC.mono, fontSize: 14, fontWeight: 700, color: JC.fg1 }}>SAR 3,400.00</span>
        </div>
      </JSection>
      <JSection icon="doc" title="Documentation" marker={JC.orange}>
        <JTextarea label="Memo" placeholder="Reason for this entry, references, approvals…" />
        <JUpload />
      </JSection>
      <JAction secondary="Save Draft" primary="Post Entry" />
    </JScroll>
  );
}

/* ═════════ 3 · JOURNAL ENTRY DETAILS ═════════ */
function MJournalEntryDetails() {
  const lines = [
    { acc: '1100 — Bank · NCB Main', desc: 'Cash collected', debit: '3,400.00', credit: '' },
    { acc: '1200 — Inventory (WIP)', desc: 'Stock consumed', debit: '', credit: '1,400.00' },
    { acc: '4001 — Sales Revenue', desc: 'Revenue recognized', debit: '', credit: '2,000.00' },
  ];
  return (
    <JScroll>
      <JCard marker={JC.blue} title="Mixed sale & revenue recognition" right={<JPill tone="success">Posted</JPill>}>
        <div style={{ fontFamily: JC.mono, fontSize: 12, color: JC.blue, marginTop: -6 }}>JV-2024-0226</div>
        <div style={{ fontSize: 12, color: JC.fg3, fontFamily: JC.body }}>Posted Dec 19, 2025 · Fiscal 2024</div>
      </JCard>
      <JCard marker={JC.green} title="Entry Lines" sub="3 lines · balanced" pad={8}>
        <div style={{ padding: '0 8px' }}>
          {lines.map((l, i) => {
            const isDr = !!l.debit;
            return (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: `1px solid ${JC.border}` }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: JC.fg1, fontFamily: JC.body }}>{l.acc}</div>
                  <div style={{ fontSize: 11.5, color: JC.fg3, fontFamily: JC.body, marginTop: 2 }}>{l.desc}</div>
                </div>
                <span style={{ fontFamily: JC.mono, fontSize: 13.5, fontWeight: 600, color: isDr ? JC.green : JC.red }}>{isDr ? '+' : '−'}{l.debit || l.credit}</span>
              </div>
            );
          })}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0 0' }}>
            <span style={{ fontWeight: 700, fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: JC.fg3, fontFamily: JC.body }}>Totals · balanced</span>
            <span style={{ fontFamily: JC.mono, fontSize: 15, fontWeight: 700, color: JC.fg1 }}>3,400.00</span>
          </div>
        </div>
      </JCard>
      <JCard marker={JC.orange} title="Audit Information">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {[['Created By', 'Layla A. (ID: 12)'], ['Posted At', 'Dec 19, 10:14 AM'], ['Approved By', 'Controller (ID: 3)'], ['Audit Hash', 'c2d9…f047']].map(([k, v]) => (
            <div key={k}><div style={{ fontWeight: 700, fontSize: 9.5, letterSpacing: '0.05em', textTransform: 'uppercase', color: JC.fg3, marginBottom: 5, fontFamily: JC.body }}>{k}</div><div style={{ fontSize: 12.5, color: JC.fg1, fontFamily: k === 'Audit Hash' ? JC.mono : JC.body }}>{v}</div></div>
          ))}
        </div>
      </JCard>
      <div style={{ display: 'flex', gap: 10 }}>
        <JBtn variant="secondary" icon="download" full>Export</JBtn>
        <JBtn variant="danger" icon="trash" full>Reverse</JBtn>
      </div>
    </JScroll>
  );
}

/* ───────── register ───────── */
Object.assign(window.MScreens = window.MScreens || {}, {
  journalList: MJournalList,
  createJournalEntry: MCreateJournalEntry,
  journalEntryDetail: MJournalEntryDetails,
});
