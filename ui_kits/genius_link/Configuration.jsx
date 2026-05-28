/* global React, Page, Card, SectionHeader, Field, Button, Icon, StatusPill */
// Stage 5 — Configuration: Exchange Rate Setup + Fiscal Year Setup

function ExchangeRateSetup({ onCancel, onSave }) {
  const pairs = [
    { code: 'USD', name: 'US Dollar',     rate: '3.750200', prev: '3.751400', auto: true },
    { code: 'EUR', name: 'Euro',          rate: '4.082100', prev: '4.079800', auto: true },
    { code: 'GBP', name: 'British Pound', rate: '4.761000', prev: '4.758200', auto: true },
    { code: 'AED', name: 'UAE Dirham',    rate: '1.020800', prev: '1.020800', auto: false },
    { code: 'KWD', name: 'Kuwaiti Dinar', rate: '12.18000', prev: '12.17200', auto: false },
  ];
  const grid = '90px 1.6fr 1.1fr 1.1fr 1fr 110px';

  return (
    <Page breadcrumb={['Configuration', 'Exchange Rates']} title="Exchange Rate Setup">
      <Card padding={20}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <span style={{ fontWeight: 700, fontSize: 11, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--gl-fg-3)' }}>Base Currency</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'var(--gl-font-mono)', fontWeight: 600, fontSize: 14, color: 'var(--gl-fg-1)' }}>
              SAR <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.08em', color: '#4A7CFF', background: 'rgba(74,124,255,0.14)', padding: '2px 5px', borderRadius: 4 }}>BASE</span>
            </span>
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <span style={{ fontFamily: 'var(--gl-font-mono)', fontSize: 12, color: 'var(--gl-fg-3)' }}>Effective Dec 18, 2025</span>
            <Button variant="secondary" icon="download">Pull ECB Feed</Button>
          </div>
        </div>
      </Card>

      <Card padding={0}>
        <div style={{ padding: '20px 24px 0' }}>
          <SectionHeader title="Rates per 1 SAR" subtitle="Auto-fed pairs sync daily; manual pairs are editable" marker="green" />
        </div>
        <div style={{ padding: '16px 24px 24px' }}>
          <div style={{
            display: 'grid', gridTemplateColumns: grid, gap: 12, padding: '0 0 12px',
            borderBottom: '1px solid var(--gl-border)',
            fontWeight: 700, fontSize: 10, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--gl-fg-3)',
          }}>
            <span>Code</span><span>Currency</span>
            <span style={{ textAlign: 'right' }}>Previous</span>
            <span style={{ textAlign: 'right' }}>New Rate</span>
            <span style={{ textAlign: 'right' }}>Δ</span>
            <span>Source</span>
          </div>
          {pairs.map((p, i) => {
            const delta = (parseFloat(p.rate) - parseFloat(p.prev)).toFixed(6);
            const up = parseFloat(delta) > 0, flat = parseFloat(delta) === 0;
            return (
              <div key={p.code} style={{
                display: 'grid', gridTemplateColumns: grid, gap: 12, padding: '12px 0', alignItems: 'center',
                borderBottom: i < pairs.length - 1 ? '1px solid var(--gl-border)' : 'none', fontSize: 13, color: 'var(--gl-fg-1)',
              }}>
                <span style={{ fontFamily: 'var(--gl-font-mono)', fontWeight: 600 }}>{p.code}</span>
                <span style={{ color: 'var(--gl-fg-2)' }}>{p.name}</span>
                <span style={{ fontFamily: 'var(--gl-font-mono)', textAlign: 'right', color: 'var(--gl-fg-3)' }}>{p.prev}</span>
                <span>
                  <input defaultValue={p.rate} readOnly={p.auto}
                    style={{
                      width: '100%', height: 32, padding: '0 10px', textAlign: 'right',
                      background: p.auto ? 'transparent' : 'var(--gl-input-bg)',
                      border: `1px solid ${p.auto ? 'transparent' : 'var(--gl-border-strong)'}`,
                      borderRadius: 4, fontFamily: 'var(--gl-font-mono)', fontSize: 13, fontWeight: 600,
                      color: 'var(--gl-fg-1)', outline: 'none', boxSizing: 'border-box',
                      cursor: p.auto ? 'default' : 'text',
                    }} />
                </span>
                <span style={{ fontFamily: 'var(--gl-font-mono)', textAlign: 'right', color: flat ? 'var(--gl-fg-4)' : (up ? '#1DB88A' : '#EF4444') }}>
                  {flat ? '—' : (up ? '▲' : '▼')}
                </span>
                <span>
                  <StatusPill tone={p.auto ? 'info' : 'neutral'} size="sm">{p.auto ? 'Auto' : 'Manual'}</StatusPill>
                </span>
              </div>
            );
          })}
        </div>
      </Card>

      <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
        <Button variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button variant="primary" icon="check" onClick={onSave}>Save Rates</Button>
      </div>
    </Page>
  );
}

function FiscalYearSetup({ onCancel, onSave }) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  // Periods up to Nov are closed, Dec open, rest future
  const state = (i) => i < 11 ? 'closed' : (i === 11 ? 'open' : 'future');

  return (
    <Page breadcrumb={['Configuration', 'Fiscal Years']} title="Fiscal Year Setup">
      <Card>
        <SectionHeader title="Year Definition" subtitle="Define the active fiscal year boundaries" marker="blue"
                       right={<StatusPill tone="success">Open</StatusPill>} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24 }}>
          <Field label="Fiscal Year" value="2024" mono />
          <Field label="Start Date" value="01/01/2024" mono />
          <Field label="End Date" value="12/31/2024" mono />
        </div>
      </Card>

      <Card>
        <SectionHeader title="Accounting Periods" subtitle="12 monthly periods · lock to prevent back-dated postings" marker="green" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          {months.map((m, i) => {
            const st = state(i);
            const cfg = {
              closed: { bg: 'var(--gl-bg)',                border: 'var(--gl-border)',        label: 'Closed', tone: 'neutral', icon: 'lock' },
              open:   { bg: 'rgba(29,184,138,0.08)',       border: 'rgba(29,184,138,0.3)',    label: 'Open',   tone: 'success', icon: 'check' },
              future: { bg: 'var(--gl-bg)',                border: 'var(--gl-border)',        label: 'Future', tone: 'neutral', icon: null },
            }[st];
            return (
              <div key={m} style={{
                padding: '14px 16px', borderRadius: 6, background: cfg.bg, border: `1px solid ${cfg.border}`,
                display: 'flex', flexDirection: 'column', gap: 8,
                opacity: st === 'future' ? 0.55 : 1,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 700, fontSize: 13, color: 'var(--gl-fg-1)' }}>{m}</span>
                  {cfg.icon && <Icon name={cfg.icon} size={13} color={st === 'open' ? '#1DB88A' : 'var(--gl-fg-3)'} />}
                </div>
                <span style={{ fontWeight: 700, fontSize: 9, letterSpacing: '0.08em', textTransform: 'uppercase', color: st === 'open' ? '#1DB88A' : 'var(--gl-fg-3)' }}>{cfg.label}</span>
              </div>
            );
          })}
        </div>
      </Card>

      <Card>
        <div style={{ display: 'flex', gap: 12, padding: '14px 16px', background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.25)', borderRadius: 4, fontSize: 12, color: 'var(--gl-fg-2)', lineHeight: 1.5 }}>
          <span style={{ color: '#F97316', flexShrink: 0 }}><Icon name="info" size={14} /></span>
          <span>Closing a period locks all postings dated within it. A locked period can only be reopened by a controller with audit justification.</span>
        </div>
      </Card>

      <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
        <Button variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button variant="primary" icon="check" onClick={onSave}>Save Configuration</Button>
      </div>
    </Page>
  );
}

window.ExchangeRateSetup = ExchangeRateSetup;
window.FiscalYearSetup = FiscalYearSetup;
