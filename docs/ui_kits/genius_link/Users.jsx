/* global React, Page, Card, SectionHeader, Field, Textarea, Button, Icon, StatusPill, LockedField */
// Stage 6 — Users: List + Create + Details + Roles & Permissions

const USERS = [
  { id: 5,  name: 'Admin User',     ar: 'المدير',       email: 'admin@geniuslink.sa',    role: 'Administrator', active: 'Now',         status: 'active' },
  { id: 12, name: 'Layla Ahmed',    ar: 'ليلى أحمد',    email: 'layla.a@geniuslink.sa',  role: 'Accountant',    active: '8 min ago',   status: 'active' },
  { id: 3,  name: 'Controller',     ar: 'المراقب',      email: 'controller@geniuslink.sa', role: 'Controller',  active: '1 hr ago',    status: 'active' },
  { id: 21, name: 'Khalid Saleh',   ar: 'خالد صالح',    email: 'khalid.s@geniuslink.sa', role: 'Store Manager', active: 'Yesterday',   status: 'active' },
  { id: 33, name: 'Noura Faisal',   ar: 'نورة فيصل',    email: 'noura.f@geniuslink.sa',  role: 'Viewer',        active: '3 days ago',  status: 'inactive' },
  { id: 41, name: 'Omar Hassan',    ar: 'عمر حسن',      email: 'omar.h@geniuslink.sa',   role: 'Accountant',    active: 'Never',       status: 'pending' },
];

const ROLE_COLORS = {
  'Administrator': '#4A7CFF', 'Controller': '#1DB88A', 'Accountant': '#F97316',
  'Store Manager': '#8D90A0', 'Viewer': '#8D90A0',
};

function Avatar({ name, size = 36 }) {
  const initials = name.split(' ').map(w => w[0]).slice(0, 2).join('');
  return (
    <div style={{
      width: size, height: size, borderRadius: 999, flexShrink: 0,
      background: 'var(--gl-input-bg)', border: '1px solid var(--gl-border-strong)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'var(--gl-font-display)', fontWeight: 700, fontSize: size * 0.36, color: 'var(--gl-fg-2)',
    }}>{initials}</div>
  );
}

function UsersList({ onCreate, onOpen, onRoles }) {
  const grid = '2fr 1.8fr 1.1fr 1fr 90px 40px';
  return (
    <Page breadcrumb={['Administration', 'Users']} title="Users"
      titleRight={
        <div style={{ display: 'flex', gap: 8 }}>
          <Button variant="secondary" icon="settings" onClick={onRoles}>Roles &amp; Permissions</Button>
          <Button variant="primary" icon="plus" onClick={onCreate}>Invite User</Button>
        </div>
      }>
      <Card padding={0}>
        <div style={{ padding: '20px 24px 0' }}>
          <SectionHeader title={`${USERS.length} Users`} subtitle="Members of this tenant workspace" marker="blue" />
        </div>
        <div style={{ padding: '20px 24px 24px' }}>
          <div style={{
            display: 'grid', gridTemplateColumns: grid, gap: 12, padding: '0 0 12px',
            borderBottom: '1px solid var(--gl-border)',
            fontWeight: 700, fontSize: 10, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--gl-fg-3)',
          }}>
            <span>User</span><span>Email</span><span>Role</span><span>Last Active</span><span>Status</span><span></span>
          </div>
          {USERS.map((u) => <UserRow key={u.id} u={u} grid={grid} onClick={() => onOpen && onOpen(u)} />)}
        </div>
      </Card>
    </Page>
  );
}

function UserRow({ u, grid, onClick }) {
  const [hover, setHover] = React.useState(false);
  const toneMap = { active: 'success', inactive: 'neutral', pending: 'warning' };
  return (
    <div onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        display: 'grid', gridTemplateColumns: grid, gap: 12, padding: '12px 8px', margin: '0 -8px',
        alignItems: 'center', borderBottom: '1px solid var(--gl-border)',
        background: hover ? 'var(--gl-hover)' : 'transparent', borderRadius: 4, cursor: 'pointer',
        fontSize: 13, color: 'var(--gl-fg-1)', transition: 'background 150ms ease',
      }}>
      <span style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Avatar name={u.name} />
        <span>
          <div style={{ fontWeight: 600 }}>{u.name}</div>
          <div dir="rtl" style={{ fontFamily: 'var(--gl-font-arabic)', fontSize: 12, color: 'var(--gl-fg-3)', marginTop: 1 }}>{u.ar}</div>
        </span>
      </span>
      <span style={{ fontFamily: 'var(--gl-font-mono)', fontSize: 12, color: 'var(--gl-fg-2)' }}>{u.email}</span>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
        <span style={{ width: 6, height: 6, borderRadius: 999, background: ROLE_COLORS[u.role] }} />
        {u.role}
      </span>
      <span style={{ color: 'var(--gl-fg-2)', fontSize: 12 }}>{u.active}</span>
      <span><StatusPill tone={toneMap[u.status]} size="sm">{u.status}</StatusPill></span>
      <span style={{ justifySelf: 'end', color: 'var(--gl-fg-3)', display: 'flex' }}><Icon name="chevRight" size={14} /></span>
    </div>
  );
}

function CreateUser({ onCancel, onCreate }) {
  const [name, setName] = React.useState({ en: '', ar: '' });
  return (
    <Page breadcrumb={['Administration', 'Users', 'Invite']} title="Invite User">
      <Card>
        <SectionHeader title="Identity" subtitle="The new member's name and contact" marker="blue" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 24 }}>
          <Field label="Name English" required placeholder="e.g. Omar Hassan" value={name.en} onChange={(v) => setName({ ...name, en: v })} />
          <Field label="الاسم بالعربية" placeholder="مثال: عمر حسن" dir="rtl" value={name.ar} onChange={(v) => setName({ ...name, ar: v })} />
          <Field label="Work Email" required placeholder="name@geniuslink.sa" type="email" />
          <Field label="Employee ID" placeholder="Optional" mono />
        </div>
      </Card>

      <Card>
        <SectionHeader title="Access" subtitle="Role determines default permissions" marker="green" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 24 }}>
          <window._cfgShared.CurSelect label="Role" value="Accountant" options={['Administrator', 'Controller', 'Accountant', 'Store Manager', 'Viewer']} />
          <window._cfgShared.CurSelect label="Default Store" value="All Stores" options={['All Stores', 'Downtown Central', 'King Fahd Warehouse', 'Jeddah Showroom']} />
        </div>
        <div style={{ display: 'flex', gap: 12, padding: '14px 16px', background: 'rgba(74,124,255,0.08)', border: '1px solid rgba(74,124,255,0.25)', borderRadius: 4, fontSize: 12, color: 'var(--gl-fg-2)', lineHeight: 1.5 }}>
          <span style={{ color: '#4A7CFF', flexShrink: 0 }}><Icon name="info" size={14} /></span>
          <span>An invitation email with a single-use setup link will be sent. The account stays <strong>Pending</strong> until the user sets a password.</span>
        </div>
      </Card>

      <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
        <Button variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button variant="primary" icon="check" onClick={onCreate}>Send Invitation</Button>
      </div>
    </Page>
  );
}

function UserDetails({ onBack, onEdit, onDelete }) {
  const activity = [
    { what: 'Posted JV-2024-0226', at: 'Dec 19, 10:14' },
    { what: 'Created DEP-2024-0182', at: 'Dec 18, 09:42' },
    { what: 'Edited account 1200', at: 'Dec 17, 16:20' },
    { what: 'Signed in', at: 'Dec 17, 08:55' },
  ];
  return (
    <Page breadcrumb={['Administration', 'Users', 'Profile']} title="Layla Ahmed" titleArabic="ليلى أحمد"
      titleRight={
        <div style={{ display: 'flex', gap: 8 }}>
          <Button variant="secondary" icon="edit" onClick={onEdit}>Edit</Button>
          <Button variant="danger" icon="trash" onClick={onDelete}>Deactivate</Button>
        </div>
      }>
      <Card>
        <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
          <Avatar name="Layla Ahmed" size={64} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--gl-fg-1)' }}>Layla Ahmed</div>
            <div style={{ fontFamily: 'var(--gl-font-mono)', fontSize: 13, color: 'var(--gl-fg-3)', marginTop: 4 }}>layla.a@geniuslink.sa</div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--gl-fg-1)' }}>
              <span style={{ width: 6, height: 6, borderRadius: 999, background: '#F97316' }} /> Accountant
            </span>
            <StatusPill tone="success">Active</StatusPill>
          </div>
        </div>
      </Card>

      <Card>
        <SectionHeader title="Account Information" marker="blue" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 24, rowGap: 20 }}>
          <LockedField label="User ID" value="12" mono />
          <LockedField label="Role" value="Accountant" />
          <LockedField label="Default Store" value="All Stores" />
          <LockedField label="Two-Factor Auth" value="Enabled" />
          <LockedField label="Joined" value="Apr 12, 2024" />
          <LockedField label="Last Sign-In" value="Dec 19, 2025 08:55" />
        </div>
      </Card>

      <Card>
        <SectionHeader title="Active Sessions" subtitle="Devices currently signed in" marker="orange"
                       right={<Button variant="secondary" icon="lock">Revoke all</Button>} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { dev: 'MacBook Pro · Chrome', loc: 'Riyadh, SA', ip: '10.4.22.18', when: 'Active now', current: true },
            { dev: 'iPhone 15 · GeniusLink App', loc: 'Riyadh, SA', ip: '10.4.22.51', when: '2 hours ago', current: false },
            { dev: 'Windows · Edge', loc: 'Jeddah, SA', ip: '94.12.8.140', when: 'Yesterday', current: false },
          ].map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 14px', background: 'var(--gl-bg)', border: '1px solid var(--gl-border)', borderRadius: 6 }}>
              <span style={{ color: 'var(--gl-fg-3)', display: 'flex' }}><Icon name={s.current ? 'briefcase' : 'compass'} size={18} /></span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--gl-fg-1)', display: 'flex', alignItems: 'center', gap: 8 }}>{s.dev}{s.current && <StatusPill tone="success" size="sm">This device</StatusPill>}</div>
                <div style={{ fontFamily: 'var(--gl-font-mono)', fontSize: 11, color: 'var(--gl-fg-3)', marginTop: 3 }}>{s.loc} · {s.ip} · {s.when}</div>
              </div>
              {!s.current && <Button variant="danger" icon="trash">Revoke</Button>}
            </div>
          ))}
        </div>
      </Card>

      <Card padding={0}>
        <div style={{ padding: '20px 24px 0' }}>
          <SectionHeader title="Recent Activity" subtitle="Latest actions in the audit log" marker="green" />
        </div>
        <div style={{ padding: '8px 24px 24px' }}>
          {activity.map((a, i) => (
            <div key={i} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '14px 0', borderBottom: i < activity.length - 1 ? '1px solid var(--gl-border)' : 'none',
            }}>
              <span style={{ fontSize: 13, color: 'var(--gl-fg-1)' }}>{a.what}</span>
              <span style={{ fontFamily: 'var(--gl-font-mono)', fontSize: 12, color: 'var(--gl-fg-3)' }}>{a.at}</span>
            </div>
          ))}
        </div>
      </Card>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Button variant="secondary" icon="back" onClick={onBack}>Back to Users</Button>
      </div>
    </Page>
  );
}

function RolesPermissions({ onBack, onSave }) {
  const modules = ['Accounts', 'Stores', 'Inventory', 'Banking', 'Ledger', 'Reports', 'Users'];
  const roles = ['Admin', 'Controller', 'Accountant', 'Manager', 'Viewer'];
  // permission level per [module][role]: full, edit, view, none
  const matrix = {
    Accounts:  ['full', 'edit', 'edit', 'view', 'view'],
    Stores:    ['full', 'edit', 'view', 'edit', 'view'],
    Inventory: ['full', 'edit', 'edit', 'edit', 'view'],
    Banking:   ['full', 'full', 'edit', 'none', 'none'],
    Ledger:    ['full', 'full', 'edit', 'view', 'view'],
    Reports:   ['full', 'full', 'view', 'view', 'view'],
    Users:     ['full', 'view', 'none', 'none', 'none'],
  };
  const dot = { full: '#1DB88A', edit: '#4A7CFF', view: '#8D90A0', none: 'transparent' };
  const lbl = { full: 'Full', edit: 'Edit', view: 'View', none: '—' };
  const grid = `1.4fr repeat(${roles.length}, 1fr)`;

  return (
    <Page breadcrumb={['Administration', 'Users', 'Roles']} title="Roles & Permissions">
      <Card padding={20}>
        <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontWeight: 700, fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--gl-fg-3)' }}>Legend</span>
          {[['full', 'Full access'], ['edit', 'Create & edit'], ['view', 'View only'], ['none', 'No access']].map(([k, v]) => (
            <span key={k} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--gl-fg-2)' }}>
              <span style={{ width: 10, height: 10, borderRadius: 999, background: dot[k], border: k === 'none' ? '1px solid var(--gl-border-strong)' : 'none' }} />
              {v}
            </span>
          ))}
        </div>
      </Card>

      <Card padding={0}>
        <div style={{ padding: '20px 24px 0' }}>
          <SectionHeader title="Permission Matrix" subtitle="Module access per role · click a cell to cycle level" marker="blue" />
        </div>
        <div style={{ padding: '16px 24px 24px' }}>
          <div style={{
            display: 'grid', gridTemplateColumns: grid, gap: 8, padding: '0 0 14px',
            borderBottom: '1px solid var(--gl-border)',
            fontWeight: 700, fontSize: 10, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--gl-fg-3)',
          }}>
            <span>Module</span>
            {roles.map((r) => <span key={r} style={{ textAlign: 'center' }}>{r}</span>)}
          </div>
          {modules.map((m, mi) => (
            <div key={m} style={{
              display: 'grid', gridTemplateColumns: grid, gap: 8, padding: '12px 0', alignItems: 'center',
              borderBottom: mi < modules.length - 1 ? '1px solid var(--gl-border)' : 'none',
            }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--gl-fg-1)' }}>{m}</span>
              {matrix[m].map((lvl, ri) => (
                <div key={ri} style={{ display: 'flex', justifyContent: 'center' }}>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    padding: '4px 10px', borderRadius: 12, minWidth: 56, justifyContent: 'center',
                    background: lvl === 'none' ? 'transparent' : `${dot[lvl]}22`,
                    border: lvl === 'none' ? '1px solid var(--gl-border)' : 'none',
                    fontSize: 10, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase',
                    color: lvl === 'none' ? 'var(--gl-fg-4)' : dot[lvl],
                  }}>{lbl[lvl]}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </Card>

      <div style={{ display: 'flex', gap: 12, justifyContent: 'space-between' }}>
        <Button variant="secondary" icon="back" onClick={onBack}>Back to Users</Button>
        <Button variant="primary" icon="check" onClick={onSave}>Save Permissions</Button>
      </div>
    </Page>
  );
}

window.UsersList = UsersList;
window.CreateUser = CreateUser;
window.UserDetails = UserDetails;
window.RolesPermissions = RolesPermissions;
