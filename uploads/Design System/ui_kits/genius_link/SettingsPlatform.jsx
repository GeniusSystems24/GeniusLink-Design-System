/* global React, Card, SectionHeader, Field, Textarea, Button, Icon, StatusPill, IconBtn */
// GeniusLink — Settings (Phase 3): Platform.
// Integrations · Webhooks · API Keys · Notifications · Billing & Plan · Backup & Export.

const PL = () => window._settings.SettingsLayout;

function Mono({ name, tone }) {
  return <div style={{ width: 38, height: 38, borderRadius: 8, background: `${tone}1F`, color: tone, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--gl-font-display)', fontWeight: 800, fontSize: 16, flexShrink: 0 }}>{name[0]}</div>;
}
function RowToggle({ on, onClick }) {
  return (
    <button onClick={onClick} style={{ width: 38, height: 22, borderRadius: 999, background: on ? '#4A7CFF' : 'var(--gl-input-bg)', border: '1px solid var(--gl-border-strong)', position: 'relative', cursor: 'pointer', padding: 0, flexShrink: 0 }}>
      <span style={{ position: 'absolute', top: 2, left: on ? 18 : 2, width: 16, height: 16, borderRadius: 999, background: '#fff', transition: 'left 150ms ease' }} />
    </button>
  );
}

/* ═════════ INTEGRATIONS ═════════ */
function IntegrationsScreen({ onNavigate }) {
  const Layout = PL();
  const groups = [
    { title: 'Banking & Payments', marker: 'blue', items: [
      { name: 'SAMA Open Banking', tone: '#4A7CFF', desc: 'Account aggregation & statement sync', connected: true },
      { name: 'Mada Gateway', tone: '#1DB88A', desc: 'Card acquiring for local payments', connected: true },
      { name: 'Stripe', tone: '#635BFF', desc: 'International card processing', connected: false },
    ] },
    { title: 'E-commerce', marker: 'green', items: [
      { name: 'Salla', tone: '#1DB88A', desc: 'Sync orders & inventory', connected: true },
      { name: 'Zid', tone: '#F97316', desc: 'Storefront order import', connected: false },
      { name: 'Shopify', tone: '#95BF47', desc: 'Multi-channel commerce', connected: false },
    ] },
    { title: 'Email & Comms', marker: 'orange', items: [
      { name: 'SMTP / SendGrid', tone: '#4A7CFF', desc: 'Transactional document email', connected: true },
      { name: 'Slack', tone: '#E01E5A', desc: 'Approval & alert notifications', connected: false },
    ] },
  ];
  const [state, setState] = React.useState(() => { const o = {}; groups.forEach((g) => g.items.forEach((it) => { o[it.name] = it.connected; })); return o; });
  return (
    <Layout active="setIntegrations" onNavigate={onNavigate} title="Integrations" sub="Connect GeniusLink to external services">
      {groups.map((g) => (
        <Card key={g.title} padding={0}>
          <div style={{ padding: '20px 24px 0' }}><SectionHeader title={g.title} marker={g.marker} /></div>
          <div style={{ padding: '12px 24px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {g.items.map((it) => {
              const on = state[it.name];
              return (
                <div key={it.name} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 14px', background: 'var(--gl-bg)', border: '1px solid var(--gl-border)', borderRadius: 6 }}>
                  <Mono name={it.name} tone={it.tone} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--gl-fg-1)', display: 'flex', alignItems: 'center', gap: 8 }}>{it.name}{on && <StatusPill tone="success" size="sm">Connected</StatusPill>}</div>
                    <div style={{ fontSize: 12, color: 'var(--gl-fg-3)', marginTop: 3 }}>{it.desc}</div>
                  </div>
                  <Button variant={on ? 'secondary' : 'primary'} onClick={() => setState((s) => ({ ...s, [it.name]: !s[it.name] }))}>{on ? 'Disconnect' : 'Connect'}</Button>
                </div>
              );
            })}
          </div>
        </Card>
      ))}
    </Layout>
  );
}

/* ═════════ WEBHOOKS ═════════ */
function WebhooksScreen({ onNavigate }) {
  const Layout = PL();
  const [hooks, setHooks] = React.useState([
    { url: 'https://erp.acme.sa/hooks/postings', events: ['journal.posted', 'deposit.created'], on: true, last: '200 · 2m ago' },
    { url: 'https://api.najd.io/gl/inventory', events: ['inventory.adjusted', 'transfer.created'], on: true, last: '200 · 1h ago' },
    { url: 'https://hooks.slack.com/services/T0…', events: ['approval.requested'], on: false, last: '410 · 3d ago' },
  ]);
  const toggle = (i) => setHooks((h) => h.map((x, j) => j === i ? { ...x, on: !x.on } : x));
  return (
    <Layout active="setWebhooks" onNavigate={onNavigate} title="Webhooks" sub="Push events to external endpoints"
      actions={<Button variant="primary" icon="plus">Add Endpoint</Button>}>
      <Card padding={0}>
        <div style={{ padding: '20px 24px 0' }}><SectionHeader title={`${hooks.length} Endpoints`} subtitle="Signed with HMAC-SHA256 · retried 5× on failure" marker="blue" /></div>
        <div style={{ padding: '12px 24px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {hooks.map((h, i) => (
            <div key={i} style={{ padding: '14px 16px', background: 'var(--gl-bg)', border: '1px solid var(--gl-border)', borderRadius: 6 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ color: h.on ? '#1DB88A' : 'var(--gl-fg-4)', display: 'flex' }}><Icon name="link" size={16} /></span>
                <span style={{ flex: 1, fontFamily: 'var(--gl-font-mono)', fontSize: 12.5, color: 'var(--gl-fg-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{h.url}</span>
                <span style={{ fontFamily: 'var(--gl-font-mono)', fontSize: 11, color: h.last.startsWith('2') ? '#1DB88A' : '#EF4444' }}>{h.last}</span>
                <RowToggle on={h.on} onClick={() => toggle(i)} />
              </div>
              <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
                {h.events.map((e) => <span key={e} style={{ fontFamily: 'var(--gl-font-mono)', fontSize: 10.5, color: 'var(--gl-fg-2)', background: 'var(--gl-input-bg)', border: '1px solid var(--gl-border)', borderRadius: 4, padding: '3px 8px' }}>{e}</span>)}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </Layout>
  );
}

/* ═════════ API KEYS ═════════ */
function APIKeysScreen({ onNavigate }) {
  const Layout = PL();
  const [keys, setKeys] = React.useState([
    { name: 'Production · Server', prefix: 'gl_live_8f2a', scopes: 'read, write', created: 'Apr 12, 2024', used: '2m ago', reveal: false },
    { name: 'Reporting · Read-only', prefix: 'gl_live_3b71', scopes: 'read', created: 'Sep 02, 2024', used: 'Yesterday', reveal: false },
    { name: 'Staging', prefix: 'gl_test_aa90', scopes: 'read, write', created: 'Nov 18, 2024', used: 'Never', reveal: false },
  ]);
  const grid = '1.4fr 1.6fr 0.9fr 1fr 0.9fr 80px';
  const reveal = (i) => setKeys((k) => k.map((x, j) => j === i ? { ...x, reveal: !x.reveal } : x));
  return (
    <Layout active="setApiKeys" onNavigate={onNavigate} title="API Keys" sub="Tokens for programmatic access to the API"
      actions={<Button variant="primary" icon="plus">Create Key</Button>}>
      <Card padding={20}>
        <div style={{ display: 'flex', gap: 12, padding: '12px 14px', background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.25)', borderRadius: 6, fontSize: 12, color: 'var(--gl-fg-2)', lineHeight: 1.5 }}>
          <span style={{ color: '#F97316', flexShrink: 0 }}><Icon name="info" size={14} /></span>
          <span>A key's secret is shown only once at creation. Store it securely — you can revoke and re-issue at any time.</span>
        </div>
      </Card>
      <Card padding={0}>
        <div style={{ padding: '20px 24px 0' }}><SectionHeader title={`${keys.length} Active Keys`} marker="green" /></div>
        <div style={{ padding: '16px 24px 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: grid, gap: 12, padding: '0 0 12px', borderBottom: '1px solid var(--gl-border)', fontWeight: 700, fontSize: 10, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--gl-fg-3)' }}>
            <span>Name</span><span>Key</span><span>Scopes</span><span>Created</span><span>Last Used</span><span></span>
          </div>
          {keys.map((k, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: grid, gap: 12, padding: '14px 0', alignItems: 'center', borderBottom: i < keys.length - 1 ? '1px solid var(--gl-border)' : 'none', fontSize: 13, color: 'var(--gl-fg-1)' }}>
              <span style={{ fontWeight: 600 }}>{k.name}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontFamily: 'var(--gl-font-mono)', fontSize: 12, color: 'var(--gl-fg-2)' }}>{k.reveal ? `${k.prefix}_4d9e1c7b22f0` : `${k.prefix}••••••••••••`}</span>
                <button onClick={() => reveal(i)} style={{ background: 'none', border: 'none', color: '#4A7CFF', cursor: 'pointer', fontSize: 11, fontWeight: 700, fontFamily: 'var(--gl-font-body)' }}>{k.reveal ? 'Hide' : 'Reveal'}</button>
              </span>
              <span style={{ fontFamily: 'var(--gl-font-mono)', fontSize: 11, color: 'var(--gl-fg-2)' }}>{k.scopes}</span>
              <span style={{ fontFamily: 'var(--gl-font-mono)', fontSize: 12, color: 'var(--gl-fg-3)' }}>{k.created}</span>
              <span style={{ fontFamily: 'var(--gl-font-mono)', fontSize: 12, color: 'var(--gl-fg-3)' }}>{k.used}</span>
              <Button variant="danger" onClick={() => setKeys((ks) => ks.filter((_, j) => j !== i))}>Revoke</Button>
            </div>
          ))}
        </div>
      </Card>
    </Layout>
  );
}

/* ═════════ NOTIFICATIONS ═════════ */
function NotificationPreferencesScreen({ onNavigate, onSave }) {
  const Layout = PL();
  const cats = [
    { name: 'Postings & Ledger', sub: 'Entries posted, reversed, locked' },
    { name: 'Approvals', sub: 'Wires & adjustments awaiting review' },
    { name: 'Inventory', sub: 'Low stock, transfers, counts' },
    { name: 'Security', sub: 'Sign-ins, role & key changes' },
    { name: 'Billing', sub: 'Invoices, plan & usage limits' },
  ];
  const chans = ['Email', 'In-app', 'SMS'];
  const seed = [[1, 1, 0], [1, 1, 1], [1, 1, 0], [1, 1, 1], [1, 0, 0]];
  const [prefs, setPrefs] = React.useState(() => seed.map((r) => r.map(Boolean)));
  const toggle = (ci, chi) => setPrefs((p) => p.map((row, i) => i === ci ? row.map((v, j) => j === chi ? !v : v) : row));
  const grid = '1.8fr repeat(3, 90px)';
  return (
    <Layout active="setNotifications" onNavigate={onNavigate} title="Notifications" sub="Choose how each event reaches you"
      actions={<Button variant="primary" icon="check" onClick={onSave}>Save Preferences</Button>}>
      <Card padding={0}>
        <div style={{ padding: '20px 24px 0' }}><SectionHeader title="Preferences" subtitle="Toggle a channel per category" marker="blue" /></div>
        <div style={{ padding: '16px 24px 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: grid, gap: 12, padding: '0 0 12px', borderBottom: '1px solid var(--gl-border)', fontWeight: 700, fontSize: 10, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--gl-fg-3)' }}>
            <span>Category</span>{chans.map((c) => <span key={c} style={{ textAlign: 'center' }}>{c}</span>)}
          </div>
          {cats.map((cat, ci) => (
            <div key={cat.name} style={{ display: 'grid', gridTemplateColumns: grid, gap: 12, padding: '14px 0', alignItems: 'center', borderBottom: ci < cats.length - 1 ? '1px solid var(--gl-border)' : 'none' }}>
              <span><div style={{ fontSize: 13, fontWeight: 600, color: 'var(--gl-fg-1)' }}>{cat.name}</div><div style={{ fontSize: 11, color: 'var(--gl-fg-3)', marginTop: 2 }}>{cat.sub}</div></span>
              {chans.map((c, chi) => <div key={c} style={{ display: 'flex', justifyContent: 'center' }}><RowToggle on={prefs[ci][chi]} onClick={() => toggle(ci, chi)} /></div>)}
            </div>
          ))}
        </div>
      </Card>
    </Layout>
  );
}

/* ═════════ BILLING & PLAN ═════════ */
function BillingPlanScreen({ onNavigate }) {
  const Layout = PL();
  const plans = [
    { name: 'Starter', price: '0', per: 'free', feats: ['1 workspace', '3 users', '500 entries/mo'], current: false },
    { name: 'Business', price: '349', per: '/mo', feats: ['Unlimited entries', '25 users', 'All integrations'], current: true },
    { name: 'Enterprise', price: 'Custom', per: '', feats: ['SSO & SAML', 'Dedicated support', 'Audit retention 10y'], current: false },
  ];
  const usage = [['Users', 6, 25], ['Transactions · MTD', 4120, 100000], ['Storage', 2.4, 50]];
  return (
    <Layout active="setBilling" onNavigate={onNavigate} title="Billing & Plan" sub="Subscription, usage and invoices">
      <Card>
        <SectionHeader title="Current Plan" marker="green" right={<StatusPill tone="success">Active</StatusPill>} />
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
          <span style={{ fontFamily: 'var(--gl-font-display)', fontWeight: 700, fontSize: 24, color: 'var(--gl-fg-1)' }}>Business</span>
          <span style={{ fontFamily: 'var(--gl-font-mono)', fontSize: 16, color: 'var(--gl-fg-2)' }}>349.00 SAR<span style={{ fontSize: 12, color: 'var(--gl-fg-3)' }}>/mo</span></span>
          <span style={{ marginLeft: 'auto', fontFamily: 'var(--gl-font-mono)', fontSize: 12, color: 'var(--gl-fg-3)' }}>Renews Jan 1, 2026</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginTop: 4 }}>
          {usage.map(([label, val, max]) => {
            const pct = Math.min(100, Math.round((val / max) * 100));
            return (
              <div key={label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 6 }}>
                  <span style={{ fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--gl-fg-3)' }}>{label}</span>
                  <span style={{ fontFamily: 'var(--gl-font-mono)', color: 'var(--gl-fg-2)' }}>{typeof val === 'number' && val > 100 ? val.toLocaleString() : val}{label === 'Storage' ? ' GB' : ''} / {max.toLocaleString()}</span>
                </div>
                <div style={{ height: 6, background: 'var(--gl-input-bg)', borderRadius: 999, overflow: 'hidden' }}><div style={{ width: `${pct}%`, height: '100%', background: pct > 85 ? '#F97316' : '#4A7CFF', borderRadius: 999 }} /></div>
              </div>
            );
          })}
        </div>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
        {plans.map((p) => (
          <div key={p.name} style={{ background: 'var(--gl-surface)', border: `1px solid ${p.current ? '#4A7CFF' : 'var(--gl-border)'}`, borderRadius: 8, padding: 20, display: 'flex', flexDirection: 'column', gap: 14, position: 'relative' }}>
            {p.current && <span style={{ position: 'absolute', top: 16, right: 16, fontSize: 8, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#4A7CFF', background: 'rgba(74,124,255,0.14)', borderRadius: 4, padding: '2px 6px' }}>Current</span>}
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--gl-fg-1)' }}>{p.name}</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}><span style={{ fontFamily: 'var(--gl-font-mono)', fontSize: 26, fontWeight: 700, color: 'var(--gl-fg-1)' }}>{p.price}</span><span style={{ fontSize: 12, color: 'var(--gl-fg-3)' }}>{p.per}</span></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
              {p.feats.map((f) => <div key={f} style={{ display: 'flex', gap: 8, fontSize: 12.5, color: 'var(--gl-fg-2)' }}><Icon name="check" size={14} color="#1DB88A" />{f}</div>)}
            </div>
            <Button variant={p.current ? 'secondary' : 'primary'}>{p.current ? 'Current Plan' : (p.name === 'Enterprise' ? 'Contact Sales' : 'Upgrade')}</Button>
          </div>
        ))}
      </div>

      <Card padding={0}>
        <div style={{ padding: '20px 24px 0' }}><SectionHeader title="Recent Invoices" marker="orange" /></div>
        <div style={{ padding: '8px 24px 24px' }}>
          {[['INV-GL-2025-012', 'Dec 01, 2025', '349.00', 'Paid'], ['INV-GL-2025-011', 'Nov 01, 2025', '349.00', 'Paid'], ['INV-GL-2025-010', 'Oct 01, 2025', '349.00', 'Paid']].map(([ref, date, amt, st], i, a) => (
            <div key={ref} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 0', borderBottom: i < a.length - 1 ? '1px solid var(--gl-border)' : 'none', fontSize: 13 }}>
              <span style={{ fontFamily: 'var(--gl-font-mono)', color: '#4A7CFF', flex: 1 }}>{ref}</span>
              <span style={{ color: 'var(--gl-fg-3)', fontSize: 12 }}>{date}</span>
              <span style={{ fontFamily: 'var(--gl-font-mono)', fontWeight: 600 }}>{amt} SAR</span>
              <StatusPill tone="success" size="sm">{st}</StatusPill>
              <button style={{ background: 'none', border: 'none', color: 'var(--gl-fg-3)', cursor: 'pointer', display: 'flex' }}><Icon name="download" size={15} /></button>
            </div>
          ))}
        </div>
      </Card>
    </Layout>
  );
}

/* ═════════ BACKUP & EXPORT ═════════ */
function BackupExportScreen({ onNavigate }) {
  const Layout = PL();
  const [auto, setAuto] = React.useState(true);
  const [scope, setScope] = React.useState({ Ledger: true, Inventory: true, Contacts: true, Documents: false });
  return (
    <Layout active="setBackup" onNavigate={onNavigate} title="Backup & Export" sub="Snapshots and data portability">
      <Card>
        <SectionHeader title="Automatic Backups" marker="green" right={<StatusPill tone="success">Healthy</StatusPill>} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <div>
            <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--gl-fg-1)' }}>Daily encrypted snapshot</div>
            <div style={{ fontSize: 12, color: 'var(--gl-fg-3)', marginTop: 3, fontFamily: 'var(--gl-font-mono)' }}>Last backup · Dec 19, 2025 03:00 · 248 MB</div>
          </div>
          <RowToggle on={auto} onClick={() => setAuto(!auto)} />
        </div>
      </Card>

      <Card>
        <SectionHeader title="Manual Export" subtitle="Download a portable copy of your data" marker="blue" />
        <div>
          <div style={{ fontWeight: 700, fontSize: 11, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--gl-fg-2)', marginBottom: 8 }}>Data Scope</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 8 }}>
            {Object.keys(scope).map((k) => (
              <button key={k} onClick={() => setScope((s) => ({ ...s, [k]: !s[k] }))} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', borderRadius: 6, cursor: 'pointer', background: scope[k] ? 'rgba(74,124,255,0.12)' : 'var(--gl-input-bg)', border: `1px solid ${scope[k] ? '#4A7CFF' : 'var(--gl-border)'}`, textAlign: 'left' }}>
                <span style={{ width: 18, height: 18, borderRadius: 4, border: `1px solid ${scope[k] ? '#4A7CFF' : 'var(--gl-border-strong)'}`, background: scope[k] ? '#4A7CFF' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{scope[k] && <Icon name="check" size={12} color="#fff" stroke={3} />}</span>
                <span style={{ fontSize: 13, color: 'var(--gl-fg-1)' }}>{k}</span>
              </button>
            ))}
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <window._cfgShared.CurSelect label="Format" value="CSV (zipped)" options={['CSV (zipped)', 'JSON', 'Excel (XLSX)']} />
          <window._cfgShared.CurSelect label="Date Range" value="Fiscal 2024" options={['Fiscal 2024', 'Last 90 days', 'All time']} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}><Button variant="primary" icon="download">Generate Export</Button></div>
      </Card>

      <Card padding={0}>
        <div style={{ padding: '20px 24px 0' }}><SectionHeader title="Export History" marker="orange" /></div>
        <div style={{ padding: '8px 24px 24px' }}>
          {[['full-export-2025-12-15.zip', '248 MB', 'Dec 15'], ['ledger-q4-2025.csv', '12 MB', 'Dec 02'], ['contacts-2025-11.json', '1.1 MB', 'Nov 20']].map(([f, sz, d], i, a) => (
            <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 0', borderBottom: i < a.length - 1 ? '1px solid var(--gl-border)' : 'none', fontSize: 13 }}>
              <span style={{ color: '#4A7CFF', display: 'flex' }}><Icon name="doc" size={16} /></span>
              <span style={{ flex: 1, fontFamily: 'var(--gl-font-mono)', fontSize: 12.5 }}>{f}</span>
              <span style={{ fontFamily: 'var(--gl-font-mono)', fontSize: 11, color: 'var(--gl-fg-3)' }}>{sz} · {d}</span>
              <button style={{ background: 'none', border: 'none', color: 'var(--gl-fg-3)', cursor: 'pointer', display: 'flex' }}><Icon name="download" size={15} /></button>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <SectionHeader title="Danger Zone" marker="orange" />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '14px 16px', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 6 }}>
          <div><div style={{ fontSize: 13, fontWeight: 600, color: 'var(--gl-fg-1)' }}>Delete workspace</div><div style={{ fontSize: 12, color: 'var(--gl-fg-3)', marginTop: 2 }}>Permanently removes all data after a 30-day grace period.</div></div>
          <Button variant="danger" icon="trash">Delete</Button>
        </div>
      </Card>
    </Layout>
  );
}

Object.assign(window, {
  IntegrationsScreen, WebhooksScreen, APIKeysScreen,
  NotificationPreferencesScreen, BillingPlanScreen, BackupExportScreen,
});
