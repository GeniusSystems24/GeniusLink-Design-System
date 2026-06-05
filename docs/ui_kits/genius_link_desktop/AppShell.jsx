/* global React, Icon, Logo, SCREENS, NAV_TREE_SECTIONS, TREE_ANCESTORS, SCREEN_META, SHORTCUTS, NavBadge, KeyHint, SidebarTree, ThemeToggle, screenById, SECTION_LABELS, subtreeHasBadge */
// ──────────────────────────────────────────────────────────────────────────
// AppShell.jsx — the production app chrome, mirroring
// design_system/components-navigation-sidebar.html (NavShell):
//   • a top AppBar with a centered command-search, workspace + user menus
//   • a responsive sidebar (full tree · collapsed rail · mobile drawer)
//   • a ⌘K / "/" command palette over every screen
// It reuses the app's real screen data + SidebarTree (no duplicate tree code).
// Loaded BEFORE app.jsx; all app globals are referenced only at render time.
// ──────────────────────────────────────────────────────────────────────────

const SH_ACCENT   = '#4A7CFF';
const SH_EASE     = 'cubic-bezier(0.4, 0, 0.2, 1)';
const SH_W_FULL   = 256;
const SH_W_RAIL   = 76;
const SH_W_DRAWER = 280;
const SH_BAR_H    = 60;
const SH_BAR_H_M  = 56;
const SH_TABLET   = 680;
const SH_DESKTOP  = 860;

function shNavMode(w) {
  if (w < SH_TABLET) return 'mobile';
  if (w < SH_DESKTOP) return 'tablet';
  return 'desktop';
}

function useShViewport() {
  const [w, setW] = React.useState(() => window.innerWidth);
  React.useEffect(() => {
    const onResize = () => setW(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return w;
}

function useShClickOutside(ref, onOut, active) {
  React.useEffect(() => {
    if (!active) return;
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) onOut(); };
    window.addEventListener('mousedown', h);
    return () => window.removeEventListener('mousedown', h);
  }, [active]);
}

// One-time keyframes for the palette + drawer (the app's base CSS lacks them).
(function injectShellStyles() {
  if (typeof document === 'undefined' || document.getElementById('gl-shell-styles')) return;
  const s = document.createElement('style');
  s.id = 'gl-shell-styles';
  s.textContent = `
    @keyframes glPaletteIn { from { opacity: 0; transform: translateY(-8px) scale(0.985); } to { opacity: 1; transform: none; } }
    @keyframes glFlyIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: none; } }
  `;
  document.head.appendChild(s);
})();

const SH_TENANTS = [
  { id: 9,  name: 'Al-Rashid Trading Co.', plan: 'Enterprise' },
  { id: 14, name: 'Najd Holdings',         plan: 'Business' },
  { id: 22, name: 'Coastal Logistics',     plan: 'Business' },
];
const shTenantById = (id) => SH_TENANTS.find((t) => t.id === id) || SH_TENANTS[0];
const SH_USER = { name: 'Sara Mansour', role: 'Administrator', email: 'sara.mansour@alrashid.co', initials: 'SM' };

function ShAvatar({ initials, size = 32 }) {
  return (
    <span style={{
      width: size, height: size, borderRadius: '50%', flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(74,124,255,0.16)', color: SH_ACCENT, border: '1px solid rgba(74,124,255,0.35)',
      fontFamily: 'var(--gl-font-body)', fontWeight: 700, fontSize: size * 0.36, letterSpacing: '0.02em',
    }}>{initials}</span>
  );
}

function ShHamburger({ size = 18, color = 'var(--gl-fg-1)' }) {
  return (
    <span style={{ display: 'block', width: size, height: 2, borderRadius: 2, background: color, boxShadow: `0 -6px 0 ${color}, 0 6px 0 ${color}` }} />
  );
}

const SH_POPOVER = {
  position: 'absolute', top: 'calc(100% + 8px)', insetInlineEnd: 0, zIndex: 80,
  minWidth: 240, background: 'var(--gl-surface)', border: '1px solid var(--gl-border-strong)',
  borderRadius: 10, boxShadow: 'var(--gl-shadow-pop)', padding: 6,
};

function ShMenuRow({ icon, label, onClick, danger }) {
  const [hover, setHover] = React.useState(false);
  return (
    <button onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} onClick={onClick}
      style={{
        width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '9px 10px',
        borderRadius: 7, border: 'none', cursor: 'pointer', textAlign: 'start',
        background: hover ? 'var(--gl-hover)' : 'transparent',
        color: danger ? '#E5484D' : 'var(--gl-fg-1)', fontFamily: 'var(--gl-font-body)', fontSize: 13, fontWeight: 500,
      }}>
      {icon && <span style={{ display: 'flex', color: danger ? '#E5484D' : 'var(--gl-fg-3)', flexShrink: 0 }}><Icon name={icon} size={15} /></span>}
      <span style={{ flex: 1, minWidth: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</span>
    </button>
  );
}

/* ── workspace dropdown ─────────────────────────────────────────────── */
function ShWorkspace({ tenantId, setTenantId, compact }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  useShClickOutside(ref, () => setOpen(false), open);
  const t = shTenantById(tenantId);
  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button onClick={() => setOpen((v) => !v)} aria-label="Switch workspace" title="Switch workspace"
        style={{
          display: 'flex', alignItems: 'center', gap: 9, height: 40,
          padding: compact ? 0 : '0 10px', width: compact ? 40 : 'auto', justifyContent: 'center',
          borderRadius: 9, cursor: 'pointer', background: open ? 'var(--gl-hover)' : 'var(--gl-input-bg)',
          border: `1px solid ${open ? SH_ACCENT : 'var(--gl-border)'}`, transition: 'border-color 150ms ease',
        }}>
        <span style={{ width: 26, height: 26, borderRadius: 7, background: 'rgba(74,124,255,0.18)', color: SH_ACCENT, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Icon name="building" size={15} /></span>
        {!compact && (
          <span style={{ textAlign: 'start', minWidth: 0, maxWidth: 150 }}>
            <span style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: 'var(--gl-fg-1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.name}</span>
            <span style={{ display: 'block', fontFamily: 'var(--gl-font-mono)', fontSize: 9.5, color: 'var(--gl-fg-3)', letterSpacing: '0.04em' }}>TENANT {t.id}</span>
          </span>
        )}
        {!compact && <Icon name="chevDown" size={14} color="var(--gl-fg-3)" />}
      </button>
      {open && (
        <div style={{ ...SH_POPOVER, insetInlineStart: 0, insetInlineEnd: 'auto', minWidth: 250 }}>
          <div style={{ padding: '6px 10px 8px', fontFamily: 'var(--gl-font-mono)', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--gl-fg-4)' }}>Switch workspace</div>
          {SH_TENANTS.map((opt) => {
            const active = opt.id === tenantId;
            return (
              <button key={opt.id} onClick={() => { setTenantId(opt.id); setOpen(false); }}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 7, border: 'none', cursor: 'pointer', textAlign: 'start', background: active ? 'rgba(74,124,255,0.10)' : 'transparent' }}>
                <span style={{ width: 28, height: 28, borderRadius: 7, background: 'rgba(74,124,255,0.18)', color: SH_ACCENT, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Icon name="building" size={14} /></span>
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ display: 'block', fontSize: 13, fontWeight: 600, color: active ? SH_ACCENT : 'var(--gl-fg-1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{opt.name}</span>
                  <span style={{ display: 'block', fontSize: 10.5, fontFamily: 'var(--gl-font-mono)', color: 'var(--gl-fg-3)' }}>{opt.plan} · Tenant {opt.id}</span>
                </span>
                {active && <span style={{ display: 'flex', color: SH_ACCENT }}><Icon name="check" size={15} /></span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ── user menu ──────────────────────────────────────────────────────── */
function ShUserMenu({ compact, setScreen }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  useShClickOutside(ref, () => setOpen(false), open);
  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button onClick={() => setOpen((v) => !v)} aria-label="Account menu"
        style={{ display: 'flex', alignItems: 'center', gap: 9, height: 40, padding: compact ? 0 : '0 8px 0 4px', borderRadius: 9, cursor: 'pointer', background: open ? 'var(--gl-hover)' : 'transparent', border: `1px solid ${open ? 'var(--gl-border-strong)' : 'transparent'}` }}>
        <ShAvatar initials={SH_USER.initials} size={32} />
        {!compact && (
          <span style={{ textAlign: 'start', minWidth: 0 }}>
            <span style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: 'var(--gl-fg-1)', whiteSpace: 'nowrap' }}>{SH_USER.name}</span>
            <span style={{ display: 'block', fontSize: 10, fontFamily: 'var(--gl-font-mono)', color: 'var(--gl-fg-3)', letterSpacing: '0.04em' }}>{SH_USER.role}</span>
          </span>
        )}
        {!compact && <Icon name="chevDown" size={14} color="var(--gl-fg-3)" />}
      </button>
      {open && (
        <div style={SH_POPOVER}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px 12px', borderBottom: '1px solid var(--gl-border)', marginBottom: 6 }}>
            <ShAvatar initials={SH_USER.initials} size={38} />
            <span style={{ minWidth: 0 }}>
              <span style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--gl-fg-1)' }}>{SH_USER.name}</span>
              <span style={{ display: 'block', fontSize: 11, fontFamily: 'var(--gl-font-mono)', color: 'var(--gl-fg-3)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{SH_USER.email}</span>
            </span>
          </div>
          <ShMenuRow icon="user" label="Profile" onClick={() => setOpen(false)} />
          <ShMenuRow icon="settings" label="Settings" onClick={() => { setScreen('settingsHub'); setOpen(false); }} />
          <ShMenuRow icon="switch2" label="Workspaces" onClick={() => { setScreen('tenants'); setOpen(false); }} />
          <div style={{ height: 1, background: 'var(--gl-border)', margin: '6px 4px' }} />
          <ShMenuRow icon="lock" label="Sign out" danger onClick={() => { setScreen('login'); setOpen(false); }} />
        </div>
      )}
    </div>
  );
}

/* ── top app bar (3-col grid keeps the search optically centered) ───── */
function ShAppBar({ mode, dense, dir, onToggleSidebar, onOpenSearch, tenantId, setTenantId, setScreen }) {
  const isMobile = mode === 'mobile';
  const tight = dense || mode !== 'desktop';
  const iconBtn = { width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 9, border: '1px solid var(--gl-border)', background: 'var(--gl-input-bg)', cursor: 'pointer', color: 'var(--gl-fg-2)', flexShrink: 0 };

  if (isMobile) {
    return (
      <header style={{ height: SH_BAR_H_M, flexShrink: 0, zIndex: 30, position: 'relative', display: 'flex', alignItems: 'center', gap: 10, padding: '0 12px', background: 'var(--gl-surface)', borderBottom: '1px solid var(--gl-border)' }}>
        <button onClick={onToggleSidebar} aria-label="Toggle navigation" style={iconBtn}><ShHamburger /></button>
        <Logo size={22} withWordmark={false} />
        <button onClick={onOpenSearch} aria-label="Search" style={{ ...iconBtn, marginInlineStart: 'auto' }}><Icon name="search" size={16} color="var(--gl-fg-3)" /></button>
        <ShWorkspace tenantId={tenantId} setTenantId={setTenantId} compact />
        <ShUserMenu compact setScreen={setScreen} />
      </header>
    );
  }

  return (
    <header style={{ height: SH_BAR_H, flexShrink: 0, zIndex: 30, position: 'relative', display: 'grid', gridTemplateColumns: 'minmax(0,1fr) auto minmax(0,1fr)', alignItems: 'center', gap: 16, padding: '0 18px', background: 'var(--gl-surface)', borderBottom: '1px solid var(--gl-border)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0, overflow: 'hidden' }}>
        <button onClick={onToggleSidebar} aria-label="Toggle navigation" style={iconBtn}><ShHamburger /></button>
        <Logo size={24} withWordmark={!tight} />
      </div>
      <button onClick={onOpenSearch} aria-label="Search tabs"
        style={{ width: tight ? 'min(360px, 40vw)' : 'min(480px, 42vw)', height: 40, display: 'flex', alignItems: 'center', gap: 9, padding: '0 12px', borderRadius: 9, cursor: 'text', textAlign: 'start', background: 'var(--gl-input-bg)', border: '1px solid var(--gl-border)' }}>
        <Icon name="search" size={15} color="var(--gl-fg-3)" />
        <span style={{ flex: 1, fontSize: 13, color: 'var(--gl-fg-3)', fontFamily: 'var(--gl-font-body)', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'start' }}>Search tabs &amp; actions…</span>
        <kbd style={{ fontFamily: 'var(--gl-font-mono)', fontSize: 10, color: 'var(--gl-fg-4)', border: '1px solid var(--gl-border)', borderRadius: 4, padding: '1px 6px', lineHeight: 1.4, flexShrink: 0 }}>/</kbd>
      </button>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 12, minWidth: 0, overflow: 'hidden' }}>
        <ShWorkspace tenantId={tenantId} setTenantId={setTenantId} compact={tight} />
        <ShUserMenu compact={tight} setScreen={setScreen} />
      </div>
    </header>
  );
}

/* ── command palette (search over every screen, grouped by module) ──── */
function shBuildSearchGroups() {
  const out = [];
  NAV_TREE_SECTIONS.forEach((sec) => {
    const leaves = sec.items.filter((n) => !n.children);
    const modules = sec.items.filter((n) => n.children);
    if (leaves.length) out.push({ group: sec.section, crumb: '', items: leaves.map((l) => ({ id: l.id, label: l.label, icon: l.icon })) });
    modules.forEach((mod) => {
      const items = [
        { id: mod.id, label: mod.label + ' — Overview', icon: mod.icon, isHub: true },
        ...mod.children.flatMap((g) => g.children.map((it) => ({ id: it.id, label: it.label, icon: it.icon, sub: g.label }))),
      ];
      out.push({ group: mod.label, crumb: sec.section, items });
    });
  });
  return out;
}

function ShSearchDialog({ open, onClose, setScreen, dir }) {
  const groupsAll = React.useMemo(() => shBuildSearchGroups(), []);
  const total = React.useMemo(() => groupsAll.reduce((n, g) => n + g.items.length, 0), [groupsAll]);
  const [query, setQuery] = React.useState('');
  const [activeIdx, setActiveIdx] = React.useState(0);
  const inputRef = React.useRef(null);
  const listRef = React.useRef(null);

  React.useEffect(() => {
    if (open) { setQuery(''); setActiveIdx(0); const id = setTimeout(() => inputRef.current && inputRef.current.focus(), 30); return () => clearTimeout(id); }
  }, [open]);

  const groups = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return groupsAll;
    const toks = q.split(/\s+/);
    const match = (text) => toks.every((t) => text.includes(t));
    const res = [];
    for (const g of groupsAll) {
      const path = (g.crumb ? g.crumb + ' ' : '') + g.group;
      const groupHit = match(path.toLowerCase());
      const items = g.items.filter((it) => groupHit || match((it.label + ' ' + (it.sub || '') + ' ' + path).toLowerCase()));
      if (items.length) res.push({ ...g, items });
    }
    return res;
  }, [query, groupsAll]);

  const flat = React.useMemo(() => {
    const arr = []; groups.forEach((g) => g.items.forEach((it) => arr.push(it))); return arr;
  }, [groups]);

  React.useEffect(() => { setActiveIdx(0); }, [query]);
  React.useEffect(() => {
    const c = listRef.current; if (!c) return;
    const el = c.querySelector(`[data-row="${activeIdx}"]`); if (!el) return;
    if (el.offsetTop < c.scrollTop) c.scrollTop = el.offsetTop - 8;
    else if (el.offsetTop + el.offsetHeight > c.scrollTop + c.clientHeight) c.scrollTop = el.offsetTop + el.offsetHeight - c.clientHeight + 8;
  }, [activeIdx]);

  const choose = (it) => { if (!it) return; setScreen(it.id); onClose(); };
  const onKey = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIdx((i) => Math.min(i + 1, flat.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIdx((i) => Math.max(i - 1, 0)); }
    else if (e.key === 'Enter') { e.preventDefault(); choose(flat[activeIdx]); }
    else if (e.key === 'Escape') { e.preventDefault(); onClose(); }
  };

  if (!open) return null;
  const q = query.trim();
  let rowCursor = -1;

  return (
    <div onMouseDown={onClose} role="presentation"
      style={{ position: 'absolute', inset: 0, zIndex: 100, display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: '12vh 20px 20px', background: 'rgba(8,9,12,0.55)', backdropFilter: 'blur(2px)' }}>
      <div onMouseDown={(e) => e.stopPropagation()} role="dialog" aria-label="Search" dir={dir}
        style={{ width: '100%', maxWidth: 580, background: 'var(--gl-surface)', border: '1px solid var(--gl-border-strong)', borderRadius: 14, boxShadow: 'var(--gl-shadow-pop)', overflow: 'hidden', animation: 'glPaletteIn 160ms ' + SH_EASE }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '14px 16px', borderBottom: '1px solid var(--gl-border)' }}>
          <Icon name="search" size={18} color="var(--gl-fg-3)" />
          <input ref={inputRef} value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={onKey}
            placeholder="Search tabs & actions…" aria-label="Search tabs"
            style={{ flex: 1, minWidth: 0, border: 'none', outline: 'none', background: 'transparent', color: 'var(--gl-fg-1)', fontFamily: 'var(--gl-font-body)', fontSize: 15.5 }} />
          <button onMouseDown={(e) => { e.preventDefault(); onClose(); }} aria-label="Close"
            style={{ display: 'flex', alignItems: 'center', gap: 5, border: '1px solid var(--gl-border)', background: 'transparent', cursor: 'pointer', color: 'var(--gl-fg-3)', borderRadius: 5, padding: '3px 7px', fontFamily: 'var(--gl-font-mono)', fontSize: 10 }}>ESC</button>
        </div>
        <div ref={listRef} role="listbox" className="gl-nav-scroll" style={{ maxHeight: 420, overflowY: 'auto', padding: 8 }}>
          <div style={{ padding: '4px 10px 6px', fontFamily: 'var(--gl-font-mono)', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--gl-fg-4)' }}>
            {q ? `${flat.length} result${flat.length === 1 ? '' : 's'}` : `All tabs · ${total}`}
          </div>
          {flat.length === 0 ? (
            <div style={{ padding: '28px 12px', textAlign: 'center', fontSize: 13.5, color: 'var(--gl-fg-3)' }}>No tabs match “{q}”</div>
          ) : groups.map((g) => (
            <div key={g.group} style={{ marginBottom: 4 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, padding: '10px 12px 5px' }}>
                <span style={{ fontWeight: 700, fontSize: 10.5, letterSpacing: '0.13em', textTransform: 'uppercase', color: 'var(--gl-fg-3)' }}>{g.group}</span>
                {g.crumb && <span style={{ fontFamily: 'var(--gl-font-mono)', fontSize: 9.5, color: 'var(--gl-fg-4)', letterSpacing: '0.06em' }}>{g.crumb}</span>}
              </div>
              {g.items.map((it) => {
                rowCursor += 1; const i = rowCursor; const active = i === activeIdx;
                const meta = SCREEN_META[it.id];
                return (
                  <button key={it.id + '_' + i} data-row={i} role="option" aria-selected={active}
                    onMouseEnter={() => setActiveIdx(i)} onMouseDown={(e) => { e.preventDefault(); choose(it); }}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '9px 12px', borderRadius: 8, border: 'none', cursor: 'pointer', textAlign: 'start', background: active ? 'var(--gl-hover)' : 'transparent' }}>
                    <span style={{ width: 30, height: 30, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: active ? 'rgba(74,124,255,0.16)' : 'var(--gl-input-bg)', color: active ? SH_ACCENT : 'var(--gl-fg-3)' }}><Icon name={it.icon} size={16} /></span>
                    <span style={{ flex: 1, minWidth: 0 }}>
                      <span style={{ display: 'block', fontSize: 13.5, fontWeight: it.isHub ? 600 : 500, color: 'var(--gl-fg-1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{it.label}</span>
                      <span style={{ display: 'block', fontSize: 11, fontFamily: 'var(--gl-font-mono)', color: 'var(--gl-fg-3)' }}>{it.isHub ? 'Module landing' : (it.sub || g.group)}</span>
                    </span>
                    {meta && meta.badge && <NavBadge badge={meta.badge} small />}
                    {meta && meta.keys && <KeyHint keys={meta.keys} />}
                    {it.isHub && <span style={{ fontFamily: 'var(--gl-font-mono)', fontSize: 9, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--gl-fg-4)', border: '1px solid var(--gl-border)', borderRadius: 4, padding: '2px 6px', flexShrink: 0 }}>Hub</span>}
                    {active && <span style={{ display: 'flex', color: 'var(--gl-fg-4)' }}><Icon name="chevRight" size={15} /></span>}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '10px 16px', borderTop: '1px solid var(--gl-border)', fontFamily: 'var(--gl-font-mono)', fontSize: 10.5, color: 'var(--gl-fg-4)' }}>
          <span><kbd style={shKbd}>↑</kbd><kbd style={shKbd}>↓</kbd> navigate</span>
          <span><kbd style={shKbd}>↵</kbd> open</span>
          <span><kbd style={shKbd}>esc</kbd> close</span>
        </div>
      </div>
    </div>
  );
}
const shKbd = { display: 'inline-block', border: '1px solid var(--gl-border)', borderRadius: 4, padding: '0 5px', marginInlineEnd: 3, color: 'var(--gl-fg-3)' };

/* ── collapsed rail: icon-only modules + hover flyout ───────────────── */
function ShRailNav({ screen, setScreen, rtl }) {
  const [fly, setFly] = React.useState(null);
  const closeTimer = React.useRef(null);
  const FLY_W = 248;
  const openFly = (node, el) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    if (!node.children) { setFly(null); return; }
    const r = el.getBoundingClientRect();
    const left = rtl ? Math.max(8, r.left - FLY_W - 10) : r.right + 10;
    setFly({ node, top: Math.min(r.top, window.innerHeight - 320), left });
  };
  const scheduleClose = () => { if (closeTimer.current) clearTimeout(closeTimer.current); closeTimer.current = setTimeout(() => setFly(null), 130); };
  const cancelClose = () => { if (closeTimer.current) clearTimeout(closeTimer.current); };

  return (
    <nav className="gl-nav-scroll" style={{ display: 'flex', flexDirection: 'column', gap: 5, alignItems: 'center', overflowY: 'auto', overflowX: 'visible', flex: 1, width: '100%' }}>
      {NAV_TREE_SECTIONS.map((sec, si) => (
        <React.Fragment key={sec.section}>
          {si > 0 && <span style={{ width: 26, height: 1, background: 'var(--gl-border)', margin: '5px 0' }} />}
          {sec.items.map((node) => {
            const active = node.children ? (TREE_ANCESTORS[screen] || []).includes(node.id) : screen === node.id;
            const ownBadge = !node.children && SCREEN_META[node.id] && SCREEN_META[node.id].badge;
            const hasBadge = node.children ? subtreeHasBadge(node) : !!ownBadge;
            return (
              <button key={node.id} onMouseEnter={(e) => openFly(node, e.currentTarget)} onMouseLeave={scheduleClose}
                onClick={() => { if (!node.children) setScreen(node.id); }}
                title={node.children ? undefined : node.label} aria-label={node.label}
                style={{ width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 10, border: 'none', cursor: 'pointer', flexShrink: 0, position: 'relative', background: active ? (node.children ? 'rgba(74,124,255,0.12)' : SH_ACCENT) : 'transparent', color: active ? (node.children ? SH_ACCENT : '#fff') : 'var(--gl-fg-2)', transition: 'background 150ms ease' }}>
                <Icon name={node.icon} size={22} />
                {hasBadge && <span style={{ position: 'absolute', insetInlineEnd: 6, top: 6, width: 7, height: 7, borderRadius: '50%', background: SH_ACCENT, border: '1.5px solid var(--gl-surface)' }} />}
              </button>
            );
          })}
        </React.Fragment>
      ))}
      {fly && (
        <div onMouseEnter={cancelClose} onMouseLeave={scheduleClose} className="gl-nav-scroll"
          style={{ position: 'fixed', top: fly.top, left: fly.left, zIndex: 90, width: FLY_W, maxHeight: 360, overflowY: 'auto', background: 'var(--gl-surface)', border: '1px solid var(--gl-border-strong)', borderRadius: 12, boxShadow: 'var(--gl-shadow-pop)', padding: 8, direction: rtl ? 'rtl' : 'ltr', animation: 'glPaletteIn 140ms ' + SH_EASE }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '4px 8px 10px', borderBottom: '1px solid var(--gl-border)', marginBottom: 4 }}>
            <span style={{ display: 'flex', color: 'var(--gl-fg-2)' }}><Icon name={fly.node.icon} size={17} /></span>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--gl-fg-1)' }}>{fly.node.label}</span>
          </div>
          {fly.node.children.map((grp) => (
            <div key={grp.id} style={{ marginBottom: 2 }}>
              <div style={{ padding: '6px 8px 3px', fontSize: 9.5, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--gl-fg-4)' }}>{grp.label}</div>
              {grp.children.map((c) => {
                const a = screen === c.id;
                return (
                  <button key={c.id} onClick={() => { setScreen(c.id); setFly(null); }}
                    onMouseEnter={(e) => { if (!a) e.currentTarget.style.background = 'var(--gl-hover)'; }}
                    onMouseLeave={(e) => { if (!a) e.currentTarget.style.background = 'transparent'; }}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '7px 8px', borderRadius: 8, border: 'none', cursor: 'pointer', textAlign: 'start', background: a ? 'rgba(74,124,255,0.10)' : 'transparent', color: a ? SH_ACCENT : 'var(--gl-fg-1)', fontFamily: 'var(--gl-font-body)', fontSize: 12.5, fontWeight: a ? 600 : 500 }}>
                    <span style={{ width: 24, height: 24, borderRadius: 7, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${a ? SH_ACCENT : 'var(--gl-border)'}`, color: a ? SH_ACCENT : 'var(--gl-fg-3)' }}><Icon name={c.icon} size={13} /></span>
                    <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.label}</span>
                    {SCREEN_META[c.id] && SCREEN_META[c.id].badge && <NavBadge badge={SCREEN_META[c.id].badge} small />}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </nav>
  );
}

function ShDirToggle({ dir, setDir, collapsed }) {
  if (collapsed) {
    const next = (dir === 'rtl') ? 'ltr' : 'rtl';
    return (
      <button onClick={() => setDir(next)} title={`Switch to ${next.toUpperCase()}`} aria-label="Toggle direction"
        style={{ width: 44, height: 44, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8, background: 'var(--gl-input-bg)', border: '1px solid var(--gl-border)', cursor: 'pointer', fontFamily: 'var(--gl-font-mono)', fontSize: 10, fontWeight: 700, color: 'var(--gl-fg-2)' }}>
        {(dir || 'ltr').toUpperCase()}
      </button>
    );
  }
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4, background: 'var(--gl-input-bg)', padding: 4, borderRadius: 6, border: '1px solid var(--gl-border)' }}>
      {[{ id: 'ltr', label: 'LTR' }, { id: 'rtl', label: 'RTL' }].map((opt) => {
        const on = (dir || 'ltr') === opt.id;
        return (
          <button key={opt.id} onClick={() => setDir(opt.id)}
            style={{ padding: '7px 0', borderRadius: 4, border: 'none', cursor: 'pointer', fontFamily: 'var(--gl-font-mono)', fontSize: 11, letterSpacing: '0.06em', background: on ? 'var(--gl-surface)' : 'transparent', color: on ? 'var(--gl-fg-1)' : 'var(--gl-fg-3)', fontWeight: on ? 600 : 500, boxShadow: on ? '0 1px 2px rgba(0,0,0,0.25)' : 'none' }}>{opt.label}</button>
        );
      })}
    </div>
  );
}

function ShHelpCard({ collapsed }) {
  if (collapsed) {
    return (
      <button title="Help Center" aria-label="Help Center"
        style={{ width: 44, height: 44, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 10, border: '1px solid var(--gl-border)', background: 'var(--gl-input-bg)', cursor: 'pointer', color: 'var(--gl-fg-2)' }}>
        <Icon name="info" size={18} />
      </button>
    );
  }
  return (
    <button style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', padding: '12px 14px', borderRadius: 12, border: '1px solid var(--gl-border)', background: 'var(--gl-input-bg)', cursor: 'pointer', textAlign: 'start' }}>
      <span style={{ width: 34, height: 34, borderRadius: 9, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(74,124,255,0.14)', color: SH_ACCENT }}><Icon name="info" size={18} /></span>
      <span style={{ minWidth: 0 }}>
        <span style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--gl-fg-1)' }}>Need help?</span>
        <span style={{ display: 'block', fontSize: 11, color: 'var(--gl-fg-3)', marginTop: 1 }}>Go to Help Center →</span>
      </span>
    </button>
  );
}

/* ── sidebar wrapper: full tree · rail · mobile drawer ──────────────── */
function ShSidebar({ screen, setScreen, mode, collapsed, mobileOpen, onCloseDrawer, dir, theme, setTheme, dirState, setDir }) {
  const isMobile = mode === 'mobile';
  const railed = !isMobile && collapsed;
  const rtl = dir === 'rtl';
  const drawerHidden = rtl ? `translateX(${SH_W_DRAWER + 8}px)` : `translateX(-${SH_W_DRAWER + 8}px)`;
  const asideStyle = {
    direction: dir, background: 'var(--gl-surface)', borderInlineEnd: '1px solid var(--gl-border)',
    padding: '16px 14px', display: 'flex', flexDirection: 'column', gap: 12, boxSizing: 'border-box', overflow: 'hidden',
    ...(isMobile
      ? { position: 'absolute', top: 0, bottom: 0, insetInlineStart: 0, width: SH_W_DRAWER, zIndex: 60, transform: mobileOpen ? 'translateX(0)' : drawerHidden, boxShadow: mobileOpen ? 'var(--gl-shadow-pop)' : 'none', transition: `transform 280ms ${SH_EASE}` }
      : { position: 'relative', flexShrink: 0, height: '100%', width: railed ? SH_W_RAIL : SH_W_FULL, transition: `width 240ms ${SH_EASE}` }),
  };
  return (
    <aside style={asideStyle}>
      {isMobile && (
        <div style={{ display: 'flex', alignItems: 'center', height: 30, marginBottom: 2 }}>
          <span style={{ fontFamily: 'var(--gl-font-mono)', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--gl-fg-4)' }}>Navigation</span>
          <button onClick={onCloseDrawer} aria-label="Close navigation" style={{ marginInlineStart: 'auto', display: 'flex', border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--gl-fg-3)', padding: 6 }}><Icon name="close" size={18} /></button>
        </div>
      )}
      {railed ? <ShRailNav screen={screen} setScreen={setScreen} rtl={rtl} /> : <SidebarTree screen={screen} setScreen={setScreen} />}
      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 12, paddingTop: 4 }}>
        <ThemeToggle theme={theme} setTheme={setTheme} collapsed={railed} />
        <ShDirToggle dir={dirState} setDir={setDir} collapsed={railed} />
        <ShHelpCard collapsed={railed} />
      </div>
    </aside>
  );
}

/* ── shell orchestrator ─────────────────────────────────────────────── */
function AppShell({ screen, setScreen, theme, setTheme, dir, setDir, tenantId, setTenantId, children }) {
  const width = useShViewport();
  const mode = shNavMode(width);
  const isMobile = mode === 'mobile';
  const [collapsed, setCollapsed] = React.useState(mode === 'tablet');
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const prevMode = React.useRef(mode);

  React.useEffect(() => {
    if (mode === prevMode.current) return;
    if (mode === 'desktop') setCollapsed(false);
    else if (mode === 'tablet') setCollapsed(true);
    else if (mode === 'mobile') setMobileOpen(false);
    prevMode.current = mode;
  }, [mode]);

  const toggleSidebar = () => { if (isMobile) setMobileOpen((v) => !v); else setCollapsed((v) => !v); };
  const handleNav = (id) => { setScreen(id); if (isMobile) setMobileOpen(false); };
  const navRef = React.useRef(handleNav); navRef.current = handleNav;

  // ⌘K / "/" open search; "g"+key jumps to a screen; Esc closes drawer.
  React.useEffect(() => {
    let pending = null, timer = null;
    const clearPending = () => { pending = null; if (timer) { clearTimeout(timer); timer = null; } };
    const onKey = (e) => {
      const t = e.target, tag = t && t.tagName;
      const typing = tag === 'INPUT' || tag === 'TEXTAREA' || (t && t.isContentEditable);
      if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) { e.preventDefault(); clearPending(); setSearchOpen(true); return; }
      if (typing || e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === '/') { e.preventDefault(); clearPending(); setSearchOpen(true); return; }
      if (e.key === 'Escape') { clearPending(); setSearchOpen(false); if (isMobile) setMobileOpen(false); return; }
      const k = (e.key || '').toLowerCase();
      if (pending) { const hit = SHORTCUTS.find((s) => s.combo === pending + k); clearPending(); if (hit) { e.preventDefault(); setSearchOpen(false); navRef.current(hit.id); } return; }
      if (k === 'g' && SHORTCUTS.some((s) => s.combo[0] === 'g')) { pending = 'g'; timer = setTimeout(clearPending, 1200); }
    };
    window.addEventListener('keydown', onKey);
    return () => { window.removeEventListener('keydown', onKey); clearPending(); };
  }, [isMobile]);

  return (
    <div dir={dir} style={{ position: 'relative', height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'var(--gl-bg)' }}>
      <ShAppBar mode={mode} dense={width < 1120} dir={dir} onToggleSidebar={toggleSidebar} onOpenSearch={() => setSearchOpen(true)}
        tenantId={tenantId} setTenantId={setTenantId} setScreen={handleNav} />
      <div style={{ position: 'relative', flex: 1, minHeight: 0, display: 'flex', overflow: 'hidden' }}>
        <ShSidebar screen={screen} setScreen={handleNav} mode={mode} collapsed={collapsed} mobileOpen={mobileOpen}
          onCloseDrawer={() => setMobileOpen(false)} dir={dir} theme={theme} setTheme={setTheme} dirState={dir} setDir={setDir} />
        {isMobile && (
          <div onClick={() => setMobileOpen(false)} aria-hidden="true"
            style={{ position: 'absolute', inset: 0, zIndex: 50, background: 'rgba(8,9,12,0.55)', backdropFilter: 'blur(1px)', opacity: mobileOpen ? 1 : 0, pointerEvents: mobileOpen ? 'auto' : 'none', transition: 'opacity 280ms ease' }} />
        )}
        <main style={{ flex: 1, minWidth: 0, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>{children}</main>
      </div>
      <ShSearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} setScreen={handleNav} dir={dir} />
    </div>
  );
}

window.AppShell = AppShell;
