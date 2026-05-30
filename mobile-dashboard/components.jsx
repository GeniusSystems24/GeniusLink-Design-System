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

function ViewStyleMenu({ value, onChange, str, lang }) {
  const [open, setOpen] = useS(false);
  const opts = [
    ['cards', str.cardsView, 'grid'],
    ['chart', str.chartView, 'poll'],
  ];
  const current = opts.find(([k]) => k === value) || opts[0];
  const choose = (k) => { onChange(k); setOpen(false); };
  return <div style={{ position: 'relative', flexShrink: 0 }}>
    <button className="gl-press" onClick={() => setOpen(v => !v)} style={{ minHeight: 36, display: 'flex', alignItems: 'center', gap: 5, padding: '0 10px', border: '1px solid var(--gl-border)', borderRadius: 'var(--gl-radius-md)', background: 'var(--gl-input-bg)', color: 'var(--gl-fg-2)', cursor: 'pointer' }}>
      <GLIcon name={current[2]} size={15} />
      <GLIcon name="chevD" size={13} />
    </button>
    {open && <>
      <button aria-label="Close view style menu" onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 45, background: 'transparent', border: 'none', padding: 0 }} />
      <div style={{ position: 'absolute', zIndex: 46, top: 42, insetInlineEnd: 0, minWidth: 148, padding: 5, background: 'var(--gl-surface)', border: '1px solid var(--gl-border-strong)', borderRadius: 'var(--gl-radius-md)', boxShadow: 'var(--gl-shadow-pop)' }}>
        {opts.map(([k, lbl, ic]) => {
          const on = k === value;
          return <button key={k} onClick={() => choose(k)} style={{ width: '100%', minHeight: 34, display: 'flex', alignItems: 'center', gap: 8, padding: '0 8px', border: 'none', borderRadius: 'var(--gl-radius-sm)', background: on ? 'var(--gl-hover)' : 'transparent', color: on ? 'var(--gl-blue-500)' : 'var(--gl-fg-2)', fontFamily: fontFor(lang), fontSize: 12.5, fontWeight: on ? 700 : 600, textAlign: 'start', cursor: 'pointer' }}>
            <GLIcon name={ic} size={14} />
            <span style={{ flex: 1 }}>{pick(lbl, lang)}</span>
            {on && <GLIcon name="check" size={14} />}
          </button>;
        })}
      </div>
    </>}
  </div>;
}

/* ── accounting chart: vertical bars ── */
function VerticalBarChart({ cards, cur, lang }) {
  const vals = cards.map(c => c.val[cur]);
  const maxV = Math.max(...vals) || 1;
  const unit = maxV >= 1e6 ? 1e6 : 1e3;
  const uLbl = maxV >= 1e6 ? (lang === 'ar' ? 'م' : 'M') : (lang === 'ar' ? 'ك' : 'k');
  const yMax = Math.ceil(maxV / unit) * unit;
  const W = 304, H = 158, pl = 38, pr = 6, pt = 12, pb = 38;
  const cW = W - pl - pr, cH = H - pt - pb;
  const slot = cW / cards.length, bW = Math.floor(slot * 0.52);
  const fmt = v => _g.glNum(+(v / unit).toFixed(1), lang) + uLbl;
  return <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} aria-hidden="true">
    <defs>
      {cards.map(c => {
        const col = MARK[c.marker] || MARK.blue;
        return <linearGradient key={c.id} id={`vb-${c.id}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={col} stopOpacity="0.65" />
          <stop offset="100%" stopColor={col} stopOpacity="0.18" />
        </linearGradient>;
      })}
    </defs>
    {[0, 0.5, 1].map((f, i) => {
      const v = yMax * f, y = pt + cH - f * cH;
      return <g key={i}>
        {f > 0 && <line x1={pl} x2={pl + cW} y1={y} y2={y} stroke="var(--gl-border)" strokeWidth="1" strokeDasharray="3 5" />}
        <text x={pl - 5} y={y + 3.5} textAnchor="end" fill="var(--gl-fg-4)" fontFamily="var(--gl-font-mono)" fontSize="8.5">{f === 0 ? '0' : fmt(v)}</text>
      </g>;
    })}
    <line x1={pl} x2={pl} y1={pt} y2={pt + cH} stroke="var(--gl-border-strong)" strokeWidth="1.2" />
    <line x1={pl - 1} x2={pl + cW} y1={pt + cH} y2={pt + cH} stroke="var(--gl-border-strong)" strokeWidth="1.2" />
    {cards.map((c, i) => {
      const col = MARK[c.marker] || MARK.blue;
      const bH = Math.max(4, (c.val[cur] / yMax) * cH);
      const x = pl + i * slot + (slot - bW) / 2;
      const y = pt + cH - bH;
      return <g key={c.id}>
        <rect x={x} y={y} width={bW} height={bH} rx="4" fill={`url(#vb-${c.id})`} />
        <rect x={x} y={y} width={bW} height={4} rx="2" fill={col} />
        <text x={x + bW / 2} y={pt + cH + 14} textAnchor="middle" fill="var(--gl-fg-3)" fontFamily={fontFor(lang)} fontSize="9" fontWeight="600">{pick(c.label, lang).split(' ')[0]}</text>
        <text x={x + bW / 2} y={pt + cH + 26} textAnchor="middle" fill="var(--gl-fg-4)" fontFamily="var(--gl-font-mono)" fontSize="8">{fmt(c.val[cur])}</text>
      </g>;
    })}
  </svg>;
}

/* ── banking chart: horizontal gauge tracks ── */
function GaugeTrackChart({ cards, cur, lang }) {
  const maxV = Math.max(...cards.map(c => c.val[cur])) || 1;
  const unit = maxV >= 1e6 ? 1e6 : 1e3;
  const uLbl = maxV >= 1e6 ? (lang === 'ar' ? 'م' : 'M') : (lang === 'ar' ? 'ك' : 'k');
  const W = 304, H = 158, pl = 10, pr = 58, pt = 8;
  const trackW = W - pl - pr, trackH = 10, rowH = 32;
  const startY = pt + (H - pt - cards.length * rowH) / 2;
  const fmt = v => _g.glNum(+(v / unit).toFixed(v >= unit * 10 ? 1 : 2), lang) + uLbl;
  return <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} aria-hidden="true">
    {cards.map((c, i) => {
      const col = MARK[c.marker] || MARK.blue;
      const pct = c.val[cur] / maxV;
      const fillW = pct * trackW;
      const y = startY + i * rowH;
      return <g key={c.id}>
        <text x={pl} y={y + 12} fill="var(--gl-fg-2)" fontFamily={fontFor(lang)} fontSize="10.5" fontWeight="700">{pick(c.label, lang)}</text>
        <rect x={pl} y={y + 17} width={trackW} height={trackH} rx="5" fill="var(--gl-input-bg)" />
        <rect x={pl} y={y + 17} width={fillW} height={trackH} rx="5" fill={col} opacity="0.85" />
        {fillW > 30 && <text x={pl + fillW - 5} y={y + 17 + trackH - 2} textAnchor="end" fill="white" fontFamily="var(--gl-font-mono)" fontSize="7.5" fontWeight="700">{Math.round(pct * 100)}%</text>}
        <text x={W - pr + 6} y={y + 17 + trackH - 1} fill="var(--gl-fg-1)" fontFamily="var(--gl-font-mono)" fontSize="10" fontWeight="700">{fmt(c.val[cur])}</text>
      </g>;
    })}
  </svg>;
}

/* ── commercial chart: horizontal bar pairs ── */
function HorizPairChart({ cards, cur, lang }) {
  const maxV = Math.max(...cards.map(c => c.val[cur])) || 1;
  const unit = maxV >= 1e6 ? 1e6 : 1e3;
  const uLbl = maxV >= 1e6 ? (lang === 'ar' ? 'م' : 'M') : (lang === 'ar' ? 'ك' : 'k');
  const W = 304, H = 158, pl = 10, pr = 6, pt = 10;
  const trackW = W - pl - pr, barH = 19, rowH = 27, sectionGap = 18;
  const fmt = v => _g.glNum(+(v / unit).toFixed(1), lang) + uLbl;
  const sections = [
    { label: lang === 'ar' ? 'الحجم' : 'VOLUME', items: [cards[0], cards[1]], y: pt + 14 },
    { label: lang === 'ar' ? 'الأرصدة' : 'BALANCES', items: [cards[2], cards[3]], y: pt + 14 + 2 * rowH + sectionGap },
  ];
  return <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} aria-hidden="true">
    {sections.map(sec => <g key={sec.label}>
      <text x={pl} y={sec.y - 3} fill="var(--gl-fg-3)" fontFamily="var(--gl-font-body)" fontSize="8.5" fontWeight="800" letterSpacing=".07em">{sec.label}</text>
      <line x1={pl + (lang === 'ar' ? 0 : sec.label.length * 5.8)} x2={W - pr} y1={sec.y - 7} y2={sec.y - 7} stroke="var(--gl-border)" strokeWidth="0.8" />
      {sec.items.map((c, ci) => {
        if (!c) return null;
        const col = MARK[c.marker] || MARK.blue;
        const fillW = (c.val[cur] / maxV) * trackW;
        const barY = sec.y + ci * rowH;
        return <g key={c.id}>
          <rect x={pl} y={barY} width={trackW} height={barH} rx="5" fill="var(--gl-input-bg)" />
          <rect x={pl} y={barY} width={fillW} height={barH} rx="5" fill={`color-mix(in srgb, ${col} 60%, transparent)`} />
          <rect x={pl} y={barY} width={4} height={barH} rx="2" fill={col} />
          <text x={pl + 9} y={barY + barH / 2 + 4} fill="var(--gl-fg-1)" fontFamily={fontFor(lang)} fontSize="10" fontWeight="700">{pick(c.label, lang)}</text>
          {fillW > 80
            ? <text x={pl + fillW - 6} y={barY + barH / 2 + 4} textAnchor="end" fill="white" fontFamily="var(--gl-font-mono)" fontSize="9" fontWeight="700">{fmt(c.val[cur])}</text>
            : <text x={pl + fillW + 5} y={barY + barH / 2 + 4} fill="var(--gl-fg-2)" fontFamily="var(--gl-font-mono)" fontSize="9" fontWeight="700">{fmt(c.val[cur])}</text>}
        </g>;
      })}
    </g>)}
  </svg>;
}

/* ── summary chart wrapper ── */
const CHART_TITLE = {
  accounting: { en: 'Metrics Comparison', ar: 'مقارنة المؤشرات' },
  banking:    { en: 'Balance & Cash Flow', ar: 'الرصيد والتدفق النقدي' },
  commercial: { en: 'Performance Overview', ar: 'الأداء التجاري' },
};
function SummaryChart({ cards, cur, lang, loading, tab }) {
  if (loading) return <div style={cardBox()}>
    <Sk w="38%" h={10} />
    <Sk w="100%" h={170} r={10} mt={14} />
  </div>;
  const title = CHART_TITLE[tab] || CHART_TITLE.accounting;
  return <div style={{ ...cardBox(), padding: '14px 14px 16px' }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 12 }}>
      <div style={{ fontFamily: fontFor(lang), fontSize: 12, fontWeight: 700, color: 'var(--gl-fg-2)' }}>{lang === 'ar' ? title.ar : title.en}</div>
      <div style={{ fontFamily: 'var(--gl-font-mono)', fontSize: 10.5, color: 'var(--gl-fg-3)' }}>{cur}</div>
    </div>
    <div style={{ overflow: 'hidden' }}>
      {tab === 'banking' ? <GaugeTrackChart cards={cards} cur={cur} lang={lang} />
        : tab === 'commercial' ? <HorizPairChart cards={cards} cur={cur} lang={lang} />
        : <VerticalBarChart cards={cards} cur={cur} lang={lang} />}
    </div>
  </div>;
}

/* ── quick actions ── */
const QA_TONES = [MARK.blue, MARK.green, MARK.orange, MARK.blue];
function QuickActions({ actions, lang, onTap }) {
  const visible = actions.slice(0, 4);
  return <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 8 }}>
    {visible.map((a, i) => {
      const tone = QA_TONES[i % QA_TONES.length];
      return <button key={a.id} onClick={() => onTap(a)} className="gl-press" style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7,
        padding: '14px 6px 12px',
        background: 'var(--gl-surface)',
        border: '1px solid var(--gl-border)',
        borderTop: `3px solid ${tone}`,
        borderRadius: 'var(--gl-radius-md)',
        boxShadow: 'var(--gl-shadow)', cursor: 'pointer', minHeight: 84, minWidth: 0,
      }}>
        <span style={{
          width: 34, height: 34, borderRadius: 10,
          background: `color-mix(in srgb, ${tone} 12%, transparent)`,
          border: `1.5px solid color-mix(in srgb, ${tone} 26%, transparent)`,
          color: tone, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}><GLIcon name={a.icon} size={16} /></span>
        <span style={{
          width: '100%', fontFamily: fontFor(lang), fontSize: 10, fontWeight: 700,
          color: 'var(--gl-fg-1)', textAlign: 'center', lineHeight: 1.2,
          overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
        }}>{pick(a.label, lang)}</span>
      </button>;
    })}
  </div>;
}

function QuickActionsSheet({ open, actions, lang, str, onTap, onClose }) {
  if (!open) return null;
  return <div style={{ position: 'absolute', inset: 0, zIndex: 65, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', pointerEvents: 'auto' }}>
    <button aria-label="Close quick actions" onClick={onClose} style={{ flex: 1, border: 'none', padding: 0, background: 'rgba(0,0,0,.56)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)' }} />
    <div role="dialog" aria-modal="true" style={{ background: 'var(--gl-surface)', borderTop: '1px solid var(--gl-border-strong)', borderRadius: '24px 24px 0 0', boxShadow: '0 -14px 44px rgba(0,0,0,.32)', padding: '14px 20px 32px', animation: 'glsheet var(--gl-dur-moderate) var(--gl-ease-out)' }}>
      <div style={{ width: 40, height: 4, borderRadius: 999, background: 'color-mix(in srgb, var(--gl-fg-3) 30%, transparent)', margin: '0 auto 20px' }} />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 16 }}>
        <div>
          <div style={{ fontFamily: 'var(--gl-font-body)', fontSize: 10.5, fontWeight: 800, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--gl-blue-500)', marginBottom: 4 }}>{lang === 'ar' ? 'الاختصارات' : 'Shortcuts'}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ fontFamily: fontFor(lang), fontSize: 20, fontWeight: 800, color: 'var(--gl-fg-1)' }}>{pick(str.quickActions, lang)}</div>
            <span style={{ minWidth: 26, height: 22, padding: '0 7px', borderRadius: 6, background: 'color-mix(in srgb, var(--gl-blue-500) 14%, transparent)', color: 'var(--gl-blue-500)', fontFamily: 'var(--gl-font-mono)', fontSize: 11, fontWeight: 800, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{_g.glNum(actions.length, lang)}</span>
          </div>
          <div style={{ fontFamily: fontFor(lang), fontSize: 12, color: 'var(--gl-fg-3)', marginTop: 3 }}>{pick(str.allQuickActions, lang)}</div>
        </div>
        <button className="gl-press" onClick={onClose} style={{ width: 36, height: 36, borderRadius: 10, border: '1px solid var(--gl-border)', background: 'var(--gl-input-bg)', color: 'var(--gl-fg-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, marginTop: 2 }}><GLIcon name="close" size={15} /></button>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: 'var(--gl-border)', marginBottom: 4 }} />

      {/* Action list */}
      <div style={{ maxHeight: 390, overflowY: 'auto' }}>
        {actions.map((a, i) => {
          const tone = [MARK.blue, MARK.green, MARK.orange][i % 3];
          const last = i === actions.length - 1;
          return <button key={a.id} className="gl-press" onClick={() => { onTap(a); onClose(); }} style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 13,
            padding: '11px 0', border: 'none',
            borderBottom: last ? 'none' : '1px solid var(--gl-border)',
            borderInlineStart: `3px solid ${tone}`,
            paddingInlineStart: 12,
            background: 'transparent', cursor: 'pointer', textAlign: 'start',
          }}>
            <span style={{
              width: 38, height: 38, borderRadius: 10, flexShrink: 0,
              background: `color-mix(in srgb, ${tone} 13%, transparent)`,
              border: `1.5px solid color-mix(in srgb, ${tone} 24%, transparent)`,
              color: tone, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}><GLIcon name={a.icon} size={17} /></span>
            <span style={{ flex: 1, fontFamily: fontFor(lang), fontSize: 14, fontWeight: 600, color: 'var(--gl-fg-1)', lineHeight: 1.2 }}>{pick(a.label, lang)}</span>
            <span style={{ color: 'var(--gl-fg-4)', display: 'flex', flexShrink: 0 }}><GLIcon name={lang === 'ar' ? 'back' : 'chevR'} size={15} /></span>
          </button>;
        })}
      </div>
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

Object.assign(window, { GLMD: { Sk, SecHead, DomainTabs, PeriodSeg, MetricCard, ViewStyleMenu, SummaryChart, QuickActions, QuickActionsSheet, OpRow, OpRowSkeleton, AttentionItem, cardBox, pick, fontFor, MARK, TONE } });
