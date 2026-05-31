/* global React */
// GeniusLink mobile — interactive primitives (window._mui).
// Real controlled inputs / selects / toggles / segmented tabs / search / avatars
// used across Stages E–H so the screens behave like a real app.

const _UI = window._mob;
const { C: UIc, MIcon: UIcon } = _UI;
const { useState: useUIState } = React;

// Controlled text input
function TInput({ label, defaultValue = '', placeholder, mono, ar, type = 'text', icon, required, suffix }) {
  const [v, setV] = useUIState(defaultValue);
  const [focus, setFocus] = useUIState(false);
  return (
    <div dir={ar ? 'rtl' : 'ltr'}>
      {label && <div style={{ fontWeight: 700, fontSize: 10, letterSpacing: '0.05em', textTransform: 'uppercase', color: UIc.fg2, marginBottom: 7, fontFamily: UIc.body }}>{label}{required && <span style={{ color: UIc.red, marginInlineStart: 2 }}>*</span>}</div>}
      <div style={{ height: 46, padding: '0 14px', background: UIc.input, border: `1px solid ${focus ? UIc.blue : UIc.borderStrong}`, borderRadius: 8, display: 'flex', alignItems: 'center', gap: 10, transition: 'border-color 150ms ease' }}>
        {icon && <UIcon name={icon} size={16} color={UIc.fg3} />}
        <input value={v} onChange={(e) => setV(e.target.value)} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)} placeholder={placeholder} type={type}
          style={{ flex: 1, minWidth: 0, background: 'transparent', border: 'none', outline: 'none', fontFamily: mono ? UIc.mono : (ar ? UIc.arabic : UIc.body), fontSize: 14, color: UIc.fg1, textAlign: ar ? 'right' : 'left' }} />
        {suffix}
      </div>
    </div>
  );
}

// Password input with show/hide
function TPassword({ label, placeholder = 'Minimum 10 characters', required }) {
  const [show, setShow] = useUIState(false);
  return (
    <TInput label={label} placeholder={placeholder} required={required} type={show ? 'text' : 'password'}
      suffix={<span onClick={() => setShow(!show)} style={{ color: UIc.fg3, cursor: 'pointer', fontSize: 11, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', fontFamily: UIc.body }}>{show ? 'Hide' : 'Show'}</span>} />
  );
}

// Native select
function TSelect({ label, value, options, required }) {
  const [v, setV] = useUIState(value || options[0]);
  return (
    <div>
      {label && <div style={{ fontWeight: 700, fontSize: 10, letterSpacing: '0.05em', textTransform: 'uppercase', color: UIc.fg2, marginBottom: 7, fontFamily: UIc.body }}>{label}{required && <span style={{ color: UIc.red, marginInlineStart: 2 }}>*</span>}</div>}
      <div style={{ position: 'relative' }}>
        <select value={v} onChange={(e) => setV(e.target.value)}
          style={{ width: '100%', height: 46, padding: '0 40px 0 14px', background: UIc.input, border: `1px solid ${UIc.borderStrong}`, borderRadius: 8, fontFamily: UIc.body, fontSize: 14, color: UIc.fg1, appearance: 'none', cursor: 'pointer', outline: 'none' }}>
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        <span style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: UIc.fg3, display: 'flex', pointerEvents: 'none' }}><UIcon name="chevD" size={15} /></span>
      </div>
    </div>
  );
}

// Stateful toggle
function TSwitch({ label, defaultOn = false }) {
  const [on, setOn] = useUIState(defaultOn);
  return (
    <div onClick={() => setOn(!on)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 0', cursor: 'pointer' }}>
      <span style={{ fontWeight: 700, fontSize: 10, letterSpacing: '0.05em', textTransform: 'uppercase', color: UIc.fg2, fontFamily: UIc.body }}>{label}</span>
      <div style={{ width: 42, height: 24, borderRadius: 999, background: on ? UIc.blue : UIc.input, border: `1px solid ${on ? UIc.blue : UIc.borderStrong}`, position: 'relative', transition: 'background 150ms ease' }}>
        <span style={{ position: 'absolute', top: 2, left: on ? 20 : 2, width: 18, height: 18, borderRadius: 999, background: '#fff', boxShadow: '0 1px 2px rgba(0,0,0,0.3)', transition: 'left 150ms ease' }} />
      </div>
    </div>
  );
}

// Stateful checkbox with label
function TCheckbox({ children, defaultChecked = false }) {
  const [on, setOn] = useUIState(defaultChecked);
  return (
    <div onClick={() => setOn(!on)} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer', fontSize: 12.5, color: UIc.fg3, lineHeight: 1.5, fontFamily: UIc.body }}>
      <span style={{ width: 18, height: 18, borderRadius: 4, border: `1px solid ${on ? UIc.blue : UIc.borderStrong}`, background: on ? UIc.blue : 'transparent', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
        {on && <UIcon name="check" size={12} color="#fff" stroke={2.5} />}
      </span>
      <span>{children}</span>
    </div>
  );
}

// Controlled segmented tabs (filter pills, horizontally scrollable)
function Segmented({ options, value, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 2 }}>
      {options.map((o) => {
        const on = o === value;
        return (
          <span key={o} onClick={() => onChange(o)} style={{ flexShrink: 0, padding: '7px 14px', borderRadius: 999, fontSize: 11, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', fontFamily: UIc.body, cursor: 'pointer', background: on ? UIc.blue : UIc.input, color: on ? '#fff' : UIc.fg3, border: `1px solid ${on ? UIc.blue : UIc.border}`, transition: 'all 120ms ease' }}>{o}</span>
        );
      })}
    </div>
  );
}

// Controlled search bar
function SearchInput({ placeholder = 'Search…', value, onChange }) {
  return (
    <div style={{ height: 44, padding: '0 14px', background: UIc.input, border: `1px solid ${UIc.borderStrong}`, borderRadius: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
      <UIcon name="searchO" size={16} color={UIc.fg3} />
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        style={{ flex: 1, minWidth: 0, background: 'transparent', border: 'none', outline: 'none', fontFamily: UIc.body, fontSize: 14, color: UIc.fg1 }} />
      {value && <span onClick={() => onChange('')} style={{ color: UIc.fg3, cursor: 'pointer', display: 'flex' }}><UIcon name="plus" size={16} /></span>}
    </div>
  );
}

function Avatar({ name, size = 40 }) {
  const initials = name.split(' ').map((w) => w[0]).slice(0, 2).join('');
  return (
    <div style={{ width: size, height: size, borderRadius: 999, flexShrink: 0, background: UIc.input, border: `1px solid ${UIc.borderStrong}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: UIc.display, fontWeight: 700, fontSize: size * 0.36, color: UIc.fg2 }}>{initials}</div>
  );
}

window._mui = { TInput, TPassword, TSelect, TSwitch, TCheckbox, Segmented, SearchInput, Avatar };
