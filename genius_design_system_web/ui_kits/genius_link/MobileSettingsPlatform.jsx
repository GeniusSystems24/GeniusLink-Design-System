/* global React */
// GeniusLink mobile — Settings Phase 3: Platform.
// Integrations · Webhooks · API Keys · Notifications · Billing & Plan · Backup & Export.

const MP = window._mob;
const { C: PC, MIcon: PIcon, Pill: PPill, MCard: PCard, MBtn: PBtn, Scroll: PScroll } = MP;
const { ISection: PSection } = window._minv;
const { TSelect: PSelect } = window._mui;
const { useState: usePState } = React;

function PToggle({ on, onClick }) {
  return (
    <button onClick={onClick} style={{ width: 42, height: 24, borderRadius: 999, background: on ? PC.blue : PC.input, border: `1px solid ${on ? PC.blue : PC.borderStrong}`, position: 'relative', cursor: 'pointer', padding: 0, flexShrink: 0 }}>
      <span style={{ position: 'absolute', top: 2, left: on ? 20 : 2, width: 18, height: 18, borderRadius: 999, background: '#fff', transition: 'left 150ms ease' }} />
    </button>
  );
}
function PMono({ name, tone }) {
  return <div style={{ width: 36, height: 36, borderRadius: 8, background: `${tone}1F`, color: tone, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: PC.display, fontWeight: 800, fontSize: 15, flexShrink: 0 }}>{name[0]}</div>;
}

/* ═════════ INTEGRATIONS ═════════ */
function MIntegrations() {
  const groups = [
    { title: 'Banking & Payments', marker: PC.blue, items: [['SAMA Open Banking', '#4A7CFF', 'Statement sync', true], ['Mada Gateway', '#1DB88A', 'Local card acquiring', true], ['Stripe', '#635BFF', 'International cards', false]] },
    { title: 'E-commerce', marker: PC.green, items: [['Salla', '#1DB88A', 'Orders & inventory', true], ['Zid', '#F97316', 'Order import', false], ['Shopify', '#95BF47', 'Multi-channel', false]] },
    { title: 'Email & Comms', marker: PC.orange, items: [['SendGrid', '#4A7CFF', 'Document email', true], ['Slack', '#E01E5A', 'Alert notifications', false]] },
  ];
  const [state, setState] = usePState(() => { const o = {}; groups.forEach((g) => g.items.forEach((it) => { o[it[0]] = it[3]; })); return o; });
  return (
    <PScroll>
      {groups.map((g) => (
        <PCard key={g.title} title={g.title} marker={g.marker} pad={8}>
          <div style={{ padding: '0 8px' }}>
            {g.items.map(([name, tone, desc], i) => (
              <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: i < g.items.length - 1 ? `1px solid ${PC.border}` : 'none' }}>
                <PMono name={name} tone={tone} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: PC.fg1, fontFamily: PC.body }}>{name}</div>
                  <div style={{ fontSize: 11.5, color: PC.fg3, fontFamily: PC.body, marginTop: 1 }}>{desc}</div>
                </div>
                {state[name] && <PPill tone="success">On</PPill>}
                <PToggle on={state[name]} onClick={() => setState((s) => ({ ...s, [name]: !s[name] }))} />
              </div>
            ))}
          </div>
        </PCard>
      ))}
    </PScroll>
  );
}

/* ═════════ WEBHOOKS ═════════ */
function MWebhooks() {
  const [hooks, setHooks] = usePState([
    { url: 'erp.acme.sa/hooks/postings', events: ['journal.posted', 'deposit.created'], on: true, last: '200 · 2m' },
    { url: 'api.najd.io/gl/inventory', events: ['inventory.adjusted', 'transfer.created'], on: true, last: '200 · 1h' },
    { url: 'hooks.slack.com/services/T0…', events: ['approval.requested'], on: false, last: '410 · 3d' },
  ]);
  const toggle = (i) => setHooks((h) => h.map((x, j) => j === i ? { ...x, on: !x.on } : x));
  return (
    <PScroll>
      <PCard marker={PC.blue} title={`${hooks.length} Endpoints`} sub="HMAC-signed · retried 5× on failure" pad={8}>
        <div style={{ padding: '0 8px' }}>
          {hooks.map((h, i) => (
            <div key={i} style={{ padding: '12px 0', borderBottom: i < hooks.length - 1 ? `1px solid ${PC.border}` : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ color: h.on ? PC.green : PC.fg4, display: 'flex', flexShrink: 0 }}><PIcon name="link" size={15} /></span>
                <span style={{ flex: 1, fontFamily: PC.mono, fontSize: 12, color: PC.fg1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{h.url}</span>
                <PToggle on={h.on} onClick={() => toggle(i)} />
              </div>
              <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap', paddingLeft: 25 }}>
                {h.events.map((e) => <span key={e} style={{ fontFamily: PC.mono, fontSize: 10, color: PC.fg2, background: PC.input, border: `1px solid ${PC.border}`, borderRadius: 4, padding: '2px 7px' }}>{e}</span>)}
                <span style={{ fontFamily: PC.mono, fontSize: 10, color: h.last.startsWith('2') ? PC.green : PC.red, marginLeft: 'auto' }}>{h.last}</span>
              </div>
            </div>
          ))}
        </div>
      </PCard>
      <PBtn variant="primary" icon="plus" full>Add Endpoint</PBtn>
    </PScroll>
  );
}

/* ═════════ API KEYS ═════════ */
function MApiKeys() {
  const [keys, setKeys] = usePState([
    { name: 'Production · Server', prefix: 'gl_live_8f2a', scopes: 'read, write', used: '2m ago', reveal: false },
    { name: 'Reporting · Read-only', prefix: 'gl_live_3b71', scopes: 'read', used: 'Yesterday', reveal: false },
    { name: 'Staging', prefix: 'gl_test_aa90', scopes: 'read, write', used: 'Never', reveal: false },
  ]);
  const reveal = (i) => setKeys((k) => k.map((x, j) => j === i ? { ...x, reveal: !x.reveal } : x));
  return (
    <PScroll>
      <div style={{ display: 'flex', gap: 10, padding: '12px 14px', background: `${PC.orange}14`, border: `1px solid ${PC.orange}40`, borderRadius: 8, fontSize: 11.5, color: PC.fg2, lineHeight: 1.5, fontFamily: PC.body }}>
        <span style={{ color: PC.orange, flexShrink: 0, marginTop: 1 }}><PIcon name="info" size={14} /></span>
        <span>A key's secret is shown only once at creation. Revoke and re-issue anytime.</span>
      </div>
      <PCard marker={PC.green} title={`${keys.length} Active Keys`} pad={8}>
        <div style={{ padding: '0 8px' }}>
          {keys.map((k, i) => (
            <div key={i} style={{ padding: '12px 0', borderBottom: i < keys.length - 1 ? `1px solid ${PC.border}` : 'none' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 13.5, fontWeight: 600, color: PC.fg1, fontFamily: PC.body }}>{k.name}</span>
                <span style={{ color: PC.red, fontSize: 11, fontWeight: 700, fontFamily: PC.body, cursor: 'pointer' }} onClick={() => setKeys((ks) => ks.filter((_, j) => j !== i))}>Revoke</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
                <span style={{ flex: 1, fontFamily: PC.mono, fontSize: 11.5, color: PC.fg2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{k.reveal ? `${k.prefix}_4d9e1c7b22f0` : `${k.prefix}••••••••`}</span>
                <button onClick={() => reveal(i)} style={{ background: 'none', border: 'none', color: PC.blue, cursor: 'pointer', fontSize: 11, fontWeight: 700, fontFamily: PC.body }}>{k.reveal ? 'Hide' : 'Reveal'}</button>
              </div>
              <div style={{ fontFamily: PC.mono, fontSize: 10.5, color: PC.fg3, marginTop: 4 }}>{k.scopes} · used {k.used}</div>
            </div>
          ))}
        </div>
      </PCard>
      <PBtn variant="primary" icon="plus" full>Create Key</PBtn>
    </PScroll>
  );
}

/* ═════════ NOTIFICATIONS ═════════ */
function MNotifications() {
  const cats = [['Postings & Ledger', 'Entries posted, reversed'], ['Approvals', 'Wires & adjustments'], ['Inventory', 'Low stock, transfers'], ['Security', 'Sign-ins, key changes'], ['Billing', 'Invoices & usage']];
  const chans = ['Email', 'In-app', 'SMS'];
  const seed = [[1, 1, 0], [1, 1, 1], [1, 1, 0], [1, 1, 1], [1, 0, 0]];
  const [prefs, setPrefs] = usePState(() => seed.map((r) => r.map(Boolean)));
  const toggle = (ci, chi) => setPrefs((p) => p.map((row, i) => i === ci ? row.map((v, j) => j === chi ? !v : v) : row));
  return (
    <PScroll>
      <PCard marker={PC.blue} title="Preferences" sub="Toggle a channel per category" pad={8}>
        <div style={{ padding: '0 8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 0 10px', borderBottom: `1px solid ${PC.border}` }}>
            <span style={{ flex: 1 }} />
            {chans.map((c) => <span key={c} style={{ width: 50, textAlign: 'center', fontWeight: 700, fontSize: 9, letterSpacing: '0.04em', textTransform: 'uppercase', color: PC.fg3, fontFamily: PC.body }}>{c}</span>)}
          </div>
          {cats.map(([name, sub], ci) => (
            <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 0', borderBottom: ci < cats.length - 1 ? `1px solid ${PC.border}` : 'none' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: PC.fg1, fontFamily: PC.body }}>{name}</div>
                <div style={{ fontSize: 11, color: PC.fg3, fontFamily: PC.body, marginTop: 1 }}>{sub}</div>
              </div>
              {chans.map((c, chi) => {
                const on = prefs[ci][chi];
                return (
                  <div key={c} style={{ width: 50, display: 'flex', justifyContent: 'center' }}>
                    <button onClick={() => toggle(ci, chi)} style={{ width: 26, height: 26, borderRadius: 7, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', background: on ? PC.blue : PC.input, border: `1px solid ${on ? PC.blue : PC.borderStrong}` }}>{on && <PIcon name="check" size={14} color="#fff" stroke={3} />}</button>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </PCard>
      <PBtn variant="primary" icon="check" full>Save Preferences</PBtn>
    </PScroll>
  );
}

/* ═════════ BILLING & PLAN ═════════ */
function MBilling() {
  const usage = [['Users', 6, 25, ''], ['Transactions · MTD', 4120, 100000, ''], ['Storage', 2.4, 50, ' GB']];
  const plans = [
    { name: 'Starter', price: '0', per: 'free', feats: ['1 workspace', '3 users', '500 entries/mo'], cur: false },
    { name: 'Business', price: '349', per: '/mo', feats: ['Unlimited entries', '25 users', 'All integrations'], cur: true },
    { name: 'Enterprise', price: 'Custom', per: '', feats: ['SSO & SAML', 'Dedicated support', 'Audit retention 10y'], cur: false },
  ];
  return (
    <PScroll>
      <PCard marker={PC.green} title="Current Plan" right={<PPill tone="success">Active</PPill>}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
          <span style={{ fontFamily: PC.display, fontWeight: 700, fontSize: 22, color: PC.fg1 }}>Business</span>
          <span style={{ fontFamily: PC.mono, fontSize: 14, color: PC.fg2 }}>349.00 SAR<span style={{ fontSize: 11, color: PC.fg3 }}>/mo</span></span>
        </div>
        <div style={{ fontFamily: PC.mono, fontSize: 11, color: PC.fg3, marginTop: -6 }}>Renews Jan 1, 2026</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {usage.map(([label, val, max, unit]) => {
            const pct = Math.min(100, Math.round((val / max) * 100));
            return (
              <div key={label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 5 }}>
                  <span style={{ fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: PC.fg3, fontFamily: PC.body }}>{label}</span>
                  <span style={{ fontFamily: PC.mono, color: PC.fg2 }}>{val > 100 ? val.toLocaleString() : val}{unit} / {max.toLocaleString()}</span>
                </div>
                <div style={{ height: 6, background: PC.input, borderRadius: 999, overflow: 'hidden' }}><div style={{ width: `${pct}%`, height: '100%', background: pct > 85 ? PC.orange : PC.blue, borderRadius: 999 }} /></div>
              </div>
            );
          })}
        </div>
      </PCard>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {plans.map((p) => (
          <div key={p.name} style={{ background: PC.surface, border: `1px solid ${p.cur ? PC.blue : PC.border}`, borderRadius: 12, padding: 18, display: 'flex', flexDirection: 'column', gap: 14, position: 'relative' }}>
            {p.cur && <span style={{ position: 'absolute', top: 16, right: 16, fontSize: 8, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: PC.blue, background: `${PC.blue}24`, borderRadius: 4, padding: '2px 6px', fontFamily: PC.body }}>Current</span>}
            <div style={{ fontSize: 15, fontWeight: 700, color: PC.fg1, fontFamily: PC.body }}>{p.name}</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
              <span style={{ fontFamily: PC.mono, fontSize: 26, fontWeight: 700, color: PC.fg1, letterSpacing: '-0.02em' }}>{p.price}</span>
              <span style={{ fontSize: 12, color: PC.fg3, fontFamily: PC.body }}>{p.per}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {p.feats.map((f) => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, color: PC.fg2, fontFamily: PC.body }}>
                  <PIcon name="check" size={14} color={PC.green} />{f}
                </div>
              ))}
            </div>
            <PBtn variant={p.cur ? 'secondary' : 'primary'} full>{p.cur ? 'Current Plan' : (p.name === 'Enterprise' ? 'Contact Sales' : 'Upgrade')}</PBtn>
          </div>
        ))}
      </div>
      <PCard marker={PC.orange} title="Recent Invoices" pad={8}>
        <div style={{ padding: '0 8px' }}>
          {[['INV-GL-2025-012', 'Dec 01', '349.00'], ['INV-GL-2025-011', 'Nov 01', '349.00'], ['INV-GL-2025-010', 'Oct 01', '349.00']].map(([ref, d, amt], i, a) => (
            <div key={ref} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 0', borderBottom: i < a.length - 1 ? `1px solid ${PC.border}` : 'none' }}>
              <span style={{ flex: 1, fontFamily: PC.mono, fontSize: 12, color: PC.blue }}>{ref}</span>
              <span style={{ fontSize: 11, color: PC.fg3 }}>{d}</span>
              <span style={{ fontFamily: PC.mono, fontSize: 12.5, fontWeight: 600, color: PC.fg1 }}>{amt}</span>
              <PPill tone="success">Paid</PPill>
            </div>
          ))}
        </div>
      </PCard>
    </PScroll>
  );
}

/* ═════════ BACKUP & EXPORT ═════════ */
function MBackup() {
  const [auto, setAuto] = usePState(true);
  const [scope, setScope] = usePState({ Ledger: true, Inventory: true, Contacts: true, Documents: false });
  return (
    <PScroll>
      <PCard marker={PC.green} title="Automatic Backups" right={<PPill tone="success">Healthy</PPill>}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <div>
            <div style={{ fontSize: 13.5, fontWeight: 600, color: PC.fg1, fontFamily: PC.body }}>Daily encrypted snapshot</div>
            <div style={{ fontFamily: PC.mono, fontSize: 11, color: PC.fg3, marginTop: 3 }}>Last · Dec 19 03:00 · 248 MB</div>
          </div>
          <PToggle on={auto} onClick={() => setAuto(!auto)} />
        </div>
      </PCard>
      <PSection icon="download" title="Manual Export" sub="Download a portable copy" marker={PC.blue}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 10, letterSpacing: '0.05em', textTransform: 'uppercase', color: PC.fg2, marginBottom: 7, fontFamily: PC.body }}>Data Scope</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {Object.keys(scope).map((k) => (
              <button key={k} onClick={() => setScope((s) => ({ ...s, [k]: !s[k] }))} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '11px 12px', borderRadius: 8, cursor: 'pointer', background: scope[k] ? `${PC.blue}1F` : PC.input, border: `1px solid ${scope[k] ? PC.blue : PC.border}`, textAlign: 'left' }}>
                <span style={{ width: 18, height: 18, borderRadius: 4, border: `1px solid ${scope[k] ? PC.blue : PC.borderStrong}`, background: scope[k] ? PC.blue : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{scope[k] && <PIcon name="check" size={12} color="#fff" stroke={3} />}</span>
                <span style={{ fontSize: 13, color: PC.fg1, fontFamily: PC.body }}>{k}</span>
              </button>
            ))}
          </div>
        </div>
        <PSelect label="Format" value="CSV (zipped)" options={['CSV (zipped)', 'JSON', 'Excel (XLSX)']} />
        <PBtn variant="primary" icon="download" full>Generate Export</PBtn>
      </PSection>
      <PCard marker={PC.orange} title="Export History" pad={8}>
        <div style={{ padding: '0 8px' }}>
          {[['full-export-2025-12-15.zip', '248 MB · Dec 15'], ['ledger-q4-2025.csv', '12 MB · Dec 02'], ['contacts-2025-11.json', '1.1 MB · Nov 20']].map(([f, meta], i, a) => (
            <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 0', borderBottom: i < a.length - 1 ? `1px solid ${PC.border}` : 'none' }}>
              <span style={{ color: PC.blue, display: 'flex', flexShrink: 0 }}><PIcon name="doc" size={16} /></span>
              <span style={{ flex: 1, fontFamily: PC.mono, fontSize: 11.5, color: PC.fg1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f}</span>
              <span style={{ fontFamily: PC.mono, fontSize: 10.5, color: PC.fg3, flexShrink: 0 }}>{meta}</span>
              <span style={{ color: PC.fg3, display: 'flex', flexShrink: 0 }}><PIcon name="download" size={15} /></span>
            </div>
          ))}
        </div>
      </PCard>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '14px 16px', background: `${PC.red}0F`, border: `1px solid ${PC.red}4D`, borderRadius: 10 }}>
        <div><div style={{ fontSize: 13, fontWeight: 600, color: PC.fg1, fontFamily: PC.body }}>Delete workspace</div><div style={{ fontSize: 11, color: PC.fg3, fontFamily: PC.body, marginTop: 2 }}>30-day grace period.</div></div>
        <PBtn variant="danger" icon="trash">Delete</PBtn>
      </div>
    </PScroll>
  );
}

/* ───────── register ───────── */
Object.assign(window.MScreens = window.MScreens || {}, {
  setIntegrations: MIntegrations,
  setWebhooks: MWebhooks,
  setApiKeys: MApiKeys,
  setNotifications: MNotifications,
  setBilling: MBilling,
  setBackup: MBackup,
});
