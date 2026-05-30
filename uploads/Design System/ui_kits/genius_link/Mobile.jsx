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
    minus: 'M5 12h14',
    box: 'M3 7l9-4 9 4v10l-9 4-9-4z|M3 7l9 4 9-4|M12 11v10',
    cart: 'M4 5h2l1.6 11h11L21 8H7|M9 20a1 1 0 100-2 1 1 0 000 2z|M17 20a1 1 0 100-2 1 1 0 000 2z',
    doc: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z|M14 2v6h6|M8 13h8|M8 17h5',
    cloud: 'M12 13v8|M8 17l4-4 4 4|M20 16.5A4.5 4.5 0 0 0 16 8h-1.26A7 7 0 1 0 4 15.2',
    info: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z|M12 16v-4|M12 8h.01',
    swap: 'M7 10l-4 4 4 4|M3 14h14|M17 14l4-4-4-4|M21 10H7',
    calendar: 'M5 4h14a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z|M4 9h16|M8 2v4|M16 2v4',
    pin: 'M12 21s-7-6.3-7-11a7 7 0 0 1 14 0c0 4.7-7 11-7 11z|M12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z',
    edit: 'M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7|M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4z',
    settings: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z|M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z',
    building: 'M3 21h18|M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16|M9 9h.01|M13 9h.01|M9 13h.01|M13 13h.01|M9 17h.01|M13 17h.01',
    globe: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z|M2 12h20|M12 2a15 15 0 0 1 0 20|M12 2a15 15 0 0 0 0 20',
    percent: 'M19 5L5 19|M6.5 5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z|M17.5 16a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z',
    refresh: 'M23 4v6h-6|M1 20v-6h6|M3.5 9a9 9 0 0 1 14.85-3.36L23 10|M1 14l4.64 4.36A9 9 0 0 0 20.49 15',
    bell2: 'M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9|M13.7 21a2 2 0 0 1-3.4 0',
    mail: 'M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z|M22 6l-10 7L2 6',
    card: 'M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z|M2 10h20',
    link: 'M10 13a5 5 0 0 0 7 0l2-2a5 5 0 0 0-7-7l-1 1|M14 11a5 5 0 0 0-7 0l-2 2a5 5 0 0 0 7 7l1-1',
    database: 'M12 8c4.4 0 8-1.3 8-3s-3.6-3-8-3-8 1.3-8 3 3.6 3 8 3z|M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5|M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6',
    plug: 'M9 2v6|M15 2v6|M6 8h12v3a6 6 0 0 1-12 0V8z|M12 17v5',
    key: 'M14 7a4 4 0 1 0-3.9 5L3 19v2h3l1-1h2v-2h2l1.1-1.1A4 4 0 0 0 14 7z|M15.5 7.5h.01',
    switch2: 'M16 3h5v5|M21 3l-7 7|M8 21H3v-5|M3 21l7-7',
    clock: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z|M12 6v6l4 2',
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

// Shared stat tile used across multiple screens (stores, ledger, operations)
function Mini({ label, value, sub, hi }) {
  return (
    <div style={{ padding: 14, background: hi ? `${C.green}14` : C.bg, border: `1px solid ${hi ? C.green + '4D' : C.border}`, borderRadius: 10 }}>
      <div style={{ fontWeight: 700, fontSize: 9.5, letterSpacing: '0.06em', textTransform: 'uppercase', color: C.fg3, fontFamily: C.body }}>{label}</div>
      <div style={{ fontFamily: C.mono, fontSize: 20, fontWeight: 600, color: hi ? C.green : C.fg1, marginTop: 6 }}>{value}</div>
      {sub && <div style={{ fontFamily: C.mono, fontSize: 10, color: C.fg3, marginTop: 3 }}>{sub}</div>}
    </div>
  );
}

window._mob = { C, MIcon, Pill, MCard, MField, MBtn, AppBar, TabBar, Scroll, Mini };
