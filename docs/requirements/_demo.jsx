/* global React */
// Shared chrome for the GeniusLink "New Requirements" phase demos.
// Loaded after React/Babel + ds-kit.jsx. Exports to window.
// Gives every phase a consistent header (phase tag · title · requirement),
// theme toggle, an optional LTR/RTL stage toggle, a live key-log, callouts,
// and a code block — so each phase file only contains its component demo.

const { useState: _uS, useEffect: _uE, useRef: _uR, useCallback: _uC } = React;

/* ── persisted theme (writes body[data-theme]) ── */
function useTheme() {
  const [theme, setTheme] = _uS(() => localStorage.getItem('ds-theme') || 'dark');
  _uE(() => { document.body.dataset.theme = theme === 'light' ? 'light' : ''; localStorage.setItem('ds-theme', theme); }, [theme]);
  return [theme, setTheme];
}

/* ── segmented control ── */
function Segmented({ value, onChange, options, ariaLabel }) {
  return (
    <div role="group" aria-label={ariaLabel} style={{ display: 'inline-flex', gap: 3, background: 'var(--gl-input-bg)', padding: 3, borderRadius: 7, border: '1px solid var(--gl-border)' }}>
      {options.map(o => {
        const v = typeof o === 'string' ? o : o.value;
        const label = typeof o === 'string' ? o : o.label;
        const on = value === v;
        return (
          <button key={v} type="button" onClick={() => onChange(v)} aria-pressed={on}
            style={{ padding: '6px 13px', borderRadius: 5, background: on ? 'var(--gl-surface)' : 'transparent', color: on ? 'var(--gl-fg-1)' : 'var(--gl-fg-3)', border: 'none', cursor: 'pointer', fontFamily: 'var(--gl-font-body)', fontWeight: 700, fontSize: 10.5, letterSpacing: '.09em', textTransform: 'uppercase', boxShadow: on ? 'var(--gl-shadow-sm, 0 1px 2px rgba(0,0,0,.2))' : 'none', transition: 'background var(--gl-dur-base)' }}>
            {label}
          </button>
        );
      })}
    </div>
  );
}

/* ── page header ── */
function DemoHeader({ phase, title, requirement, theme, setTheme, right }) {
  return (
    <div style={{ position: 'sticky', top: 0, zIndex: 100, background: 'color-mix(in srgb, var(--gl-bg) 90%, transparent)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--gl-border)' }}>
      <div style={{ maxWidth: 1180, margin: '0 auto', padding: '16px 40px', display: 'flex', alignItems: 'center', gap: 18 }}>
        <a href="index.html" title="All phases" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none', color: 'inherit', flexShrink: 0 }}>
          <img src="../assets/logo-mark.png" style={{ width: 26, height: 26 }} alt="GeniusLink" />
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: 30, height: 22, padding: '0 8px', borderRadius: 6, background: 'var(--gl-blue-500)', color: '#fff', fontFamily: 'var(--gl-font-mono)', fontWeight: 700, fontSize: 12 }}>{phase}</span>
        </a>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: 'var(--gl-font-display)', fontWeight: 800, fontSize: 17, letterSpacing: '-0.01em', lineHeight: 1.1 }}>{title}</div>
          {requirement && <div style={{ fontSize: 12, color: 'var(--gl-fg-3)', marginTop: 3, lineHeight: 1.4, maxWidth: 760, textWrap: 'pretty' }}>{requirement}</div>}
        </div>
        {right}
        <Segmented value={theme} onChange={setTheme} options={['dark', 'light']} ariaLabel="Theme" />
      </div>
    </div>
  );
}

/* ── content width wrapper ── */
function DemoBody({ children }) {
  return <div style={{ maxWidth: 1180, margin: '0 auto', padding: '36px 40px 140px' }}>{children}</div>;
}

/* ── a titled block that hosts one demo ── */
function Panel({ title, desc, controls, children, dir }) {
  return (
    <section style={{ marginBottom: 40 }}>
      {(title || controls) && (
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, marginBottom: 14, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: 11, alignItems: 'baseline' }}>
            <div style={{ width: 4, height: 18, borderRadius: 12, background: 'var(--gl-blue-500)', transform: 'translateY(3px)' }} />
            <div>
              {title && <h2 style={{ fontFamily: 'var(--gl-font-body)', fontWeight: 700, fontSize: 16, margin: 0, color: 'var(--gl-fg-1)' }}>{title}</h2>}
              {desc && <p style={{ fontSize: 12.5, color: 'var(--gl-fg-3)', margin: '5px 0 0', maxWidth: 680, lineHeight: 1.5, textWrap: 'pretty' }}>{desc}</p>}
            </div>
          </div>
          {controls && <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>{controls}</div>}
        </div>
      )}
      <div dir={dir} style={{ direction: dir || undefined }}>{children}</div>
    </section>
  );
}

/* ── stage card that the component sits inside ── */
function Stage({ children, pad = 22, dir, flush }) {
  return (
    <div dir={dir} style={{ background: 'var(--gl-surface)', border: '1px solid var(--gl-border)', borderRadius: 'var(--gl-radius-lg)', padding: flush ? 0 : pad, boxShadow: 'var(--gl-shadow)', direction: dir || undefined, overflow: 'hidden' }}>{children}</div>
  );
}

/* ── live key log (proves which key resolved to which action) ── */
function useKeyLog(max = 7) {
  const [log, setLog] = _uS([]);
  const push = _uC((key, action, ok = true) => {
    setLog(l => [{ id: Date.now() + Math.random(), key, action, ok }, ...l].slice(0, max));
  }, [max]);
  return [log, push];
}
function KeyLog({ log, title = 'Key log', hint }) {
  return (
    <div dir="ltr" style={{ background: 'var(--gl-bg)', border: '1px solid var(--gl-border)', borderRadius: 'var(--gl-radius-md)', overflow: 'hidden', minWidth: 230 }}>
      <div style={{ padding: '9px 13px', borderBottom: '1px solid var(--gl-border)', display: 'flex', alignItems: 'center', gap: 8 }}>
        <GLIcon name="keyboard" size={15} color="var(--gl-blue-500)" />
        <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--gl-fg-2)' }}>{title}</span>
      </div>
      <div style={{ padding: log.length ? '6px 0' : '16px 13px', minHeight: 40 }}>
        {!log.length
          ? <span style={{ fontSize: 12, color: 'var(--gl-fg-3)' }}>{hint || 'Press a key…'}</span>
          : log.map((e, i) => (
            <div key={e.id} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '4px 13px', opacity: 1 - i * 0.1 }}>
              <Kbd>{e.key}</Kbd>
              <GLIcon name="chevR" size={12} color="var(--gl-fg-4)" />
              <span style={{ fontSize: 12, fontFamily: 'var(--gl-font-mono)', color: e.ok ? 'var(--gl-success-500)' : 'var(--gl-danger-500)' }}>{e.action}</span>
            </div>
          ))}
      </div>
    </div>
  );
}
function Kbd({ children }) {
  return <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: 22, height: 22, padding: '0 6px', borderRadius: 5, background: 'var(--gl-input-bg)', border: '1px solid var(--gl-border-strong)', borderBottomWidth: 2, fontFamily: 'var(--gl-font-mono)', fontSize: 11.5, fontWeight: 600, color: 'var(--gl-fg-1)' }}>{children}</span>;
}

/* ── callout / note ── */
function Callout({ title, children, tone = 'info', icon }) {
  const c = { info: 'var(--gl-blue-500)', success: 'var(--gl-success-500)', warning: 'var(--gl-warning-500)', danger: 'var(--gl-danger-500)' }[tone];
  return (
    <div style={{ display: 'flex', gap: 12, padding: '13px 15px', background: `color-mix(in srgb, ${c} 8%, var(--gl-surface))`, border: `1px solid color-mix(in srgb, ${c} 35%, transparent)`, borderRadius: 'var(--gl-radius-md)' }}>
      <span style={{ color: c, display: 'flex', flexShrink: 0, marginTop: 1 }}><GLIcon name={icon || (tone === 'warning' || tone === 'danger' ? 'alert' : 'infoO')} size={16} /></span>
      <div style={{ fontSize: 13, color: 'var(--gl-fg-2)', lineHeight: 1.55, textWrap: 'pretty' }}>
        {title && <strong style={{ color: 'var(--gl-fg-1)', fontWeight: 700 }}>{title}{' '}</strong>}
        {children}
      </div>
    </div>
  );
}

/* ── before/after diff strip ── */
function FixNote({ before, after }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
      <div style={{ background: 'color-mix(in srgb, var(--gl-danger-500) 7%, var(--gl-surface))', border: '1px solid color-mix(in srgb, var(--gl-danger-500) 30%, transparent)', borderRadius: 'var(--gl-radius-md)', padding: 14 }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--gl-danger-500)', marginBottom: 7 }}>Before — bug</div>
        <div style={{ fontSize: 12.5, color: 'var(--gl-fg-2)', lineHeight: 1.55 }}>{before}</div>
      </div>
      <div style={{ background: 'color-mix(in srgb, var(--gl-success-500) 7%, var(--gl-surface))', border: '1px solid color-mix(in srgb, var(--gl-success-500) 30%, transparent)', borderRadius: 'var(--gl-radius-md)', padding: 14 }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--gl-success-500)', marginBottom: 7 }}>After — fixed</div>
        <div style={{ fontSize: 12.5, color: 'var(--gl-fg-2)', lineHeight: 1.55 }}>{after}</div>
      </div>
    </div>
  );
}

/* ── collapsible Flutter code block ── */
function CodeBlock({ code, label = 'Flutter reference', file, defaultOpen = false }) {
  const [open, setOpen] = _uS(defaultOpen);
  return (
    <div style={{ border: '1px solid var(--gl-border)', borderRadius: 'var(--gl-radius-md)', overflow: 'hidden', background: 'var(--gl-bg)' }}>
      <button type="button" onClick={() => setOpen(o => !o)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '11px 15px', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--gl-fg-1)', textAlign: 'left' }}>
        <span style={{ transform: open ? 'rotate(90deg)' : 'none', transition: 'transform var(--gl-dur-base)', display: 'flex', color: 'var(--gl-fg-3)' }}><GLIcon name="chevR" size={15} /></span>
        <GLIcon name="fileCode" size={16} color="var(--gl-blue-500)" />
        <span style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--gl-fg-1)' }}>{label}</span>
        {file && <span style={{ fontFamily: 'var(--gl-font-mono)', fontSize: 11, color: 'var(--gl-fg-3)', marginInlineStart: 'auto' }}>{file}</span>}
      </button>
      {open && (
        <pre dir="ltr" style={{ margin: 0, padding: '4px 18px 18px', overflowX: 'auto', fontFamily: 'var(--gl-font-mono)', fontSize: 12, lineHeight: 1.6, color: 'var(--gl-fg-2)', tabSize: 2 }}><code>{code}</code></pre>
      )}
    </div>
  );
}

/* ── small inline tag ── */
function Tag({ children, tone = 'neutral' }) {
  const c = { neutral: 'var(--gl-fg-3)', blue: 'var(--gl-blue-500)', green: 'var(--gl-success-500)', orange: 'var(--gl-warning-500)' }[tone];
  return <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '2px 8px', borderRadius: 5, background: `color-mix(in srgb, ${c} 14%, transparent)`, color: c, fontFamily: 'var(--gl-font-mono)', fontSize: 11, fontWeight: 600 }}>{children}</span>;
}

Object.assign(window, { useTheme, Segmented, DemoHeader, DemoBody, Panel, Stage, useKeyLog, KeyLog, Kbd, Callout, FixNote, CodeBlock, Tag });
