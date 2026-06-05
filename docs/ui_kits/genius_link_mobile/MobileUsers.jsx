/* global React */
// GeniusLink mobile — V3 Stage E · Users & Authentication.
// Interactive: real form inputs, live user search/role filter, stateful forgot-password
// success, and a tappable permission matrix that cycles access levels.
// Mirrors desktop Users.jsx + Auth.jsx.

const MU = window._mob;
const { C: EC, MIcon: EIcon, Pill: EPill, MCard: ECard, MBtn: EBtn, Scroll: EScroll } = MU;
const { ISection: ESection } = window._minv;
const { TInput: ETInput, TPassword: ETPass, TSelect: ETSelect, TCheckbox: ECheck, Segmented: ESeg, SearchInput: ESearch, Avatar: EAvatar } = window._mui;
const { useState: useEState } = React;

/* ═════════ AUTH — Sign Up (full screen) ═════════ */
function MSignUp({ onLogin, onBack }) {
  return (
    <div style={{ minHeight: '100%', background: EC.bg, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '64px 28px 40px', boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
        <img src="../../assets/logo-mark.png" style={{ width: 28, height: 28 }} alt="" />
        <span style={{ fontFamily: EC.display, fontWeight: 800, fontSize: 20, color: EC.fg1, letterSpacing: '-0.01em' }}>GeniusLink</span>
      </div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontWeight: 700, fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: EC.blue, marginBottom: 12, fontFamily: EC.body }}>Create Account</div>
        <h1 style={{ fontFamily: EC.display, fontWeight: 700, fontSize: 26, lineHeight: 1.25, letterSpacing: '-0.025em', color: EC.fg1, margin: 0 }}>Provision a workspace</h1>
        <div style={{ fontSize: 13, color: EC.fg3, marginTop: 8, fontFamily: EC.body }}>You'll be the workspace administrator.</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <ETInput label="Full Name" placeholder="e.g. Khalid Al-Rashid" required />
        <ETInput label="Work Email" placeholder="you@company.com" type="email" required />
        <ETInput label="Organization" placeholder="e.g. Al-Rashid Trading Co." required />
        <ETPass label="Password" required />
        <ECheck defaultChecked>I agree to the Terms of Service and Data Processing Agreement.</ECheck>
        <EBtn variant="primary" full onClick={onLogin}>Create Workspace</EBtn>
        <div style={{ textAlign: 'center', fontSize: 13, color: EC.fg3, fontFamily: EC.body }}>
          Already have an account? <span onClick={onBack} style={{ color: EC.blue, fontWeight: 600, cursor: 'pointer' }}>Sign in</span>
        </div>
      </div>
    </div>
  );
}

/* ═════════ AUTH — Forgot Password (full screen) ═════════ */
function MForgot({ onBack }) {
  const [sent, setSent] = useEState(false);
  const [email, setEmail] = useEState('');
  return (
    <div style={{ minHeight: '100%', background: EC.bg, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '64px 28px 40px', boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 40 }}>
        <img src="../../assets/logo-mark.png" style={{ width: 28, height: 28 }} alt="" />
        <span style={{ fontFamily: EC.display, fontWeight: 800, fontSize: 20, color: EC.fg1, letterSpacing: '-0.01em' }}>GeniusLink</span>
      </div>
      {!sent ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: EC.blue, marginBottom: 12, fontFamily: EC.body }}>Password Reset</div>
            <h1 style={{ fontFamily: EC.display, fontWeight: 700, fontSize: 26, lineHeight: 1.25, letterSpacing: '-0.025em', color: EC.fg1, margin: 0 }}>Forgot password?</h1>
            <div style={{ fontSize: 13, color: EC.fg3, marginTop: 8, fontFamily: EC.body }}>Enter the email tied to your account.</div>
          </div>
          <div style={{ height: 46, padding: '0 14px', background: EC.input, border: `1px solid ${EC.borderStrong}`, borderRadius: 8, display: 'flex', alignItems: 'center' }}>
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" type="email" style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontFamily: EC.body, fontSize: 14, color: EC.fg1 }} />
          </div>
          <EBtn variant="primary" full onClick={() => setSent(true)}>Send Reset Link</EBtn>
          <div style={{ textAlign: 'center', fontSize: 13, color: EC.blue, fontWeight: 600, fontFamily: EC.body, cursor: 'pointer' }} onClick={onBack}>Back to sign in</div>
        </div>
      ) : (
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 56, height: 56, borderRadius: 999, background: `${EC.green}1F`, border: `1px solid ${EC.green}66`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
            <EIcon name="check" size={24} color={EC.green} stroke={2} />
          </div>
          <h1 style={{ fontFamily: EC.display, fontWeight: 700, fontSize: 22, color: EC.fg1, margin: 0 }}>Check your inbox</h1>
          <div style={{ fontSize: 13, color: EC.fg3, marginTop: 12, lineHeight: 1.6, fontFamily: EC.body }}>A reset link was sent to<br /><strong style={{ color: EC.fg1, fontFamily: EC.mono }}>{email || 'you@company.com'}</strong>. It expires in 30 minutes.</div>
          <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <EBtn variant="secondary" full onClick={() => setSent(false)}>Use a different email</EBtn>
            <div style={{ textAlign: 'center', fontSize: 13, color: EC.blue, fontWeight: 600, fontFamily: EC.body, cursor: 'pointer' }} onClick={onBack}>Back to sign in</div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═════════ data ═════════ */
const USERS = [
  { id: 5, name: 'Admin User', ar: 'المدير', email: 'admin@geniuslink.sa', role: 'Administrator', active: 'Now', status: 'active' },
  { id: 12, name: 'Layla Ahmed', ar: 'ليلى أحمد', email: 'layla.a@geniuslink.sa', role: 'Accountant', active: '8 min ago', status: 'active' },
  { id: 3, name: 'Controller', ar: 'المراقب', email: 'controller@geniuslink.sa', role: 'Controller', active: '1 hr ago', status: 'active' },
  { id: 21, name: 'Khalid Saleh', ar: 'خالد صالح', email: 'khalid.s@geniuslink.sa', role: 'Store Manager', active: 'Yesterday', status: 'active' },
  { id: 33, name: 'Noura Faisal', ar: 'نورة فيصل', email: 'noura.f@geniuslink.sa', role: 'Viewer', active: '3 days ago', status: 'inactive' },
  { id: 41, name: 'Omar Hassan', ar: 'عمر حسن', email: 'omar.h@geniuslink.sa', role: 'Accountant', active: 'Never', status: 'pending' },
];
const ROLE_DOT = { Administrator: '#4A7CFF', Controller: '#1DB88A', Accountant: '#F97316', 'Store Manager': '#8D90A0', Viewer: '#8D90A0' };
const uTone = { active: 'success', inactive: 'neutral', pending: 'warning' };

/* ═════════ USERS LIST (live search + role filter) ═════════ */
function MUsersList({ go }) {
  const [q, setQ] = useEState('');
  const [role, setRole] = useEState('All');
  const roles = ['All', 'Administrator', 'Controller', 'Accountant', 'Store Manager', 'Viewer'];
  const visible = USERS.filter((u) => (role === 'All' || u.role === role) && (!q || u.name.toLowerCase().includes(q.toLowerCase()) || u.email.toLowerCase().includes(q.toLowerCase())));
  return (
    <EScroll>
      <ESearch placeholder="Search name or email…" value={q} onChange={setQ} />
      <ESeg options={roles} value={role} onChange={setRole} />
      <ECard pad={8}>
        {visible.map((u, i) => (
          <div key={u.id} onClick={() => go('userDetail')} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 8px', borderBottom: i < visible.length - 1 ? `1px solid ${EC.border}` : 'none', cursor: 'pointer' }}>
            <EAvatar name={u.name} size={38} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: EC.fg1, fontFamily: EC.body }}>{u.name}</div>
              <div style={{ fontFamily: EC.mono, fontSize: 11, color: EC.fg3, marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.email}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                <span style={{ width: 6, height: 6, borderRadius: 999, background: ROLE_DOT[u.role] }} />
                <span style={{ fontSize: 11, color: EC.fg3, fontFamily: EC.body }}>{u.role}</span>
              </div>
            </div>
            <EPill tone={uTone[u.status]}>{u.status}</EPill>
          </div>
        ))}
        {visible.length === 0 && <div style={{ padding: '36px 0', textAlign: 'center', color: EC.fg3, fontSize: 13, fontFamily: EC.body }}>No users match.</div>}
      </ECard>
    </EScroll>
  );
}

/* ═════════ USER DETAILS ═════════ */
function MUserDetails() {
  const activity = [['Posted JV-2024-0226', 'Dec 19, 10:14'], ['Created DEP-2024-0182', 'Dec 18, 09:42'], ['Edited account 1200', 'Dec 17, 16:20'], ['Signed in', 'Dec 17, 08:55']];
  return (
    <EScroll>
      <ECard>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <EAvatar name="Layla Ahmed" size={56} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 17, fontWeight: 700, color: EC.fg1, fontFamily: EC.body }}>Layla Ahmed</div>
            <div style={{ fontFamily: EC.mono, fontSize: 12, color: EC.fg3, marginTop: 3, overflow: 'hidden', textOverflow: 'ellipsis' }}>layla.a@geniuslink.sa</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, color: EC.fg2, fontFamily: EC.body }}><span style={{ width: 6, height: 6, borderRadius: 999, background: EC.orange }} /> Accountant</span>
              <EPill tone="success">Active</EPill>
            </div>
          </div>
        </div>
      </ECard>
      <ECard marker={EC.blue} title="Account Information">
        {[['User ID', '12', true], ['Role', 'Accountant'], ['Default Store', 'All Stores'], ['Two-Factor Auth', 'Enabled'], ['Joined', 'Apr 12, 2024'], ['Last Sign-In', 'Dec 19, 08:55']].map(([k, v, mono]) => (
          <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
            <span style={{ fontWeight: 700, fontSize: 10, letterSpacing: '0.05em', textTransform: 'uppercase', color: EC.fg3, fontFamily: EC.body }}>{k}</span>
            <span style={{ fontSize: 13, color: EC.fg1, fontFamily: mono ? EC.mono : EC.body }}>{v}</span>
          </div>
        ))}
      </ECard>
      <ECard marker={EC.green} title="Recent Activity" sub="Latest actions in the audit log" pad={8}>
        <div style={{ padding: '0 8px' }}>
          {activity.map(([w, at], i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: i < activity.length - 1 ? `1px solid ${EC.border}` : 'none' }}>
              <span style={{ fontSize: 13, color: EC.fg1, fontFamily: EC.body }}>{w}</span>
              <span style={{ fontFamily: EC.mono, fontSize: 11, color: EC.fg3 }}>{at}</span>
            </div>
          ))}
        </div>
      </ECard>
      <div style={{ display: 'flex', gap: 10 }}>
        <EBtn variant="secondary" icon="edit" full>Edit</EBtn>
        <EBtn variant="danger" icon="trash" full>Deactivate</EBtn>
      </div>
    </EScroll>
  );
}

/* ═════════ CREATE USER ═════════ */
function MCreateUser() {
  return (
    <EScroll>
      <ESection icon="user" title="Identity" sub="The new member's name and contact" marker={EC.blue}>
        <ETInput label="Name English" placeholder="e.g. Omar Hassan" required />
        <ETInput label="الاسم بالعربية" placeholder="مثال: عمر حسن" ar />
        <ETInput label="Work Email" placeholder="name@geniuslink.sa" type="email" required />
        <ETInput label="Employee ID" placeholder="Optional" mono />
      </ESection>
      <ESection icon="lock" title="Access" sub="Role determines default permissions" marker={EC.green}>
        <ETSelect label="Role" value="Accountant" options={['Administrator', 'Controller', 'Accountant', 'Store Manager', 'Viewer']} />
        <ETSelect label="Default Store" value="All Stores" options={['All Stores', 'Downtown Central', 'King Fahd Warehouse', 'Jeddah Showroom']} />
        <div style={{ display: 'flex', gap: 10, padding: '12px 14px', background: `${EC.blue}14`, border: `1px solid ${EC.blue}40`, borderRadius: 8, fontSize: 11.5, color: EC.fg2, lineHeight: 1.5, fontFamily: EC.body }}>
          <span style={{ color: EC.blue, flexShrink: 0, marginTop: 1 }}><EIcon name="info" size={14} /></span>
          <span>An invitation email with a single-use setup link will be sent. The account stays <strong>Pending</strong> until the user sets a password.</span>
        </div>
      </ESection>
      <div style={{ display: 'flex', gap: 10 }}>
        <EBtn variant="secondary" full>Cancel</EBtn>
        <EBtn variant="primary" icon="check" full>Send Invitation</EBtn>
      </div>
    </EScroll>
  );
}

/* ═════════ ROLES & PERMISSIONS (interactive cycling matrix) ═════════ */
const PERM_ORDER = ['none', 'view', 'edit', 'full'];
const PERM_META = { full: { c: '#1DB88A', l: 'Full' }, edit: { c: '#4A7CFF', l: 'Edit' }, view: { c: '#8D90A0', l: 'View' }, none: { c: null, l: '—' } };
function MRolesPermissions() {
  const modules = ['Accounts', 'Stores', 'Inventory', 'Banking', 'Ledger', 'Reports', 'Users'];
  const roles = ['Admin', 'Controller', 'Accountant', 'Manager', 'Viewer'];
  const initial = {
    Accounts: ['full', 'edit', 'edit', 'view', 'view'], Stores: ['full', 'edit', 'view', 'edit', 'view'],
    Inventory: ['full', 'edit', 'edit', 'edit', 'view'], Banking: ['full', 'full', 'edit', 'none', 'none'],
    Ledger: ['full', 'full', 'edit', 'view', 'view'], Reports: ['full', 'full', 'view', 'view', 'view'],
    Users: ['full', 'view', 'none', 'none', 'none'],
  };
  const [matrix, setMatrix] = useEState(initial);
  const [role, setRole] = useEState('Admin');
  const ri = roles.indexOf(role);
  const cycle = (mod) => setMatrix((m) => {
    const cur = m[mod][ri];
    const next = PERM_ORDER[(PERM_ORDER.indexOf(cur) + 1) % PERM_ORDER.length];
    const row = [...m[mod]]; row[ri] = next;
    return { ...m, [mod]: row };
  });
  return (
    <EScroll>
      <ECard marker={EC.blue} title="Select Role" sub="Tap a module's badge to cycle its access level">
        <ESeg options={roles} value={role} onChange={setRole} />
      </ECard>
      <ECard pad={8}>
        {modules.map((mod, i) => {
          const lvl = matrix[mod][ri];
          const meta = PERM_META[lvl];
          return (
            <div key={mod} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 8px', borderBottom: i < modules.length - 1 ? `1px solid ${EC.border}` : 'none' }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: EC.fg1, fontFamily: EC.body }}>{mod}</span>
              <span onClick={() => cycle(mod)} style={{ minWidth: 72, textAlign: 'center', padding: '7px 14px', borderRadius: 999, cursor: 'pointer', fontSize: 11, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', fontFamily: EC.body, background: meta.c ? `${meta.c}26` : 'transparent', border: meta.c ? 'none' : `1px solid ${EC.border}`, color: meta.c || EC.fg4, transition: 'all 120ms ease' }}>{meta.l}</span>
            </div>
          );
        })}
      </ECard>
      <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', padding: '4px 2px' }}>
        {Object.entries(PERM_META).map(([k, m]) => (
          <span key={k} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 11.5, color: EC.fg2, fontFamily: EC.body }}>
            <span style={{ width: 9, height: 9, borderRadius: 999, background: m.c || 'transparent', border: m.c ? 'none' : `1px solid ${EC.borderStrong}` }} />{m.l === '—' ? 'No access' : m.l}
          </span>
        ))}
      </div>
      <EBtn variant="primary" icon="check" full>Save Permissions</EBtn>
    </EScroll>
  );
}

/* ───────── register ───────── */
Object.assign(window.MScreens = window.MScreens || {}, {
  signup: MSignUp,
  forgot: MForgot,
  usersList: MUsersList,
  userDetail: MUserDetails,
  createUser: MCreateUser,
  rolesPermissions: MRolesPermissions,
});
