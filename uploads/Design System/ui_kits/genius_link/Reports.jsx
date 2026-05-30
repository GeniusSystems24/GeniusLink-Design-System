/* global React, Page, Card, SectionHeader, Button, Icon, StatusPill */
// Stage 7 — Reports: Trial Balance, Income Statement, Balance Sheet, Inventory Valuation, Audit Log

function ReportHeader({ period = 'Dec 2024', extra }) {
  return (
    <Card padding={20}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
          <PeriodPill label="Period" value={period} />
          <PeriodPill label="Currency" value="SAR" />
          <PeriodPill label="Basis" value="Accrual" />
          {extra}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button variant="secondary" icon="download">PDF</Button>
          <Button variant="secondary" icon="download">XLSX</Button>
        </div>
      </div>
    </Card>
  );
}

function PeriodPill({ label, value }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
      <span style={{ fontWeight: 700, fontSize: 10, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--gl-fg-3)' }}>{label}</span>
      <span style={{ fontFamily: 'var(--gl-font-mono)', fontSize: 13, fontWeight: 600, color: 'var(--gl-fg-1)' }}>{value}</span>
    </span>
  );
}

const money = (n) => Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/* ---------- Trial Balance ---------- */
function TrialBalanceReport() {
  const rows = [
    { code: '1001', name: 'Cash Box',            dr: 42500,  cr: 0 },
    { code: '1100', name: 'Bank · NCB Main',     dr: 186420, cr: 0 },
    { code: '1200', name: 'Inventory (WIP)',     dr: 54890,  cr: 0 },
    { code: '2001', name: 'Accounts Payable',    dr: 0,      cr: 23140 },
    { code: '3001', name: 'Owner Capital',       dr: 0,      cr: 260670 },
    { code: '4001', name: 'Sales Revenue',       dr: 0,      cr: 89200 },
    { code: '5001', name: 'Cost of Goods Sold',  dr: 34120,  cr: 0 },
    { code: '5200', name: 'Operating Expense',   dr: 55080,  cr: 0 },
  ];
  const totDr = rows.reduce((s, r) => s + r.dr, 0);
  const totCr = rows.reduce((s, r) => s + r.cr, 0);
  const grid = '90px 2fr 1.2fr 1.2fr';
  return (
    <Page breadcrumb={['Reports', 'Trial Balance']} title="Trial Balance">
      <ReportHeader extra={<PeriodPill label="Status" value="Balanced" />} />
      <Card padding={0}>
        <div style={{ padding: '20px 24px 0' }}>
          <SectionHeader title="All Accounts" subtitle="Debit and credit balances as of period end" marker="green" />
        </div>
        <div style={{ padding: '16px 24px 24px' }}>
          <ReportHead grid={grid} cols={['Code', 'Account', 'Debit', 'Credit']} rightFrom={2} />
          {rows.map((r, i) => (
            <div key={r.code} style={rowStyle(i, rows.length, grid)}>
              <span style={{ fontFamily: 'var(--gl-font-mono)', color: 'var(--gl-fg-3)' }}>{r.code}</span>
              <span style={{ fontWeight: 600 }}>{r.name}</span>
              <span style={{ fontFamily: 'var(--gl-font-mono)', textAlign: 'right', color: r.dr ? '#1DB88A' : 'var(--gl-fg-4)' }}>{r.dr ? money(r.dr) : '—'}</span>
              <span style={{ fontFamily: 'var(--gl-font-mono)', textAlign: 'right', color: r.cr ? '#EF4444' : 'var(--gl-fg-4)' }}>{r.cr ? money(r.cr) : '—'}</span>
            </div>
          ))}
          <TotalRow grid={grid} label="Totals" values={[money(totDr), money(totCr)]} balanced />
        </div>
      </Card>
    </Page>
  );
}

/* ---------- Income Statement ---------- */
function IncomeStatement() {
  const sections = [
    { title: 'Revenue', marker: 'green', rows: [['4001', 'Sales Revenue', 89200], ['4002', 'Service Revenue', 14600]], subtotal: 103800 },
    { title: 'Cost of Sales', marker: 'orange', rows: [['5001', 'Cost of Goods Sold', -34120]], subtotal: -34120 },
    { title: 'Operating Expenses', marker: 'orange', rows: [['5200', 'Operating Expense', -55080], ['5300', 'Bank Charges', -1240]], subtotal: -56320 },
  ];
  const net = 103800 - 34120 - 56320;
  const grid = '90px 2fr 1.4fr';
  return (
    <Page breadcrumb={['Reports', 'Income Statement']} title="Income Statement">
      <ReportHeader />
      {sections.map((s) => (
        <Card key={s.title} padding={0}>
          <div style={{ padding: '20px 24px 0' }}>
            <SectionHeader title={s.title} marker={s.marker} />
          </div>
          <div style={{ padding: '16px 24px 24px' }}>
            <ReportHead grid={grid} cols={['Code', 'Account', 'Amount']} rightFrom={2} />
            {s.rows.map(([code, name, amt], i) => (
              <div key={code} style={rowStyle(i, s.rows.length, grid)}>
                <span style={{ fontFamily: 'var(--gl-font-mono)', color: 'var(--gl-fg-3)' }}>{code}</span>
                <span style={{ fontWeight: 600 }}>{name}</span>
                <span style={{ fontFamily: 'var(--gl-font-mono)', textAlign: 'right', color: amt < 0 ? '#EF4444' : 'var(--gl-fg-1)' }}>{amt < 0 ? '(' + money(amt) + ')' : money(amt)}</span>
              </div>
            ))}
            <TotalRow grid={grid} label={`Total ${s.title}`} values={[s.subtotal < 0 ? '(' + money(s.subtotal) + ')' : money(s.subtotal)]} />
          </div>
        </Card>
      ))}
      <Card padding={20}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--gl-fg-1)' }}>Net Income</span>
          <span style={{ fontFamily: 'var(--gl-font-mono)', fontSize: 24, fontWeight: 700, color: '#1DB88A' }}>{money(net)} <span style={{ fontSize: 12, color: 'var(--gl-fg-3)', fontWeight: 400 }}>SAR</span></span>
        </div>
      </Card>
    </Page>
  );
}

/* ---------- Balance Sheet ---------- */
function BalanceSheet() {
  const blocks = [
    { title: 'Assets', marker: 'blue', rows: [['Current Assets', 283790], ['Fixed Assets', 142000]], total: 425790 },
    { title: 'Liabilities', marker: 'orange', rows: [['Accounts Payable', 23140], ['Long-Term Debt', 80000]], total: 103140 },
    { title: 'Equity', marker: 'green', rows: [['Owner Capital', 260670], ['Retained Earnings', 61980]], total: 322650 },
  ];
  const grid = '2fr 1.4fr';
  return (
    <Page breadcrumb={['Reports', 'Balance Sheet']} title="Balance Sheet">
      <ReportHeader extra={<PeriodPill label="Status" value="Assets = L + E" />} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'start' }}>
        <BsCard block={blocks[0]} grid={grid} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <BsCard block={blocks[1]} grid={grid} />
          <BsCard block={blocks[2]} grid={grid} />
        </div>
      </div>
    </Page>
  );
}

function BsCard({ block, grid }) {
  return (
    <Card padding={0}>
      <div style={{ padding: '20px 24px 0' }}>
        <SectionHeader title={block.title} marker={block.marker} />
      </div>
      <div style={{ padding: '16px 24px 24px' }}>
        {block.rows.map(([name, amt], i) => (
          <div key={name} style={rowStyle(i, block.rows.length, grid)}>
            <span style={{ fontWeight: 600 }}>{name}</span>
            <span style={{ fontFamily: 'var(--gl-font-mono)', textAlign: 'right' }}>{money(amt)}</span>
          </div>
        ))}
        <TotalRow grid={grid} label={`Total ${block.title}`} values={[money(block.total)]} />
      </div>
    </Card>
  );
}

/* ---------- Inventory Valuation ---------- */
function InventoryValuation() {
  const rows = [
    { sku: 'STL-44021', name: 'Structural Steel I-Beam', qty: 142, cost: 450, store: 'Downtown' },
    { sku: 'CMT-90112', name: 'Portland Cement Type I',  qty: 1820, cost: 24.5, store: 'King Fahd' },
    { sku: 'AGG-21044', name: 'Coarse Aggregate 20mm',   qty: 46,  cost: 125, store: 'Downtown' },
    { sku: 'PLY-30022', name: 'Plywood Sheet 18mm',      qty: 312, cost: 92,  store: 'Jeddah' },
    { sku: 'RBR-71203', name: 'Reinforcement Bar #6',    qty: 0,   cost: 78,  store: 'Downtown' },
  ];
  const total = rows.reduce((s, r) => s + r.qty * r.cost, 0);
  const grid = '120px 1.8fr 1fr 0.7fr 1fr 1.2fr';
  return (
    <Page breadcrumb={['Reports', 'Inventory Valuation']} title="Inventory Valuation">
      <ReportHeader extra={<PeriodPill label="Method" value="Weighted Avg" />} />
      <Card padding={0}>
        <div style={{ padding: '20px 24px 0' }}>
          <SectionHeader title="Stock Valuation" subtitle="Quantity × weighted-average unit cost" marker="green" />
        </div>
        <div style={{ padding: '16px 24px 24px' }}>
          <ReportHead grid={grid} cols={['SKU', 'Product', 'Store', 'Qty', 'Unit Cost', 'Value']} rightFrom={3} />
          {rows.map((r, i) => (
            <div key={r.sku} style={rowStyle(i, rows.length, grid)}>
              <span style={{ fontFamily: 'var(--gl-font-mono)', color: 'var(--gl-fg-3)' }}>{r.sku}</span>
              <span style={{ fontWeight: 600 }}>{r.name}</span>
              <span style={{ color: 'var(--gl-fg-2)' }}>{r.store}</span>
              <span style={{ fontFamily: 'var(--gl-font-mono)', textAlign: 'right', color: r.qty === 0 ? '#EF4444' : 'var(--gl-fg-1)' }}>{r.qty}</span>
              <span style={{ fontFamily: 'var(--gl-font-mono)', textAlign: 'right', color: 'var(--gl-fg-2)' }}>{money(r.cost)}</span>
              <span style={{ fontFamily: 'var(--gl-font-mono)', textAlign: 'right', fontWeight: 600 }}>{money(r.qty * r.cost)}</span>
            </div>
          ))}
          <TotalRow grid={grid} label="Total Inventory Value" values={['', '', '', money(total)]} span />
        </div>
      </Card>
    </Page>
  );
}

/* ---------- Audit Log ---------- */
function AuditLog() {
  const logs = [
    { ts: '2025-12-19 10:14:02', user: 'Layla A.', action: 'POST', entity: 'JV-2024-0226', ip: '10.4.22.18', tone: 'success' },
    { ts: '2025-12-18 11:02:55', user: 'Layla A.', action: 'CREATE', entity: 'EXT-2024-0311', ip: '10.4.22.18', tone: 'info' },
    { ts: '2025-12-18 10:05:31', user: 'Controller', action: 'APPROVE', entity: 'DEP-2024-0182', ip: '10.4.22.03', tone: 'success' },
    { ts: '2025-12-18 09:42:10', user: 'Layla A.', action: 'CREATE', entity: 'DEP-2024-0182', ip: '10.4.22.18', tone: 'info' },
    { ts: '2025-12-17 16:20:44', user: 'Layla A.', action: 'EDIT', entity: 'Account 1200', ip: '10.4.22.18', tone: 'warning' },
    { ts: '2025-12-12 14:08:09', user: 'Admin', action: 'VOID', entity: 'JV-2024-0150', ip: '10.4.22.01', tone: 'danger' },
    { ts: '2025-12-01 00:00:01', user: 'System', action: 'LOCK', entity: 'Period Nov 2024', ip: 'internal', tone: 'neutral' },
  ];
  const grid = '190px 1fr 110px 1.4fr 1.1fr';
  return (
    <Page breadcrumb={['Reports', 'Audit Log']} title="Audit Log">
      <ReportHeader extra={<PeriodPill label="Retention" value="7 years" />} />
      <Card padding={0}>
        <div style={{ padding: '20px 24px 0' }}>
          <SectionHeader title="Immutable Activity Trail" subtitle="Every state-changing action, timestamped and IP-stamped" marker="orange" />
        </div>
        <div style={{ padding: '16px 24px 24px' }}>
          <div style={{
            display: 'grid', gridTemplateColumns: grid, gap: 12, padding: '0 0 12px',
            borderBottom: '1px solid var(--gl-border)',
            fontWeight: 700, fontSize: 10, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--gl-fg-3)',
          }}>
            <span>Timestamp</span><span>User</span><span>Action</span><span>Entity</span><span>IP Address</span>
          </div>
          {logs.map((l, i) => (
            <div key={i} style={rowStyle(i, logs.length, grid)}>
              <span style={{ fontFamily: 'var(--gl-font-mono)', fontSize: 12, color: 'var(--gl-fg-2)' }}>{l.ts}</span>
              <span>{l.user}</span>
              <span><StatusPill tone={l.tone} size="sm">{l.action}</StatusPill></span>
              <span style={{ fontFamily: 'var(--gl-font-mono)', fontSize: 12, color: '#4A7CFF' }}>{l.entity}</span>
              <span style={{ fontFamily: 'var(--gl-font-mono)', fontSize: 12, color: 'var(--gl-fg-3)' }}>{l.ip}</span>
            </div>
          ))}
        </div>
      </Card>
    </Page>
  );
}

/* shared row helpers */
function ReportHead({ grid, cols, rightFrom }) {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: grid, gap: 12, padding: '0 0 12px',
      borderBottom: '1px solid var(--gl-border)',
      fontWeight: 700, fontSize: 10, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--gl-fg-3)',
    }}>
      {cols.map((c, i) => <span key={i} style={{ textAlign: i >= rightFrom ? 'right' : 'left' }}>{c}</span>)}
    </div>
  );
}

function rowStyle(i, len, grid) {
  return {
    display: 'grid', gridTemplateColumns: grid, gap: 12, padding: '13px 0', alignItems: 'center',
    borderBottom: i < len - 1 ? '1px solid var(--gl-border)' : 'none', fontSize: 13, color: 'var(--gl-fg-1)',
  };
}

function TotalRow({ grid, label, values, balanced, span }) {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: grid, gap: 12, padding: '16px 0 0', marginTop: 4,
      borderTop: '2px solid var(--gl-border-strong)', fontWeight: 700, fontSize: 13,
    }}>
      <span style={{ color: 'var(--gl-fg-1)' }}>{label}</span>
      {span && <span></span>}
      {values.map((v, i) => (
        <span key={i} style={{ fontFamily: 'var(--gl-font-mono)', textAlign: 'right', color: balanced ? '#1DB88A' : 'var(--gl-fg-1)' }}>{v}</span>
      ))}
    </div>
  );
}

Object.assign(window, { TrialBalanceReport, IncomeStatement, BalanceSheet, InventoryValuation, AuditLog });
