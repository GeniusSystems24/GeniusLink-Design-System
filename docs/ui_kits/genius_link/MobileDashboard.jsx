/* global React, window */
// GeniusLink mobile — Dashboard tab.
// Merged from the standalone "Mobile Dashboard.html": the rich, interactive
// dashboard rendered inside the app shell. This screen provides its OWN app bar
// (workspace switcher + notifications + menu) and the SAME slide-in side drawer
// as the standalone — so MobileApp skips its default app bar for the dashboard.
//
// View styles: Cards · Charts (area trend) · Cash Flow (12-month bar chart).
// The drawer's preferences (Theme / Language / Connection) drive real dashboard
// state: language flips the whole dashboard EN⇄AR (with RTL), theme re-tints the
// dashboard subtree via [data-theme], and connection toggles the offline banner.

const { useState: useDashState, useRef: useDashRef, useCallback: useDashCb } = React;

/* device-anchored overlay host: fixed + centered to the 430px device column so
   the drawer, bottom sheet, search overlay, FAB and toast pin to the phone frame
   instead of scrolling (the shell's #device is itself the scroll container). */
function MDLayer({ children, active }) {
  return (
    <div style={{ position: 'fixed', top: 0, bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 430, zIndex: 60, pointerEvents: active ? 'auto' : 'none' }}>
      {children}
    </div>
  );
}

function MDashboard({ go, setTab }) {
  const G = window.GLMD;
  const DATA = window.GL_DATA;
  const STR = window.GL_STR;
  const CURRENCIES = window.GL_CURRENCIES;
  const CASHFLOW = window.GL_CASHFLOW;
  const GLIcon = window.GLIcon;

  // preferences (driven by the side drawer)
  const [theme, setTheme] = useDashState('dark');
  const [lang, setLang] = useDashState('en');
  const [online, setOnline] = useDashState(true);
  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  const L = (o) => G.pick(o, lang);
  const fontFor = G.fontFor;

  const [tab, setDomain] = useDashState('banking');
  const [cur, setCur] = useDashState('SAR');
  const [period, setPeriod] = useDashState('week');
  const [viewStyle, setViewStyle] = useDashState('cards');
  const [chartMetric, setChartMetric] = useDashState(null);
  const [actionsOpen, setActionsOpen] = useDashState(false);
  const [searchOpen, setSearchOpen] = useDashState(false);
  const [drawerOpen, setDrawerOpen] = useDashState(false);
  const [tabLoading, setTabLoading] = useDashState(false);
  const [toast, setToast] = useDashState(null);
  // workspace switching (scales the displayed figures by workspace.factor)
  const [wsId, setWsId] = useDashState(DATA.workspaces[0].id);
  const [wsOpen, setWsOpen] = useDashState(false);
  const [wsLoading, setWsLoading] = useDashState(false);
  const loaded = useDashRef(new Set(['banking']));
  const toastTimer = useDashRef(null);

  const showToast = useDashCb((msg) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2200);
  }, []);

  const switchTab = (id) => {
    setDomain(id);
    if (!loaded.current.has(id)) {
      setTabLoading(true);
      setTimeout(() => { loaded.current.add(id); setTabLoading(false); }, 560);
    }
  };

  const workspace = DATA.workspaces.find((w) => w.id === wsId) || DATA.workspaces[0];
  const switchWorkspace = (id) => {
    setWsOpen(false);
    if (id === wsId) return;
    setWsId(id);
    setWsLoading(true);
    const dev = document.getElementById('device');
    if (dev) dev.scrollTop = 0;
    setTimeout(() => setWsLoading(false), 850);
  };

  // drawer nav → routes within the kit
  const onDrawerTap = (label, id) => {
    setDrawerOpen(false);
    if (id === 'accounts') { setTab && setTab('accounts'); }
    else if (id === 'journal') go('journalList');
    else if (id === 'contacts') go('customersList');
    else if (id === 'reports') go('trialBalance');
    else if (id === 'settings') go('settingsHub');
    else if (id === 'signout') showToast(label);
  };
  const onDrawerPref = (k, v) => {
    if (k === 'theme') setTheme(v);
    else if (k === 'lang') setLang(v);
    else if (k === 'online') setOnline(v);
  };

  const cfg = DATA.tabs.find((x) => x.id === tab);
  const busy = tabLoading || wsLoading;
  const overlayActive = actionsOpen || searchOpen || drawerOpen;

  // scale figures by the active workspace's factor
  const f = workspace.factor;
  const scaleObj = (o) => { const r = {}; for (const k in o) r[k] = Math.round(o[k] * f); return r; };
  const cards = cfg.cards.map((c) => f === 1 ? c : { ...c, val: scaleObj(c.val) });
  const ops = cfg.ops.map((o) => f === 1 ? o : { ...o, amt: scaleObj(o.amt) });

  const VIEW_OPTS = [['cards', STR.cardsView, 'grid'], ['chart', STR.chartView, 'trend'], ['cashflow', STR.cashflowView, 'bars']];

  return (
    <div dir={dir} data-theme={theme === 'light' ? 'light' : undefined} style={{ fontFamily: fontFor(lang), background: 'var(--gl-bg)', minHeight: '100%' }}>

      {/* ── rich app bar (workspace switcher + notifications + menu) ── */}
      <header style={{ position: 'sticky', top: 0, zIndex: 30, paddingTop: 'calc(env(safe-area-inset-top, 0px) + 14px)', paddingInline: 18, paddingBottom: 12, background: 'color-mix(in srgb, var(--gl-bg) 90%, transparent)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', borderBottom: '1px solid var(--gl-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button className="gl-press" onClick={() => setWsOpen((v) => !v)} aria-haspopup="listbox" style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'none', border: 'none', cursor: 'pointer', padding: 0, flex: 1, minWidth: 0 }}>
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
          {/* menu — opens the side drawer */}
          <button className="gl-press" aria-label={L(STR.menu)} onClick={() => setDrawerOpen(true)} style={{ width: 38, height: 38, borderRadius: 'var(--gl-radius-sm)', background: 'var(--gl-input-bg)', border: '1px solid var(--gl-border)', color: 'var(--gl-fg-1)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><G.MenuGlyph size={20} /></button>
        </div>

        {wsOpen && <>
          <div onClick={() => setWsOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 40 }} />
          <div role="listbox" style={{ position: 'absolute', zIndex: 41, top: 62, insetInlineStart: 18, insetInlineEnd: 18, background: 'var(--gl-surface)', border: '1px solid var(--gl-border-strong)', borderRadius: 'var(--gl-radius-lg)', boxShadow: 'var(--gl-shadow-pop)', overflow: 'hidden', padding: 6 }}>
            <div style={{ fontFamily: 'var(--gl-font-body)', fontWeight: 700, fontSize: 10, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--gl-fg-3)', padding: '8px 10px 6px' }}>{L(STR.switchWorkspace)}</div>
            {DATA.workspaces.map((w) => {
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
      {!online && <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 18px', background: 'color-mix(in srgb, var(--gl-warning-500) 16%, transparent)', color: 'var(--gl-warning-500)' }}>
        <GLIcon name="ban" size={15} />
        <span style={{ fontFamily: fontFor(lang), fontSize: 12, fontWeight: 600 }}>{L(STR.offline)}</span>
      </div>}

      {/* ── body ── */}
      <div style={{ padding: '16px 18px 124px' }}>

        {/* greeting */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontFamily: 'var(--gl-font-body)', fontWeight: 700, fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--gl-blue-500)' }}>{L(STR.goodMorning)}</div>
          <h1 style={{ fontFamily: 'var(--gl-font-display)', fontWeight: 800, fontSize: 28, letterSpacing: '-0.03em', color: 'var(--gl-fg-1)', margin: '3px 0 0' }}>{L(STR.dashboard)}</h1>
        </div>

        {/* domain tabs */}
        <G.DomainTabs tabs={DATA.tabs} active={tab} onChange={switchTab} lang={lang} />

        {/* view-style + display currency + compare period */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
          <G.ViewPopup value={viewStyle} onChange={setViewStyle} lang={lang} str={STR} options={VIEW_OPTS} />
          <G.CurrencyPopup cur={cur} onChange={setCur} lang={lang} currencies={CURRENCIES} str={STR} dir={dir} />
          <div style={{ flex: 1 }} />
          {viewStyle !== 'cashflow' && <G.PeriodSeg value={period} onChange={setPeriod} str={STR} lang={lang} />}
        </div>

        {/* summary — cards grid · area-trend charts · cash-flow bars */}
        {viewStyle === 'cards' && <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 12 }}>
          {cards.map((c) => <G.MetricCard key={c.id} card={c} cur={cur} lang={lang} period={period} loading={busy} />)}
        </div>}
        {viewStyle === 'chart' && <div style={{ marginTop: 12 }}>
          <G.ChartView cards={cards} cur={cur} lang={lang} period={period} loading={busy} str={STR} dir={dir} sel={chartMetric} onSel={setChartMetric} />
        </div>}
        {viewStyle === 'cashflow' && <div style={{ marginTop: 12 }}>
          <G.CashFlowChart data={CASHFLOW} lang={lang} dir={dir} loading={busy} str={STR} />
        </div>}

        {/* quick actions */}
        <div style={{ marginTop: 24 }}>
          <G.SecHead title={L(STR.quickActions)} lang={lang} marker="blue"
            trailing={<button className="gl-press" onClick={() => setActionsOpen(true)} style={trailingBtn()}>{L(STR.viewAll)}<GLIcon name={dir === 'rtl' ? 'back' : 'chevR'} size={14} /></button>} />
          <G.QuickActions actions={cfg.actions} lang={lang} maxTiles={7} loading={busy}
            onTap={(a) => showToast((lang === 'ar' ? 'فتح ' : 'Opening ') + G.pick(a.label, lang))}
            onMore={() => setActionsOpen(true)} />
        </div>

        {/* recent operations */}
        <div style={{ marginTop: 24 }}>
          <G.SecHead title={L(STR.recentOps)} sub={L(STR.recentSub)} lang={lang} marker="green"
            trailing={<button className="gl-press" onClick={() => go('journalList')} style={trailingBtn()}>{L(STR.viewAll)}<GLIcon name={dir === 'rtl' ? 'back' : 'chevR'} size={14} /></button>} />
          <div style={listCard()}>
            {busy
              ? [0, 1, 2, 3, 4].map((i) => <G.OpRowSkeleton key={i} last={i === 4} />)
              : ops.map((op, i) => <G.OpRow key={op.ref} op={op} cur={cur} lang={lang} last={i === ops.length - 1} />)}
          </div>
        </div>

        {/* needs attention (global) */}
        <div style={{ marginTop: 24 }}>
          <G.SecHead title={L(STR.needsAttention)} lang={lang} marker="orange"
            trailing={<span style={{ fontFamily: 'var(--gl-font-mono)', fontSize: 11, color: 'var(--gl-fg-3)' }}>{lang === 'ar' ? 'كل الأقسام' : 'All domains'}</span>} />
          <div style={listCard()}>
            {DATA.attention.map((it, i) => <G.AttentionItem key={it.id} it={it} lang={lang} last={i === DATA.attention.length - 1} />)}
          </div>
        </div>
      </div>

      {/* device-anchored layer: FAB, toast, drawer, and full-screen overlays */}
      <MDLayer active={overlayActive}>
        {/* floating global-search button */}
        <button className="gl-press" aria-label={L(STR.search)} onClick={() => setSearchOpen(true)}
          style={{ position: 'absolute', insetInlineEnd: 18, bottom: 96, pointerEvents: 'auto', width: 54, height: 54, borderRadius: 18, background: 'var(--gl-blue-500)', border: 'none', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 8px 22px -6px color-mix(in srgb, var(--gl-blue-500) 70%, transparent), var(--gl-shadow-pop)' }}>
          <GLIcon name="searchO" size={22} stroke={2} /><span style={{ marginInlineStart: -22 }}><GLIcon name="search" size={22} stroke={2} /></span>
        </button>

        {/* toast */}
        {toast && <div style={{ position: 'absolute', bottom: 100, left: '50%', transform: 'translateX(-50%)', pointerEvents: 'none', display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', background: 'var(--gl-fg-1)', color: 'var(--gl-bg)', borderRadius: 999, boxShadow: 'var(--gl-shadow-pop)', fontFamily: fontFor(lang), fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', animation: 'gltoast var(--gl-dur-moderate) var(--gl-ease-out)', zIndex: 70 }}>
          <GLIcon name="check" size={15} />{toast}
        </div>}

        {/* drawer + bottom sheet + global operations search */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: overlayActive ? 'auto' : 'none' }}>
          <G.SideDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} lang={lang} dir={dir} str={STR} workspace={workspace} onTap={onDrawerTap} prefs={{ theme, lang, online }} onPref={onDrawerPref} />
          <G.BottomSheet open={actionsOpen} onClose={() => setActionsOpen(false)} title={L(STR.allActions)} lang={lang}>
            <G.ActionSheetBody actions={cfg.actions} lang={lang} onTap={(a) => { setActionsOpen(false); showToast((lang === 'ar' ? 'فتح ' : 'Opening ') + G.pick(a.label, lang)); }} />
          </G.BottomSheet>
          <G.SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} lang={lang} cur={cur} dir={dir} str={STR} />
        </div>
      </MDLayer>
    </div>
  );
}

function trailingBtn() {
  return { display: 'flex', alignItems: 'center', gap: 3, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gl-blue-500)', fontFamily: 'var(--gl-font-body)', fontSize: 12.5, fontWeight: 600, padding: 4 };
}
function listCard() {
  return { background: 'var(--gl-surface)', border: '1px solid var(--gl-border)', borderRadius: 'var(--gl-radius-lg)', boxShadow: 'var(--gl-shadow)', padding: '2px 16px' };
}

Object.assign(window.MScreens = window.MScreens || {}, { dashboard: MDashboard });
