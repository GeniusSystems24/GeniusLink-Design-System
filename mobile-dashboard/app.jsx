/* global React, window */
// GeniusLink Mobile Dashboard — app shell, interactions, tweaks.
const { useState, useRef, useEffect, useCallback } = React;
const W = window;
const { GLIcon, DSPill, IOSDevice, useTweaks, TweaksPanel, TweakSection, TweakRadio, TweakToggle } = W;
const M = W.GLMD;
const { Sk, SecHead, DomainTabs, PeriodSeg, MetricCard, ViewStyleMenu, SummaryChart, QuickActions, QuickActionsSheet, OpRow, OpRowSkeleton, AttentionItem, pick, fontFor, TONE } = M;
const STR = W.GL_STR, DATA = W.GL_DATA, CURRENCIES = W.GL_CURRENCIES;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "dark",
  "lang": "en",
  "online": true,
  "showAttention": true
}/*EDITMODE-END*/;

/* ── pull-to-refresh hook (touch) ── */
function usePull(scrollRef, onRefresh, refreshing) {
  const [pull, setPull] = useState(0);
  const st = useRef({ active: false, y0: 0 });
  useEffect(() => {
    const el = scrollRef.current; if (!el) return;
    const start = (e) => { if (el.scrollTop <= 0 && !refreshing) { st.current = { active: true, y0: e.touches[0].clientY }; } };
    const move = (e) => {
      if (!st.current.active) return;
      const dy = e.touches[0].clientY - st.current.y0;
      if (dy > 0 && el.scrollTop <= 0) { e.preventDefault(); setPull(Math.min(dy * 0.5, 96)); }
      else { st.current.active = false; setPull(0); }
    };
    const end = () => { if (!st.current.active) return; if (pull > 58) onRefresh(); st.current.active = false; setPull(0); };
    el.addEventListener('touchstart', start, { passive: true });
    el.addEventListener('touchmove', move, { passive: false });
    el.addEventListener('touchend', end, { passive: true });
    return () => { el.removeEventListener('touchstart', start); el.removeEventListener('touchmove', move); el.removeEventListener('touchend', end); };
  }, [scrollRef, onRefresh, refreshing, pull]);
  return pull;
}

function App({ t, setTweak }) {
  const lang = t.lang, dark = t.theme === 'dark', dir = lang === 'ar' ? 'rtl' : 'ltr';
  const [tab, setTab] = useState('banking');
  const [cur, setCur] = useState('SAR');
  const [period, setPeriod] = useState('week');
  const [summaryView, setSummaryView] = useState('cards');
  const [curOpen, setCurOpen] = useState(false);
  const [actionsSheetOpen, setActionsSheetOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [tabLoading, setTabLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [, setUpdated] = useState(0);
  const loaded = useRef(new Set(['banking']));
  const scrollRef = useRef(null);
  const toastTimer = useRef(null);

  // theme on body
  useEffect(() => { document.body.dataset.theme = dark ? '' : 'light'; }, [dark]);

  const showToast = useCallback((msg) => {
    setToast(msg); clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2200);
  }, []);

  const doRefresh = useCallback(() => {
    if (refreshing) return;
    setRefreshing(true);
    setTimeout(() => { setRefreshing(false); setUpdated(Date.now()); showToast(L(STR.updated) + ' · ' + L(STR.justNow)); }, 1150);
  }, [refreshing, lang, showToast]);

  const L = (o) => pick(o, lang);

  const switchTab = (id) => {
    setTab(id);
    setActionsSheetOpen(false);
    if (!loaded.current.has(id)) {
      setTabLoading(true);
      setTimeout(() => { loaded.current.add(id); setTabLoading(false); }, 620);
    }
  };

  const pull = usePull(scrollRef, doRefresh, refreshing);
  const cfg = DATA.tabs.find(x => x.id === tab);
  const busy = refreshing || tabLoading;
  const attnVisible = t.showAttention && DATA.attention.length > 0;

  return (
    <div dir={dir} style={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative', background: 'var(--gl-bg)', fontFamily: fontFor(lang) }}>
      {/* ── sticky app bar ── */}
      <header style={{ position: 'relative', zIndex: 30, paddingTop: 14, paddingInline: 18, paddingBottom: 12, background: 'color-mix(in srgb, var(--gl-bg) 90%, transparent)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', borderBottom: '1px solid var(--gl-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button className="gl-press" onClick={() => showToast(lang === 'ar' ? 'تبديل المنشأة' : 'Switch organization')} style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'none', border: 'none', cursor: 'pointer', padding: 0, flex: 1, minWidth: 0 }}>
            <span style={{ width: 38, height: 38, borderRadius: 10, background: 'color-mix(in srgb, var(--gl-blue-500) 16%, transparent)', color: 'var(--gl-blue-500)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><GLIcon name="grid" size={19} /></span>
            <span style={{ minWidth: 0, textAlign: 'start' }}>
              <span style={{ display: 'block', fontFamily: 'var(--gl-font-display)', fontWeight: 700, fontSize: 14, color: 'var(--gl-fg-1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{L(DATA.tenant.name)}</span>
              <span style={{ display: 'block', fontFamily: 'var(--gl-font-mono)', fontSize: 10.5, color: 'var(--gl-fg-3)' }}>{L(DATA.tenant.tag)}</span>
            </span>
            <span style={{ color: 'var(--gl-fg-3)', display: 'flex', flexShrink: 0 }}><GLIcon name="chevD" size={15} /></span>
          </button>
          {/* currency selector */}
          <button className="gl-press" onClick={() => setCurOpen(v => !v)} aria-haspopup="listbox" style={{ display: 'flex', alignItems: 'center', gap: 5, height: 38, padding: '0 11px', background: 'var(--gl-input-bg)', border: '1px solid var(--gl-border-strong)', borderRadius: 'var(--gl-radius-sm)', cursor: 'pointer', flexShrink: 0 }}>
            <span style={{ fontFamily: 'var(--gl-font-mono)', fontSize: 13, fontWeight: 700, color: 'var(--gl-fg-1)' }}>{cur}</span>
            <span style={{ color: 'var(--gl-fg-3)', display: 'flex' }}><GLIcon name="chevD" size={14} /></span>
          </button>
          {/* notifications */}
          <button className="gl-press" onClick={() => showToast(lang === 'ar' ? 'الإشعارات' : 'Notifications')} style={{ position: 'relative', width: 38, height: 38, borderRadius: 'var(--gl-radius-sm)', background: 'var(--gl-input-bg)', border: '1px solid var(--gl-border)', color: 'var(--gl-fg-1)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <GLIcon name="bell" size={18} />
            <span style={{ position: 'absolute', top: 6, insetInlineEnd: 6, minWidth: 15, height: 15, padding: '0 3px', borderRadius: 999, background: 'var(--gl-danger-500)', color: '#fff', fontFamily: 'var(--gl-font-mono)', fontSize: 9, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1.5px solid var(--gl-bg)' }}>8</span>
          </button>
        </div>

        {curOpen && <>
          <div onClick={() => setCurOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 40 }} />
          <div role="listbox" style={{ position: 'absolute', zIndex: 41, top: 100, insetInlineEnd: 18, width: 232, background: 'var(--gl-surface)', border: '1px solid var(--gl-border-strong)', borderRadius: 'var(--gl-radius-lg)', boxShadow: 'var(--gl-shadow-pop)', overflow: 'hidden', padding: 6 }}>
            <div style={{ fontFamily: 'var(--gl-font-body)', fontWeight: 700, fontSize: 10, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--gl-fg-3)', padding: '8px 10px 6px' }}>{L(STR.selectCurrency)}</div>
            {CURRENCIES.map(c => {
              const on = c.code === cur;
              return <button key={c.code} role="option" aria-selected={on} onClick={() => { setCur(c.code); setCurOpen(false); }} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px', minHeight: 44, background: on ? 'var(--gl-hover)' : 'transparent', border: 'none', borderRadius: 'var(--gl-radius-sm)', cursor: 'pointer', textAlign: 'start' }}>
                <span style={{ fontFamily: 'var(--gl-font-mono)', fontSize: 13, fontWeight: 700, color: on ? 'var(--gl-blue-500)' : 'var(--gl-fg-1)', width: 38 }}>{c.code}</span>
                <span style={{ flex: 1, fontFamily: fontFor(lang), fontSize: 13, color: 'var(--gl-fg-2)' }}>{L(c.label)}</span>
                {on && <span style={{ color: 'var(--gl-blue-500)', display: 'flex' }}><GLIcon name="check" size={16} /></span>}
              </button>;
            })}
          </div>
        </>}
      </header>

      {/* offline banner */}
      {!t.online && <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 18px', background: 'color-mix(in srgb, var(--gl-warning-500) 16%, transparent)', color: 'var(--gl-warning-500)', position: 'relative', zIndex: 20 }}>
        <GLIcon name="ban" size={15} />
        <span style={{ fontFamily: fontFor(lang), fontSize: 12, fontWeight: 600 }}>{L(STR.offline)}</span>
      </div>}

      {/* pull-to-refresh indicator */}
      <div style={{ position: 'absolute', top: !t.online ? 150 : 116, left: 0, right: 0, display: 'flex', justifyContent: 'center', pointerEvents: 'none', zIndex: 15, height: 0 }}>
        <div style={{ transform: `translateY(${refreshing ? 8 : pull - 28}px)`, opacity: refreshing || pull > 4 ? 1 : 0, transition: refreshing ? 'transform var(--gl-dur-base)' : 'none', display: 'flex', alignItems: 'center', gap: 8, padding: '6px 14px', background: 'var(--gl-surface)', border: '1px solid var(--gl-border)', borderRadius: 999, boxShadow: 'var(--gl-shadow)' }}>
          <span style={{ width: 14, height: 14, display: 'inline-block', borderRadius: '50%', border: '2px solid var(--gl-blue-500)', borderTopColor: 'transparent', animation: refreshing ? 'dsspin 0.7s linear infinite' : 'none', transform: refreshing ? 'none' : `rotate(${pull * 3.4}deg)` }} />
          <span style={{ fontFamily: fontFor(lang), fontSize: 11.5, fontWeight: 600, color: 'var(--gl-fg-2)' }}>{refreshing ? L(STR.refreshing) : pull > 58 ? L(STR.release) : L(STR.pullRefresh)}</span>
        </div>
      </div>

      {/* ── scroll body ── */}
      <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', WebkitOverflowScrolling: 'touch', overscrollBehaviorY: 'contain' }}>
        <div style={{ transform: `translateY(${pull}px)`, transition: pull === 0 ? 'transform var(--gl-dur-moderate) var(--gl-ease-out)' : 'none', padding: '16px 18px 110px' }}>

          {/* title */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontFamily: 'var(--gl-font-body)', fontWeight: 700, fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--gl-blue-500)' }}>{L(STR.goodMorning)}</div>
            <h1 style={{ fontFamily: 'var(--gl-font-display)', fontWeight: 800, fontSize: 28, letterSpacing: '-0.03em', color: 'var(--gl-fg-1)', margin: '3px 0 0' }}>{L(STR.dashboard)}</h1>
          </div>

          {/* domain tabs */}
          <DomainTabs tabs={DATA.tabs} active={tab} onChange={switchTab} lang={lang} />

          {/* summary controls */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
            <ViewStyleMenu value={summaryView} onChange={setSummaryView} str={STR} lang={lang} />
            <PeriodSeg value={period} onChange={setPeriod} str={STR} lang={lang} />
          </div>

          {/* summary cards */}
          {summaryView === 'cards'
            ? <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 12 }}>
              {cfg.cards.map(c => <MetricCard key={c.id} card={c} cur={cur} lang={lang} period={period} loading={busy} />)}
            </div>
            : <div style={{ marginTop: 12 }}>
              <SummaryChart cards={cfg.cards} cur={cur} lang={lang} tab={tab} loading={busy} />
            </div>}

          {/* quick actions */}
          <div style={{ marginTop: 24 }}>
            <SecHead title={L(STR.quickActions)} lang={lang} marker="blue"
              trailing={cfg.actions.length > 4 && <button className="gl-press" onClick={() => setActionsSheetOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gl-blue-500)', fontFamily: fontFor(lang), fontSize: 12.5, fontWeight: 700, padding: 4 }}>{L(STR.viewAll)}<GLIcon name={dir === 'rtl' ? 'back' : 'chevR'} size={14} /></button>} />
            <QuickActions actions={cfg.actions} lang={lang} onTap={(a) => showToast((lang === 'ar' ? 'فتح ' : 'Opening ') + pick(a.label, lang))} />
          </div>

          {/* recent operations */}
          <div style={{ marginTop: 24 }}>
            <SecHead title={L(STR.recentOps)} sub={L(STR.recentSub)} lang={lang} marker="green"
              trailing={<button className="gl-press" onClick={() => showToast((lang === 'ar' ? 'فتح اليومية' : 'Open journal'))} style={{ display: 'flex', alignItems: 'center', gap: 3, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gl-blue-500)', fontFamily: fontFor(lang), fontSize: 12.5, fontWeight: 600, padding: 4 }}>{L(STR.viewAll)}<GLIcon name={dir === 'rtl' ? 'back' : 'chevR'} size={14} /></button>} />
            <div style={{ background: 'var(--gl-surface)', border: '1px solid var(--gl-border)', borderRadius: 'var(--gl-radius-lg)', boxShadow: 'var(--gl-shadow)', padding: '2px 16px' }}>
              {busy
                ? [0, 1, 2, 3, 4].map(i => <OpRowSkeleton key={i} last={i === 4} />)
                : cfg.ops.map((op, i) => <OpRow key={op.ref} op={op} cur={cur} lang={lang} last={i === cfg.ops.length - 1} />)}
            </div>
          </div>

          {/* needs attention (global) */}
          {attnVisible && <div style={{ marginTop: 24 }}>
            <SecHead title={L(STR.needsAttention)} lang={lang} marker="orange"
              trailing={<span style={{ fontFamily: 'var(--gl-font-mono)', fontSize: 11, color: 'var(--gl-fg-3)' }}>{lang === 'ar' ? 'كل الأقسام' : 'All domains'}</span>} />
            <div style={{ background: 'var(--gl-surface)', border: '1px solid var(--gl-border)', borderRadius: 'var(--gl-radius-lg)', boxShadow: 'var(--gl-shadow)', padding: '2px 16px' }}>
              {DATA.attention.map((it, i) => <AttentionItem key={it.id} it={it} lang={lang} last={i === DATA.attention.length - 1} />)}
            </div>
          </div>}
        </div>
      </div>

      {/* toast */}
      {toast && <div style={{ position: 'absolute', bottom: 92, left: '50%', transform: 'translateX(-50%)', zIndex: 70, display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', background: 'var(--gl-fg-1)', color: 'var(--gl-bg)', borderRadius: 999, boxShadow: 'var(--gl-shadow-pop)', fontFamily: fontFor(lang), fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', animation: 'gltoast var(--gl-dur-moderate) var(--gl-ease-out)' }}>
        <GLIcon name="check" size={15} />{toast}
      </div>}

      <QuickActionsSheet open={actionsSheetOpen} actions={cfg.actions} lang={lang} str={STR} onClose={() => setActionsSheetOpen(false)} onTap={(a) => showToast((lang === 'ar' ? 'فتح ' : 'Opening ') + pick(a.label, lang))} />

      {/* ── bottom nav ── */}
      <nav style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 25, display: 'flex', paddingBottom: 22, paddingTop: 8, background: 'color-mix(in srgb, var(--gl-bg) 92%, transparent)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', borderTop: '1px solid var(--gl-border)' }}>
        {[['home', STR.home, true], ['inbox', STR.accounts, false], ['doc', STR.journal, false], ['dots', STR.more, false]].map(([ic, lbl, on]) => (
          <button key={ic} className="gl-press" onClick={() => !on && showToast(pick(lbl, lang))} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer', color: on ? 'var(--gl-blue-500)' : 'var(--gl-fg-3)', padding: '4px 0', minHeight: 48 }}>
            <GLIcon name={ic} size={21} stroke={on ? 2 : 1.6} />
            <span style={{ fontFamily: fontFor(lang), fontSize: 10, fontWeight: on ? 700 : 500 }}>{pick(lbl, lang)}</span>
          </button>
        ))}
      </nav>

      {/* ── tweaks ── */}
      <TweaksPanel>
        <TweakSection label="Appearance" />
        <TweakRadio label="Theme" value={t.theme} options={['dark', 'light']} onChange={v => setTweak('theme', v)} />
        <TweakRadio label="Language" value={t.lang} options={[{ value: 'en', label: 'English' }, { value: 'ar', label: 'العربية' }]} onChange={v => setTweak('lang', v)} />
        <TweakSection label="States" />
        <TweakToggle label="Connection online" value={t.online} onChange={v => setTweak('online', v)} />
        <TweakToggle label="Show Needs Attention" value={t.showAttention} onChange={v => setTweak('showAttention', v)} />
      </TweaksPanel>
    </div>
  );
}

function Mounted() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: t.theme === 'dark' ? '#08090c' : '#e7e8ee', overflow: 'hidden' }}>
    <div style={{ width: 402, height: '100vh', overflow: 'hidden', position: 'relative', flexShrink: 0 }}>
      <App t={t} setTweak={setTweak} />
    </div>
  </div>;
}

ReactDOM.createRoot(document.getElementById('root')).render(<Mounted />);
