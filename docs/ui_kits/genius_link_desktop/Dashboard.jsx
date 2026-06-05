/* global React, Card, SectionHeader, Button, Icon, StatusPill, Breadcrumb, Footer */
// Stage 7 — Dashboard (wide overview / home screen)

function Dashboard({ onNavigate }) {
  const cashflow = [
    { m: 'Jan', in: 62, out: 48 }, { m: 'Feb', in: 71, out: 52 }, { m: 'Mar', in: 58, out: 61 },
    { m: 'Apr', in: 80, out: 55 }, { m: 'May', in: 74, out: 58 }, { m: 'Jun', in: 92, out: 63 },
    { m: 'Jul', in: 88, out: 70 }, { m: 'Aug', in: 79, out: 66 }, { m: 'Sep', in: 96, out: 72 },
    { m: 'Oct', in: 104, out: 78 }, { m: 'Nov', in: 98, out: 81 }, { m: 'Dec', in: 112, out: 74 },
  ];
  const maxVal = Math.max(...cashflow.flatMap(d => [d.in, d.out]));

  const balances = [
    { code: '1100', name: 'Bank · NCB Main', value: '186,420.00', pct: 64 },
    { code: '1001', name: 'Cash Box',         value: '42,500.00',  pct: 15 },
    { code: '1200', name: 'Inventory (WIP)',  value: '54,890.00',  pct: 19 },
    { code: '1101', name: 'Bank · Al Rajhi',  value: '6,240.00',   pct: 2 },
  ];

  const recent = [
    { ref: 'JV-2024-0226', desc: 'Mixed sale & revenue', amount: '+3,400.00', tone: '#1DB88A', when: '10:14' },
    { ref: 'EXT-2024-0311', desc: 'Wire · Global Steel', amount: '−12,045.00', tone: '#EF4444', when: '11:02' },
    { ref: 'DEP-2024-0182', desc: 'Deposit · Customer 102', amount: '+5,000.00', tone: '#1DB88A', when: '09:42' },
    { ref: 'INV-ISS-0089', desc: 'Issue · Project A-92', amount: '−6,600.00', tone: '#EF4444', when: '08:30' },
  ];

  return (
    <div style={{ maxWidth: 1120, margin: '0 auto', padding: '64px 32px 0', display: 'flex', flexDirection: 'column', gap: 32 }}>
      <Breadcrumb items={['Workspace', 'Overview']} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 16 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--gl-font-display)', fontWeight: 700, fontSize: 30, letterSpacing: '-0.025em', color: 'var(--gl-fg-1)', margin: 0 }}>Financial Dashboard</h1>
          <div style={{ fontFamily: 'var(--gl-font-mono)', fontSize: 13, color: 'var(--gl-fg-3)', marginTop: 8 }}>Fiscal 2024 · as of Dec 19, 2025</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button variant="secondary" icon="download">Export</Button>
          <Button variant="primary" icon="plus" onClick={() => onNavigate && onNavigate('createJournal')}>New Entry</Button>
        </div>
      </div>

      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
        <Kpi label="Total Assets" value="289,050" currency="SAR" delta="+4.2%" up />
        <Kpi label="Cash Position" value="235,160" currency="SAR" delta="+1.8%" up />
        <Kpi label="Revenue · MTD" value="89,200" currency="SAR" delta="+12.4%" up accent="#1DB88A" />
        <Kpi label="Net Income · MTD" value="34,120" currency="SAR" delta="−2.1%" up={false} />
      </div>

      {/* Chart + balances */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 24, alignItems: 'start' }}>
        <Card>
          <SectionHeader title="Cash Flow" subtitle="Inflow vs outflow · SAR thousands · trailing 12 months" marker="green"
            right={
              <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                <Legend color="#4A7CFF" label="In" />
                <Legend color="var(--gl-fg-4)" label="Out" />
              </div>
            } />
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 200, paddingTop: 8 }}>
            {cashflow.map((d) => (
              <div key={d.m} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, height: '100%' }}>
                <div style={{ flex: 1, width: '100%', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 3 }}>
                  <div title={`In ${d.in}k`} style={{ width: '42%', height: `${(d.in / maxVal) * 100}%`, background: '#4A7CFF', borderRadius: '3px 3px 0 0' }} />
                  <div title={`Out ${d.out}k`} style={{ width: '42%', height: `${(d.out / maxVal) * 100}%`, background: 'var(--gl-fg-4)', borderRadius: '3px 3px 0 0' }} />
                </div>
                <span style={{ fontFamily: 'var(--gl-font-mono)', fontSize: 10, color: 'var(--gl-fg-3)' }}>{d.m}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <SectionHeader title="Cash & Asset Accounts" subtitle="Top balances" marker="blue" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {balances.map((b) => (
              <div key={b.code}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
                  <span style={{ fontSize: 13, color: 'var(--gl-fg-1)' }}>
                    <span style={{ fontFamily: 'var(--gl-font-mono)', color: 'var(--gl-fg-3)', marginRight: 8 }}>{b.code}</span>{b.name}
                  </span>
                  <span style={{ fontFamily: 'var(--gl-font-mono)', fontSize: 13, fontWeight: 600, color: 'var(--gl-fg-1)' }}>{b.value}</span>
                </div>
                <div style={{ height: 6, background: 'var(--gl-input-bg)', borderRadius: 999, overflow: 'hidden' }}>
                  <div style={{ width: `${b.pct}%`, height: '100%', background: '#4A7CFF', borderRadius: 999 }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent + alerts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 24, alignItems: 'start' }}>
        <Card padding={0}>
          <div style={{ padding: '20px 24px 0' }}>
            <SectionHeader title="Recent Operations" marker="green"
              right={<Button variant="ghost" icon="chevRight" onClick={() => onNavigate && onNavigate('journals')}>View All</Button>} />
          </div>
          <div style={{ padding: '12px 24px 24px' }}>
            {recent.map((r, i) => (
              <div key={i} style={{
                display: 'grid', gridTemplateColumns: '130px 1fr auto 60px', gap: 12, alignItems: 'center',
                padding: '14px 0', borderBottom: i < recent.length - 1 ? '1px solid var(--gl-border)' : 'none', fontSize: 13,
              }}>
                <span style={{ fontFamily: 'var(--gl-font-mono)', color: '#4A7CFF' }}>{r.ref}</span>
                <span style={{ color: 'var(--gl-fg-2)' }}>{r.desc}</span>
                <span style={{ fontFamily: 'var(--gl-font-mono)', fontWeight: 600, color: r.tone, textAlign: 'right' }}>{r.amount}</span>
                <span style={{ fontFamily: 'var(--gl-font-mono)', fontSize: 11, color: 'var(--gl-fg-3)', textAlign: 'right' }}>{r.when}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <SectionHeader title="Needs Attention" marker="orange" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Alert tone="warning" icon="info" title="1 entry out of balance" sub="JV-2024-0225 · draft" />
            <Alert tone="danger" icon="info" title="2 SKUs out of stock" sub="Downtown Central Store" />
            <Alert tone="info" icon="lock" title="3 wires await approval" sub="External transfers · 41,200 SAR" />
            <Alert tone="neutral" icon="check" title="Period Nov 2024 closed" sub="Locked Dec 01" />
          </div>
        </Card>
      </div>

      <Footer />
    </div>
  );
}

function Kpi({ label, value, currency, delta, up, accent }) {
  return (
    <Card padding={20}>
      <div style={{ fontWeight: 700, fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--gl-fg-3)' }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 10 }}>
        <span style={{ fontFamily: 'var(--gl-font-mono)', fontSize: 26, fontWeight: 700, color: accent || 'var(--gl-fg-1)', letterSpacing: '-0.02em' }}>{value}</span>
        <span style={{ fontFamily: 'var(--gl-font-mono)', fontSize: 11, color: 'var(--gl-fg-3)' }}>{currency}</span>
      </div>
      <div style={{ fontFamily: 'var(--gl-font-mono)', fontSize: 12, color: up ? '#1DB88A' : '#EF4444', marginTop: 8 }}>
        {up ? '▲' : '▼'} {delta} <span style={{ color: 'var(--gl-fg-3)' }}>vs last month</span>
      </div>
    </Card>
  );
}

function Legend({ color, label }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--gl-fg-3)', fontWeight: 600 }}>
      <span style={{ width: 10, height: 10, borderRadius: 2, background: color }} />{label}
    </span>
  );
}

function Alert({ tone, icon, title, sub }) {
  const colors = { warning: '#F97316', danger: '#EF4444', info: '#4A7CFF', neutral: '#1DB88A' };
  const c = colors[tone];
  return (
    <div style={{ display: 'flex', gap: 12, padding: '12px 14px', background: `${c}14`, border: `1px solid ${c}40`, borderRadius: 6 }}>
      <span style={{ color: c, flexShrink: 0, marginTop: 1 }}><Icon name={icon} size={15} /></span>
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--gl-fg-1)' }}>{title}</div>
        <div style={{ fontSize: 11, color: 'var(--gl-fg-3)', marginTop: 2 }}>{sub}</div>
      </div>
    </div>
  );
}

window.Dashboard = Dashboard;
