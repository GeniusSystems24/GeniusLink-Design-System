/* global React, Icon, Logo */
// ────────────────────────────────────────────────────────────────
// NavigationSidebar.jsx — the GeniusLink desktop sidebar, isolated.
//
// This is the SAME code that lives in app.jsx (Sidebar / NavItem /
// ThemeToggle / SidebarSearch) lifted into one module so it can be
// enhanced on its own bench (components-navigation-sidebar.html).
// The nav data below is a trimmed mock of SCREENS / SIDEBAR_NAV so
// the component renders standalone. When a change is approved here,
// port the component bodies back into app.jsx.
// ────────────────────────────────────────────────────────────────

// ── mock nav data (mirrors app.jsx SCREENS subset used by the sidebar) ──
const NAV_SCREENS = [
  { id: 'login',         label: 'Sign In',             icon: 'lock',      section: 'Auth' },
  { id: 'signup',        label: 'Sign Up',             icon: 'user',      section: 'Auth' },
  { id: 'forgot',        label: 'Forgot Password',     icon: 'lock',      section: 'Auth' },
  { id: 'dashboard',     label: 'Dashboard',           icon: 'briefcase', section: 'Overview' },
  { id: 'invDashboard',  label: 'Inventory Dashboard', icon: 'scanner',   section: 'Overview' },
  { id: 'accountsHub',   label: 'Accounts',            icon: 'ledger',    section: 'Modules' },
  { id: 'ledgerHub',     label: 'Ledger',              icon: 'ledger',    section: 'Modules' },
  { id: 'bankingHub',    label: 'Banking',             icon: 'switch2',   section: 'Modules' },
  { id: 'reportsHub',    label: 'Reports',             icon: 'doc',       section: 'Modules' },
  { id: 'storesHub',     label: 'Inventory & Stores',  icon: 'store',     section: 'Modules' },
  { id: 'salesHub',      label: 'Sales',               icon: 'user',      section: 'Modules' },
  { id: 'procurementHub',label: 'Procurement',         icon: 'briefcase', section: 'Modules' },
  { id: 'configHub',     label: 'Configuration',       icon: 'compass',   section: 'Modules' },
  { id: 'adminHub',      label: 'Team & Access',       icon: 'user',      section: 'Modules' },
  { id: 'settingsHub',   label: 'Settings',            icon: 'settings',  section: 'Settings' },
];

const SIDEBAR_NAV = [
  { group: 'Auth',           items: ['login', 'signup', 'forgot'] },
  { group: 'Overview',       items: ['dashboard', 'invDashboard'] },
  { group: 'Finance',        items: ['accountsHub', 'ledgerHub', 'bankingHub', 'reportsHub'] },
  { group: 'Operations',     items: ['storesHub', 'salesHub', 'procurementHub'] },
  { group: 'Administration', items: ['configHub', 'adminHub', 'settingsHub'] },
];

const SECTION_LABELS = {
  Auth: 'Authentication', Overview: 'Overview', Modules: 'Modules', Settings: 'Settings',
};

const TENANT_NAMES = { 9: 'Al-Rashid Trading Co.', 14: 'Najd Holdings', 22: 'Coastal Logistics' };

// ── responsive layout tokens ──────────────────────────────────
// Widths the rail snaps between, plus the two breakpoints that pick
// the default state: ≥ DESKTOP_BP → open, ≥ TABLET_BP → collapsed rail,
// below TABLET_BP → off-canvas drawer.
const W_EXPANDED = 256;
const W_RAIL     = 76;
const W_DRAWER   = 280;
const TABLET_BP  = 768;   // < this  → mobile drawer
const DESKTOP_BP = 1200;  // < this  → tablet rail ; ≥ this → open

function getNavMode(w) {
  if (w < TABLET_BP) return 'mobile';
  if (w < DESKTOP_BP) return 'tablet';
  return 'desktop';
}

// Width is driven by an optional override (the workbench device simulator
// passes one in) and otherwise tracks the real window — so in production
// the sidebar simply reacts to the browser size.
function useViewportWidth(override) {
  const [w, setW] = React.useState(() => (override != null ? override : window.innerWidth));
  React.useEffect(() => {
    if (override != null) { setW(override); return; }
    const onResize = () => setW(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [override]);
  return override != null ? override : w;
}

// A three-bar hamburger built from a single bar + box-shadow (no SVG).
function Hamburger({ size = 18, color = 'var(--gl-fg-1)' }) {
  return (
    <span style={{
      display: 'block', width: size, height: 2, borderRadius: 2, background: color,
      boxShadow: `0 -6px 0 ${color}, 0 6px 0 ${color}`,
    }} />
  );
}

// ── Spotlight-style search over the nav screens ──
function SidebarSearch({ setScreen, collapsed, onExpand }) {
  const [query, setQuery] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [activeIdx, setActiveIdx] = React.useState(0);
  const [focused, setFocused] = React.useState(false);
  const boxRef = React.useRef(null);
  const inputRef = React.useRef(null);
  const listRef = React.useRef(null);

  const results = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const toks = q.split(/\s+/);
    return NAV_SCREENS
      .filter((s) => {
        const hay = (s.label + ' ' + (SECTION_LABELS[s.section] || s.section)).toLowerCase();
        return toks.every((t) => hay.includes(t));
      })
      .slice(0, 10);
  }, [query]);

  React.useEffect(() => { setActiveIdx(0); }, [query]);

  React.useEffect(() => {
    if (!open) return;
    const onDoc = (e) => { if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false); };
    window.addEventListener('mousedown', onDoc);
    return () => window.removeEventListener('mousedown', onDoc);
  }, [open]);

  React.useEffect(() => {
    const onSlash = (e) => {
      if (e.key !== '/' || e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target, tag = t && t.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || (t && t.isContentEditable)) return;
      e.preventDefault();
      if (inputRef.current) inputRef.current.focus();
      setOpen(true);
    };
    window.addEventListener('keydown', onSlash);
    return () => window.removeEventListener('keydown', onSlash);
  }, []);

  React.useEffect(() => {
    const el = listRef.current && listRef.current.children[activeIdx];
    if (el && el.scrollIntoView) el.scrollIntoView({ block: 'nearest' });
  }, [activeIdx]);

  const choose = (s) => {
    if (!s) return;
    setScreen(s.id);
    setQuery('');
    setOpen(false);
    if (inputRef.current) inputRef.current.blur();
  };

  const onKey = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setOpen(true); setActiveIdx((i) => Math.min(i + 1, Math.max(results.length - 1, 0))); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIdx((i) => Math.max(i - 1, 0)); }
    else if (e.key === 'Enter') { e.preventDefault(); choose(results[activeIdx]); }
    else if (e.key === 'Escape') { e.preventDefault(); if (query) setQuery(''); else { setOpen(false); if (inputRef.current) inputRef.current.blur(); } }
  };

  const showResults = open && query.trim().length > 0;

  // Collapsed rail: a single icon button that pops the sidebar back open
  // (and focuses the field) rather than trying to type inside 44px.
  if (collapsed) {
    return (
      <button onClick={onExpand} title="Search tabs"
        style={{
          width: 44, height: 44, margin: '0 auto', display: 'flex',
          alignItems: 'center', justifyContent: 'center', borderRadius: 8,
          background: 'var(--gl-input-bg)', border: '1px solid var(--gl-border)',
          cursor: 'pointer', color: 'var(--gl-fg-3)',
        }}>
        <Icon name="search" size={16} />
      </button>
    );
  }

  return (
    <div ref={boxRef} style={{ position: 'relative' }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 9,
        height: 38, padding: '0 12px', borderRadius: 8,
        background: 'var(--gl-input-bg)',
        border: `1px solid ${focused ? '#4A7CFF' : 'var(--gl-border)'}`,
        transition: 'border-color 150ms ease',
      }}>
        <Icon name="search" size={15} color="var(--gl-fg-3)" />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => { setFocused(true); setOpen(true); }}
          onBlur={() => setFocused(false)}
          onKeyDown={onKey}
          placeholder="Search tabs…"
          aria-label="Search tabs"
          style={{
            flex: 1, minWidth: 0, border: 'none', outline: 'none', background: 'transparent',
            color: 'var(--gl-fg-1)', fontFamily: 'var(--gl-font-body)', fontSize: 13,
          }} />
        {query
          ? <button onMouseDown={(e) => { e.preventDefault(); setQuery(''); if (inputRef.current) inputRef.current.focus(); }}
              aria-label="Clear search"
              style={{ display: 'flex', border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--gl-fg-3)', padding: 0 }}>
              <Icon name="close" size={14} />
            </button>
          : <kbd style={{ fontFamily: 'var(--gl-font-mono)', fontSize: 10, color: 'var(--gl-fg-4)', border: '1px solid var(--gl-border)', borderRadius: 4, padding: '1px 6px', lineHeight: 1.4 }}>/</kbd>}
      </div>

      {showResults && (
        <div role="listbox" ref={listRef} style={{
          position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, zIndex: 60,
          maxHeight: 360, overflowY: 'auto',
          background: 'var(--gl-surface)', border: '1px solid var(--gl-border-strong)',
          borderRadius: 8, boxShadow: 'var(--gl-shadow-pop)', padding: 6,
        }}>
          {results.length === 0
            ? <div style={{ padding: '16px 10px', fontSize: 12.5, color: 'var(--gl-fg-3)', textAlign: 'center' }}>No tabs match “{query.trim()}”</div>
            : results.map((s, i) => (
              <button key={s.id} role="option" aria-selected={i === activeIdx}
                onMouseEnter={() => setActiveIdx(i)}
                onMouseDown={(e) => { e.preventDefault(); choose(s); }}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                  padding: '8px 10px', borderRadius: 6, border: 'none', cursor: 'pointer',
                  textAlign: 'left', fontFamily: 'var(--gl-font-body)',
                  background: i === activeIdx ? 'var(--gl-hover)' : 'transparent',
                }}>
                <span style={{ display: 'flex', color: i === activeIdx ? '#4A7CFF' : 'var(--gl-fg-3)', flexShrink: 0 }}><Icon name={s.icon} size={15} /></span>
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--gl-fg-1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.label}</span>
                  <span style={{ display: 'block', fontSize: 10.5, fontFamily: 'var(--gl-font-mono)', color: 'var(--gl-fg-3)' }}>{SECTION_LABELS[s.section] || s.section}</span>
                </span>
                {i === activeIdx && <span style={{ display: 'flex', color: 'var(--gl-fg-4)', flexShrink: 0 }}><Icon name="chevRight" size={14} /></span>}
              </button>
            ))}
        </div>
      )}
    </div>
  );
}

function NavigationSidebar({ screen, setScreen, theme, setTheme, viewportWidth }) {
  const [tenantOpen, setTenantOpen] = React.useState(false);
  const [tenantId, setTenantId] = React.useState(9);

  const width = useViewportWidth(viewportWidth);
  const mode = getNavMode(width);
  const isMobile = mode === 'mobile';

  // Collapse state defaults from the breakpoint, and only RE-defaults when you
  // actually cross a breakpoint — a manual toggle sticks until then.
  const [collapsed, setCollapsed] = React.useState(mode === 'tablet');
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const prevMode = React.useRef(mode);
  React.useEffect(() => {
    if (mode === prevMode.current) return;
    if (mode === 'desktop') setCollapsed(false);
    else if (mode === 'tablet') setCollapsed(true);
    else if (mode === 'mobile') setMobileOpen(false);
    prevMode.current = mode;
  }, [mode]);

  // Esc closes the drawer.
  React.useEffect(() => {
    if (!isMobile) return;
    const onKey = (e) => { if (e.key === 'Escape') setMobileOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isMobile]);

  // In the drawer the content is always full-width; the rail only applies on desktop/tablet.
  const railed = !isMobile && collapsed;
  const ease = 'cubic-bezier(0.4, 0, 0.2, 1)';

  const handleNav = (id) => {
    setScreen(id);
    if (isMobile) setMobileOpen(false);
  };

  const asideStyle = {
    background: 'var(--gl-surface)',
    borderRight: '1px solid var(--gl-border)',
    padding: railed ? '20px 16px' : '24px 16px',
    display: 'flex', flexDirection: 'column', gap: 18,
    boxSizing: 'border-box',
    overflow: 'hidden',
    zIndex: isMobile ? 60 : 'auto',
    ...(isMobile
      ? {
          position: 'absolute', top: 0, bottom: 0, left: 0, width: W_DRAWER,
          transform: mobileOpen ? 'translateX(0)' : `translateX(-${W_DRAWER + 8}px)`,
          boxShadow: mobileOpen ? 'var(--gl-shadow-pop)' : 'none',
          transition: `transform 280ms ${ease}`,
        }
      : {
          position: 'relative', flexShrink: 0, height: '100%',
          width: railed ? W_RAIL : W_EXPANDED,
          transition: `width 240ms ${ease}, padding 240ms ${ease}`,
        }),
  };

  const railBtn = {
    width: 44, height: 44, margin: '0 auto', display: 'flex',
    alignItems: 'center', justifyContent: 'center', borderRadius: 8,
    border: '1px solid var(--gl-border)', background: 'var(--gl-input-bg)',
    cursor: 'pointer', color: 'var(--gl-fg-2)', flexShrink: 0,
  };

  return (
    <React.Fragment>
      {/* Mobile top app-bar — the only persistent chrome when the nav is a drawer */}
      {isMobile && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 56, zIndex: 40,
          display: 'flex', alignItems: 'center', gap: 14, padding: '0 16px',
          background: 'var(--gl-surface)', borderBottom: '1px solid var(--gl-border)',
        }}>
          <button onClick={() => setMobileOpen(true)} aria-label="Open navigation"
            style={{ ...railBtn, margin: 0, width: 40, height: 40 }}>
            <Hamburger />
          </button>
          <Logo size={22} />
        </div>
      )}

      {/* Scrim behind the drawer */}
      {isMobile && (
        <div onClick={() => setMobileOpen(false)} aria-hidden="true"
          style={{
            position: 'absolute', inset: 0, zIndex: 50, background: 'rgba(8,9,12,0.55)',
            opacity: mobileOpen ? 1 : 0, pointerEvents: mobileOpen ? 'auto' : 'none',
            transition: 'opacity 280ms ease', backdropFilter: 'blur(1px)',
          }} />
      )}

      <aside style={asideStyle}>
        {/* Edge collapse toggle — desktop & tablet only */}
        {!isMobile && (
          <button onClick={() => setCollapsed((v) => !v)}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            style={{
              position: 'absolute', top: 26, right: -13, zIndex: 5,
              width: 26, height: 26, borderRadius: '50%', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              background: 'var(--gl-surface)', border: '1px solid var(--gl-border-strong)',
              color: 'var(--gl-fg-2)', cursor: 'pointer', boxShadow: 'var(--gl-shadow-pop)',
            }}>
            <Icon name={collapsed ? 'chevRight' : 'chevLeft'} size={14} />
          </button>
        )}

        {/* Header: logo (+ drawer close button on mobile) */}
        <div style={{ display: 'flex', alignItems: 'center', padding: railed ? 0 : '4px 8px', justifyContent: railed ? 'center' : 'flex-start' }}>
          <Logo size={railed ? 26 : 24} withWordmark={!railed} />
          {isMobile && (
            <button onClick={() => setMobileOpen(false)} aria-label="Close navigation"
              style={{ marginLeft: 'auto', display: 'flex', border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--gl-fg-3)', padding: 6 }}>
              <Icon name="close" size={18} />
            </button>
          )}
        </div>

        {/* Workspace switcher chip */}
        {railed ? (
          <button onClick={() => setTenantOpen((v) => !v)} title={TENANT_NAMES[tenantId]}
            style={{ ...railBtn }}>
            <span style={{ color: '#4A7CFF', display: 'flex' }}><Icon name="building" size={16} /></span>
          </button>
        ) : (
          <button onClick={() => setTenantOpen((v) => !v)}
            style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 8, background: 'var(--gl-input-bg)', border: '1px solid var(--gl-border)', cursor: 'pointer', textAlign: 'left' }}>
            <span style={{ width: 28, height: 28, borderRadius: 7, background: 'rgba(74,124,255,0.18)', color: '#4A7CFF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Icon name="building" size={15} /></span>
            <span style={{ flex: 1, minWidth: 0 }}>
              <span style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: 'var(--gl-fg-1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{TENANT_NAMES[tenantId]}</span>
              <span style={{ display: 'block', fontFamily: 'var(--gl-font-mono)', fontSize: 10, color: 'var(--gl-fg-3)' }}>Tenant {tenantId}</span>
            </span>
            <Icon name="switch2" size={14} color="var(--gl-fg-3)" />
          </button>
        )}
        {tenantOpen && window.TenantSwitcher && <window.TenantSwitcher onClose={() => setTenantOpen(false)} onNavigate={handleNav} currentId={tenantId} onSwitch={setTenantId} />}

        <div style={{ height: 1, background: 'var(--gl-border)' }} />

        <SidebarSearch setScreen={handleNav} collapsed={railed} onExpand={() => setCollapsed(false)} />

        <nav style={{ display: 'flex', flexDirection: 'column', gap: 4, overflowY: 'auto', overflowX: 'hidden', flex: 1 }}>
          {SIDEBAR_NAV.map((grp) => (
            <React.Fragment key={grp.group}>
              {railed ? (
                <div style={{ height: 1, background: 'var(--gl-border)', margin: '12px 8px 6px' }} />
              ) : (
                <div style={{
                  fontWeight: 700, fontSize: 10, letterSpacing: '0.15em',
                  textTransform: 'uppercase', color: 'var(--gl-fg-4)',
                  padding: '12px 12px 6px', whiteSpace: 'nowrap',
                }}>{grp.group}</div>
              )}
              {grp.items.map((id) => {
                const s = NAV_SCREENS.find((x) => x.id === id);
                if (!s) return null;
                return (
                  <NavItem key={s.id}
                           active={screen === s.id}
                           icon={s.icon}
                           label={s.label}
                           collapsed={railed}
                           onClick={() => handleNav(s.id)} />
                );
              })}
            </React.Fragment>
          ))}
        </nav>

        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <ThemeToggle theme={theme} setTheme={setTheme} collapsed={railed} />
          {!railed && (
            <div style={{
              fontWeight: 700, fontSize: 10, letterSpacing: '0.15em',
              textTransform: 'uppercase', color: 'var(--gl-fg-4)',
              padding: '8px 12px', textAlign: 'center', whiteSpace: 'nowrap',
              borderTop: '1px solid var(--gl-border)',
            }}>UI Kit · v1.0</div>
          )}
        </div>
      </aside>
    </React.Fragment>
  );
}

function NavItem({ active, icon, label, onClick, collapsed }) {
  const [hover, setHover] = React.useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      title={collapsed ? label : undefined}
      aria-label={label}
      style={{
        display: 'flex', alignItems: 'center',
        gap: collapsed ? 0 : 12,
        justifyContent: collapsed ? 'center' : 'flex-start',
        width: collapsed ? 44 : 'auto',
        height: collapsed ? 44 : 'auto',
        margin: collapsed ? '0 auto' : 0,
        padding: collapsed ? 0 : '10px 12px', borderRadius: collapsed ? 8 : 4,
        background: active ? 'rgba(74,124,255,0.12)' : (hover ? 'var(--gl-hover)' : 'transparent'),
        color: active ? '#4A7CFF' : 'var(--gl-fg-2)',
        border: 'none', cursor: 'pointer', textAlign: 'left',
        fontFamily: 'var(--gl-font-body)', fontWeight: active ? 600 : 500, fontSize: 13,
        transition: 'background 150ms ease',
        position: 'relative', whiteSpace: 'nowrap',
      }}>
      {active && <div style={{
        position: 'absolute', left: collapsed ? 4 : 0, top: 8, bottom: 8, width: 3,
        background: '#4A7CFF', borderRadius: 12,
      }} />}
      <Icon name={icon} size={16} />
      {!collapsed && label}
    </button>
  );
}

function ThemeToggle({ theme, setTheme, collapsed }) {
  if (collapsed) {
    return (
      <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
        aria-label="Toggle theme"
        style={{
          width: 44, height: 44, margin: '0 auto', display: 'flex',
          alignItems: 'center', justifyContent: 'center', borderRadius: 8,
          background: 'var(--gl-input-bg)', border: '1px solid var(--gl-border)', cursor: 'pointer',
        }}>
        <span style={{
          width: 16, height: 16, borderRadius: '50%',
          border: '2px solid var(--gl-fg-2)',
          background: theme === 'dark' ? 'var(--gl-fg-2)' : 'transparent',
        }} />
      </button>
    );
  }
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4,
      background: 'var(--gl-input-bg)', padding: 4, borderRadius: 6,
      border: '1px solid var(--gl-border)',
    }}>
      {[
        { id: 'dark', label: 'Dark' },
        { id: 'light', label: 'Light' },
      ].map((opt) => (
        <button key={opt.id}
          onClick={() => setTheme(opt.id)}
          style={{
            padding: '8px 12px', borderRadius: 4,
            background: theme === opt.id ? 'var(--gl-surface)' : 'transparent',
            color: theme === opt.id ? 'var(--gl-fg-1)' : 'var(--gl-fg-3)',
            border: 'none', cursor: 'pointer',
            fontFamily: 'var(--gl-font-body)',
            fontWeight: 700, fontSize: 10,
            letterSpacing: '0.1em', textTransform: 'uppercase',
            boxShadow: theme === opt.id ? '0 1px 2px rgba(0,0,0,0.2)' : 'none',
            transition: 'background 150ms ease',
          }}>{opt.label}</button>
      ))}
    </div>
  );
}

Object.assign(window, { NavigationSidebar, getNavMode });
