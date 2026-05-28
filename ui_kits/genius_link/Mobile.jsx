/* global React */
// GeniusLink — Mobile screens. Self-contained (own primitives) so the
// mobile demo doesn't need to load the desktop component files.
// Rendered inside <IOSDevice dark>. Mobile language: single column,
// sticky app bar, bottom tab nav, stacked bilingual fields, 44px targets.

const { useState } = React;

const C = {
  bg: '#111318', surface: '#1E2025', card2: '#292D38', input: '#33353A',
  border: 'rgba(67,70,84,0.5)', borderStrong: '#43464F',
  fg1: '#E2E2E9', fg2: '#C3C6D7', fg3: '#8D90A0', fg4: '#44474E',
  blue: '#4A7CFF', green: '#1DB88A', orange: '#F97316', red: '#EF4444',
  mono: 'var(--gl-font-mono)', body: 'var(--gl-font-body)', display: 'var(--gl-font-display)',
  arabic: 'var(--gl-font-arabic)',
};

/* ───────── primitives ───────── */
function MIcon({ name, size = 20, color = 'currentColor', stroke = 1.6 }) {
  const P = {
    back: 'M19 12H5|M12 19l-7-7 7-7', chevR: 'M9 6l6 6-6 6', chevD: 'M6 9l6 6 6-6',
    plus: 'M12 5v14|M5 12h14', check: 'M20 6L9 17l-5-5', search: 'M21 21l-4.35-4.35',
    searchO: 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z', lock: 'M7 11V7a5 5 0 0 1 10 0v4',
    lockB: 'M5 11h14v10H5z', home: 'M3 11l9-8 9 8|M5 10v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V10',
    ledger: 'M4 4h13a3 3 0 0 1 3 3v14H7a3 3 0 0 1-3-3V4z|M8 8h8|M8 12h8|M8 16h5',
    store: 'M3 9l2-5h14l2 5|M3 9v11a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V9|M3 9h18',
    grid: 'M3 3h7v7H3z|M14 3h7v7h-7z|M14 14h7v7h-7z|M3 14h7v7H3z',
    bell: 'M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9|M13.7 21a2 2 0 0 1-3.4 0',
    user: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2|M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0z',
    scan: 'M3 7V5a2 2 0 0 1 2-2h2|M17 3h2a2 2 0 0 1 2 2v2|M21 17v2a2 2 0 0 1-2 2h-2|M7 21H5a2 2 0 0 1-2-2v-2|M7 12h10',
    trash: 'M3 6h18|M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6|M10 11v6|M14 11v6',
    download: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4|M7 10l5 5 5-5|M12 15V3',
  };
  const raw = P[name]; if (!raw) return null;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      {raw.split('|').map((d, i) => <path key={i} d={d} />)}
    </svg>
  );
}

function Pill({ children, tone = 'success' }) {
  const colors = { success: C.green, info: C.blue, warning: C.orange, danger: C.red, neutral: C.fg3 };
  const c = colors[tone];
  return <span style={{ padding: '3px 9px', background: `${c}26`, color: c, borderRadius: 10, fontSize: 9, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: C.body }}>{children}</span>;
}

function MCard({ children, marker, title, sub, right, pad = 16 }) {
  return (
    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: pad, display: 'flex', flexDirection: 'column', gap: 14 }}>
      {title && (
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          {marker && <div style={{ width: 4, alignSelf: 'stretch', minHeight: 32, borderRadius: 12, background: marker }} />}
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: C.fg1, fontFamily: C.body }}>{title}</div>
            {sub && <div style={{ fontSize: 11.5, color: C.fg3, marginTop: 3, fontFamily: C.body }}>{sub}</div>}
          </div>
          {right}
        </div>
      )}
      {children}
    </div>
  );
}

function MField({ label, placeholder, value, ar, mono, required }) {
  return (
    <div dir={ar ? 'rtl' : 'ltr'}>
      <div style={{ fontWeight: 700, fontSize: 10, letterSpacing: '0.05em', textTransform: 'uppercase', color: C.fg2, marginBottom: 7, fontFamily: C.body }}>{label}{required && <span style={{ color: C.red, marginInlineStart: 2 }}>*</span>}</div>
      <div style={{ height: 46, padding: '0 14px', background: C.input, border: `1px solid ${C.borderStrong}`, borderRadius: 8, display: 'flex', alignItems: 'center', fontFamily: mono ? C.mono : (ar ? C.arabic : C.body), fontSize: 14, color: value ? C.fg1 : C.fg3 }}>
        {value || placeholder}
      </div>
    </div>
  );
}

function MBtn({ children, variant = 'primary', icon, onClick, full }) {
  const styles = {
    primary: { background: C.blue, color: '#fff', border: 'none' },
    secondary: { background: 'transparent', color: C.fg1, border: `1px solid ${C.borderStrong}` },
    danger: { background: 'transparent', color: C.red, border: `1px solid ${C.red}66` },
  };
  return (
    <button onClick={onClick} style={{ ...styles[variant], height: 48, padding: '0 18px', borderRadius: 10, fontFamily: C.body, fontWeight: 600, fontSize: 15, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: full ? '100%' : undefined }}>
      {icon && <MIcon name={icon} size={17} />}{children}
    </button>
  );
}

/* ───────── shell ───────── */
function AppBar({ title, ar, onBack, action }) {
  return (
    <div style={{ position: 'sticky', top: 0, zIndex: 5, background: 'rgba(17,19,24,0.92)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderBottom: `1px solid ${C.border}`, padding: '52px 16px 12px', display: 'flex', alignItems: 'center', gap: 12 }}>
      {onBack && <button onClick={onBack} style={{ background: 'none', border: 'none', color: C.blue, cursor: 'pointer', display: 'flex', padding: 0 }}><MIcon name="back" size={22} /></button>}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: C.display, fontWeight: 700, fontSize: 19, letterSpacing: '-0.02em', color: C.fg1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}</div>
        {ar && <div dir="rtl" style={{ fontFamily: C.arabic, fontSize: 12, color: C.blue, opacity: 0.85 }}>{ar}</div>}
      </div>
      {action}
    </div>
  );
}

function TabBar({ active, onChange }) {
  const tabs = [
    { id: 'dashboard', label: 'Home', icon: 'home' },
    { id: 'accounts', label: 'Accounts', icon: 'ledger' },
    { id: 'stores', label: 'Stores', icon: 'store' },
    { id: 'more', label: 'More', icon: 'grid' },
  ];
  return (
    <div style={{ position: 'sticky', bottom: 0, zIndex: 5, background: 'rgba(17,19,24,0.9)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderTop: `1px solid ${C.border}`, display: 'flex', padding: '8px 8px 28px' }}>
      {tabs.map((t) => {
        const on = active === t.id;
        return (
          <button key={t.id} onClick={() => onChange(t.id)} style={{ flex: 1, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, color: on ? C.blue : C.fg3, padding: '6px 0' }}>
            <MIcon name={t.icon} size={22} stroke={on ? 2 : 1.6} />
            <span style={{ fontSize: 10, fontWeight: on ? 700 : 500, fontFamily: C.body }}>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function Scroll({ children, pad = 16 }) {
  return <div style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: pad, paddingBottom: 24 }}>{children}</div>;
}

window._mob = { C, MIcon, Pill, MCard, MField, MBtn, AppBar, TabBar, Scroll };
