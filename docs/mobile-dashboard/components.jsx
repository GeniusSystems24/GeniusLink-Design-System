/* global React, window */
// GeniusLink Mobile Dashboard — presentational components. Exports to window.
const { useState: useS, useRef: useR, useEffect: useE } = React;
const _g = window;
const GLIcon = _g.GLIcon, DSPill = _g.DSPill;
const MARK = { blue: 'var(--gl-marker-blue)', green: 'var(--gl-marker-green)', orange: 'var(--gl-marker-orange)' };
const TONE = { success: 'var(--gl-success-500)', info: 'var(--gl-blue-500)', warning: 'var(--gl-warning-500)', danger: 'var(--gl-danger-500)', neutral: 'var(--gl-fg-3)' };
const pick = (o, lang) => (o && typeof o === 'object' && 'en' in o) ? o[lang] : o;
const fontFor = (lang) => lang === 'ar' ? 'var(--gl-font-arabic)' : 'var(--gl-font-body)';

/* ── shimmer skeleton block ── */
function Sk({ w = '100%', h = 12, r = 6, mt = 0 }) {
  return <div style={{ width: w, height: h, borderRadius: r, marginTop: mt, position: 'relative', overflow: 'hidden', background: 'var(--gl-input-bg)' }}>
    <div style={{ position: 'absolute', inset: 0, transform: 'translateX(-100%)', background: 'linear-gradient(90deg, transparent, color-mix(in srgb, var(--gl-fg-3) 14%, transparent), transparent)', animation: 'glsh 1.3s infinite' }} />
  </div>;
}

/* ── section header (4px marker bar + title + trailing) ── */
function SecHead({ title, sub, lang, trailing, marker = 'blue' }) {
  return <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
    <span style={{ width: 4, height: 22, borderRadius: 4, background: MARK[marker], flexShrink: 0 }} />
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontFamily: 'var(--gl-font-body)', fontWeight: 700, fontSize: 16, color: 'var(--gl-fg-1)', lineHeight: 1.2 }}>{title}</div>
      {sub && <div style={{ fontFamily: fontFor(lang), fontSize: 11.5, color: 'var(--gl-fg-3)', marginTop: 2 }}>{sub}</div>}
    </div>
    {trailing}
  </div>;
}

/* ── domain tabs (underline style, DS tokens) ── */
function DomainTabs({ tabs, active, onChange, lang }) {
  return <div role="tablist" style={{ display: 'flex', gap: 4, borderBottom: '1px solid var(--gl-border)' }}>
    {tabs.map(tb => {
      const on = tb.id === active;
      return <button key={tb.id} role="tab" aria-selected={on} onClick={() => onChange(tb.id)} style={{
        position: 'relative', flex: 1, minHeight: 44, padding: '10px 4px 12px', border: 'none', cursor: 'pointer',
        background: 'transparent', color: on ? 'var(--gl-fg-1)' : 'var(--gl-fg-3)', fontFamily: fontFor(lang),
        fontWeight: on ? 700 : 500, fontSize: 15, transition: 'color var(--gl-dur-base) var(--gl-ease-standard)',
      }}>
        {pick(tb.label, lang)}
        <span style={{ position: 'absolute', insetInline: 6, bottom: -1, height: 2.5, borderRadius: 3, background: 'var(--gl-blue-500)', opacity: on ? 1 : 0, transform: on ? 'scaleX(1)' : 'scaleX(0.5)', transition: 'opacity var(--gl-dur-base), transform var(--gl-dur-base) var(--gl-ease-out)' }} />
      </button>;
    })}
  </div>;
}

/* ── compare-period segmented (Day/Week/Month) ── */
function PeriodSeg({ value, onChange, str, lang }) {
  const opts = [['day', str.day], ['week', str.week], ['month', str.month]];
  return <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
    <span style={{ fontFamily: 'var(--gl-font-body)', fontWeight: 700, fontSize: 10, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--gl-fg-3)' }}>{pick(str.period, lang)}</span>
    <div style={{ display: 'flex', gap: 2, padding: 3, background: 'var(--gl-input-bg)', border: '1px solid var(--gl-border)', borderRadius: 'var(--gl-radius-md)' }}>
      {opts.map(([k, lbl]) => {
        const on = k === value;
        return <button key={k} onClick={() => onChange(k)} style={{
          minHeight: 28, padding: '0 11px', border: 'none', cursor: 'pointer', borderRadius: 'var(--gl-radius-sm)',
          background: on ? 'var(--gl-blue-500)' : 'transparent', color: on ? '#fff' : 'var(--gl-fg-3)',
          fontFamily: fontFor(lang), fontWeight: on ? 700 : 500, fontSize: 12, transition: 'all var(--gl-dur-base)',
        }}>{pick(lbl, lang)}</button>;
      })}
    </div>
  </div>;
}

/* ── metric card ── */
function MetricCard({ card, cur, lang, period, loading }) {
  if (loading) return <div style={cardBox()}><Sk w="58%" h={9} /><Sk w="80%" h={20} mt={12} /><Sk w="44%" h={9} mt={12} /></div>;
  const tr = card.trend[period];
  const isUp = tr && tr.dir === 'up';
  const trColor = tr ? (isUp ? 'var(--gl-success-500)' : 'var(--gl-danger-500)') : 'var(--gl-fg-4)';
  return <div style={{ ...cardBox(), position: 'relative', overflow: 'hidden' }}>
    <span style={{ position: 'absolute', insetInlineStart: 0, top: 14, bottom: 14, width: 3, borderRadius: 3, background: MARK[card.marker] }} />
    <div style={{ fontFamily: fontFor(lang), fontWeight: 700, fontSize: 10.5, letterSpacing: '.05em', textTransform: 'uppercase', color: 'var(--gl-fg-2)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{pick(card.label, lang)}</div>
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 5, marginTop: 9 }}>
      <span style={{ fontFamily: 'var(--gl-font-mono)', fontSize: 10, fontWeight: 500, color: 'var(--gl-fg-3)' }}>{cur}</span>
      <span style={{ fontFamily: 'var(--gl-font-mono)', fontSize: 20, fontWeight: 700, color: 'var(--gl-fg-1)', letterSpacing: '-0.04em', fontFeatureSettings: '"tnum" 1' }}>{_g.glNum(card.val[cur], lang)}</span>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 9, height: 16 }}>
      {tr ? <>
        <span style={{ color: trColor, fontSize: 11, lineHeight: 1 }}>{isUp ? '▲' : '▼'}</span>
        <span style={{ fontFamily: 'var(--gl-font-mono)', fontSize: 12, fontWeight: 700, color: trColor }}>{_g.glNum(tr.pct, lang)}%</span>
      </> : <span style={{ fontFamily: 'var(--gl-font-mono)', fontSize: 12, color: 'var(--gl-fg-4)' }}>—</span>}
    </div>
  </div>;
}
function cardBox() { return { background: 'var(--gl-surface)', border: '1px solid var(--gl-border)', borderRadius: 'var(--gl-radius-lg)', boxShadow: 'var(--gl-shadow)', padding: '14px 14px 14px 16px' }; }

/* ── quick actions (compact grid: 4 cols, smaller tiles, last = "More") ── */
function QuickActions({ actions, lang, onTap, onMore, maxTiles = 7, loading }) {
  if (loading) return <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
    {[0, 1, 2, 3, 4, 5, 6, 7].map(i => <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7, padding: '4px 2px' }}>
      <Sk w={46} h={46} r={14} /><Sk w={42} h={9} mt={1} />
    </div>)}
  </div>;
  const shown = actions.slice(0, maxTiles);
  const tiles = shown.map(a => ({ a, more: false }));
  tiles.push({ more: true });
  return <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
    {tiles.map((it, i) => it.more
      ? <button key="more" onClick={onMore} className="gl-press" style={qaTile('dash')}>
          <span style={{ ...qaIcon('var(--gl-fg-3)'), borderStyle: 'dashed', background: 'transparent', borderWidth: 1.5, borderColor: 'var(--gl-border-strong)' }}><GLIcon name="dots" size={18} /></span>
          <span style={qaLabel(lang)}>{pick(W.GL_STR.viewAll, lang)}</span>
        </button>
      : <button key={it.a.id} onClick={() => onTap(it.a)} className="gl-press" style={qaTile()}>
          <span style={qaIcon('var(--gl-blue-500)')}><GLIcon name={it.a.icon} size={18} /></span>
          <span style={qaLabel(lang)}>{pick(it.a.label, lang)}</span>
        </button>)}
  </div>;
}
function qaTile(kind) { return { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7, padding: '4px 2px', background: 'none', border: 'none', cursor: 'pointer', minHeight: 44 }; }
function qaIcon(color) { return { width: 46, height: 46, borderRadius: 14, background: `color-mix(in srgb, ${color} 13%, transparent)`, color, border: '1px solid transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }; }
function qaLabel(lang) { return { fontFamily: fontFor(lang), fontSize: 11, fontWeight: 600, color: 'var(--gl-fg-2)', textAlign: 'center', lineHeight: 1.15, maxWidth: 64, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }; }

/* ── bottom sheet (slide-up + scrim) ── */
function BottomSheet({ open, onClose, title, lang, children }) {
  const [mounted, setMounted] = useS(open);
  const [show, setShow] = useS(false);
  useE(() => {
    if (open) {
      setMounted(true);
      const tm = setTimeout(() => setShow(true), 20);
      return () => clearTimeout(tm);
    } else {
      setShow(false);
      const tm = setTimeout(() => setMounted(false), 280);
      return () => clearTimeout(tm);
    }
  }, [open]);
  if (!mounted) return null;
  return <div style={{ position: 'absolute', inset: 0, zIndex: 80, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
    <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', opacity: show ? 1 : 0, transition: 'opacity .26s var(--gl-ease-standard)' }} />
    <div role="dialog" style={{ position: 'relative', maxHeight: '78%', display: 'flex', flexDirection: 'column', background: 'var(--gl-surface)', borderTopLeftRadius: 22, borderTopRightRadius: 22, borderTop: '1px solid var(--gl-border-strong)', boxShadow: 'var(--gl-shadow-pop)', transform: show ? 'translateY(0)' : 'translateY(100%)', transition: 'transform .3s var(--gl-ease-out)', paddingBottom: 28 }}>
      <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 10, paddingBottom: 4 }}><span style={{ width: 40, height: 4, borderRadius: 4, background: 'var(--gl-border-strong)' }} /></div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 18px 12px' }}>
        <span style={{ fontFamily: 'var(--gl-font-display)', fontWeight: 800, fontSize: 18, color: 'var(--gl-fg-1)', whiteSpace: 'nowrap' }}>{title}</span>
        <button onClick={onClose} className="gl-press" style={{ width: 32, height: 32, borderRadius: 999, background: 'var(--gl-input-bg)', border: '1px solid var(--gl-border)', color: 'var(--gl-fg-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><GLIcon name="close" size={16} /></button>
      </div>
      <div style={{ overflowY: 'auto', padding: '0 18px' }}>{children}</div>
    </div>
  </div>;
}

/* ── full action list inside the sheet, grouped ── */
function ActionSheetBody({ actions, lang, onTap }) {
  const groups = [['create', pick(W.GL_STR.grpCreate, lang)], ['manage', pick(W.GL_STR.grpManage, lang)]];
  return <div>
    {groups.map(([g, label]) => {
      const items = actions.filter(a => (a.group || 'create') === g);
      if (!items.length) return null;
      return <div key={g} style={{ marginBottom: 18 }}>
        <div style={{ fontFamily: 'var(--gl-font-body)', fontWeight: 700, fontSize: 10, letterSpacing: '.09em', textTransform: 'uppercase', color: 'var(--gl-fg-3)', marginBottom: 10 }}>{label}</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
          {items.map(a => <button key={a.id} onClick={() => onTap(a)} className="gl-press" style={qaTile()}>
            <span style={qaIcon('var(--gl-blue-500)')}><GLIcon name={a.icon} size={18} /></span>
            <span style={qaLabel(lang)}>{pick(a.label, lang)}</span>
          </button>)}
        </div>
      </div>;
    })}
  </div>;
}

/* ── view-style popup button (Cards / Charts) ── */
function ViewPopup({ value, onChange, lang, str }) {
  const [open, setOpen] = useS(false);
  const opts = [['cards', str.cardsView, 'grid'], ['chart', str.chartView, 'poll']];
  const cur = opts.find(o => o[0] === value);
  return <div style={{ position: 'relative' }}>
    <button onClick={() => setOpen(v => !v)} aria-haspopup="listbox" aria-label={pick(cur[1], lang)} className="gl-press" style={{ display: 'flex', alignItems: 'center', gap: 5, height: 34, padding: '0 10px', background: 'var(--gl-input-bg)', border: '1px solid var(--gl-border)', borderRadius: 'var(--gl-radius-md)', cursor: 'pointer' }}>
      <span style={{ color: 'var(--gl-fg-1)', display: 'flex' }}><GLIcon name={cur[2]} size={16} /></span>
      <span style={{ color: 'var(--gl-fg-3)', display: 'flex' }}><GLIcon name="chevD" size={13} /></span>
    </button>
    {open && <>
      <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 44 }} />
      <div role="listbox" style={{ position: 'absolute', zIndex: 45, top: 40, insetInlineStart: 0, width: 150, background: 'var(--gl-surface)', border: '1px solid var(--gl-border-strong)', borderRadius: 'var(--gl-radius-md)', boxShadow: 'var(--gl-shadow-pop)', padding: 5 }}>
        {opts.map(([k, lbl, ic]) => {
          const on = k === value;
          return <button key={k} role="option" aria-selected={on} onClick={() => { onChange(k); setOpen(false); }} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 9, padding: '9px 10px', minHeight: 42, background: on ? 'var(--gl-hover)' : 'transparent', border: 'none', borderRadius: 'var(--gl-radius-sm)', cursor: 'pointer', textAlign: 'start' }}>
            <span style={{ color: on ? 'var(--gl-blue-500)' : 'var(--gl-fg-3)', display: 'flex' }}><GLIcon name={ic} size={16} /></span>
            <span style={{ flex: 1, fontFamily: fontFor(lang), fontSize: 13, fontWeight: on ? 700 : 500, color: on ? 'var(--gl-blue-500)' : 'var(--gl-fg-1)' }}>{pick(lbl, lang)}</span>
            {on && <span style={{ color: 'var(--gl-blue-500)', display: 'flex' }}><GLIcon name="check" size={15} /></span>}
          </button>;
        })}
      </div>
    </>}
  </div>;
}

/* ── currency selector popup (anchored, used in the controls row) ── */
function CurrencyPopup({ cur, onChange, lang, currencies, str, dir }) {
  const [open, setOpen] = useS(false);
  return <div style={{ position: 'relative' }}>
    <button onClick={() => setOpen(v => !v)} aria-haspopup="listbox" className="gl-press" style={{ display: 'flex', alignItems: 'center', gap: 5, height: 34, padding: '0 11px', background: 'var(--gl-input-bg)', border: '1px solid var(--gl-border-strong)', borderRadius: 'var(--gl-radius-md)', cursor: 'pointer' }}>
      <span style={{ fontFamily: 'var(--gl-font-mono)', fontSize: 13, fontWeight: 700, color: 'var(--gl-fg-1)' }}>{cur}</span>
      <span style={{ color: 'var(--gl-fg-3)', display: 'flex' }}><GLIcon name="chevD" size={13} /></span>
    </button>
    {open && <>
      <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 44 }} />
      <div role="listbox" style={{ position: 'absolute', zIndex: 45, top: 40, insetInlineStart: 0, width: 224, background: 'var(--gl-surface)', border: '1px solid var(--gl-border-strong)', borderRadius: 'var(--gl-radius-lg)', boxShadow: 'var(--gl-shadow-pop)', padding: 6 }}>
        <div style={{ fontFamily: 'var(--gl-font-body)', fontWeight: 700, fontSize: 10, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--gl-fg-3)', padding: '8px 10px 6px' }}>{pick(str.selectCurrency, lang)}</div>
        {currencies.map(c => {
          const on = c.code === cur;
          return <button key={c.code} role="option" aria-selected={on} onClick={() => { onChange(c.code); setOpen(false); }} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px', minHeight: 44, background: on ? 'var(--gl-hover)' : 'transparent', border: 'none', borderRadius: 'var(--gl-radius-sm)', cursor: 'pointer', textAlign: 'start' }}>
            <span style={{ fontFamily: 'var(--gl-font-mono)', fontSize: 13, fontWeight: 700, color: on ? 'var(--gl-blue-500)' : 'var(--gl-fg-1)', width: 38 }}>{c.code}</span>
            <span style={{ flex: 1, fontFamily: fontFor(lang), fontSize: 13, color: 'var(--gl-fg-2)' }}>{pick(c.label, lang)}</span>
            {on && <span style={{ color: 'var(--gl-blue-500)', display: 'flex' }}><GLIcon name="check" size={16} /></span>}
          </button>;
        })}
      </div>
    </>}
  </div>;
}

/* hamburger / side-menu glyph (not in the DS icon set) */
function MenuGlyph({ size = 20 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M4 7h16" /><path d="M4 12h16" /><path d="M4 17h16" /></svg>;
}

/* small segmented control used inside the drawer */
function DrawerSeg({ label, value, options, onChange, lang }) {
  return <div style={{ padding: '10px 12px' }}>
    <div style={{ fontFamily: fontFor(lang), fontSize: 12.5, fontWeight: 600, color: 'var(--gl-fg-2)', marginBottom: 8 }}>{label}</div>
    <div style={{ display: 'flex', gap: 3, padding: 3, background: 'var(--gl-input-bg)', border: '1px solid var(--gl-border)', borderRadius: 'var(--gl-radius-md)' }}>
      {options.map(([val, lbl]) => {
        const on = val === value;
        return <button key={String(val)} onClick={() => onChange(val)} style={{ flex: 1, minHeight: 32, border: 'none', cursor: 'pointer', borderRadius: 'var(--gl-radius-sm)', background: on ? 'var(--gl-blue-500)' : 'transparent', color: on ? '#fff' : 'var(--gl-fg-3)', fontFamily: fontFor(lang), fontWeight: on ? 700 : 500, fontSize: 12.5, transition: 'all var(--gl-dur-base)' }}>{lbl}</button>;
      })}
    </div>
  </div>;
}

/* ── side drawer (slides from the start edge) ── */
function SideDrawer({ open, onClose, lang, dir, str, workspace, onTap, prefs, onPref }) {
  const [mounted, setMounted] = useS(open);
  useE(() => {
    if (open) { setMounted(true); }
    else { const tm = setTimeout(() => setMounted(false), 240); return () => clearTimeout(tm); }
  }, [open]);
  if (!mounted) return null;
  const items = [
    ['dashboard', str.home, 'home'], ['accounts', str.accounts, 'inbox'], ['journal', str.journal, 'doc'],
    ['contacts', str.contacts, 'user'], ['reports', str.reports, 'poll'], ['settings', str.settings, 'dots'],
  ];
  const slideAnim = dir === 'rtl' ? 'gldrawerR' : 'gldrawerL';
  return <div style={{ position: 'absolute', inset: 0, zIndex: 85, display: 'flex' }}>
    <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }} />
    <div style={{ position: 'relative', width: '80%', maxWidth: 300, height: '100%', background: 'var(--gl-surface)', borderInlineEnd: '1px solid var(--gl-border-strong)', boxShadow: 'var(--gl-shadow-pop)', display: 'flex', flexDirection: 'column', animation: open ? (slideAnim + ' .26s var(--gl-ease-out) both') : 'none' }}>
      {/* workspace header */}
      <div style={{ padding: 'calc(env(safe-area-inset-top, 0px) + 18px) 18px 16px', borderBottom: '1px solid var(--gl-border)', display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ width: 42, height: 42, borderRadius: 12, background: 'color-mix(in srgb, var(--gl-blue-500) 16%, transparent)', color: 'var(--gl-blue-500)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><GLIcon name="grid" size={20} /></span>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontFamily: 'var(--gl-font-display)', fontWeight: 700, fontSize: 15, color: 'var(--gl-fg-1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{pick(workspace.name, lang)}</div>
          <div style={{ fontFamily: 'var(--gl-font-mono)', fontSize: 11, color: 'var(--gl-fg-3)' }}>{pick(workspace.tag, lang)}</div>
        </div>
      </div>
      {/* nav items */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '10px 10px' }}>
        {items.map(([id, lbl, ic]) => <button key={id} onClick={() => onTap(pick(lbl, lang))} className="gl-press" style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '12px', minHeight: 48, background: 'none', border: 'none', borderRadius: 'var(--gl-radius-md)', cursor: 'pointer', textAlign: 'start', color: 'var(--gl-fg-1)' }}>
          <span style={{ color: 'var(--gl-fg-2)', display: 'flex' }}><GLIcon name={ic} size={19} /></span>
          <span style={{ flex: 1, fontFamily: fontFor(lang), fontSize: 14.5, fontWeight: 600 }}>{pick(lbl, lang)}</span>
          <span style={{ color: 'var(--gl-fg-4)', display: 'flex' }}><GLIcon name={dir === 'rtl' ? 'back' : 'chevR'} size={16} /></span>
        </button>)}

        {/* preferences */}
        <div style={{ marginTop: 8, paddingTop: 12, borderTop: '1px solid var(--gl-border)' }}>
          <div style={{ fontFamily: 'var(--gl-font-body)', fontWeight: 700, fontSize: 10, letterSpacing: '.09em', textTransform: 'uppercase', color: 'var(--gl-fg-3)', padding: '2px 12px 4px' }}>{pick(str.preferences, lang)}</div>
          <DrawerSeg label={pick(str.themeLabel, lang)} value={prefs.theme} lang={lang} onChange={v => onPref('theme', v)} options={[['dark', pick(str.optDark, lang)], ['light', pick(str.optLight, lang)]]} />
          <DrawerSeg label={pick(str.languageLabel, lang)} value={prefs.lang} lang={lang} onChange={v => onPref('lang', v)} options={[['en', 'English'], ['ar', 'العربية']]} />
          <DrawerSeg label={pick(str.connectionLabel, lang)} value={prefs.online ? 'on' : 'off'} lang={lang} onChange={v => onPref('online', v === 'on')} options={[['on', pick(str.optOnline, lang)], ['off', pick(str.optOffline, lang)]]} />
        </div>
      </div>
      {/* sign out */}
      <div style={{ padding: '12px 10px calc(env(safe-area-inset-bottom, 0px) + 14px)', borderTop: '1px solid var(--gl-border)' }}>
        <button onClick={() => onTap(pick(str.signOut, lang))} className="gl-press" style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '12px', minHeight: 48, background: 'none', border: 'none', borderRadius: 'var(--gl-radius-md)', cursor: 'pointer', textAlign: 'start', color: 'var(--gl-danger-500)' }}>
          <span style={{ display: 'flex' }}><GLIcon name="ban" size={19} /></span>
          <span style={{ flex: 1, fontFamily: fontFor(lang), fontSize: 14.5, fontWeight: 600 }}>{pick(str.signOut, lang)}</span>
        </button>
      </div>
    </div>
  </div>;
}

/* ── area + line trend chart (SVG) ── */
function TrendChart({ series, finalValue, cur, lang, color, axis, dir }) {
  const W_ = 320, H = 132, padL = 8, padR = 8, padT = 14, padB = 22;
  const n = series.length;
  const vals = series.map(s => s * finalValue);
  const min = Math.min(...vals), max = Math.max(...vals);
  const span = (max - min) || 1;
  const lo = min - span * 0.18, hi = max + span * 0.12;
  const iw = W_ - padL - padR, ih = H - padT - padB;
  const xx = (i) => padL + (n === 1 ? iw / 2 : (i / (n - 1)) * iw);
  const yy = (v) => padT + ih - ((v - lo) / (hi - lo)) * ih;
  const pts = vals.map((v, i) => [xx(i), yy(v)]);
  const line = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
  const area = `M${xx(0).toFixed(1)} ${(padT + ih).toFixed(1)} ` + pts.map(p => `L${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ') + ` L${xx(n - 1).toFixed(1)} ${(padT + ih).toFixed(1)} Z`;
  const gid = 'gr' + Math.round(finalValue);
  const last = pts[n - 1];
  // pick ~5 tick labels spread across n
  const ticks = axis || [];
  const tickIdx = ticks.map((_, i) => Math.round((i / (ticks.length - 1)) * (n - 1)));
  return <svg viewBox={`0 0 ${W_} ${H}`} width="100%" height={H} style={{ display: 'block', transform: dir === 'rtl' ? 'scaleX(-1)' : 'none' }} preserveAspectRatio="none">
    <defs>
      <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={color} stopOpacity="0.30" />
        <stop offset="100%" stopColor={color} stopOpacity="0.02" />
      </linearGradient>
    </defs>
    {[0.5].map(f => { const gy = padT + ih * f; return <line key={f} x1={padL} y1={gy} x2={W_ - padR} y2={gy} stroke="var(--gl-border)" strokeWidth="1" strokeDasharray="3 4" />; })}
    <path d={area} fill={`url(#${gid})`} />
    <path d={line} fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx={last[0]} cy={last[1]} r="4.5" fill={color} stroke="var(--gl-surface)" strokeWidth="2.5" />
    {ticks.map((lb, i) => <text key={i} x={xx(tickIdx[i])} y={H - 6} fill="var(--gl-fg-3)" fontSize="10" fontFamily="var(--gl-font-mono)" textAnchor="middle" style={{ transform: dir === 'rtl' ? 'scaleX(-1)' : 'none', transformOrigin: `${xx(tickIdx[i])}px 0px` }}>{lb}</text>)}
  </svg>;
}

/* ── horizontal comparison bars across the tab's metrics ── */
function CompareBars({ cards, cur, lang }) {
  const vals = cards.map(c => c.val[cur]);
  const max = Math.max(...vals) || 1;
  return <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
    {cards.map((c, i) => {
      const pctW = Math.max(4, (c.val[cur] / max) * 100);
      const col = MARK[c.marker];
      return <div key={c.id}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 10, marginBottom: 6 }}>
          <span style={{ fontFamily: fontFor(lang), fontSize: 12, fontWeight: 600, color: 'var(--gl-fg-2)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{pick(c.label, lang)}</span>
          <span style={{ fontFamily: 'var(--gl-font-mono)', fontSize: 12.5, fontWeight: 700, color: 'var(--gl-fg-1)', whiteSpace: 'nowrap', direction: 'ltr' }}>{cur} {W.glNum(c.val[cur], lang)}</span>
        </div>
        <div style={{ height: 8, borderRadius: 6, background: 'var(--gl-input-bg)', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: pctW + '%', borderRadius: 6, background: col, transition: 'width .5s var(--gl-ease-out)' }} />
        </div>
      </div>;
    })}
  </div>;
}

/* ── chart view panel: metric chips + area chart + comparison bars ── */
function ChartView({ cards, cur, lang, period, loading, str, dir, sel, onSel }) {
  if (loading) return <div style={{ ...cardBox(), padding: 16 }}><Sk w="40%" h={10} /><Sk w="100%" h={132} mt={14} r={10} /><Sk w="60%" h={10} mt={14} /></div>;
  const card = cards.find(c => c.id === sel) || cards[0];
  const tr = card.trend[period];
  const isUp = tr && tr.dir === 'up';
  const trColor = tr ? (isUp ? 'var(--gl-success-500)' : 'var(--gl-danger-500)') : 'var(--gl-fg-4)';
  const lineColor = MARK[card.marker];
  const axis = (W.GL_AXIS[period] || {})[lang === 'ar' ? 'ar' : 'en'] || [];
  return <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
    {/* metric chips */}
    <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 2, margin: '0 -2px', WebkitOverflowScrolling: 'touch' }}>
      {cards.map(c => {
        const on = c.id === card.id;
        return <button key={c.id} onClick={() => onSel(c.id)} className="gl-press" style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 7, height: 32, padding: '0 12px', borderRadius: 999, cursor: 'pointer', border: '1px solid ' + (on ? 'transparent' : 'var(--gl-border)'), background: on ? 'color-mix(in srgb, ' + MARK[c.marker] + ' 16%, transparent)' : 'var(--gl-input-bg)', fontFamily: fontFor(lang), fontSize: 12, fontWeight: on ? 700 : 500, color: on ? MARK[c.marker] : 'var(--gl-fg-3)' }}>
          <span style={{ width: 7, height: 7, borderRadius: 999, background: MARK[c.marker] }} />{pick(c.label, lang)}
        </button>;
      })}
    </div>
    {/* chart card */}
    <div style={{ ...cardBox(), padding: '16px 14px 10px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, marginBottom: 6, padding: '0 4px' }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontFamily: fontFor(lang), fontSize: 11, fontWeight: 600, color: 'var(--gl-fg-3)' }}>{pick(str.trendOver, lang)} · {pick(str[period], lang)}</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 5, marginTop: 4 }}>
            <span style={{ fontFamily: 'var(--gl-font-mono)', fontSize: 11, fontWeight: 500, color: 'var(--gl-fg-3)' }}>{cur}</span>
            <span style={{ fontFamily: 'var(--gl-font-mono)', fontSize: 22, fontWeight: 700, color: 'var(--gl-fg-1)', letterSpacing: '-0.04em' }}>{W.glNum(card.val[cur], lang)}</span>
          </div>
        </div>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, height: 24, padding: '0 9px', borderRadius: 999, background: `color-mix(in srgb, ${trColor} 14%, transparent)`, color: trColor, fontFamily: 'var(--gl-font-mono)', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
          {tr ? <>{isUp ? '▲' : '▼'} {W.glNum(tr.pct, lang)}%</> : '—'}
        </span>
      </div>
      <TrendChart series={card.series[period]} finalValue={card.val[cur]} cur={cur} lang={lang} color={lineColor} axis={axis} dir={dir} />
    </div>
    {/* comparison bars */}
    <div style={{ ...cardBox(), padding: 16 }}>
      <div style={{ marginBottom: 13 }}>
        <div style={{ fontFamily: 'var(--gl-font-body)', fontWeight: 700, fontSize: 13.5, color: 'var(--gl-fg-1)' }}>{pick(str.breakdown, lang)}</div>
        <div style={{ fontFamily: fontFor(lang), fontSize: 11, color: 'var(--gl-fg-3)', marginTop: 1 }}>{pick(str.breakdownSub, lang)}</div>
      </div>
      <CompareBars cards={cards} cur={cur} lang={lang} />
    </div>
  </div>;
}

/* ── recent operation row ── */
function OpRow({ op, cur, lang, last }) {
  const credit = op.dir === 'credit';
  const amtColor = credit ? 'var(--gl-success-500)' : 'var(--gl-danger-500)';
  const sign = credit ? '+' : '−';
  return <div style={{ padding: '12px 0', borderBottom: last ? 'none' : '1px solid var(--gl-border)' }}>
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 10 }}>
      <span style={{ fontFamily: fontFor(lang), fontSize: 14, fontWeight: 600, color: 'var(--gl-fg-1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flex: 1 }}>{pick(op.desc, lang)}</span>
      <span style={{ fontFamily: 'var(--gl-font-mono)', fontSize: 14, fontWeight: 700, color: amtColor, whiteSpace: 'nowrap', direction: 'ltr' }}>{sign}{_g.glMoney(op.amt[cur], cur, lang, { decimals: true })}</span>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginTop: 7 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
        <span style={{ fontFamily: 'var(--gl-font-mono)', fontSize: 11, color: 'var(--gl-blue-500)', whiteSpace: 'nowrap' }}>{op.ref}</span>
        <DSPill tone={op.tone}>{pick(op.type, lang)}</DSPill>
      </div>
      <span style={{ fontFamily: fontFor(lang), fontSize: 11, color: 'var(--gl-fg-3)', whiteSpace: 'nowrap' }}>{pick(op.time, lang)}</span>
    </div>
  </div>;
}

function OpRowSkeleton({ last }) {
  return <div style={{ padding: '14px 0', borderBottom: last ? 'none' : '1px solid var(--gl-border)' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}><Sk w="52%" h={13} /><Sk w="22%" h={13} /></div>
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginTop: 9 }}><Sk w="38%" h={9} /><Sk w="16%" h={9} /></div>
  </div>;
}

/* ── needs attention (global) ── */
function AttentionItem({ it, lang, last }) {
  const c = TONE[it.tone];
  return <button className="gl-press" style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: last ? 'none' : '1px solid var(--gl-border)', background: 'none', border: 'none', borderBottomStyle: 'solid', cursor: 'pointer', textAlign: 'start' }}>
    <span style={{ width: 38, height: 38, borderRadius: 10, background: `color-mix(in srgb, ${c} 16%, transparent)`, color: c, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><GLIcon name={it.icon} size={18} /></span>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontFamily: fontFor(lang), fontSize: 13.5, fontWeight: 600, color: 'var(--gl-fg-1)' }}>{pick(it.label, lang)}</div>
      <div style={{ fontFamily: fontFor(lang), fontSize: 11.5, color: 'var(--gl-fg-3)', marginTop: 1 }}>{pick(it.desc, lang)}</div>
    </div>
    <span style={{ minWidth: 24, height: 24, padding: '0 7px', borderRadius: 999, background: `color-mix(in srgb, ${c} 16%, transparent)`, color: c, fontFamily: 'var(--gl-font-mono)', fontSize: 12, fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{_g.glNum(it.count, lang)}</span>
    <span style={{ color: 'var(--gl-fg-4)', display: 'flex', flexShrink: 0 }}><GLIcon name="chevR" size={16} /></span>
  </button>;
}

/* ── global search overlay: searches operations across all domains ── */
function SearchOverlay({ open, onClose, lang, cur, dir, str }) {
  const [mounted, setMounted] = useS(open);
  const [q, setQ] = useS('');
  const inputRef = useR(null);
  useE(() => {
    if (open) {
      setMounted(true);
      const tm = setTimeout(() => inputRef.current && inputRef.current.focus(), 60);
      return () => clearTimeout(tm);
    } else {
      const tm = setTimeout(() => { setMounted(false); setQ(''); }, 200);
      return () => clearTimeout(tm);
    }
  }, [open]);
  if (!mounted) return null;
  const all = W.GL_DATA.tabs.flatMap(tb => tb.ops.map(op => ({ op, domain: tb.label })));
  const ql = q.trim().toLowerCase();
  const res = ql ? all.filter(({ op }) => (op.ref + ' ' + op.desc.en + ' ' + op.desc.ar + ' ' + op.type.en + ' ' + op.type.ar).toLowerCase().includes(ql)) : all;
  return <div style={{ position: 'absolute', inset: 0, zIndex: 90, background: 'var(--gl-bg)', display: 'flex', flexDirection: 'column', animation: open ? 'glslideup .22s var(--gl-ease-out) both' : 'none' }}>
    {/* search bar */}
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '16px 16px 12px', borderBottom: '1px solid var(--gl-border)' }}>
      <button onClick={onClose} className="gl-press" style={{ width: 38, height: 38, flexShrink: 0, borderRadius: 'var(--gl-radius-sm)', background: 'var(--gl-input-bg)', border: '1px solid var(--gl-border)', color: 'var(--gl-fg-1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><GLIcon name={dir === 'rtl' ? 'chevR' : 'back'} size={18} /></button>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 9, height: 42, padding: '0 12px', background: 'var(--gl-input-bg)', border: '1px solid var(--gl-border-strong)', borderRadius: 'var(--gl-radius-md)' }}>
        <span style={{ color: 'var(--gl-fg-3)', display: 'flex', flexShrink: 0 }}><GLIcon name="searchO" size={17} /><span style={{ marginInlineStart: -17 }}><GLIcon name="search" size={17} /></span></span>
        <input ref={inputRef} value={q} onChange={e => setQ(e.target.value)} placeholder={pick(str.searchPh, lang)} style={{ flex: 1, minWidth: 0, background: 'none', border: 'none', outline: 'none', color: 'var(--gl-fg-1)', fontFamily: fontFor(lang), fontSize: 14 }} />
        {q && <button onClick={() => { setQ(''); inputRef.current && inputRef.current.focus(); }} style={{ background: 'none', border: 'none', color: 'var(--gl-fg-3)', cursor: 'pointer', display: 'flex', padding: 2 }}><GLIcon name="close" size={15} /></button>}
      </div>
    </div>
    {/* results */}
    <div style={{ flex: 1, overflowY: 'auto', padding: '14px 16px 28px' }}>
      <div style={{ fontFamily: 'var(--gl-font-body)', fontWeight: 700, fontSize: 10, letterSpacing: '.09em', textTransform: 'uppercase', color: 'var(--gl-fg-3)', marginBottom: 10 }}>
        {ql ? pick(str.searchResults, lang) + ' · ' + W.glNum(res.length, lang) : pick(str.searchStart, lang)}
      </div>
      {res.length === 0
        ? <div style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--gl-fg-3)' }}>
            <div style={{ display: 'inline-flex', width: 56, height: 56, borderRadius: 16, background: 'var(--gl-input-bg)', alignItems: 'center', justifyContent: 'center', color: 'var(--gl-fg-4)', marginBottom: 14 }}><GLIcon name="search" size={24} /></div>
            <div style={{ fontFamily: fontFor(lang), fontSize: 14, fontWeight: 600, color: 'var(--gl-fg-2)' }}>{pick(str.searchEmpty, lang)}</div>
          </div>
        : <div style={{ background: 'var(--gl-surface)', border: '1px solid var(--gl-border)', borderRadius: 'var(--gl-radius-lg)', boxShadow: 'var(--gl-shadow)', padding: '2px 16px' }}>
            {res.map(({ op, domain }, i) => <SearchRow key={op.ref + i} op={op} domain={domain} cur={cur} lang={lang} last={i === res.length - 1} />)}
          </div>}
    </div>
  </div>;
}

/* search result row = OpRow + a domain tag */
function SearchRow({ op, domain, cur, lang, last }) {
  const credit = op.dir === 'credit';
  const amtColor = credit ? 'var(--gl-success-500)' : 'var(--gl-danger-500)';
  const sign = credit ? '+' : '−';
  return <button className="gl-press" style={{ width: '100%', display: 'block', textAlign: 'start', background: 'none', border: 'none', borderBottom: last ? 'none' : '1px solid var(--gl-border)', borderBottomStyle: 'solid', padding: '12px 0', cursor: 'pointer' }}>
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 10 }}>
      <span style={{ fontFamily: fontFor(lang), fontSize: 14, fontWeight: 600, color: 'var(--gl-fg-1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flex: 1 }}>{pick(op.desc, lang)}</span>
      <span style={{ fontFamily: 'var(--gl-font-mono)', fontSize: 14, fontWeight: 700, color: amtColor, whiteSpace: 'nowrap', direction: 'ltr' }}>{sign}{W.glMoney(op.amt[cur], cur, lang, { decimals: true })}</span>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginTop: 7 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
        <span style={{ fontFamily: 'var(--gl-font-mono)', fontSize: 11, color: 'var(--gl-blue-500)', whiteSpace: 'nowrap' }}>{op.ref}</span>
        <DSPill tone={op.tone}>{pick(op.type, lang)}</DSPill>
      </div>
      <span style={{ fontFamily: fontFor(lang), fontSize: 10.5, fontWeight: 600, color: 'var(--gl-fg-3)', textTransform: 'uppercase', letterSpacing: '.04em', whiteSpace: 'nowrap' }}>{pick(domain, lang)}</span>
    </div>
  </button>;
}

Object.assign(window, { GLMD: { Sk, SecHead, DomainTabs, PeriodSeg, MetricCard, QuickActions, OpRow, OpRowSkeleton, AttentionItem, cardBox, pick, fontFor, MARK, TONE, BottomSheet, ActionSheetBody, ViewPopup, CurrencyPopup, MenuGlyph, SideDrawer, ChartView, SearchOverlay } });
