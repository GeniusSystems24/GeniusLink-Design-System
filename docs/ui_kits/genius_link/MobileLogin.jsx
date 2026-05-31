/* global React */
// GeniusLink mobile — Login screen. Registers into window.MScreens.

const ML = window._mob;
const { C: MLC, MIcon: MLIcon, MField: MLField, MBtn: MLBtn } = ML;

function MLogin({ onLogin, onForgot, onSignup }) {
  return (
    <div style={{ minHeight: '100%', background: MLC.bg, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '72px 28px 40px', boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 40 }}>
        <img src="../../assets/logo-mark.png" style={{ width: 28, height: 28 }} alt="" />
        <span style={{ fontFamily: MLC.display, fontWeight: 800, fontSize: 20, color: MLC.fg1, letterSpacing: '-0.01em' }}>GeniusLink</span>
      </div>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontWeight: 700, fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: MLC.blue, marginBottom: 14, fontFamily: MLC.body }}>Sign In</div>
        <h1 style={{ fontFamily: MLC.display, fontWeight: 700, fontSize: 28, lineHeight: 1.25, letterSpacing: '-0.025em', color: MLC.fg1, margin: 0 }}>Access your workspace</h1>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <MLField label="Email" placeholder="you@company.com" value="layla.a@geniuslink.sa" />
        <MLField label="Password" placeholder="••••••••" value="••••••••••" mono />
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <span onClick={onForgot} style={{ fontSize: 12.5, color: MLC.blue, fontWeight: 600, fontFamily: MLC.body, cursor: 'pointer' }}>Forgot password?</span>
        </div>
        <MLBtn full onClick={onLogin}>Sign In to GeniusLink</MLBtn>
        <div style={{ textAlign: 'center', fontSize: 12.5, color: MLC.fg3, fontFamily: MLC.body }}>
          New organization? <span onClick={onSignup} style={{ color: MLC.blue, fontWeight: 600, cursor: 'pointer' }}>Create a workspace</span>
        </div>
        <div style={{ display: 'flex', gap: 9, padding: '12px 14px', background: MLC.input, border: `1px solid ${MLC.border}`, borderRadius: 8, fontSize: 11.5, color: MLC.fg3, lineHeight: 1.5, fontFamily: MLC.body }}>
          <span style={{ color: MLC.blue, flexShrink: 0, marginTop: 1 }}><MLIcon name="lock" size={14} /></span>
          Sessions are recorded in the audit log with timestamp and device.
        </div>
      </div>
    </div>
  );
}

Object.assign(window.MScreens = window.MScreens || {}, { login: MLogin });
