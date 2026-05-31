/* global React, Logo, Field, Button, Icon */
// Stage 6 — Auth: Sign Up + Forgot Password (full-bleed, mirrors Login)

function AuthShell({ children, headline, sub }) {
  return (
    <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr 1fr', background: 'var(--gl-bg)' }}>
      <div style={{
        position: 'relative', background: 'var(--gl-surface)', borderRight: '1px solid var(--gl-border)',
        padding: 64, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', overflow: 'hidden',
      }}>
        <Logo size={28} />
        <div style={{
          position: 'absolute', bottom: -40, right: -40, fontFamily: 'var(--gl-font-display)',
          fontWeight: 800, fontSize: 240, lineHeight: 0.9, color: 'var(--gl-fg-1)', opacity: 0.04,
          letterSpacing: '-0.04em', pointerEvents: 'none',
        }}>Ledger</div>
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 440 }}>
          <div style={{ fontWeight: 700, fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#4A7CFF', marginBottom: 24 }}>GeniusLink ERP · v4.2</div>
          <h1 style={{ fontFamily: 'var(--gl-font-display)', fontWeight: 700, fontSize: 36, lineHeight: 1.2, letterSpacing: '-0.025em', color: 'var(--gl-fg-1)', margin: 0 }}>{headline}</h1>
          <div style={{ fontSize: 14, color: 'var(--gl-fg-3)', marginTop: 16, lineHeight: 1.6 }}>{sub}</div>
        </div>
        <div style={{ display: 'flex', gap: 24, fontWeight: 700, fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gl-fg-4)', zIndex: 1 }}>
          <span>© 2024 GeniusLink</span>
          <span style={{ color: 'var(--gl-fg-3)' }}>Status · Operational</span>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 64 }}>
        <div style={{ width: 400 }}>{children}</div>
      </div>
    </div>
  );
}

function SignUp({ onCreate, onLogin }) {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [company, setCompany] = React.useState('');
  return (
    <AuthShell
      headline="Provision a new tenant workspace."
      sub="Set up your organization's ledger, chart of accounts, and first admin user.">
      <div style={{ fontWeight: 700, fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#4A7CFF', marginBottom: 12 }}>Create Account</div>
      <h2 style={{ fontFamily: 'var(--gl-font-display)', fontWeight: 700, fontSize: 26, lineHeight: 1.4, letterSpacing: '-0.025em', color: 'var(--gl-fg-1)', margin: 0 }}>Get started</h2>
      <div style={{ fontSize: 13, color: 'var(--gl-fg-3)', marginTop: 8 }}>You'll be the workspace administrator.</div>

      <form onSubmit={(e) => { e.preventDefault(); onCreate && onCreate(); }} style={{ marginTop: 36, display: 'flex', flexDirection: 'column', gap: 18 }}>
        <Field label="Full Name" required placeholder="e.g. Khalid Al-Rashid" value={name} onChange={setName} />
        <Field label="Work Email" required placeholder="you@company.com" value={email} onChange={setEmail} type="email" />
        <Field label="Organization" required placeholder="e.g. Al-Rashid Trading Co." value={company} onChange={setCompany} />
        <Field label="Password" required placeholder="Minimum 10 characters" type="password" />
        <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer', fontSize: 12, color: 'var(--gl-fg-3)', lineHeight: 1.5 }}>
          <span style={{ width: 16, height: 16, borderRadius: 3, border: '1px solid #4A7CFF', background: '#4A7CFF', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
            <Icon name="check" size={11} color="#fff" stroke={2.5} />
          </span>
          I agree to the Terms of Service and Data Processing Agreement.
        </label>
        <Button type="submit" variant="primary">Create Workspace</Button>
        <div style={{ textAlign: 'center', fontSize: 13, color: 'var(--gl-fg-3)' }}>
          Already have an account?{' '}
          <a href="#" onClick={(e) => { e.preventDefault(); onLogin && onLogin(); }} style={{ color: '#4A7CFF', textDecoration: 'none', fontWeight: 600 }}>Sign in</a>
        </div>
      </form>
    </AuthShell>
  );
}

function ForgotPassword({ onSend, onLogin }) {
  const [email, setEmail] = React.useState('');
  const [sent, setSent] = React.useState(false);
  return (
    <AuthShell
      headline="Reset access to your workspace."
      sub="We'll email a secure, single-use link. All password resets are recorded in the audit log.">
      {!sent ? (
        <>
          <div style={{ fontWeight: 700, fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#4A7CFF', marginBottom: 12 }}>Password Reset</div>
          <h2 style={{ fontFamily: 'var(--gl-font-display)', fontWeight: 700, fontSize: 26, lineHeight: 1.4, letterSpacing: '-0.025em', color: 'var(--gl-fg-1)', margin: 0 }}>Forgot password?</h2>
          <div style={{ fontSize: 13, color: 'var(--gl-fg-3)', marginTop: 8 }}>Enter the email tied to your account.</div>
          <form onSubmit={(e) => { e.preventDefault(); setSent(true); onSend && onSend(); }} style={{ marginTop: 36, display: 'flex', flexDirection: 'column', gap: 20 }}>
            <Field label="Email" required placeholder="you@company.com" value={email} onChange={setEmail} type="email" />
            <Button type="submit" variant="primary">Send Reset Link</Button>
            <div style={{ textAlign: 'center', fontSize: 13, color: 'var(--gl-fg-3)' }}>
              <a href="#" onClick={(e) => { e.preventDefault(); onLogin && onLogin(); }} style={{ color: '#4A7CFF', textDecoration: 'none', fontWeight: 600 }}>Back to sign in</a>
            </div>
          </form>
        </>
      ) : (
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 56, height: 56, borderRadius: 999, background: 'rgba(29,184,138,0.12)', border: '1px solid rgba(29,184,138,0.4)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
            <Icon name="check" size={24} color="#1DB88A" stroke={2} />
          </div>
          <h2 style={{ fontFamily: 'var(--gl-font-display)', fontWeight: 700, fontSize: 22, color: 'var(--gl-fg-1)', margin: 0 }}>Check your inbox</h2>
          <div style={{ fontSize: 13, color: 'var(--gl-fg-3)', marginTop: 12, lineHeight: 1.6 }}>
            A reset link was sent to<br /><strong style={{ color: 'var(--gl-fg-1)', fontFamily: 'var(--gl-font-mono)' }}>{email || 'you@company.com'}</strong>. It expires in 30 minutes.
          </div>
          <div style={{ marginTop: 28 }}>
            <Button variant="secondary" onClick={() => setSent(false)}>Use a different email</Button>
          </div>
        </div>
      )}
    </AuthShell>
  );
}

window.SignUp = SignUp;
window.ForgotPassword = ForgotPassword;
