/* global React, window */
// GeniusLink Mobile Dashboard — app shell, interactions, tweaks.
const { useState, useRef, useEffect, useCallback } = React;
const W = window;
const { GLIcon, DSPill, IOSDevice, useTweaks, TweaksPanel, TweakSection, TweakRadio, TweakToggle } = W;
const M = W.GLMD;
const { Sk, SecHead, DomainTabs, PeriodSeg, MetricCard, QuickActions, OpRow, OpRowSkeleton, AttentionItem, pick, fontFor, TONE, BottomSheet, ActionSheetBody, ViewPopup, CurrencyPopup, MenuGlyph, SideDrawer, ChartView, SearchOverlay } = M;
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
  const [viewStyle, setViewStyle] = useState('cards');
  const [chartMetric, setChartMetric] = useState(null);
  const [actionsOpen, setActionsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [wsId, setWsId] = useState(DATA.workspaces[0].id);
  const [wsOpen, setWsOpen] = useState(false);
  const [wsLoading, setWsLoading] = useState(false);
  const [curOpen, setCurOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [tabLoading, setTabLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [updated, setUpdated] = useState(0);
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
    if (!loaded.current.has(id)) {
      setTabLoading(true);
      setTimeout(() => { loaded.current.add(id); setTabLoading(false); }, 620);
    }
  };

  const workspace = DATA.workspaces.find(w => w.id === wsId) || DATA.workspaces[0];
  const switchWorkspace = (id) => {
    setWsOpen(false);
    if (id === wsId) return;
    setWsId(id);
    setWsLoading(true);
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
    setTimeout(() => setWsLoading(false), 900);
  };

  const pull = usePull(scrollRef, doRefresh, refreshing);
  const cfg = DATA.tabs.find(x => x.id === tab);
  const busy = refreshing || tabLoading || wsLoading;
  const attnVisible = t.showAttention && DATA.attention.length > 0;

  // scale the displayed figures by the active workspace's factor
  const f = workspace.factor;
  const scaleObj = (o) => { const r = {}; for (const k in o) r[k] = Math.round(o[k] * f); return r; };
  const cards = cfg.cards.map(c => f === 1 ? c : { ...c, val: scaleObj(c.val) });
  const ops = cfg.ops.map(o => f === 1 ? o : { ...o, amt: scaleObj(o.amt) });

  return (
    <div dir={dir} style={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative', background: 'var(--gl-bg)', fontFamily: fontFor(lang) }}>
      {/* ── sticky app bar ── */}
      <header style={{ position: 'relative', zIndex: 30, paddingTop: 'calc(env(safe-area-inset-top, 0px) + 14px)', paddingInline: 18, paddingBottom: 12, background: 'color-mix(in srgb, var(--gl-bg) 90%, transparent)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', borderBottom: '1px solid var(--gl-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button className="gl-press" onClick={() => setWsOpen(v => !v)} aria-haspopup="listbox" style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'none', border: 'none', cursor: 'pointer', padding: 0, flex: 1, minWidth: 0 }}>
            <span style={{ width: 38, height: 38, borderRadius: 10, background: 'color-mix(in srgb, var(--gl-blue-500) 16%, transparent)', color: 'var(--gl-blue-500)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><GLIcon name="grid" size={19} /></span>
            <span style={{ minWidth: 0, textAlign: 'start' }}>
              <span style={{ display: 'block', fontFamily: 'var(--gl-font-display)', fontWeight: 700, fontSize: 14, color: 'var(--gl-fg-1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{L(workspace.name)}</span>
              <span style={{ display: 'block', fontFamily: 'var(--gl-font-mono)', fontSize: 10.5, color: 'var(--gl-fg-3)' }}>{L(workspace.tag)}</span>
            </span>
            <span style={{ color: 'var(--gl-fg-3)', display: 'flex', flexShrink: 0, transform: wsOpen ? 'rotate(180deg)' : 'none', transition: 'transform var(--gl-dur-base)' }}><GLIcon name="chevD" size={15} /></span>
          </button>
          {/* notifications */}
          <button className="gl-press" onClick={() => showToast(L(STR.notifications))} style={{ position: 'relative', width: 38, height: 38, borderRadius: 'var(--gl-radius-sm)', background: 'var(--gl-input-bg)', border: '1px solid var(--gl-border)', color: 'var(--gl-fg-1)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <GLIcon name="bell" size={18} />
            <span style={{ position: 'absolute', top: 6, insetInlineEnd: 6, minWidth: 15, height: 15, padding: '0 3px', borderRadius: 999, background: 'var(--gl-danger-500)', color: '#fff', fontFamily: 'var(--gl-font-mono)', fontSize: 9, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1.5px solid var(--gl-bg)' }}>8</span>
          </button>
          {/* side menu */}
          <button className="gl-press" aria-label={L(STR.menu)} onClick={() => setDrawerOpen(true)} style={{ width: 38, height: 38, borderRadius: 'var(--gl-radius-sm)', background: 'var(--gl-input-bg)', border: '1px solid var(--gl-border)', color: 'var(--gl-fg-1)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><MenuGlyph size={20} /></button>
        </div>

        {wsOpen && <>
          <div onClick={() => setWsOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 40 }} />
          <div role="listbox" style={{ position: 'absolute', zIndex: 41, top: 62, insetInlineStart: 18, insetInlineEnd: 18, background: 'var(--gl-surface)', border: '1px solid var(--gl-border-strong)', borderRadius: 'var(--gl-radius-lg)', boxShadow: 'var(--gl-shadow-pop)', overflow: 'hidden', padding: 6 }}>
            <div style={{ fontFamily: 'var(--gl-font-body)', fontWeight: 700, fontSize: 10, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--gl-fg-3)', padding: '8px 10px 6px' }}>{L(STR.switchWorkspace)}</div>
            {DATA.workspaces.map(w => {
              const on = w.id === wsId;
              return <button key={w.id} role="option" aria-selected={on} onClick={() => switchWorkspace(w.id)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 11, padding: '10px', minHeight: 48, background: on ? 'var(--gl-hover)' : 'transparent', border: 'none', borderRadius: 'var(--gl-radius-sm)', cursor: 'pointer', textAlign: 'start' }}>
                <span style={{ width: 34, height: 34, borderRadius: 9, background: on ? 'var(--gl-blue-500)' : 'var(--gl-input-bg)', color: on ? '#fff' : 'var(--gl-fg-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontFamily: 'var(--gl-font-display)', fontWeight: 700, fontSize: 14 }}>{L(w.name).trim().charAt(0)}</span>
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ display: 'block', fontFamily: fontFor(lang), fontSize: 13.5, fontWeight: 600, color: 'var(--gl-fg-1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{L(w.name)}</span>
                  <span style={{ display: 'block', fontFamily: 'var(--gl-font-mono)', fontSize: 10.5, color: 'var(--gl-fg-3)' }}>{L(w.tag)}</span>
                </span>
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
      <div style={{ position: 'absolute', top: !t.online ? 104 : 66, left: 0, right: 0, display: 'flex', justifyContent: 'center', pointerEvents: 'none', zIndex: 15, height: 0 }}>
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

          {/* view style popup + currency + compare period — same row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
            <ViewPopup value={viewStyle} onChange={setViewStyle} lang={lang} str={STR} />
            <CurrencyPopup cur={cur} onChange={setCur} lang={lang} currencies={CURRENCIES} str={STR} dir={dir} />
            <div style={{ flex: 1 }} />
            <PeriodSeg value={period} onChange={setPeriod} str={STR} lang={lang} />
          </div>

          {/* summary — cards grid OR chart view */}
          {viewStyle === 'cards'
            ? <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 12 }}>
                {cards.map(c => <MetricCard key={c.id} card={c} cur={cur} lang={lang} period={period} loading={busy} />)}
              </div>
            : <div style={{ marginTop: 12 }}>
                <ChartView cards={cards} cur={cur} lang={lang} period={period} loading={busy} str={STR} dir={dir} sel={chartMetric} onSel={setChartMetric} />
              </div>}

          {/* quick actions */}
          <div style={{ marginTop: 24 }}>
            <SecHead title={L(STR.quickActions)} lang={lang} marker="blue"
              trailing={<button className="gl-press" onClick={() => setActionsOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: 3, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gl-blue-500)', fontFamily: fontFor(lang), fontSize: 12.5, fontWeight: 600, padding: 4 }}>{L(STR.viewAll)}<GLIcon name={dir === 'rtl' ? 'back' : 'chevR'} size={14} /></button>} />
            <QuickActions actions={cfg.actions} lang={lang} maxTiles={7} loading={busy}
              onTap={(a) => showToast((lang === 'ar' ? 'فتح ' : 'Opening ') + pick(a.label, lang))}
              onMore={() => setActionsOpen(true)} />
          </div>

          {/* recent operations */}
          <div style={{ marginTop: 24 }}>
            <SecHead title={L(STR.recentOps)} sub={L(STR.recentSub)} lang={lang} marker="green"
              trailing={<button className="gl-press" onClick={() => showToast((lang === 'ar' ? 'فتح اليومية' : 'Open journal'))} style={{ display: 'flex', alignItems: 'center', gap: 3, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gl-blue-500)', fontFamily: fontFor(lang), fontSize: 12.5, fontWeight: 600, padding: 4 }}>{L(STR.viewAll)}<GLIcon name={dir === 'rtl' ? 'back' : 'chevR'} size={14} /></button>} />
            <div style={{ background: 'var(--gl-surface)', border: '1px solid var(--gl-border)', borderRadius: 'var(--gl-radius-lg)', boxShadow: 'var(--gl-shadow)', padding: '2px 16px' }}>
              {busy
                ? [0, 1, 2, 3, 4].map(i => <OpRowSkeleton key={i} last={i === 4} />)
                : ops.map((op, i) => <OpRow key={op.ref} op={op} cur={cur} lang={lang} last={i === ops.length - 1} />)}
            </div>
          </div>

          {/* needs attention (global) */}
          {attnVisible && <div style={{ marginTop: 24 }}>
            <SecHead title={L(STR.needsAttention)} lang={lang} marker="orange"
              trailing={<span style={{ fontFamily: 'var(--gl-font-mono)', fontSize: 11, color: 'var(--gl-fg-3)' }}>{lang === 'ar' ? 'كل الأقسام' : 'All domains'}</span>} />
            <div style={{ background: 'var(--gl-surface)', border: '1px solid var(--gl-border)', borderRadius: 'var(--gl-radius-lg)', boxShadow: 'var(--gl-shadow)', padding: '2px 16px' }}>
              {busy
                ? [0, 1, 2].map(i => <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: i === 2 ? 'none' : '1px solid var(--gl-border)' }}><Sk w={38} h={38} r={10} /><div style={{ flex: 1 }}><Sk w="55%" h={11} /><Sk w="38%" h={9} mt={6} /></div><Sk w={24} h={24} r={999} /></div>)
                : DATA.attention.map((it, i) => <AttentionItem key={it.id} it={it} lang={lang} last={i === DATA.attention.length - 1} />)}
            </div>
          </div>}
        </div>
      </div>

      {/* all-actions bottom sheet */}
      <BottomSheet open={actionsOpen} onClose={() => setActionsOpen(false)} title={L(STR.allActions)} lang={lang}>
        <ActionSheetBody actions={cfg.actions} lang={lang} onTap={(a) => { setActionsOpen(false); showToast((lang === 'ar' ? 'فتح ' : 'Opening ') + pick(a.label, lang)); }} />
      </BottomSheet>

      {/* global operations search */}
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} lang={lang} cur={cur} dir={dir} str={STR} />

      {/* side menu drawer */}
      <SideDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} lang={lang} dir={dir} str={STR} workspace={workspace} onTap={(label) => { setDrawerOpen(false); showToast(label); }} prefs={{ theme: t.theme, lang: t.lang, online: t.online }} onPref={(k, v) => setTweak(k, v)} />

      {/* floating search button */}
      <button className="gl-press" aria-label={L(STR.search)} onClick={() => setSearchOpen(true)} style={{ position: 'absolute', insetInlineEnd: 18, bottom: 92, zIndex: 28, width: 54, height: 54, borderRadius: 18, background: 'var(--gl-blue-500)', border: 'none', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 8px 22px -6px color-mix(in srgb, var(--gl-blue-500) 70%, transparent), var(--gl-shadow-pop)' }}>
        <GLIcon name="searchO" size={22} stroke={2} /><span style={{ marginInlineStart: -22 }}><GLIcon name="search" size={22} stroke={2} /></span>
      </button>

      {/* toast */}
      {toast && <div style={{ position: 'absolute', bottom: 92, left: '50%', transform: 'translateX(-50%)', zIndex: 70, display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', background: 'var(--gl-fg-1)', color: 'var(--gl-bg)', borderRadius: 999, boxShadow: 'var(--gl-shadow-pop)', fontFamily: fontFor(lang), fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', animation: 'gltoast var(--gl-dur-moderate) var(--gl-ease-out)' }}>
        <GLIcon name="check" size={15} />{toast}
      </div>}

      {/* ── bottom nav ── */}
      <nav style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 25, display: 'flex', paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 12px)', paddingTop: 8, background: 'color-mix(in srgb, var(--gl-bg) 92%, transparent)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', borderTop: '1px solid var(--gl-border)' }}>
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
  return <div style={{ position: 'fixed', inset: 0, display: 'flex', justifyContent: 'center', background: t.theme === 'dark' ? '#08090c' : '#e7e8ee' }}>
    <div style={{ position: 'relative', width: '100%', maxWidth: 430, height: '100%', overflow: 'hidden', background: 'var(--gl-bg)', boxShadow: '0 0 0 1px var(--gl-border)' }}>
      <App t={t} setTweak={setTweak} />
    </div>
  </div>;
}

ReactDOM.createRoot(document.getElementById('root')).render(<Mounted />);
