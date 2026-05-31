/* global React */
// GeniusLink mobile — Settings Phase 2: Team & Security + Tenant switching.
// Roles list · Role Editor (View/Edit/Delete) · Tenant management + quick-switch sheet ·
// enriched User Details (2FA + sessions) · session-expiry banner + inline re-auth.

const MT = window._mob;
const { C: TC, MIcon: TIcon, Pill: TPill, MCard: TCard, MBtn: TBtn, Scroll: TScroll } = MT;
const { ISection: TSection } = window._minv;
const { Segmented: TSeg, TInput: TTInput } = window._mui;
const { useState: useTState, useEffect: useTEffect } = React;

const T_ROLES = [
  { id: 'admin', name: 'Administrator', tone: TC.blue, members: 1, desc: 'Full access to every module and settings.', preview: [['Accounts', 'Full'], ['Banking', 'Full'], ['Users', 'Full']] },
  { id: 'controller', name: 'Controller', tone: TC.green, members: 1, desc: 'Approves postings and manages the ledger.', preview: [['Ledger', 'Full'], ['Banking', 'Full'], ['Users', 'View']] },
  { id: 'accountant', name: 'Accountant', tone: TC.orange, members: 2, desc: 'Creates and edits day-to-day transactions.', preview: [['Accounts', 'Edit'], ['Ledger', 'Edit'], ['Reports', 'View']] },
  { id: 'manager', name: 'Store Manager', tone: TC.fg3, members: 1, desc: 'Manages inventory and store operations.', preview: [['Stores', 'Edit'], ['Inventory', 'Edit'], ['Banking', '—']] },
  { id: 'viewer', name: 'Viewer', tone: TC.fg3, members: 1, desc: 'Read-only access to reports and records.', preview: [['Reports', 'View'], ['Accounts', 'View'], ['Users', '—']] },
];
const T_LVL = { Full: TC.green, Edit: TC.blue, View: TC.fg3, '—': null };

/* ═════════ ROLES LIST ═════════ */
function MRolesList({ go }) {
  return (
    <TScroll>
      {T_ROLES.map((r) => (
        <TCard key={r.id}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ width: 8, height: 8, borderRadius: 999, background: r.tone }} />
            <span style={{ fontSize: 15, fontWeight: 700, color: TC.fg1, fontFamily: TC.body }}>{r.name}</span>
            <span style={{ marginLeft: 'auto', fontFamily: TC.mono, fontSize: 11, color: TC.fg3 }}>{r.members} member{r.members === 1 ? '' : 's'}</span>
          </div>
          <div style={{ fontSize: 12.5, color: TC.fg3, lineHeight: 1.5, fontFamily: TC.body }}>{r.desc}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, paddingTop: 10, borderTop: `1px solid ${TC.border}` }}>
            {r.preview.map(([mod, lvl]) => (
              <div key={mod} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12 }}>
                <span style={{ color: TC.fg2, fontFamily: TC.body }}>{mod}</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontWeight: 700, fontSize: 10, letterSpacing: '0.04em', textTransform: 'uppercase', color: T_LVL[lvl] || TC.fg4, fontFamily: TC.body }}>
                  {T_LVL[lvl] && <span style={{ width: 6, height: 6, borderRadius: 999, background: T_LVL[lvl] }} />}{lvl}
                </span>
              </div>
            ))}
          </div>
          <TBtn variant="secondary" icon="edit" full onClick={() => go('roleEditor')}>Edit Role</TBtn>
        </TCard>
      ))}
      <TBtn variant="primary" icon="plus" full onClick={() => go('roleEditor')}>New Role</TBtn>
    </TScroll>
  );
}

/* ═════════ ROLE EDITOR — View/Edit/Delete ═════════ */
const T_MODULES = ['Accounts', 'Stores', 'Inventory', 'Banking', 'Ledger', 'Reports', 'Customers', 'Suppliers', 'Users', 'Settings'];
function MRoleEditor() {
  const seed = { Accounts: [1, 1, 0], Stores: [1, 1, 0], Inventory: [1, 1, 1], Banking: [1, 1, 0], Ledger: [1, 1, 0], Reports: [1, 0, 0], Customers: [1, 1, 0], Suppliers: [1, 1, 0], Users: [1, 0, 0], Settings: [0, 0, 0] };
  const init = {}; T_MODULES.forEach((m) => { init[m] = { view: !!seed[m][0], edit: !!seed[m][1], del: !!seed[m][2] }; });
  const [perms, setPerms] = useTState(init);
  const cols = [['view', 'View', TC.green], ['edit', 'Edit', TC.blue], ['del', 'Delete', TC.red]];
  const toggle = (m, c) => setPerms((p) => ({ ...p, [m]: { ...p[m], [c]: !p[m][c] } }));
  return (
    <TScroll>
      <TCard marker={TC.blue} title="Accountant" sub="2 members assigned">
        <TTInput label="Role Name" defaultValue="Accountant" />
      </TCard>
      <TCard marker={TC.green} title="Permission Matrix" sub="Tap a cell to toggle access" pad={8}>
        <div style={{ padding: '0 8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 0 10px', borderBottom: `1px solid ${TC.border}` }}>
            <span style={{ flex: 1, fontWeight: 700, fontSize: 9.5, letterSpacing: '0.06em', textTransform: 'uppercase', color: TC.fg3, fontFamily: TC.body }}>Module</span>
            {cols.map(([k, label]) => <span key={k} style={{ width: 44, textAlign: 'center', fontWeight: 700, fontSize: 9, letterSpacing: '0.04em', textTransform: 'uppercase', color: TC.fg3, fontFamily: TC.body }}>{label}</span>)}
          </div>
          {T_MODULES.map((m, i) => (
            <div key={m} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 0', borderBottom: i < T_MODULES.length - 1 ? `1px solid ${TC.border}` : 'none' }}>
              <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: TC.fg1, fontFamily: TC.body }}>{m}</span>
              {cols.map(([k, , tone]) => {
                const on = perms[m][k];
                return (
                  <div key={k} style={{ width: 44, display: 'flex', justifyContent: 'center' }}>
                    <button onClick={() => toggle(m, k)} style={{ width: 28, height: 28, borderRadius: 7, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', background: on ? tone : TC.input, border: `1px solid ${on ? tone : TC.borderStrong}` }}>
                      {on && <TIcon name="check" size={15} color="#fff" stroke={3} />}
                    </button>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </TCard>
      <TBtn variant="primary" icon="check" full>Save Role</TBtn>
    </TScroll>
  );
}

/* ═════════ TENANT MANAGEMENT + quick switch ═════════ */
const T_TENANTS = [
  { id: 9, name: 'Al-Rashid Trading Co.', role: 'Administrator', plan: 'Business', members: 6, tone: TC.blue },
  { id: 14, name: 'Najd Holdings', role: 'Controller', plan: 'Enterprise', members: 28, tone: TC.green },
  { id: 22, name: 'Coastal Logistics', role: 'Accountant', plan: 'Starter', members: 3, tone: TC.orange },
];
function MTenantManagement() {
  const [active, setActive] = useTState(9);
  return (
    <TScroll>
      {T_TENANTS.map((t) => {
        const on = t.id === active;
        return (
          <TCard key={t.id}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: 11, background: `${t.tone}1F`, color: t.tone, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><TIcon name="building" size={22} /></div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 14.5, fontWeight: 700, color: TC.fg1, fontFamily: TC.body }}>{t.name}</span>
                  {on && <TPill tone="success">Current</TPill>}
                </div>
                <div style={{ fontFamily: TC.mono, fontSize: 11, color: TC.fg3, marginTop: 3 }}>Tenant {t.id} · {t.role} · {t.members} members</div>
              </div>
              <TPill tone={t.plan === 'Enterprise' ? 'info' : (t.plan === 'Business' ? 'success' : 'neutral')}>{t.plan}</TPill>
            </div>
            {on ? <TBtn variant="secondary" icon="settings" full>Manage Workspace</TBtn>
              : <TBtn variant="primary" icon="switch2" full onClick={() => setActive(t.id)}>Switch to this Workspace</TBtn>}
          </TCard>
        );
      })}
      <TBtn variant="primary" icon="plus" full>New Workspace</TBtn>
    </TScroll>
  );
}

/* ═════════ enriched USER DETAILS (override) ═════════ */
function MUserDetailFull() {
  const [twofa, setTwofa] = useTState(true);
  const activity = [['Posted JV-2024-0226', 'Dec 19, 10:14'], ['Created DEP-2024-0182', 'Dec 18, 09:42'], ['Edited account 1200', 'Dec 17, 16:20']];
  const sessions = [
    { dev: 'MacBook Pro · Chrome', meta: 'Riyadh · 10.4.22.18 · now', current: true },
    { dev: 'iPhone 15 · App', meta: 'Riyadh · 10.4.22.51 · 2h ago', current: false },
    { dev: 'Windows · Edge', meta: 'Jeddah · 94.12.8.140 · Yesterday', current: false },
  ];
  return (
    <TScroll>
      <TCard>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <div style={{ width: 56, height: 56, borderRadius: 999, background: `${TC.orange}1F`, color: TC.orange, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: TC.display, fontWeight: 700, fontSize: 20, flexShrink: 0 }}>LA</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 17, fontWeight: 700, color: TC.fg1, fontFamily: TC.body }}>Layla Ahmed</div>
            <div style={{ fontFamily: TC.mono, fontSize: 12, color: TC.fg3, marginTop: 3, overflow: 'hidden', textOverflow: 'ellipsis' }}>layla.a@geniuslink.sa</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, color: TC.fg2, fontFamily: TC.body }}><span style={{ width: 6, height: 6, borderRadius: 999, background: TC.orange }} /> Accountant</span>
              <TPill tone="success">Active</TPill>
            </div>
          </div>
        </div>
      </TCard>
      <TSection icon="user" title="Profile" marker={TC.blue}>
        <TTInput label="Full Name" defaultValue="Layla Ahmed" />
        <TTInput label="Work Email" defaultValue="layla.a@geniuslink.sa" mono />
        <TTInput label="Employee ID" defaultValue="EMP-0012" mono />
      </TSection>
      <TCard marker={TC.green} title="Security">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <div>
            <div style={{ fontSize: 13.5, fontWeight: 600, color: TC.fg1, fontFamily: TC.body }}>Two-Factor Authentication</div>
            <div style={{ fontSize: 11.5, color: TC.fg3, fontFamily: TC.body, marginTop: 2 }}>{twofa ? 'Enabled · Authenticator app' : 'Disabled'}</div>
          </div>
          <button onClick={() => setTwofa(!twofa)} style={{ width: 42, height: 24, borderRadius: 999, background: twofa ? TC.green : TC.input, border: `1px solid ${twofa ? TC.green : TC.borderStrong}`, position: 'relative', cursor: 'pointer', padding: 0, flexShrink: 0 }}>
            <span style={{ position: 'absolute', top: 2, left: twofa ? 20 : 2, width: 18, height: 18, borderRadius: 999, background: '#fff', transition: 'left 150ms ease' }} />
          </button>
        </div>
      </TCard>
      <TCard marker={TC.orange} title="Active Sessions" sub="Devices currently signed in" pad={8}>
        <div style={{ padding: '0 8px' }}>
          {sessions.map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: i < sessions.length - 1 ? `1px solid ${TC.border}` : 'none' }}>
              <span style={{ color: TC.fg3, display: 'flex', flexShrink: 0 }}><TIcon name={s.current ? 'briefcase' : 'swap'} size={17} /></span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: TC.fg1, fontFamily: TC.body, display: 'flex', alignItems: 'center', gap: 7 }}>{s.dev}{s.current && <TPill tone="success">This</TPill>}</div>
                <div style={{ fontFamily: TC.mono, fontSize: 10.5, color: TC.fg3, marginTop: 2 }}>{s.meta}</div>
              </div>
              {!s.current && <span style={{ color: TC.red, fontSize: 11, fontWeight: 700, fontFamily: TC.body, cursor: 'pointer' }}>Revoke</span>}
            </div>
          ))}
        </div>
      </TCard>
      <TCard marker={TC.green} title="Recent Activity" pad={8}>
        <div style={{ padding: '0 8px' }}>
          {activity.map(([w, at], i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 0', borderBottom: i < activity.length - 1 ? `1px solid ${TC.border}` : 'none' }}>
              <span style={{ fontSize: 13, color: TC.fg1, fontFamily: TC.body }}>{w}</span>
              <span style={{ fontFamily: TC.mono, fontSize: 11, color: TC.fg3 }}>{at}</span>
            </div>
          ))}
        </div>
      </TCard>
      <TBtn variant="danger" icon="trash" full>Deactivate User</TBtn>
    </TScroll>
  );
}

/* ═════════ session-expiry banner + inline re-auth (wraps usersList) ═════════ */
function MSessionBanner() {
  const [left, setLeft] = useTState(90);
  const [reauth, setReauth] = useTState(false);
  const [dismissed, setDismissed] = useTState(false);
  useTEffect(() => {
    if (reauth || dismissed) return;
    const t = setInterval(() => setLeft((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [reauth, dismissed]);
  if (dismissed) return null;
  const mm = String(Math.floor(left / 60)).padStart(2, '0');
  const ss = String(left % 60).padStart(2, '0');
  const urgent = left <= 30;
  return (
    <div style={{ position: 'sticky', bottom: 8, margin: '4px 0 0', padding: 14, background: TC.surface, border: `1px solid ${urgent ? TC.red : TC.borderStrong}`, borderLeft: `3px solid ${urgent ? TC.red : TC.orange}`, borderRadius: 10, boxShadow: '0 12px 28px -10px rgba(0,0,0,0.5)' }}>
      {!reauth ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ color: urgent ? TC.red : TC.orange, display: 'flex' }}><TIcon name="clock" size={18} /></span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: TC.fg1, fontFamily: TC.body }}>Session expires in <span style={{ fontFamily: TC.mono, color: urgent ? TC.red : TC.fg1 }}>{mm}:{ss}</span></div>
            <div style={{ fontSize: 11, color: TC.fg3, fontFamily: TC.body, marginTop: 1 }}>Re-authenticate to stay signed in</div>
          </div>
          <button onClick={() => setDismissed(true)} style={{ background: 'none', border: 'none', color: TC.fg3, cursor: 'pointer', fontSize: 12, fontFamily: TC.body }}>Dismiss</button>
          <TBtn variant="primary" icon="lock" onClick={() => setReauth(true)}>Renew</TBtn>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ color: TC.blue, display: 'flex' }}><TIcon name="lock" size={16} /></span>
            <span style={{ fontSize: 13, fontWeight: 600, color: TC.fg1, fontFamily: TC.body }}>Confirm your password</span>
          </div>
          <TTInput label="Password" type="password" placeholder="••••••••••" />
          <div style={{ display: 'flex', gap: 10 }}>
            <TBtn variant="secondary" full onClick={() => setReauth(false)}>Cancel</TBtn>
            <TBtn variant="primary" icon="check" full onClick={() => setDismissed(true)}>Confirm</TBtn>
          </div>
        </div>
      )}
    </div>
  );
}

/* wrap the existing users list to append the session banner */
const _origUsersList = (window.MScreens || {}).usersList;
function MUsersListWithBanner(props) {
  return (
    <div style={{ minHeight: '100%' }}>
      {_origUsersList ? React.createElement(_origUsersList, props) : null}
      <div style={{ padding: '0 16px 16px' }}><MSessionBanner /></div>
    </div>
  );
}

/* ───────── register (userDetail + usersList override the MobileUsers versions) ───────── */
Object.assign(window.MScreens = window.MScreens || {}, {
  rolesList: MRolesList,
  roleEditor: MRoleEditor,
  tenants: MTenantManagement,
  userDetail: MUserDetailFull,
  usersList: MUsersListWithBanner,
});
