/* global React, Logo, Field, Button, Icon */
// Screen: Login

function Login({ onLogin }) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [remember, setRemember] = React.useState(true);
  const [showPwd, setShowPwd] = React.useState(false);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'grid', gridTemplateColumns: '1fr 1fr',
      background: 'var(--gl-bg)',
    }}>
      {/* Hero side — flat, no gradient (brand rule) */}
      <div style={{
        position: 'relative',
        background: 'var(--gl-surface)',
        borderRight: '1px solid var(--gl-border)',
        padding: '64px',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        overflow: 'hidden',
      }}>
        <Logo size={28} />

        {/* Embossed wordmark */}
        <div style={{
          position: 'absolute', bottom: -40, right: -40,
          fontFamily: 'var(--gl-font-display)',
          fontWeight: 800, fontSize: 240, lineHeight: 0.9,
          color: 'var(--gl-fg-1)', opacity: 0.04,
          letterSpacing: '-0.04em',
          pointerEvents: 'none',
        }}>Ledger</div>

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 440 }}>
          <div style={{
            fontWeight: 700, fontSize: 11, letterSpacing: '0.15em',
            textTransform: 'uppercase', color: '#4A7CFF', marginBottom: 24,
          }}>GeniusLink ERP · v4.2</div>
          <h1 style={{
            fontFamily: 'var(--gl-font-display)',
            fontWeight: 700, fontSize: 36, lineHeight: 1.2,
            letterSpacing: '-0.025em', color: 'var(--gl-fg-1)',
            margin: 0,
          }}>Audit-grade accounting for precision operations.</h1>
          <div style={{
            fontSize: 14, color: 'var(--gl-fg-3)', marginTop: 16, lineHeight: 1.6,
          }}>Bilingual ledger · multi-store inventory · journal entries that balance to the cent.</div>
        </div>

        <div style={{
          display: 'flex', gap: 24, fontWeight: 700, fontSize: 11,
          letterSpacing: '0.15em', textTransform: 'uppercase',
          color: 'var(--gl-fg-4)', zIndex: 1,
        }}>
          <span>© 2024 GeniusLink</span>
          <span style={{ color: 'var(--gl-fg-3)' }}>Status · Operational</span>
        </div>
      </div>

      {/* Form side */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '64px',
      }}>
        <div style={{ width: 380 }}>
          <div style={{
            fontWeight: 700, fontSize: 11, letterSpacing: '0.15em',
            textTransform: 'uppercase', color: '#4A7CFF', marginBottom: 12,
          }}>Sign In</div>
          <h2 style={{
            fontFamily: 'var(--gl-font-display)',
            fontWeight: 700, fontSize: 26, lineHeight: 1.4,
            letterSpacing: '-0.025em', color: 'var(--gl-fg-1)',
            margin: 0,
          }}>Access your workspace</h2>
          <div style={{
            fontSize: 13, color: 'var(--gl-fg-3)', marginTop: 8,
          }}>Enter your credentials to continue to the ledger.</div>

          <form
            onSubmit={(e) => { e.preventDefault(); onLogin && onLogin({ email, password }); }}
            style={{ marginTop: 40, display: 'flex', flexDirection: 'column', gap: 20 }}>

            <Field
              label="Email"
              required
              placeholder="you@company.com"
              value={email}
              onChange={setEmail}
              type="email" />

            {/* Password with eye toggle */}
            <PasswordField value={password} onChange={setPassword} show={showPwd} setShow={setShowPwd} />

            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '4px 0',
            }}>
              <label style={{
                display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer',
                fontSize: 13, color: 'var(--gl-fg-2)',
              }}>
                <CheckBox checked={remember} onChange={() => setRemember(!remember)} />
                Remember this device
              </label>
              <a href="#" style={{
                fontSize: 12, color: '#4A7CFF', textDecoration: 'none',
                fontWeight: 600, letterSpacing: '0.02em',
              }}>Forgot password?</a>
            </div>

            <Button type="submit" variant="primary">Sign In to GeniusLink</Button>

            <div style={{
              padding: '14px 16px',
              background: 'var(--gl-input-bg)',
              border: '1px solid var(--gl-border)',
              borderRadius: 4,
              display: 'flex', alignItems: 'flex-start', gap: 10,
              fontSize: 12, color: 'var(--gl-fg-3)', lineHeight: 1.5,
            }}>
              <span style={{ color: '#4A7CFF', flexShrink: 0, marginTop: 2 }}>
                <Icon name="lock" size={14} />
              </span>
              <span>Sessions are recorded in the audit log with timestamp, IP, and device fingerprint.</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function PasswordField({ value, onChange, show, setShow }) {
  const [focused, setFocused] = React.useState(false);
  return (
    <div>
      <div style={{
        fontWeight: 700, fontSize: 11, letterSpacing: '0.05em',
        textTransform: 'uppercase', color: 'var(--gl-fg-2)', marginBottom: 8,
      }}>Password <span style={{ color: '#EF4444' }}>*</span></div>
      <div style={{
        position: 'relative',
        height: 40, padding: '0 44px 0 16px',
        background: 'var(--gl-input-bg)',
        border: `${focused ? 2 : 1}px solid ${focused ? '#4A7CFF' : 'var(--gl-border-strong)'}`,
        borderRadius: 4,
        transition: 'border-color 150ms ease',
      }}>
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="••••••••"
          style={{
            width: '100%', height: '100%',
            background: 'transparent', border: 'none', outline: 'none',
            fontFamily: 'var(--gl-font-body)', fontSize: 14,
            color: 'var(--gl-fg-1)',
          }} />
        <button
          type="button"
          onClick={() => setShow(!show)}
          style={{
            position: 'absolute', right: 12, top: '50%',
            transform: 'translateY(-50%)',
            background: 'transparent', border: 'none', cursor: 'pointer',
            color: 'var(--gl-fg-3)', display: 'flex', padding: 4,
          }}>
          <Icon name={show ? 'close' : 'info'} size={14} />
        </button>
      </div>
    </div>
  );
}

function CheckBox({ checked, onChange }) {
  return (
    <span
      onClick={onChange}
      style={{
        width: 16, height: 16, borderRadius: 3,
        border: `1px solid ${checked ? '#4A7CFF' : 'var(--gl-border-strong)'}`,
        background: checked ? '#4A7CFF' : 'transparent',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
      {checked && <Icon name="check" size={11} color="#fff" stroke={2.5} />}
    </span>
  );
}

window.Login = Login;
