/* global React */
// GeniusLink mobile — Dashboard tab. Full parity with desktop Dashboard.jsx:
// KPI row, Cash Flow chart, Cash & Asset Accounts balances, Recent Operations,
// Needs Attention alerts — adapted to a single mobile column. Registers into window.MScreens.

const MD = window._mob;
const { C: MDC, MIcon: MDIcon, MCard: MDCard, Scroll: MDScroll } = MD;

const CASHFLOW = [
  { m: 'Jan', in: 62, out: 48 }, { m: 'Feb', in: 71, out: 52 }, { m: 'Mar', in: 58, out: 61 },
  { m: 'Apr', in: 80, out: 55 }, { m: 'May', in: 74, out: 58 }, { m: 'Jun', in: 92, out: 63 },
  { m: 'Jul', in: 88, out: 70 }, { m: 'Aug', in: 79, out: 66 }, { m: 'Sep', in: 96, out: 72 },
  { m: 'Oct', in: 104, out: 78 }, { m: 'Nov', in: 98, out: 81 }, { m: 'Dec', in: 112, out: 74 },
];
const BALANCES = [
  { code: '1100', name: 'Bank · NCB Main', value: '186,420.00', pct: 64 },
  { code: '1001', name: 'Cash Box', value: '42,500.00', pct: 15 },
  { code: '1200', name: 'Inventory (WIP)', value: '54,890.00', pct: 19 },
  { code: '1101', name: 'Bank · Al Rajhi', value: '6,240.00', pct: 2 },
];
const RECENT = [
  { ref: 'JV-2024-0226', desc: 'Mixed sale & revenue', amt: '+3,400.00', tone: MDC.green, when: '10:14' },
  { ref: 'EXT-2024-0311', desc: 'Wire · Global Steel', amt: '−12,045.00', tone: MDC.red, when: '11:02' },
  { ref: 'DEP-2024-0182', desc: 'Deposit · Customer 102', amt: '+5,000.00', tone: MDC.green, when: '09:42' },
  { ref: 'INV-ISS-0089', desc: 'Issue · Project A-92', amt: '−6,600.00', tone: MDC.red, when: '08:30' },
];
const ALERTS = [
  { tone: MDC.orange, icon: 'info', title: '1 entry out of balance', sub: 'JV-2024-0225 · draft' },
  { tone: MDC.red, icon: 'info', title: '2 SKUs out of stock', sub: 'Downtown Central Store' },
  { tone: MDC.blue, icon: 'lock', title: '3 wires await approval', sub: 'External transfers · 41,200 SAR' },
  { tone: MDC.green, icon: 'check', title: 'Period Nov 2024 closed', sub: 'Locked Dec 01' },
];

function MDashboard({ go }) {
  const maxVal = Math.max(...CASHFLOW.flatMap((d) => [d.in, d.out]));
  return (
    <MDScroll>
      <div style={{ fontFamily: MDC.mono, fontSize: 11.5, color: MDC.fg3, marginTop: -2 }}>Fiscal 2024 · as of Dec 19, 2025</div>

      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Kpi label="Total Assets" value="289,050" delta="+4.2%" up />
        <Kpi label="Cash Position" value="235,160" delta="+1.8%" up />
        <Kpi label="Revenue · MTD" value="89,200" delta="+12.4%" up accent={MDC.green} />
        <Kpi label="Net Income · MTD" value="34,120" delta="−2.1%" up={false} />
      </div>

      {/* Cash Flow chart */}
      <MDCard marker={MDC.green} title="Cash Flow" sub="Inflow vs outflow · SAR thousands · 12 months"
        right={<div style={{ display: 'flex', gap: 12 }}><Legend color={MDC.blue} label="In" /><Legend color={MDC.fg4} label="Out" /></div>}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 5, height: 150, paddingTop: 4 }}>
          {CASHFLOW.map((d) => (
            <div key={d.m} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, height: '100%' }}>
              <div style={{ flex: 1, width: '100%', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 2 }}>
                <div style={{ width: '42%', height: `${(d.in / maxVal) * 100}%`, background: MDC.blue, borderRadius: '2px 2px 0 0' }} />
                <div style={{ width: '42%', height: `${(d.out / maxVal) * 100}%`, background: MDC.fg4, borderRadius: '2px 2px 0 0' }} />
              </div>
              <span style={{ fontFamily: MDC.mono, fontSize: 8.5, color: MDC.fg3 }}>{d.m}</span>
            </div>
          ))}
        </div>
      </MDCard>

      {/* Cash & Asset Accounts */}
      <MDCard marker={MDC.blue} title="Cash & Asset Accounts" sub="Top balances">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {BALANCES.map((b) => (
            <div key={b.code}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6, gap: 10 }}>
                <span style={{ fontSize: 12.5, color: MDC.fg1, fontFamily: MDC.body, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  <span style={{ fontFamily: MDC.mono, color: MDC.fg3, marginInlineEnd: 8 }}>{b.code}</span>{b.name}
                </span>
                <span style={{ fontFamily: MDC.mono, fontSize: 12.5, fontWeight: 600, color: MDC.fg1, flexShrink: 0 }}>{b.value}</span>
              </div>
              <div style={{ height: 6, background: MDC.input, borderRadius: 999, overflow: 'hidden' }}>
                <div style={{ width: `${b.pct}%`, height: '100%', background: MDC.blue, borderRadius: 999 }} />
              </div>
            </div>
          ))}
        </div>
      </MDCard>

      {/* Recent Operations */}
      <MDCard marker={MDC.green} title="Recent Operations" right={<span onClick={() => go('journalList')} style={{ color: MDC.blue, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>View All</span>} pad={8}>
        <div style={{ padding: '0 8px' }}>
          {RECENT.map((r, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, padding: '12px 0', borderBottom: i < RECENT.length - 1 ? `1px solid ${MDC.border}` : 'none' }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontFamily: MDC.mono, fontSize: 12, color: MDC.blue }}>{r.ref}</div>
                <div style={{ fontSize: 12, color: MDC.fg3, marginTop: 2, fontFamily: MDC.body }}>{r.desc}</div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontFamily: MDC.mono, fontSize: 13, fontWeight: 600, color: r.tone }}>{r.amt}</div>
                <div style={{ fontFamily: MDC.mono, fontSize: 10.5, color: MDC.fg3, marginTop: 2 }}>{r.when}</div>
              </div>
            </div>
          ))}
        </div>
      </MDCard>

      {/* Needs Attention */}
      <MDCard marker={MDC.orange} title="Needs Attention">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {ALERTS.map((a, i) => (
            <div key={i} style={{ display: 'flex', gap: 11, padding: '11px 13px', background: `${a.tone}14`, border: `1px solid ${a.tone}40`, borderRadius: 8 }}>
              <span style={{ color: a.tone, flexShrink: 0, marginTop: 1 }}><MDIcon name={a.icon} size={15} /></span>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: MDC.fg1, fontFamily: MDC.body }}>{a.title}</div>
                <div style={{ fontSize: 11, color: MDC.fg3, marginTop: 2, fontFamily: MDC.body }}>{a.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </MDCard>
    </MDScroll>
  );
}

function Kpi({ label, value, delta, up, accent }) {
  return (
    <div style={{ background: MDC.surface, border: `1px solid ${MDC.border}`, borderRadius: 12, padding: 14 }}>
      <div style={{ fontWeight: 700, fontSize: 9.5, letterSpacing: '0.06em', textTransform: 'uppercase', color: MDC.fg3, fontFamily: MDC.body }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 5, marginTop: 8 }}>
        <span style={{ fontFamily: MDC.mono, fontSize: 20, fontWeight: 700, color: accent || MDC.fg1, letterSpacing: '-0.02em' }}>{value}</span>
        <span style={{ fontFamily: MDC.mono, fontSize: 10, color: MDC.fg3 }}>SAR</span>
      </div>
      <div style={{ fontFamily: MDC.mono, fontSize: 11, color: up ? MDC.green : MDC.red, marginTop: 4 }}>{up ? '▲' : '▼'} {delta}</div>
    </div>
  );
}

function Legend({ color, label }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 10.5, color: MDC.fg3, fontWeight: 600, fontFamily: MDC.body }}>
      <span style={{ width: 9, height: 9, borderRadius: 2, background: color }} />{label}
    </span>
  );
}

Object.assign(window.MScreens = window.MScreens || {}, { dashboard: MDashboard });
