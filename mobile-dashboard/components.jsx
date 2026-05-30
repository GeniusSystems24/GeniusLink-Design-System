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

/* ── domain tabs (segmented, DS tokens) ── */
function DomainTabs({ tabs, active, onChange, lang }) {
  return <div role="tablist" style={{ display: 'flex', gap: 4, padding: 4, background: 'var(--gl-input-bg)', border: '1px solid var(--gl-border)', borderRadius: 'var(--gl-radius-lg)' }}>
    {tabs.map(tb => {
      const on = tb.id === active;
      return <button key={tb.id} role="tab" aria-selected={on} onClick={() => onChange(tb.id)} style={{
        flex: 1, minHeight: 40, border: 'none', cursor: 'pointer',
        borderRadius: 'var(--gl-radius-md)',
        background: on ? 'color-mix(in srgb, var(--gl-blue-500) 16%, transparent)' : 'transparent',
        color: on ? 'var(--gl-blue-500)' : 'var(--gl-fg-3)', fontFamily: fontFor(lang),
        fontWeight: on ? 700 : 500, fontSize: 13.5, transition: 'all var(--gl-dur-base) var(--gl-ease-standard)',
      }}>{pick(tb.label, lang)}</button>;
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

function SummaryChart({ cards, cur, lang, period, loading }) {
  if (loading) return <div style={cardBox()}>
    <Sk w="38%" h={10} />
    {[0, 1, 2, 3].map(i => <div key={i} style={{ marginTop: i === 0 ? 16 : 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}><Sk w="34%" h={11} /><Sk w="22%" h={11} /></div>
      <Sk w="100%" h={8} r={999} mt={8} />
    </div>)}
  </div>;
  const max = Math.max(...cards.map(c => c.val[cur])) || 1;
  return <div style={{ ...cardBox(), padding: '14px 14px 16px' }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 12 }}>
      <div style={{ fontFamily: fontFor(lang), fontSize: 12, fontWeight: 700, color: 'var(--gl-fg-2)' }}>{lang === 'ar' ? 'عرض الرسم البياني' : 'Chart view'}</div>
      <div style={{ fontFamily: 'var(--gl-font-mono)', fontSize: 10.5, color: 'var(--gl-fg-3)' }}>{cur}</div>
    </div>
    <div style={{ display: 'grid', gap: 12 }}>
      {cards.map(c => {
        const tr = c.trend[period];
        const width = Math.max(7, Math.round((c.val[cur] / max) * 100));
        const trColor = tr ? (tr.dir === 'up' ? 'var(--gl-success-500)' : 'var(--gl-danger-500)') : 'var(--gl-fg-4)';
        return <div key={c.id}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 10, marginBottom: 7 }}>
            <span style={{ fontFamily: fontFor(lang), fontSize: 12, fontWeight: 650, color: 'var(--gl-fg-1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{pick(c.label, lang)}</span>
            <span style={{ fontFamily: 'var(--gl-font-mono)', fontSize: 12, fontWeight: 700, color: 'var(--gl-fg-2)', whiteSpace: 'nowrap' }}>{_g.glNum(c.val[cur], lang)}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ flex: 1, height: 9, borderRadius: 999, background: 'var(--gl-input-bg)', overflow: 'hidden' }}>
              <div style={{ width: `${width}%`, height: '100%', borderRadius: 999, background: MARK[c.marker], boxShadow: '0 0 0 1px color-mix(in srgb, var(--gl-bg) 24%, transparent) inset' }} />
            </div>
            <span style={{ width: 45, textAlign: 'end', fontFamily: 'var(--gl-font-mono)', fontSize: 10.5, fontWeight: 700, color: trColor }}>
              {tr ? `${tr.dir === 'up' ? '+' : '-'}${_g.glNum(tr.pct, lang)}%` : '—'}
            </span>
          </div>
        </div>;
      })}
    </div>
  </div>;
}

/* ── quick actions ── */
function QuickActions({ actions, lang, onTap, str }) {
  const [expanded, setExpanded] = useS(false);
  const limit = 4;
  const canToggle = actions.length > limit;
  const visible = expanded ? actions : actions.slice(0, limit);
  return <div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 8 }}>
      {visible.map(a => <button key={a.id} onClick={() => onTap(a)} className="gl-press" style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '9px 5px 8px',
        background: 'var(--gl-surface)', border: '1px solid var(--gl-border)', borderRadius: 'var(--gl-radius-md)',
        boxShadow: 'var(--gl-shadow)', cursor: 'pointer', minHeight: 72, minWidth: 0,
      }}>
        <span style={{ width: 30, height: 30, borderRadius: 9, background: 'color-mix(in srgb, var(--gl-blue-500) 14%, transparent)', color: 'var(--gl-blue-500)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><GLIcon name={a.icon} size={16} /></span>
        <span style={{ width: '100%', fontFamily: fontFor(lang), fontSize: 10.5, fontWeight: 650, color: 'var(--gl-fg-1)', textAlign: 'center', lineHeight: 1.15, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{pick(a.label, lang)}</span>
      </button>)}
    </div>
    {canToggle && <button className="gl-press" onClick={() => setExpanded(v => !v)} style={{ marginTop: 10, width: '100%', minHeight: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, border: '1px solid var(--gl-border)', borderRadius: 'var(--gl-radius-md)', background: 'var(--gl-input-bg)', color: 'var(--gl-blue-500)', fontFamily: fontFor(lang), fontSize: 12.5, fontWeight: 700, cursor: 'pointer' }}>
      {expanded ? pick(str.showLess, lang) : pick(str.viewAll, lang)}
      <GLIcon name={expanded ? 'chevD' : 'dots'} size={14} />
    </button>}
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

Object.assign(window, { GLMD: { Sk, SecHead, DomainTabs, PeriodSeg, MetricCard, SummaryChart, QuickActions, OpRow, OpRowSkeleton, AttentionItem, cardBox, pick, fontFor, MARK, TONE } });
