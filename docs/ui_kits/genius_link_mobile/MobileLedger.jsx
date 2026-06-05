/* global React */
// GeniusLink mobile — Ledger: opening journal entry + financial operation details.
// Registers into window.MScreens.

const MLg = window._mob;
const { C: MLgC, Pill: MLgPill, MCard: MLgCard, MField: MLgField, MBtn: MLgBtn, Scroll: MLgScroll, Mini: MLgMini } = MLg;

/* ───────── Opening Journal Entry ───────── */
function MJournalEntry() {
  const lines = [
    { acc: 'Cash Box (1001)', amt: '+5,000.00', tone: MLgC.green, desc: 'Opening balance' },
    { acc: 'Capital Account (3001)', amt: '-5,000.00', tone: MLgC.red, desc: 'Owner investment' },
  ];
  return (
    <MLgScroll>
      <MLgCard marker={MLgC.blue} title="Entry Details">
        <MLgField label="Serial No" value="JV-2024-0042" mono />
        <MLgField label="Currency" value="SAR — Saudi Riyal" />
        <MLgField label="Fiscal Year" value="2024" mono />
      </MLgCard>
      <MLgCard marker={MLgC.green} title="Transfer Lines" sub="2 lines · balanced" pad={8}>
        <div style={{ padding: '0 8px' }}>
          {lines.map((l, i) => (
            <div key={i} style={{ padding: '12px 0', borderBottom: i < lines.length - 1 ? `1px solid ${MLgC.border}` : 'none' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13.5, fontWeight: 600, color: MLgC.fg1, fontFamily: MLgC.body }}>{l.acc}</span>
                <span style={{ fontFamily: MLgC.mono, fontSize: 14, fontWeight: 600, color: l.tone }}>{l.amt}</span>
              </div>
              <div style={{ fontSize: 12, color: MLgC.fg3, marginTop: 3, fontFamily: MLgC.body }}>{l.desc}</div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 8px 0', marginTop: 4, borderTop: `2px solid ${MLgC.borderStrong}` }}>
          <span style={{ fontWeight: 700, fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase', color: MLgC.green, fontFamily: MLgC.body }}>Balanced · Diff 0.00</span>
          <span style={{ fontFamily: MLgC.mono, fontSize: 15, fontWeight: 700, color: MLgC.fg1 }}>5,000.00</span>
        </div>
      </MLgCard>
      <MLgBtn variant="primary" icon="check" full>Create Entry</MLgBtn>
    </MLgScroll>
  );
}

/* ───────── Financial Operation Details ───────── */
function MOpDetails() {
  const lines = [
    { acc: '1200 — Inventory (WIP)', amt: '+5,400.00', tone: MLgC.green, side: 'Debit' },
    { acc: '5001 — Cost of Goods Sold', amt: '+1,200.00', tone: MLgC.green, side: 'Debit' },
    { acc: '1100 — Bank · NCB Main', amt: '−6,600.00', tone: MLgC.red, side: 'Credit' },
  ];
  const timeline = [
    ['Operation created', 'Layla A. · Dec 18, 09:21'],
    ['Submitted for review', 'Layla A. · Dec 18, 09:24'],
    ['Approved & posted', 'Controller · Dec 18, 10:05'],
  ];
  return (
    <MLgScroll>
      <MLgCard marker={MLgC.green} title="Operation Summary" right={<MLgPill tone="success">Posted</MLgPill>}>
        <div style={{ fontFamily: MLgC.mono, fontSize: 12, color: MLgC.blue }}>OP-2024-0883</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <MLgMini label="Total Debits" value="6,600.00" sub="SAR" />
          <MLgMini label="Difference" value="0.00" sub="SAR" hi />
        </div>
      </MLgCard>
      <MLgCard marker={MLgC.green} title="Ledger Lines" pad={8}>
        <div style={{ padding: '0 8px' }}>
          {lines.map((l, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: i < lines.length - 1 ? `1px solid ${MLgC.border}` : 'none' }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: MLgC.fg1, fontFamily: MLgC.body }}>{l.acc}</div>
                <div style={{ marginTop: 3 }}><MLgPill tone={l.side === 'Debit' ? 'info' : 'danger'}>{l.side}</MLgPill></div>
              </div>
              <span style={{ fontFamily: MLgC.mono, fontSize: 13.5, fontWeight: 600, color: l.tone }}>{l.amt}</span>
            </div>
          ))}
        </div>
      </MLgCard>
      <MLgCard marker={MLgC.blue} title="Activity">
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {timeline.map(([t, w], i) => (
            <div key={i} style={{ display: 'flex', gap: 12 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ width: 12, height: 12, borderRadius: 999, background: MLgC.green, border: `2px solid ${MLgC.green}` }} />
                {i < timeline.length - 1 && <div style={{ width: 2, flex: 1, minHeight: 22, background: MLgC.borderStrong }} />}
              </div>
              <div style={{ paddingBottom: 14 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: MLgC.fg1, fontFamily: MLgC.body }}>{t}</div>
                <div style={{ fontFamily: MLgC.mono, fontSize: 11, color: MLgC.fg3, marginTop: 2 }}>{w}</div>
              </div>
            </div>
          ))}
        </div>
      </MLgCard>
      <MLgBtn variant="secondary" icon="back" full>Back to Operations</MLgBtn>
    </MLgScroll>
  );
}

Object.assign(window.MScreens = window.MScreens || {}, {
  journal: MJournalEntry,
  opDetail: MOpDetails,
});
