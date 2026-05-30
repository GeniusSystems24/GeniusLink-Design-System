/* global React, Card, SectionHeader, Field, Textarea, Button, Icon, StatusPill, LockedField, IconBtn, Breadcrumb */
// GeniusLink — Settings (Phase 2): Team & Security + Tenant switching.
// RolesList · RoleEditor (View/Edit/Delete matrix) · AuditLog (date filter) ·
// TenantManagement + TenantSwitcher overlay · Session-expiry banner + re-auth modal.

const SL = () => window._settings.SettingsLayout;

function TAvatar({ name, size = 36, tone = '#4A7CFF' }) {
  const initials = name.split(' ').map((w) => w[0]).slice(0, 2).join('');
  return <div style={{ width: size, height: size, borderRadius: 999, flexShrink: 0, background: `${tone}1F`, color: tone, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--gl-font-display)', fontWeight: 700, fontSize: size * 0.36 }}>{initials}</div>;
}

/* ═════════ ROLES LIST — 3-col cards ═════════ */
const ROLES = [
  { id: 'admin', name: 'Administrator', tone: '#4A7CFF', members: 1, desc: 'Full access to every module and settings.', preview: [['Accounts', 'Full'], ['Banking', 'Full'], ['Users', 'Full'], ['Settings', 'Full']] },
  { id: 'controller', name: 'Controller', tone: '#1DB88A', members: 1, desc: 'Approves postings and manages the ledger.', preview: [['Ledger', 'Full'], ['Banking', 'Full'], ['Reports', 'Full'], ['Users', 'View']] },
  { id: 'accountant', name: 'Accountant', tone: '#F97316', members: 2, desc: 'Creates and edits day-to-day transactions.', preview: [['Accounts', 'Edit'], ['Ledger', 'Edit'], ['Banking', 'Edit'], ['Reports', 'View']] },
  { id: 'manager', name: 'Store Manager', tone: '#8D90A0', members: 1, desc: 'Manages inventory and store operations.', preview: [['Stores', 'Edit'], ['Inventory', 'Edit'], ['Accounts', 'View'], ['Banking', '—']] },
  { id: 'viewer', name: 'Viewer', tone: '#8D90A0', members: 1, desc: 'Read-only access to reports and records.', preview: [['Reports', 'View'], ['Accounts', 'View'], ['Ledger', 'View'], ['Users', '—']] },
];
const LVL_TONE = { Full: '#1DB88A', Edit: '#4A7CFF', View: '#8D90A0', '—': null };

function RolesListScreen({ onNavigate, onOpen }) {
  const Layout = SL();
  return (
    <Layout active="setRoles" onNavigate={onNavigate} title="Roles & Permissions" sub="Reusable access profiles assigned to members"
      actions={<Button variant="primary" icon="plus" onClick={() => onNavigate('roleEditor')}>New Role</Button>}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {ROLES.map((r) => (
          <div key={r.id} style={{ background: 'var(--gl-surface)', border: '1px solid var(--gl-border)', borderRadius: 8, padding: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 8, height: 8, borderRadius: 999, background: r.tone }} />
              <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--gl-fg-1)' }}>{r.name}</span>
              <span style={{ marginLeft: 'auto', fontFamily: 'var(--gl-font-mono)', fontSize: 11, color: 'var(--gl-fg-3)' }}>{r.members} member{r.members === 1 ? '' : 's'}</span>
            </div>
            <div style={{ fontSize: 12.5, color: 'var(--gl-fg-3)', lineHeight: 1.5, minHeight: 36 }}>{r.desc}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, paddingTop: 12, borderTop: '1px solid var(--gl-border)' }}>
              {r.preview.map(([mod, lvl]) => (
                <div key={mod} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12 }}>
                  <span style={{ color: 'var(--gl-fg-2)' }}>{mod}</span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontWeight: 700, fontSize: 10, letterSpacing: '0.04em', textTransform: 'uppercase', color: LVL_TONE[lvl] || 'var(--gl-fg-4)' }}>
                    {LVL_TONE[lvl] && <span style={{ width: 6, height: 6, borderRadius: 999, background: LVL_TONE[lvl] }} />}{lvl}
                  </span>
                </div>
              ))}
            </div>
            <Button variant="secondary" icon="edit" onClick={() => onNavigate('roleEditor')}>Edit Role</Button>
          </div>
        ))}
      </div>
    </Layout>
  );
}

/* ═════════ ROLE EDITOR — View/Edit/Delete matrix ═════════ */
const MODULES = ['Accounts', 'Stores', 'Inventory', 'Banking', 'Ledger', 'Reports', 'Customers', 'Suppliers', 'Users', 'Settings'];
const DEFAULT_PERMS = () => {
  const seed = { Accounts: [1, 1, 0], Stores: [1, 1, 0], Inventory: [1, 1, 1], Banking: [1, 1, 0], Ledger: [1, 1, 0], Reports: [1, 0, 0], Customers: [1, 1, 0], Suppliers: [1, 1, 0], Users: [1, 0, 0], Settings: [0, 0, 0] };
  const o = {}; MODULES.forEach((m) => { o[m] = { view: !!seed[m][0], edit: !!seed[m][1], del: !!seed[m][2] }; }); return o;
};

function RoleEditorScreen({ onNavigate, onSave }) {
  const Layout = SL();
  const [perms, setPerms] = React.useState(DEFAULT_PERMS);
  const cols = ['view', 'edit', 'del'];
  const colLabel = { view: 'View', edit: 'Edit', del: 'Delete' };
  const toggle = (mod, col) => setPerms((p) => ({ ...p, [mod]: { ...p[mod], [col]: !p[mod][col] } }));
  const setRow = (mod, val) => setPerms((p) => ({ ...p, [mod]: { view: val, edit: val, del: val } }));
  const grid = '1.6fr repeat(3, 88px)';
  return (
    <Layout active="setRoles" onNavigate={onNavigate} title="Edit Role · Accountant" sub="Toggle the actions this role can perform per module"
      actions={<div style={{ display: 'flex', gap: 8 }}><Button variant="secondary" icon="back" onClick={() => onNavigate('setRoles')}>Back</Button><Button variant="primary" icon="check" onClick={onSave}>Save Role</Button></div>}>
      <Card>
        <SectionHeader title="Role Details" marker="blue" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <Field label="Role Name" value="Accountant" />
          <Field label="Members" value="2 assigned" />
        </div>
        <Textarea label="Description" rows={2} value="Creates and edits day-to-day transactions." />
      </Card>
      <Card padding={0}>
        <div style={{ padding: '20px 24px 0' }}>
          <SectionHeader title="Permission Matrix" subtitle="Click a cell to toggle · click the module to set the whole row" marker="green" />
        </div>
        <div style={{ padding: '16px 24px 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: grid, gap: 12, padding: '0 0 12px', borderBottom: '1px solid var(--gl-border)', fontWeight: 700, fontSize: 10, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--gl-fg-3)' }}>
            <span>Module</span>{cols.map((c) => <span key={c} style={{ textAlign: 'center' }}>{colLabel[c]}</span>)}
          </div>
          {MODULES.map((mod, i) => {
            const all = perms[mod].view && perms[mod].edit && perms[mod].del;
            return (
              <div key={mod} style={{ display: 'grid', gridTemplateColumns: grid, gap: 12, padding: '12px 0', alignItems: 'center', borderBottom: i < MODULES.length - 1 ? '1px solid var(--gl-border)' : 'none' }}>
                <button onClick={() => setRow(mod, !all)} style={{ background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: 'var(--gl-fg-1)', padding: 0 }}>{mod}</button>
                {cols.map((c) => {
                  const on = perms[mod][c];
                  const tone = c === 'del' ? '#EF4444' : (c === 'edit' ? '#4A7CFF' : '#1DB88A');
                  return (
                    <div key={c} style={{ display: 'flex', justifyContent: 'center' }}>
                      <button onClick={() => toggle(mod, c)} aria-pressed={on}
                        style={{ width: 26, height: 26, borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', background: on ? tone : 'var(--gl-input-bg)', border: `1px solid ${on ? tone : 'var(--gl-border-strong)'}`, color: '#fff', transition: 'all 120ms ease' }}>
                        {on && <Icon name="check" size={14} color="#fff" stroke={3} />}
                      </button>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </Card>
    </Layout>
  );
}

/* ═════════ AUDIT LOG — date filter + badges ═════════ */
const AUDIT = [
  { ts: '2025-12-19 10:14:02', day: 0, user: 'Layla A.', action: 'POST', entity: 'JV-2024-0226', ip: '10.4.22.18', tone: 'success' },
  { ts: '2025-12-18 11:02:55', day: 1, user: 'Layla A.', action: 'CREATE', entity: 'EXT-2024-0311', ip: '10.4.22.18', tone: 'info' },
  { ts: '2025-12-18 10:05:31', day: 1, user: 'Controller', action: 'APPROVE', entity: 'DEP-2024-0182', ip: '10.4.22.03', tone: 'success' },
  { ts: '2025-12-17 16:20:44', day: 2, user: 'Layla A.', action: 'EDIT', entity: 'Account 1200', ip: '10.4.22.18', tone: 'warning' },
  { ts: '2025-12-12 14:08:09', day: 7, user: 'Admin', action: 'VOID', entity: 'JV-2024-0150', ip: '10.4.22.01', tone: 'danger' },
  { ts: '2025-12-01 00:00:01', day: 18, user: 'System', action: 'LOCK', entity: 'Period Nov 2024', ip: 'internal', tone: 'neutral' },
  { ts: '2025-11-22 09:11:00', day: 27, user: 'Khalid S.', action: 'LOGIN', entity: 'Session', ip: '10.4.22.40', tone: 'neutral' },
];
function AuditLogScreen({ onNavigate }) {
  const Layout = SL();
  const [range, setRange] = React.useState('30 days');
  const [act, setAct] = React.useState('All');
  const [q, setQ] = React.useState('');
  const rangeDays = { 'Today': 0, '7 days': 7, '30 days': 30, 'All': 9999 }[range];
  const actions = ['All', 'POST', 'CREATE', 'APPROVE', 'EDIT', 'VOID', 'LOCK', 'LOGIN'];
  const visible = AUDIT.filter((l) => l.day <= rangeDays && (act === 'All' || l.action === act) && (!q || l.entity.toLowerCase().includes(q.toLowerCase()) || l.user.toLowerCase().includes(q.toLowerCase())));
  const grid = '190px 1fr 110px 1.4fr 1.1fr';
  return (
    <Layout active="setAudit" onNavigate={onNavigate} title="Audit Log" sub="Immutable activity trail · 7-year retention"
      actions={<Button variant="secondary" icon="download">Export</Button>}>
      <Card padding={20}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: 4, background: 'var(--gl-input-bg)', padding: 4, borderRadius: 6, border: '1px solid var(--gl-border)' }}>
            {['Today', '7 days', '30 days', 'All'].map((r) => (
              <button key={r} onClick={() => setRange(r)} style={{ padding: '6px 14px', borderRadius: 4, background: range === r ? 'var(--gl-surface)' : 'transparent', color: range === r ? 'var(--gl-fg-1)' : 'var(--gl-fg-3)', border: 'none', cursor: 'pointer', fontFamily: 'var(--gl-font-body)', fontWeight: 700, fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{r}</button>
            ))}
          </div>
          <div style={{ position: 'relative', flex: '0 0 280px' }}>
            <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--gl-fg-3)', display: 'flex', pointerEvents: 'none' }}><Icon name="search" size={14} /></div>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search entity or user…" style={{ width: '100%', height: 38, padding: '0 16px 0 40px', background: 'var(--gl-input-bg)', border: '1px solid var(--gl-border-strong)', borderRadius: 4, fontFamily: 'var(--gl-font-body)', fontSize: 13, color: 'var(--gl-fg-1)', outline: 'none', boxSizing: 'border-box' }} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {actions.map((a) => (
            <button key={a} onClick={() => setAct(a)} style={{ padding: '5px 11px', borderRadius: 999, cursor: 'pointer', fontSize: 10, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', fontFamily: 'var(--gl-font-body)', background: act === a ? 'rgba(74,124,255,0.14)' : 'transparent', border: `1px solid ${act === a ? '#4A7CFF' : 'var(--gl-border)'}`, color: act === a ? '#4A7CFF' : 'var(--gl-fg-3)' }}>{a}</button>
          ))}
        </div>
      </Card>
      <Card padding={0}>
        <div style={{ padding: '20px 24px 0' }}>
          <SectionHeader title={`${visible.length} Event${visible.length === 1 ? '' : 's'}`} subtitle={`${range} · ${act === 'All' ? 'all actions' : act}`} marker="orange" />
        </div>
        <div style={{ padding: '16px 24px 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: grid, gap: 12, padding: '0 0 12px', borderBottom: '1px solid var(--gl-border)', fontWeight: 700, fontSize: 10, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--gl-fg-3)' }}>
            <span>Timestamp</span><span>User</span><span>Action</span><span>Entity</span><span>IP Address</span>
          </div>
          {visible.map((l, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: grid, gap: 12, padding: '13px 0', alignItems: 'center', borderBottom: i < visible.length - 1 ? '1px solid var(--gl-border)' : 'none', fontSize: 13, color: 'var(--gl-fg-1)' }}>
              <span style={{ fontFamily: 'var(--gl-font-mono)', fontSize: 12, color: 'var(--gl-fg-2)' }}>{l.ts}</span>
              <span>{l.user}</span>
              <span><StatusPill tone={l.tone} size="sm">{l.action}</StatusPill></span>
              <span style={{ fontFamily: 'var(--gl-font-mono)', fontSize: 12, color: '#4A7CFF' }}>{l.entity}</span>
              <span style={{ fontFamily: 'var(--gl-font-mono)', fontSize: 12, color: 'var(--gl-fg-3)' }}>{l.ip}</span>
            </div>
          ))}
          {visible.length === 0 && <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--gl-fg-3)', fontSize: 13 }}>No events in this range.</div>}
        </div>
      </Card>
    </Layout>
  );
}

/* ═════════ TENANT MANAGEMENT ═════════ */
const TENANTS = [
  { id: 9, name: 'Al-Rashid Trading Co.', ar: 'شركة الراشد التجارية', role: 'Administrator', plan: 'Business', members: 6, current: true, tone: '#4A7CFF' },
  { id: 14, name: 'Najd Holdings', ar: 'نجد القابضة', role: 'Controller', plan: 'Enterprise', members: 28, current: false, tone: '#1DB88A' },
  { id: 22, name: 'Coastal Logistics', ar: 'الساحل للخدمات', role: 'Accountant', plan: 'Starter', members: 3, current: false, tone: '#F97316' },
];
function TenantManagement({ onNavigate }) {
  const Layout = SL();
  const [active, setActive] = React.useState(9);
  return (
    <Layout active="tenants" onNavigate={onNavigate} title="Workspaces" sub="Organizations you belong to"
      actions={<Button variant="primary" icon="plus">New Workspace</Button>}>
      {TENANTS.map((t) => {
        const isActive = t.id === active;
        return (
          <Card key={t.id} padding={20}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: `${t.tone}1F`, color: t.tone, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="building" size={24} /></div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--gl-fg-1)' }}>{t.name}</span>
                  {isActive && <StatusPill tone="success" size="sm">Current</StatusPill>}
                </div>
                <div style={{ display: 'flex', gap: 14, marginTop: 6, fontFamily: 'var(--gl-font-mono)', fontSize: 12, color: 'var(--gl-fg-3)' }}>
                  <span>Tenant {t.id}</span><span>·</span><span>{t.role}</span><span>·</span><span>{t.members} members</span>
                </div>
              </div>
              <StatusPill tone={t.plan === 'Enterprise' ? 'info' : (t.plan === 'Business' ? 'success' : 'neutral')}>{t.plan}</StatusPill>
              {isActive ? <Button variant="secondary" icon="settings" onClick={() => onNavigate('setCompany')}>Manage</Button>
                : <Button variant="primary" icon="switch2" onClick={() => setActive(t.id)}>Switch</Button>}
            </div>
          </Card>
        );
      })}
    </Layout>
  );
}

/* ═════════ TENANT SWITCHER overlay (for sidebar chip) ═════════ */
function TenantSwitcher({ onClose, onNavigate, currentId, onSwitch }) {
  const [q, setQ] = React.useState('');
  const list = TENANTS.filter((t) => !q || t.name.toLowerCase().includes(q.toLowerCase()));
  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 90 }} />
      <div style={{ position: 'absolute', top: 64, left: 16, width: 300, zIndex: 91, background: 'var(--gl-surface)', border: '1px solid var(--gl-border-strong)', borderRadius: 10, boxShadow: '0 18px 48px -12px rgba(0,0,0,0.5)', overflow: 'hidden' }}>
        <div style={{ padding: 12, borderBottom: '1px solid var(--gl-border)' }}>
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--gl-fg-3)', display: 'flex', pointerEvents: 'none' }}><Icon name="search" size={13} /></div>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Find workspace…" autoFocus style={{ width: '100%', height: 34, padding: '0 12px 0 34px', background: 'var(--gl-input-bg)', border: '1px solid var(--gl-border-strong)', borderRadius: 6, fontFamily: 'var(--gl-font-body)', fontSize: 13, color: 'var(--gl-fg-1)', outline: 'none', boxSizing: 'border-box' }} />
          </div>
        </div>
        <div style={{ maxHeight: 280, overflow: 'auto', padding: 6 }}>
          {list.map((t) => {
            const on = t.id === currentId;
            return (
              <button key={t.id} onClick={() => { onSwitch(t.id); onClose(); }} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '9px 10px', borderRadius: 6, border: 'none', background: on ? 'rgba(74,124,255,0.12)' : 'transparent', cursor: 'pointer', textAlign: 'left' }}>
                <div style={{ width: 30, height: 30, borderRadius: 8, background: `${t.tone}1F`, color: t.tone, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Icon name="building" size={15} /></div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--gl-fg-1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.name}</div>
                  <div style={{ fontFamily: 'var(--gl-font-mono)', fontSize: 10.5, color: 'var(--gl-fg-3)' }}>{t.role}</div>
                </div>
                {on && <Icon name="check" size={15} color="#4A7CFF" />}
              </button>
            );
          })}
        </div>
        <button onClick={() => { onClose(); onNavigate('tenants'); }} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px', borderTop: '1px solid var(--gl-border)', background: 'transparent', border: 'none', borderTopWidth: 1, cursor: 'pointer', color: 'var(--gl-fg-2)', fontFamily: 'var(--gl-font-body)', fontSize: 13, fontWeight: 600 }}>
          <Icon name="settings" size={14} /> Manage workspaces
        </button>
      </div>
    </>
  );
}

/* ═════════ SESSION-EXPIRY BANNER + RE-AUTH MODAL ═════════ */
function SessionExpiryBanner({ seconds = 90 }) {
  const [left, setLeft] = React.useState(seconds);
  const [reauth, setReauth] = React.useState(false);
  const [dismissed, setDismissed] = React.useState(false);
  React.useEffect(() => {
    if (reauth || dismissed) return;
    const t = setInterval(() => setLeft((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [reauth, dismissed]);
  const mm = String(Math.floor(left / 60)).padStart(2, '0');
  const ss = String(left % 60).padStart(2, '0');
  const urgent = left <= 30;
  if (dismissed) return null;
  return (
    <>
      <div style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', zIndex: 120, width: 'min(560px, calc(100% - 48px))', display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', background: 'var(--gl-surface)', border: `1px solid ${urgent ? '#EF4444' : 'var(--gl-border-strong)'}`, borderLeft: `3px solid ${urgent ? '#EF4444' : '#F97316'}`, borderRadius: 8, boxShadow: '0 18px 48px -12px rgba(0,0,0,0.5)' }}>
        <span style={{ color: urgent ? '#EF4444' : '#F97316', display: 'flex' }}><Icon name="clock" size={18} /></span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--gl-fg-1)' }}>Your session expires soon</div>
          <div style={{ fontSize: 12, color: 'var(--gl-fg-3)', marginTop: 2 }}>Re-authenticate to stay signed in · <span style={{ fontFamily: 'var(--gl-font-mono)', color: urgent ? '#EF4444' : 'var(--gl-fg-2)', fontWeight: 600 }}>{mm}:{ss}</span></div>
        </div>
        <Button variant="secondary" onClick={() => setDismissed(true)}>Dismiss</Button>
        <Button variant="primary" icon="lock" onClick={() => setReauth(true)}>Re-authenticate</Button>
      </div>
      {reauth && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 130, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }} onClick={() => setReauth(false)}>
          <div onClick={(e) => e.stopPropagation()} style={{ width: 380, background: 'var(--gl-surface)', border: '1px solid var(--gl-border-strong)', borderRadius: 12, padding: 28, boxShadow: '0 24px 64px -12px rgba(0,0,0,0.6)' }}>
            <div style={{ width: 44, height: 44, borderRadius: 999, background: 'rgba(74,124,255,0.12)', color: '#4A7CFF', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}><Icon name="lock" size={20} /></div>
            <h2 style={{ fontFamily: 'var(--gl-font-display)', fontWeight: 700, fontSize: 20, color: 'var(--gl-fg-1)', margin: 0 }}>Confirm it's you</h2>
            <div style={{ fontSize: 13, color: 'var(--gl-fg-3)', marginTop: 8, lineHeight: 1.5 }}>Enter your password to extend this session. Signed in as <strong style={{ color: 'var(--gl-fg-1)' }}>layla.a@geniuslink.sa</strong>.</div>
            <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <Field label="Password" type="password" placeholder="••••••••••" />
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <Button variant="secondary" onClick={() => setReauth(false)}>Cancel</Button>
                <Button variant="primary" icon="check" onClick={() => { setReauth(false); setDismissed(true); }}>Confirm</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

Object.assign(window, {
  RolesListScreen, RoleEditorScreen, AuditLogScreen,
  TenantManagement, TenantSwitcher, SessionExpiryBanner,
});
