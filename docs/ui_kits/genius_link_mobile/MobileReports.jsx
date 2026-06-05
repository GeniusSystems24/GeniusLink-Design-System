/* global React */
// GeniusLink mobile — V3 Stage F · Reports & Dashboards.
// Interactive: period selector, live store filter (valuation), live action filter +
// search (audit log), collapsible statement sections. Mirrors desktop Reports.jsx.
// Mobile rule: stacked rows / cards, no horizontal scroll.

const MR = window._mob;
const { C: RC, MIcon: RIcon, Pill: RPill, MCard: RCard, MBtn: RBtn, Scroll: RScroll, Mini: RMini } = MR;
const { ISection: RSection } = window._minv;
const { Segmented: RSeg, SearchInput: RSearch } = window._mui;
const { useState: useRState } = React;

const rmoney = (n) => Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// Two-column row (label left, amount right) used across statements
function RRow({ left, sub, right, rightTone, bold, last }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: last ? 'none' : `1px solid ${RC.border}` }}>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: bold ? 700 : 600, color: RC.fg1, fontFamily: RC.body }}>{left}</div>
        {sub && <div style={{ fontFamily: RC.mono, fontSize: 11, color: RC.fg3, marginTop: 2 }}>{sub}</div>}
      </div>
      <span style={{ fontFamily: RC.mono, fontSize: 13.5, fontWeight: bold ? 700 : 600, color: rightTone || RC.fg1 }}>{right}</span>
    </div>
  );
}

function TotalBar({ label, value, tone = RC.green }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', marginTop: 4, borderRadius: 8, background: `${tone}14`, border: `1px solid ${tone}4D` }}>
      <span style={{ fontWeight: 700, fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase', color: tone, fontFamily: RC.body }}>{label}</span>
      <span style={{ fontFamily: RC.mono, fontSize: 15, fontWeight: 700, color: RC.fg1 }}>{value}</span>
    </div>
  );
}

// Period / meta header bar
function ReportMeta({ period, setPeriod, badges }) {
  return (
    <RCard pad={14}>
      <RSeg options={['Dec 2024', 'Nov 2024', 'Q4 2024', 'FY 2024']} value={period} onChange={setPeriod} />
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 4 }}>
        {badges.map(([k, v]) => (
          <span key={k} style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
            <span style={{ fontWeight: 700, fontSize: 9.5, letterSpacing: '0.06em', textTransform: 'uppercase', color: RC.fg3, fontFamily: RC.body }}>{k}</span>
            <span style={{ fontFamily: RC.mono, fontSize: 12, fontWeight: 600, color: RC.fg1 }}>{v}</span>
          </span>
        ))}
      </div>
    </RCard>
  );
}

/* ═════════ 1 · TRIAL BALANCE ═════════ */
function MTrialBalance() {
  const [period, setPeriod] = useRState('Dec 2024');
  const rows = [
    { code: '1001', name: 'Cash Box', dr: 42500, cr: 0 }, { code: '1100', name: 'Bank · NCB Main', dr: 186420, cr: 0 },
    { code: '1200', name: 'Inventory (WIP)', dr: 54890, cr: 0 }, { code: '2001', name: 'Accounts Payable', dr: 0, cr: 23140 },
    { code: '3001', name: 'Owner Capital', dr: 0, cr: 260670 }, { code: '4001', name: 'Sales Revenue', dr: 0, cr: 89200 },
    { code: '5001', name: 'Cost of Goods Sold', dr: 34120, cr: 0 }, { code: '5200', name: 'Operating Expense', dr: 55080, cr: 0 },
  ];
  const totDr = rows.reduce((s, r) => s + r.dr, 0), totCr = rows.reduce((s, r) => s + r.cr, 0);
  return (
    <RScroll>
      <ReportMeta period={period} setPeriod={setPeriod} badges={[['Currency', 'SAR'], ['Basis', 'Accrual'], ['Status', 'Balanced']]} />
      <RCard marker={RC.green} title="All Accounts" sub="Debit & credit balances as of period end" pad={8}>
        <div style={{ padding: '0 8px' }}>
          {rows.map((r) => (
            <div key={r.code} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 0', borderBottom: `1px solid ${RC.border}` }}>
              <span style={{ fontFamily: RC.mono, fontSize: 11, color: RC.fg3, width: 38 }}>{r.code}</span>
              <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: RC.fg1, fontFamily: RC.body }}>{r.name}</span>
              <span style={{ fontFamily: RC.mono, fontSize: 12.5, color: r.dr ? RC.green : RC.fg4, width: 76, textAlign: 'right' }}>{r.dr ? rmoney(r.dr) : '—'}</span>
              <span style={{ fontFamily: RC.mono, fontSize: 12.5, color: r.cr ? RC.red : RC.fg4, width: 76, textAlign: 'right' }}>{r.cr ? rmoney(r.cr) : '—'}</span>
            </div>
          ))}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 0 0' }}>
            <span style={{ flex: 1, fontWeight: 700, fontSize: 10, letterSpacing: '0.06em', textTransform: 'uppercase', color: RC.green, fontFamily: RC.body }}>Totals · balanced</span>
            <span style={{ fontFamily: RC.mono, fontSize: 13, fontWeight: 700, color: RC.green, width: 76, textAlign: 'right' }}>{rmoney(totDr)}</span>
            <span style={{ fontFamily: RC.mono, fontSize: 13, fontWeight: 700, color: RC.green, width: 76, textAlign: 'right' }}>{rmoney(totCr)}</span>
          </div>
        </div>
      </RCard>
      <RBtn variant="secondary" icon="download" full>Export PDF</RBtn>
    </RScroll>
  );
}

/* ═════════ 2 · INCOME STATEMENT ═════════ */
function MIncomeStatement() {
  const [period, setPeriod] = useRState('Dec 2024');
  const sections = [
    { title: 'Revenue', marker: RC.green, rows: [['4001', 'Sales Revenue', 89200], ['4002', 'Service Revenue', 14600]], subtotal: 103800 },
    { title: 'Cost of Sales', marker: RC.orange, rows: [['5001', 'Cost of Goods Sold', -34120]], subtotal: -34120 },
    { title: 'Operating Expenses', marker: RC.orange, rows: [['5200', 'Operating Expense', -55080], ['5300', 'Bank Charges', -1240]], subtotal: -56320 },
  ];
  const net = 103800 - 34120 - 56320;
  return (
    <RScroll>
      <ReportMeta period={period} setPeriod={setPeriod} badges={[['Currency', 'SAR'], ['Basis', 'Accrual']]} />
      {sections.map((s) => (
        <RSection key={s.title} icon="ledger" title={s.title} marker={s.marker}>
          {s.rows.map(([code, name, amt], i) => (
            <RRow key={code} left={name} sub={code} right={amt < 0 ? '(' + rmoney(amt) + ')' : rmoney(amt)} rightTone={amt < 0 ? RC.red : RC.fg1} last={i === s.rows.length - 1} />
          ))}
          <TotalBar label={`Total ${s.title}`} value={s.subtotal < 0 ? '(' + rmoney(s.subtotal) + ')' : rmoney(s.subtotal)} tone={s.marker} />
        </RSection>
      ))}
      <RCard marker={RC.green}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span style={{ fontWeight: 700, fontSize: 13, color: RC.fg1, fontFamily: RC.body }}>Net Income</span>
          <span style={{ fontFamily: RC.mono, fontSize: 24, fontWeight: 700, color: RC.green }}>{rmoney(net)} <span style={{ fontSize: 12, color: RC.fg3, fontWeight: 400 }}>SAR</span></span>
        </div>
      </RCard>
    </RScroll>
  );
}

/* ═════════ 3 · BALANCE SHEET ═════════ */
function MBalanceSheet() {
  const [period, setPeriod] = useRState('Dec 2024');
  const blocks = [
    { title: 'Assets', marker: RC.blue, rows: [['Current Assets', 283790], ['Fixed Assets', 142000]], total: 425790 },
    { title: 'Liabilities', marker: RC.orange, rows: [['Accounts Payable', 23140], ['Long-Term Debt', 80000]], total: 103140 },
    { title: 'Equity', marker: RC.green, rows: [['Owner Capital', 260670], ['Retained Earnings', 61980]], total: 322650 },
  ];
  return (
    <RScroll>
      <ReportMeta period={period} setPeriod={setPeriod} badges={[['Currency', 'SAR'], ['Check', 'A = L + E']]} />
      {blocks.map((b) => (
        <RCard key={b.title} marker={b.marker} title={b.title} pad={8}>
          <div style={{ padding: '0 8px' }}>
            {b.rows.map(([name, amt], i) => <RRow key={name} left={name} right={rmoney(amt)} last={i === b.rows.length - 1} />)}
            <TotalBar label={`Total ${b.title}`} value={rmoney(b.total)} tone={b.marker} />
          </div>
        </RCard>
      ))}
      <RCard>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 12, color: RC.fg3, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: RC.body }}>Balance Check</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontFamily: RC.mono, fontSize: 13, fontWeight: 600, color: RC.green }}><RIcon name="check" size={15} /> 425,790 = 425,790</span>
        </div>
      </RCard>
    </RScroll>
  );
}

/* ═════════ 4 · INVENTORY VALUATION (live store filter) ═════════ */
function MInventoryValuation() {
  const [store, setStore] = useRState('All');
  const rows = [
    { sku: 'STL-44021', name: 'Structural Steel I-Beam', qty: 142, cost: 450, store: 'Downtown' },
    { sku: 'CMT-90112', name: 'Portland Cement Type I', qty: 1820, cost: 24.5, store: 'King Fahd' },
    { sku: 'AGG-21044', name: 'Coarse Aggregate 20mm', qty: 46, cost: 125, store: 'Downtown' },
    { sku: 'PLY-30022', name: 'Plywood Sheet 18mm', qty: 312, cost: 92, store: 'Jeddah' },
    { sku: 'RBR-71203', name: 'Reinforcement Bar #6', qty: 0, cost: 78, store: 'Downtown' },
  ];
  const visible = store === 'All' ? rows : rows.filter((r) => r.store === store);
  const total = visible.reduce((s, r) => s + r.qty * r.cost, 0);
  return (
    <RScroll>
      <RCard pad={14}>
        <RSeg options={['All', 'Downtown', 'King Fahd', 'Jeddah']} value={store} onChange={setStore} />
        <div style={{ display: 'flex', gap: 16, marginTop: 4 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}><span style={{ fontWeight: 700, fontSize: 9.5, letterSpacing: '0.06em', textTransform: 'uppercase', color: RC.fg3, fontFamily: RC.body }}>Method</span><span style={{ fontFamily: RC.mono, fontSize: 12, fontWeight: 600, color: RC.fg1 }}>Weighted Avg</span></span>
        </div>
      </RCard>
      <RCard marker={RC.green} title="Stock Valuation" sub="Quantity × weighted-average unit cost" pad={8}>
        <div style={{ padding: '0 8px' }}>
          {visible.map((r, i) => (
            <div key={r.sku} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 0', borderBottom: i < visible.length - 1 ? `1px solid ${RC.border}` : 'none' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: RC.fg1, fontFamily: RC.body }}>{r.name}</div>
                <div style={{ fontFamily: RC.mono, fontSize: 11, color: RC.fg3, marginTop: 2 }}>{r.sku} · {r.store} · {r.qty} × {rmoney(r.cost)}</div>
              </div>
              <span style={{ fontFamily: RC.mono, fontSize: 13.5, fontWeight: 600, color: r.qty === 0 ? RC.red : RC.fg1 }}>{rmoney(r.qty * r.cost)}</span>
            </div>
          ))}
        </div>
        <TotalBar label="Total Inventory Value" value={rmoney(total)} />
      </RCard>
    </RScroll>
  );
}

/* ═════════ 5 · AUDIT LOG (live action filter + search) ═════════ */
function MAuditLog() {
  const [q, setQ] = useRState('');
  const [act, setAct] = useRState('All');
  const logs = [
    { ts: '2025-12-19 10:14:02', user: 'Layla A.', action: 'POST', entity: 'JV-2024-0226', ip: '10.4.22.18', tone: 'success' },
    { ts: '2025-12-18 11:02:55', user: 'Layla A.', action: 'CREATE', entity: 'EXT-2024-0311', ip: '10.4.22.18', tone: 'info' },
    { ts: '2025-12-18 10:05:31', user: 'Controller', action: 'APPROVE', entity: 'DEP-2024-0182', ip: '10.4.22.03', tone: 'success' },
    { ts: '2025-12-18 09:42:10', user: 'Layla A.', action: 'CREATE', entity: 'DEP-2024-0182', ip: '10.4.22.18', tone: 'info' },
    { ts: '2025-12-17 16:20:44', user: 'Layla A.', action: 'EDIT', entity: 'Account 1200', ip: '10.4.22.18', tone: 'warning' },
    { ts: '2025-12-12 14:08:09', user: 'Admin', action: 'VOID', entity: 'JV-2024-0150', ip: '10.4.22.01', tone: 'danger' },
    { ts: '2025-12-01 00:00:01', user: 'System', action: 'LOCK', entity: 'Period Nov 2024', ip: 'internal', tone: 'neutral' },
  ];
  const visible = logs.filter((l) => (act === 'All' || l.action === act) && (!q || l.entity.toLowerCase().includes(q.toLowerCase()) || l.user.toLowerCase().includes(q.toLowerCase())));
  return (
    <RScroll>
      <RSearch placeholder="Search entity or user…" value={q} onChange={setQ} />
      <RSeg options={['All', 'POST', 'CREATE', 'APPROVE', 'EDIT', 'VOID', 'LOCK']} value={act} onChange={setAct} />
      <RCard marker={RC.orange} title="Immutable Activity Trail" sub="Every state-changing action · 7-year retention" pad={8}>
        <div style={{ padding: '0 8px' }}>
          {visible.map((l, i) => (
            <div key={i} style={{ padding: '12px 0', borderBottom: i < visible.length - 1 ? `1px solid ${RC.border}` : 'none' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
                <span style={{ fontFamily: RC.mono, fontSize: 12, color: RC.blue }}>{l.entity}</span>
                <RPill tone={l.tone}>{l.action}</RPill>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 5 }}>
                <span style={{ fontSize: 11.5, color: RC.fg3, fontFamily: RC.body }}>{l.user} · {l.ip}</span>
                <span style={{ fontFamily: RC.mono, fontSize: 11, color: RC.fg3 }}>{l.ts}</span>
              </div>
            </div>
          ))}
          {visible.length === 0 && <div style={{ padding: '32px 0', textAlign: 'center', color: RC.fg3, fontSize: 13, fontFamily: RC.body }}>No log entries match.</div>}
        </div>
      </RCard>
    </RScroll>
  );
}

/* ───────── register ───────── */
Object.assign(window.MScreens = window.MScreens || {}, {
  trialBalance: MTrialBalance,
  incomeStatement: MIncomeStatement,
  balanceSheet: MBalanceSheet,
  inventoryValuation: MInventoryValuation,
  auditLog: MAuditLog,
});
