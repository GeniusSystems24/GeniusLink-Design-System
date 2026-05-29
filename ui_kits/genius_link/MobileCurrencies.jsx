/* global React */
// GeniusLink mobile — V3 Stage D · Currencies & Configuration.
// Mirrors desktop Currencies / Configuration. Uses _minv primitives.

const MCu = window._mob;
const { C: UC, MIcon: UIcon, Pill: UPill, MCard: UCard, MBtn: UBtn, Scroll: UScroll } = MCu;
const { ISection: USection, IField: UField, IToggle: UToggle, InfoNote: UNote, ActionRow: UAction } = window._minv;

const CURRENCIES = [
  { code: 'SAR', en: 'Saudi Riyal', ar: 'ريال سعودي', symbol: '﷼', rate: '1.000000', dec: 2, base: true, status: 'active' },
  { code: 'USD', en: 'US Dollar', ar: 'دولار أمريكي', symbol: '$', rate: '3.750200', dec: 2, base: false, status: 'active' },
  { code: 'EUR', en: 'Euro', ar: 'يورو', symbol: '€', rate: '4.082100', dec: 2, base: false, status: 'active' },
  { code: 'GBP', en: 'British Pound', ar: 'جنيه إسترليني', symbol: '£', rate: '4.761000', dec: 2, base: false, status: 'active' },
  { code: 'AED', en: 'UAE Dirham', ar: 'درهم إماراتي', symbol: 'د.إ', rate: '1.020800', dec: 2, base: false, status: 'active' },
  { code: 'KWD', en: 'Kuwaiti Dinar', ar: 'دينار كويتي', symbol: 'د.ك', rate: '12.18000', dec: 3, base: false, status: 'inactive' },
];

/* ═════════ 1 · CURRENCIES LIST ═════════ */
function MCurrenciesList({ go }) {
  return (
    <UScroll>
      <UCard pad={8}>
        {CURRENCIES.map((c, i) => (
          <div key={c.code} onClick={() => go('currencyDetail')} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 8px', borderBottom: i < CURRENCIES.length - 1 ? `1px solid ${UC.border}` : 'none', cursor: 'pointer' }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: UC.input, border: `1px solid ${UC.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, color: UC.fg1, flexShrink: 0 }}>{c.symbol}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', gap: 7, alignItems: 'center' }}>
                <span style={{ fontFamily: UC.mono, fontSize: 13, fontWeight: 700, color: UC.fg1 }}>{c.code}</span>
                {c.base && <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.08em', color: UC.blue, background: `${UC.blue}24`, padding: '2px 5px', borderRadius: 4, fontFamily: UC.body }}>BASE</span>}
              </div>
              <div style={{ fontSize: 12.5, color: UC.fg3, fontFamily: UC.body, marginTop: 2 }}>{c.en}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: UC.mono, fontSize: 13, fontWeight: 600, color: UC.fg1 }}>{c.rate}</div>
              <div style={{ marginTop: 4 }}><UPill tone={c.status === 'active' ? 'success' : 'neutral'}>{c.status}</UPill></div>
            </div>
          </div>
        ))}
      </UCard>
    </UScroll>
  );
}

/* ═════════ 2 · CREATE CURRENCY ═════════ */
function MCreateCurrency() {
  return (
    <UScroll>
      <USection icon="swap" title="Currency Definition" sub="ISO code, display names and symbol" marker={UC.blue}>
        <UField label="ISO Code" placeholder="e.g. USD" mono required />
        <UField label="Symbol" placeholder="e.g. $" required />
        <UField label="Name English" placeholder="e.g. US Dollar" required />
        <UField label="الاسم بالعربية" placeholder="مثال: دولار أمريكي" ar required />
      </USection>
      <USection icon="ledger" title="Precision & Rate" sub="Decimal places and exchange rate against base" marker={UC.green}>
        <UField label="Decimal Places" value="2" select />
        <UField label="Exchange Rate (per 1 SAR)" placeholder="e.g. 3.750200" mono />
        <UToggle label="Set as base currency" on={false} />
      </USection>
      <UAction primary="Add Currency" />
    </UScroll>
  );
}

/* ═════════ 3 · CURRENCY DETAILS ═════════ */
function MCurrencyDetails() {
  const history = [
    { date: 'Dec 18, 2025', rate: '3.750200', by: 'System · ECB feed' },
    { date: 'Dec 11, 2025', rate: '3.751400', by: 'System · ECB feed' },
    { date: 'Dec 04, 2025', rate: '3.749800', by: 'Layla A. (manual)' },
    { date: 'Nov 27, 2025', rate: '3.752100', by: 'System · ECB feed' },
  ];
  return (
    <UScroll>
      <UCard marker={UC.green} title="Current Rate" sub="Per 1 SAR · updated Dec 18, 2025" right={<UPill tone="success">Active</UPill>}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
          <span style={{ fontFamily: UC.mono, fontSize: 14, color: UC.fg3 }}>USD</span>
          <span style={{ fontFamily: UC.mono, fontSize: 34, fontWeight: 700, color: UC.fg1, letterSpacing: '-0.02em' }}>3.750200</span>
          <span style={{ fontFamily: UC.mono, fontSize: 12, color: UC.green }}>▲ 0.03%</span>
        </div>
      </UCard>
      <UCard marker={UC.blue} title="Definition">
        <KVc k="ISO Code" v="USD" mono /><KVc k="Symbol" v="$" />
        <KVc k="Name English" v="US Dollar" /><KVc k="Name Arabic" v="دولار أمريكي" ar />
        <KVc k="Decimal Places" v="2" mono /><KVc k="Source" v="ECB Daily Feed" />
      </UCard>
      <UCard marker={UC.orange} title="Rate History" sub="Last 4 updates" pad={8}>
        <div style={{ padding: '0 8px' }}>
          {history.map((h, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: i < history.length - 1 ? `1px solid ${UC.border}` : 'none' }}>
              <span style={{ fontFamily: UC.mono, fontSize: 12, color: UC.fg2, width: 92 }}>{h.date}</span>
              <span style={{ fontFamily: UC.mono, fontSize: 13, fontWeight: 600, color: UC.fg1, flex: 1, textAlign: 'right' }}>{h.rate}</span>
              <span style={{ fontSize: 11, color: UC.fg3, fontFamily: UC.body, width: 96, textAlign: 'right' }}>{h.by}</span>
            </div>
          ))}
        </div>
      </UCard>
      <UBtn variant="secondary" icon="back" full>Back to List</UBtn>
    </UScroll>
  );
}
function KVc({ k, v, mono, ar }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
      <span style={{ fontWeight: 700, fontSize: 10, letterSpacing: '0.05em', textTransform: 'uppercase', color: UC.fg3, fontFamily: UC.body }}>{k}</span>
      <span dir={ar ? 'rtl' : 'ltr'} style={{ fontSize: 13, color: UC.fg1, fontFamily: ar ? UC.arabic : (mono ? UC.mono : UC.body), textAlign: 'right' }}>{v}</span>
    </div>
  );
}

/* ═════════ 4 · EXCHANGE RATE SETUP ═════════ */
function MExchangeRateSetup() {
  const pairs = [
    { code: 'USD', name: 'US Dollar', rate: '3.750200', prev: '3.751400', auto: true },
    { code: 'EUR', name: 'Euro', rate: '4.082100', prev: '4.079800', auto: true },
    { code: 'GBP', name: 'British Pound', rate: '4.761000', prev: '4.758200', auto: true },
    { code: 'AED', name: 'UAE Dirham', rate: '1.020800', prev: '1.020800', auto: false },
    { code: 'KWD', name: 'Kuwaiti Dinar', rate: '12.18000', prev: '12.17200', auto: false },
  ];
  return (
    <UScroll>
      <UCard marker={UC.blue} title="Base Currency">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontFamily: UC.mono, fontWeight: 700, fontSize: 15, color: UC.fg1 }}>
            SAR <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.08em', color: UC.blue, background: `${UC.blue}24`, padding: '2px 5px', borderRadius: 4, fontFamily: UC.body }}>BASE</span>
          </span>
          <span style={{ fontFamily: UC.mono, fontSize: 11, color: UC.fg3 }}>Effective Dec 18, 2025</span>
        </div>
        <UBtn variant="secondary" icon="download" full>Pull ECB Feed</UBtn>
      </UCard>
      <UCard marker={UC.green} title="Rates per 1 SAR" sub="Auto-fed pairs sync daily; manual pairs are editable" pad={8}>
        <div style={{ padding: '0 8px' }}>
          {pairs.map((p, i) => {
            const delta = (parseFloat(p.rate) - parseFloat(p.prev));
            const up = delta > 0, flat = delta === 0;
            return (
              <div key={p.code} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: i < pairs.length - 1 ? `1px solid ${UC.border}` : 'none' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', gap: 7, alignItems: 'center' }}>
                    <span style={{ fontFamily: UC.mono, fontSize: 13, fontWeight: 700, color: UC.fg1 }}>{p.code}</span>
                    <UPill tone={p.auto ? 'info' : 'neutral'}>{p.auto ? 'Auto' : 'Manual'}</UPill>
                  </div>
                  <div style={{ fontSize: 11.5, color: UC.fg3, fontFamily: UC.body, marginTop: 2 }}>{p.name}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'flex-end' }}>
                    <span style={{ fontFamily: UC.mono, fontSize: 10.5, color: flat ? UC.fg4 : (up ? UC.green : UC.red) }}>{flat ? '—' : (up ? '▲' : '▼')}</span>
                    <span style={{ fontFamily: UC.mono, fontSize: 14, fontWeight: 600, color: UC.fg1, padding: p.auto ? 0 : '5px 10px', background: p.auto ? 'transparent' : UC.input, border: p.auto ? 'none' : `1px solid ${UC.borderStrong}`, borderRadius: 6 }}>{p.rate}</span>
                  </div>
                  <div style={{ fontFamily: UC.mono, fontSize: 10, color: UC.fg3, marginTop: 3 }}>prev {p.prev}</div>
                </div>
              </div>
            );
          })}
        </div>
      </UCard>
      <UAction primary="Save Rates" />
    </UScroll>
  );
}

/* ═════════ 5 · FISCAL YEAR SETUP ═════════ */
function MFiscalYearSetup() {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const stOf = (i) => i < 11 ? 'closed' : (i === 11 ? 'open' : 'future');
  return (
    <UScroll>
      <USection icon="calendar" title="Year Definition" sub="Define the active fiscal year boundaries" marker={UC.blue} right={<UPill tone="success">Open</UPill>}>
        <UField label="Fiscal Year" value="2024" mono />
        <UField label="Start Date" value="01/01/2024" mono />
        <UField label="End Date" value="12/31/2024" mono />
      </USection>
      <UCard marker={UC.green} title="Accounting Periods" sub="12 monthly periods · lock to prevent back-dated postings">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
          {months.map((m, i) => {
            const st = stOf(i);
            const cfg = {
              closed: { bg: UC.bg, border: UC.border, label: 'Closed', color: UC.fg3, icon: 'lock' },
              open: { bg: `${UC.green}14`, border: `${UC.green}4D`, label: 'Open', color: UC.green, icon: 'check' },
              future: { bg: UC.bg, border: UC.border, label: 'Future', color: UC.fg3, icon: null },
            }[st];
            return (
              <div key={m} style={{ padding: '12px 12px', borderRadius: 10, background: cfg.bg, border: `1px solid ${cfg.border}`, display: 'flex', flexDirection: 'column', gap: 8, opacity: st === 'future' ? 0.5 : 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 700, fontSize: 13, color: UC.fg1, fontFamily: UC.body }}>{m}</span>
                  {cfg.icon && <UIcon name={cfg.icon} size={13} color={cfg.color} />}
                </div>
                <span style={{ fontWeight: 700, fontSize: 8.5, letterSpacing: '0.08em', textTransform: 'uppercase', color: cfg.color, fontFamily: UC.body }}>{cfg.label}</span>
              </div>
            );
          })}
        </div>
      </UCard>
      <UNote>Closing a period locks all postings dated within it. A locked period can only be reopened by a controller with audit justification.</UNote>
      <UAction primary="Save Configuration" />
    </UScroll>
  );
}

/* ───────── register ───────── */
Object.assign(window.MScreens = window.MScreens || {}, {
  currenciesList: MCurrenciesList,
  createCurrency: MCreateCurrency,
  currencyDetail: MCurrencyDetails,
  exchangeRateSetup: MExchangeRateSetup,
  fiscalYearSetup: MFiscalYearSetup,
});
