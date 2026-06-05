/* global React */
// GeniusLink mobile — Settings (Phase 1): hub + Organization screens.
// Company Profile · Financial · Taxes · Currencies · Numbering · Branches & Stores.
// Interactive via _mui (real inputs/selects/toggles). Registers into window.MScreens.

const MSt = window._mob;
const { C: SC, MIcon: SIcon, Pill: SPill, MCard: SCard, MBtn: SBtn, Scroll: SScroll } = MSt;
const { ISection: SSection } = window._minv;
const { TInput: STInput, TSelect: STSelect, TSwitch: STSwitch } = window._mui;
const { useState: useSState } = React;

const SETTINGS_NAV = [
  { group: 'Organization', items: [
    { id: 'setCompany', label: 'Company Profile', icon: 'building', desc: 'Legal name, logo, address, tax IDs' },
    { id: 'setFinancial', label: 'Financial', icon: 'globe', desc: 'Base currency, fiscal year' },
    { id: 'setTaxes', label: 'Taxes', icon: 'percent', desc: 'VAT / GST rules' },
    { id: 'setCurrencies', label: 'Currencies', icon: 'swap', desc: 'Exchange rates' },
    { id: 'setNumbering', label: 'Numbering', icon: 'doc', desc: 'Document prefixes' },
    { id: 'setBranches', label: 'Branches & Stores', icon: 'store', desc: 'Locations & warehouses' },
  ] },
  { group: 'Workspace', items: [
    { id: 'tenants', label: 'Workspaces', icon: 'switch2', desc: 'Switch or manage organizations' },
  ] },
  { group: 'Team & Security', items: [
    { id: 'usersList', label: 'Users', icon: 'user', desc: 'Members & invites' },
    { id: 'rolesList', label: 'Roles & Permissions', icon: 'settings', desc: 'Access per module' },
    { id: 'auditLog', label: 'Audit Log', icon: 'lock', desc: 'Activity trail' },
  ] },
  { group: 'Platform', items: [
    { id: 'setIntegrations', label: 'Integrations', icon: 'plug', desc: 'Banking, e-commerce, email' },
    { id: 'setWebhooks', label: 'Webhooks', icon: 'link', desc: 'Event subscriptions' },
    { id: 'setApiKeys', label: 'API Keys', icon: 'key', desc: 'Access tokens' },
    { id: 'setNotifications', label: 'Notifications', icon: 'bell2', desc: 'Email & in-app alerts' },
    { id: 'setBilling', label: 'Billing & Plan', icon: 'card', desc: 'Subscription' },
    { id: 'setBackup', label: 'Backup & Export', icon: 'database', desc: 'Export & snapshots' },
  ] },
];

/* ═════════ HUB ═════════ */
function MSettingsHub({ go }) {
  return (
    <SScroll>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '4px 2px 4px' }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: `${SC.blue}1F`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: SC.blue }}><SIcon name="building" size={20} /></div>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: SC.fg1, fontFamily: SC.body }}>Al-Rashid Trading Co.</div>
          <div style={{ fontFamily: SC.mono, fontSize: 11, color: SC.fg3 }}>Tenant 9 · GeniusLink ERP</div>
        </div>
      </div>
      {SETTINGS_NAV.map((g) => (
        <SCard key={g.group} title={g.group} marker={SC.blue} pad={8}>
          <div style={{ padding: '0 8px' }}>
            {g.items.map((it, i) => (
              <div key={it.id} onClick={() => !it.soon && go(it.id)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: i < g.items.length - 1 ? `1px solid ${SC.border}` : 'none', cursor: it.soon ? 'default' : 'pointer', opacity: it.soon ? 0.45 : 1 }}>
                <div style={{ width: 34, height: 34, borderRadius: 8, background: SC.input, display: 'flex', alignItems: 'center', justifyContent: 'center', color: SC.fg2, flexShrink: 0 }}><SIcon name={it.icon} size={16} /></div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: SC.fg1, fontFamily: SC.body }}>{it.label}</div>
                  <div style={{ fontSize: 11.5, color: SC.fg3, fontFamily: SC.body, marginTop: 1 }}>{it.desc}</div>
                </div>
                {it.soon ? <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: SC.fg4, border: `1px solid ${SC.border}`, borderRadius: 4, padding: '2px 5px', fontFamily: SC.body }}>Soon</span> : <SIcon name="chevR" size={16} color={SC.fg4} />}
              </div>
            ))}
          </div>
        </SCard>
      ))}
    </SScroll>
  );
}

/* ═════════ COMPANY PROFILE ═════════ */
function MCompanyProfile() {
  return (
    <SScroll>
      <SSection icon="building" title="Identity" sub="Names shown on documents" marker={SC.blue}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 64, height: 64, borderRadius: 12, background: SC.input, border: `1px solid ${SC.borderStrong}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: SC.fg3, flexShrink: 0 }}><SIcon name="building" size={26} /></div>
          <SBtn variant="secondary" icon="download">Upload Logo</SBtn>
        </div>
        <STInput label="Legal Name (English)" defaultValue="Al-Rashid Trading Co." required />
        <STInput label="الاسم القانوني" defaultValue="شركة الراشد التجارية" ar required />
        <STInput label="Trade Name" defaultValue="GeniusLink" />
        <STInput label="Commercial Registration" defaultValue="1010234567" mono />
      </SSection>
      <SSection icon="pin" title="Registered Address" marker={SC.green}>
        <STSelect label="Country" value="Saudi Arabia" options={['Saudi Arabia', 'United Arab Emirates', 'Kuwait', 'Qatar']} />
        <STInput label="City" defaultValue="Riyadh" />
        <STInput label="Street Address" defaultValue="King Fahd Rd, Olaya" />
        <STInput label="Postal Code" defaultValue="12211" mono />
      </SSection>
      <SSection icon="percent" title="Tax Registration" marker={SC.orange}>
        <STInput label="VAT Number" defaultValue="300123456700003" mono required />
        <STInput label="Tax Identification No." defaultValue="9100234567" mono />
        <STSelect label="Tax Authority" value="ZATCA (Saudi Arabia)" options={['ZATCA (Saudi Arabia)', 'FTA (UAE)', 'GAZT']} />
      </SSection>
      <SBtn variant="primary" icon="check" full>Save Changes</SBtn>
    </SScroll>
  );
}

/* ═════════ FINANCIAL ═════════ */
function MFinancialSettings() {
  const [basis, setBasis] = useSState('accrual');
  return (
    <SScroll>
      <SSection icon="globe" title="Currency & Calendar" marker={SC.blue}>
        <STSelect label="Base Currency" value="SAR — Saudi Riyal" options={['SAR — Saudi Riyal', 'USD — US Dollar', 'AED — UAE Dirham']} />
        <STSelect label="Fiscal Year Start" value="January" options={['January', 'April', 'July', 'October']} />
        <STSelect label="Rounding Precision" value="2 decimals" options={['0 decimals', '2 decimals', '3 decimals']} />
        <div>
          <div style={{ fontWeight: 700, fontSize: 10, letterSpacing: '0.05em', textTransform: 'uppercase', color: SC.fg2, marginBottom: 7, fontFamily: SC.body }}>Accounting Basis</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {[['accrual', 'Accrual'], ['cash', 'Cash']].map(([id, label]) => {
              const on = basis === id;
              return <div key={id} onClick={() => setBasis(id)} style={{ padding: 12, textAlign: 'center', borderRadius: 8, cursor: 'pointer', background: on ? `${SC.blue}1F` : SC.input, border: `1px solid ${on ? SC.blue : SC.border}`, color: on ? SC.blue : SC.fg2, fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.04em', fontFamily: SC.body }}>{label}</div>;
            })}
          </div>
        </div>
      </SSection>
      <SSection icon="ledger" title="Default Posting Accounts" marker={SC.green}>
        <STSelect label="Retained Earnings" value="3100 — Retained Earnings" options={['3100 — Retained Earnings', '3001 — Owner Capital']} />
        <STSelect label="Default Tax Account" value="2200 — VAT Payable" options={['2200 — VAT Payable', '1350 — VAT Receivable']} />
      </SSection>
      <SSection icon="lock" title="Posting Rules" marker={SC.orange}>
        <STSwitch label="Lock postings to open periods only" defaultOn={true} />
        <STSwitch label="Auto-update FX rates daily" defaultOn={true} />
      </SSection>
      <SBtn variant="primary" icon="check" full>Save Changes</SBtn>
    </SScroll>
  );
}

/* ═════════ TAXES ═════════ */
function MTaxesSettings() {
  const [rules, setRules] = useSState([
    { name: 'Standard VAT', rate: '15', type: 'VAT', scope: 'Sales & Purchases', on: true },
    { name: 'Zero-Rated', rate: '0', type: 'VAT', scope: 'Exports', on: true },
    { name: 'Exempt', rate: '0', type: 'VAT', scope: 'Financial services', on: true },
    { name: 'Withholding — Services', rate: '5', type: 'WHT', scope: 'Non-resident', on: false },
  ]);
  const toggle = (i) => setRules((r) => r.map((x, j) => j === i ? { ...x, on: !x.on } : x));
  return (
    <SScroll>
      <SCard marker={SC.green} title="Tax Rules" sub={`${rules.filter(r => r.on).length} active · applied at line level`} pad={8}>
        <div style={{ padding: '0 8px' }}>
          {rules.map((r, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: i < rules.length - 1 ? `1px solid ${SC.border}` : 'none' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 13.5, fontWeight: 600, color: SC.fg1, fontFamily: SC.body }}>{r.name}</span>
                  <SPill tone={r.type === 'VAT' ? 'info' : 'warning'}>{r.type}</SPill>
                </div>
                <div style={{ fontSize: 11.5, color: SC.fg3, fontFamily: SC.body, marginTop: 3 }}>{r.scope}</div>
              </div>
              <span style={{ fontFamily: SC.mono, fontSize: 15, fontWeight: 700, color: SC.fg1 }}>{r.rate}%</span>
              <button onClick={() => toggle(i)} style={{ width: 42, height: 24, borderRadius: 999, background: r.on ? SC.blue : SC.input, border: `1px solid ${r.on ? SC.blue : SC.borderStrong}`, position: 'relative', cursor: 'pointer', padding: 0, flexShrink: 0 }}>
                <span style={{ position: 'absolute', top: 2, left: r.on ? 20 : 2, width: 18, height: 18, borderRadius: 999, background: '#fff', transition: 'left 150ms ease' }} />
              </button>
            </div>
          ))}
        </div>
      </SCard>
      <SBtn variant="secondary" icon="plus" full onClick={() => setRules((r) => [...r, { name: 'New Rule', rate: '0', type: 'VAT', scope: '—', on: false }])}>Add Tax Rule</SBtn>
      <SBtn variant="primary" icon="check" full>Save Changes</SBtn>
    </SScroll>
  );
}

/* ═════════ CURRENCIES ═════════ */
function MCurrenciesSettings() {
  const pairs = [
    { code: 'USD', name: 'US Dollar', rate: '3.750200', auto: true },
    { code: 'EUR', name: 'Euro', rate: '4.082100', auto: true },
    { code: 'GBP', name: 'British Pound', rate: '4.761000', auto: true },
    { code: 'AED', name: 'UAE Dirham', rate: '1.020800', auto: false },
    { code: 'KWD', name: 'Kuwaiti Dinar', rate: '12.18000', auto: false },
  ];
  return (
    <SScroll>
      <SCard marker={SC.blue} title="Base Currency">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontFamily: SC.mono, fontWeight: 700, fontSize: 15, color: SC.fg1 }}>SAR <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.08em', color: SC.blue, background: `${SC.blue}24`, padding: '2px 5px', borderRadius: 4, fontFamily: SC.body }}>BASE</span></span>
          <span style={{ fontFamily: SC.mono, fontSize: 11, color: SC.fg3 }}>Eff. Dec 18, 2025</span>
        </div>
        <SBtn variant="secondary" icon="refresh" full>Pull ECB Feed</SBtn>
      </SCard>
      <SCard marker={SC.green} title="Rates per 1 SAR" sub="Auto pairs sync daily; manual editable" pad={8}>
        <div style={{ padding: '0 8px' }}>
          {pairs.map((p, i) => (
            <div key={p.code} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: i < pairs.length - 1 ? `1px solid ${SC.border}` : 'none' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}><span style={{ fontFamily: SC.mono, fontSize: 13, fontWeight: 700, color: SC.fg1 }}>{p.code}</span><SPill tone={p.auto ? 'info' : 'neutral'}>{p.auto ? 'Auto' : 'Manual'}</SPill></div>
                <div style={{ fontSize: 11.5, color: SC.fg3, fontFamily: SC.body, marginTop: 2 }}>{p.name}</div>
              </div>
              <span style={{ fontFamily: SC.mono, fontSize: 14, fontWeight: 600, color: SC.fg1, padding: p.auto ? 0 : '6px 10px', background: p.auto ? 'transparent' : SC.input, border: p.auto ? 'none' : `1px solid ${SC.borderStrong}`, borderRadius: 6 }}>{p.rate}</span>
            </div>
          ))}
        </div>
      </SCard>
      <SBtn variant="primary" icon="check" full>Save Rates</SBtn>
    </SScroll>
  );
}

/* ═════════ NUMBERING ═════════ */
function MNumberingSequences() {
  const [seqs, setSeqs] = useSState([
    { doc: 'Sales Invoice', prefix: 'INV', next: '0412', pad: 4 },
    { doc: 'Journal Voucher', prefix: 'JV', next: '0227', pad: 4 },
    { doc: 'Deposit', prefix: 'DEP', next: '0183', pad: 4 },
    { doc: 'Purchase Order', prefix: 'PO', next: '0212', pad: 4 },
    { doc: 'Inventory Transfer', prefix: 'INV-TRF', next: '0118', pad: 4 },
  ]);
  const yr = 2024;
  const setPrefix = (i, v) => setSeqs((s) => s.map((x, j) => j === i ? { ...x, prefix: v } : x));
  return (
    <SScroll>
      <SCard marker={SC.blue} title="Document Sequences" sub="Format: PREFIX-YEAR-NUMBER" pad={8}>
        <div style={{ padding: '0 8px' }}>
          {seqs.map((s, i) => (
            <div key={i} style={{ padding: '12px 0', borderBottom: i < seqs.length - 1 ? `1px solid ${SC.border}` : 'none' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 13.5, fontWeight: 600, color: SC.fg1, fontFamily: SC.body }}>{s.doc}</span>
                <span style={{ fontFamily: SC.mono, fontSize: 12.5, fontWeight: 600, color: SC.blue }}>{s.prefix}-{yr}-{String(s.next).padStart(s.pad, '0')}</span>
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                <input value={s.prefix} onChange={(e) => setPrefix(i, e.target.value)} style={{ flex: 1, height: 38, padding: '0 12px', background: SC.input, border: `1px solid ${SC.borderStrong}`, borderRadius: 8, fontFamily: SC.mono, fontSize: 13, fontWeight: 600, color: SC.fg1, outline: 'none', boxSizing: 'border-box' }} />
                <div style={{ width: 90, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', background: SC.input, border: `1px solid ${SC.border}`, borderRadius: 8, fontFamily: SC.mono, fontSize: 12, color: SC.fg3 }}>Next {s.next}</div>
              </div>
            </div>
          ))}
        </div>
      </SCard>
      <SBtn variant="primary" icon="check" full>Save Changes</SBtn>
    </SScroll>
  );
}

/* ═════════ BRANCHES & STORES ═════════ */
function MBranchesStores() {
  const rows = [
    { code: 'ST-001', name: 'Downtown Central', ar: 'وسط المدينة', city: 'Riyadh', type: 'Store', status: 'active' },
    { code: 'ST-002', name: 'King Fahd Warehouse', ar: 'مستودع الملك فهد', city: 'Riyadh', type: 'Warehouse', status: 'active' },
    { code: 'ST-003', name: 'Jeddah Showroom', ar: 'صالة عرض جدة', city: 'Jeddah', type: 'Store', status: 'active' },
    { code: 'BR-010', name: 'Dammam Branch', ar: 'فرع الدمام', city: 'Dammam', type: 'Branch', status: 'inactive' },
  ];
  return (
    <SScroll>
      <SCard pad={8}>
        {rows.map((r, i) => (
          <div key={r.code} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 8px', borderBottom: i < rows.length - 1 ? `1px solid ${SC.border}` : 'none' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: SC.fg1, fontFamily: SC.body }}>{r.name}</div>
              <div dir="rtl" style={{ fontFamily: SC.arabic, fontSize: 12, color: SC.fg3, marginTop: 1 }}>{r.ar}</div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 3 }}><span style={{ fontFamily: SC.mono, fontSize: 10.5, color: SC.fg3 }}>{r.code}</span><span style={{ fontSize: 10.5, color: SC.fg4 }}>·</span><span style={{ fontSize: 10.5, color: SC.fg3, fontFamily: SC.body }}>{r.city}</span></div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5, alignItems: 'flex-end' }}>
              <SPill tone={r.type === 'Warehouse' ? 'info' : (r.type === 'Branch' ? 'warning' : 'neutral')}>{r.type}</SPill>
              <SPill tone={r.status === 'active' ? 'success' : 'neutral'}>{r.status}</SPill>
            </div>
          </div>
        ))}
      </SCard>
      <SBtn variant="primary" icon="plus" full>Add Branch</SBtn>
    </SScroll>
  );
}

/* ───────── register ───────── */
Object.assign(window.MScreens = window.MScreens || {}, {
  settingsHub: MSettingsHub,
  setCompany: MCompanyProfile,
  setFinancial: MFinancialSettings,
  setTaxes: MTaxesSettings,
  setCurrencies: MCurrenciesSettings,
  setNumbering: MNumberingSequences,
  setBranches: MBranchesStores,
});
