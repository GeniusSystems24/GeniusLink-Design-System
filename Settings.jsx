/* global React, Card, SectionHeader, Field, Textarea, Button, Icon, StatusPill, LockedField, IconBtn, Breadcrumb */
// GeniusLink — Settings (Phase 1): two-pane shell, hub, and Organization screens.
// Company Profile · Financial · Taxes · Currencies · Numbering · Branches & Stores.

const { CurSelect: SCurSelect, Toggle: SToggle } = window._cfgShared;

const SETTINGS_NAV = [
{ group: 'Workspace', items: [
  { id: 'tenants', label: 'Workspaces', icon: 'switch2', desc: 'Switch or manage organizations' }]
},
{ group: 'Organization', items: [
  { id: 'setCompany', label: 'Company Profile', icon: 'building', desc: 'Legal name, logo, address, tax IDs' },
  { id: 'setFinancial', label: 'Financial', icon: 'globe', desc: 'Base currency, fiscal year, accounting basis' },
  { id: 'setTaxes', label: 'Taxes', icon: 'percent', desc: 'VAT / GST rules and rates' },
  { id: 'setCurrencies', label: 'Currencies', icon: 'compass', desc: 'Exchange rates against base' },
  { id: 'setNumbering', label: 'Numbering', icon: 'hash', desc: 'Document prefixes and sequences' },
  { id: 'setBranches', label: 'Branches & Stores', icon: 'store', desc: 'Locations and warehouses' }]
},
{ group: 'Team & Security', items: [
  { id: 'users', label: 'Users', icon: 'user', desc: 'Workspace members and invites' },
  { id: 'setRoles', label: 'Roles & Permissions', icon: 'settings', desc: 'Access levels per module' },
  { id: 'setAudit', label: 'Audit Log', icon: 'lock', desc: 'Immutable activity trail' }]
},
{ group: 'Platform', items: [
  { id: 'setIntegrations', label: 'Integrations', icon: 'plug', desc: 'Banking, e-commerce, email' },
  { id: 'setWebhooks', label: 'Webhooks', icon: 'link', desc: 'Event subscriptions' },
  { id: 'setApiKeys', label: 'API Keys', icon: 'key', desc: 'Programmatic access tokens' },
  { id: 'setNotifications', label: 'Notifications', icon: 'bell', desc: 'Email and in-app alerts' },
  { id: 'setBilling', label: 'Billing & Plan', icon: 'card', desc: 'Subscription and invoices' },
  { id: 'setBackup', label: 'Backup & Export', icon: 'database', desc: 'Data export and snapshots' }]
}];

const ALL_NAV = SETTINGS_NAV.flatMap((g) => g.items);

/* ───────── two-pane shell ───────── */
function SettingsLayout({ active, onNavigate, title, sub, actions, children }) {
  return (
    <div style={{ maxWidth: 920, margin: '0 auto', padding: '64px 32px 0', display: 'flex', flexDirection: 'column', gap: 28 }}>
      <Breadcrumb items={['Settings', title]} />
      <div style={{ display: 'flex', alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, minWidth: 0, flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 16 }}>
            <div>
              <h1 style={{ fontFamily: 'var(--gl-font-display)', fontWeight: 700, fontSize: 26, letterSpacing: '-0.025em', color: 'var(--gl-fg-1)', margin: 0 }}>{title}</h1>
              {sub && <div style={{ fontSize: 13, color: 'var(--gl-fg-3)', marginTop: 6 }}>{sub}</div>}
            </div>
            {actions}
          </div>
          {children}
        </div>
      </div>
      <div style={{ height: 48 }} />
    </div>);

}

function SettingsRail({ active, onNavigate }) {
  return (
    <div style={{ position: 'sticky', top: 32, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <button onClick={() => onNavigate('settingsHub')} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', color: 'var(--gl-fg-3)', cursor: 'pointer', fontFamily: 'var(--gl-font-body)', fontSize: 12, fontWeight: 600, padding: 0 }}>
        <Icon name="back" size={14} /> All Settings
      </button>
      {SETTINGS_NAV.map((g) =>
      <div key={g.group} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <div style={{ fontWeight: 700, fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--gl-fg-4)', padding: '4px 10px 8px' }}>{g.group}</div>
          {g.items.map((it) => {
          const on = active === it.id;
          return (
            <button key={it.id} disabled={it.soon} onClick={() => !it.soon && onNavigate(it.id)}
            style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 10px', borderRadius: 6, border: 'none', textAlign: 'left', cursor: it.soon ? 'default' : 'pointer',
              background: on ? 'rgba(74,124,255,0.12)' : 'transparent', color: on ? '#4A7CFF' : 'var(--gl-fg-2)', opacity: it.soon ? 0.4 : 1,
              fontFamily: 'var(--gl-font-body)', fontWeight: on ? 600 : 500, fontSize: 13 }}>
                <Icon name={it.icon} size={15} />
                <span style={{ flex: 1 }}>{it.label}</span>
                {it.soon && <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--gl-fg-4)', border: '1px solid var(--gl-border)', borderRadius: 4, padding: '1px 4px' }}>Soon</span>}
              </button>);

        })}
        </div>
      )}
    </div>);

}

/* ───────── hub landing ───────── */
function SettingsHub({ onNavigate }) {
  return (
    <div style={{ maxWidth: 1120, margin: '0 auto', padding: '64px 32px 0', display: 'flex', flexDirection: 'column', gap: 28 }}>
      <Breadcrumb items={['Workspace', 'Settings']} />
      <div>
        <h1 style={{ fontFamily: 'var(--gl-font-display)', fontWeight: 700, fontSize: 30, letterSpacing: '-0.025em', color: 'var(--gl-fg-1)', margin: 0 }}>Settings</h1>
        <div style={{ fontFamily: 'var(--gl-font-mono)', fontSize: 13, color: 'var(--gl-fg-3)', marginTop: 8 }}>GeniusLink ERP · Al-Rashid Trading Co. · Tenant 9</div>
      </div>
      {SETTINGS_NAV.map((g) =>
      <div key={g.group} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ fontWeight: 700, fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--gl-fg-3)' }}>{g.group}</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {g.items.map((it) =>
          <HubCard key={it.id} it={it} onClick={() => !it.soon && onNavigate(it.id)} />
          )}
          </div>
        </div>
      )}
      <div style={{ height: 48 }} />
    </div>);

}

function HubCard({ it, onClick }) {
  const [hover, setHover] = React.useState(false);
  return (
    <div onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
    style={{ background: 'var(--gl-surface)', border: `1px solid ${hover && !it.soon ? '#4A7CFF' : 'var(--gl-border)'}`, borderRadius: 8, padding: 20, cursor: it.soon ? 'default' : 'pointer', opacity: it.soon ? 0.5 : 1, transition: 'border-color 150ms ease', position: 'relative' }}>
      {it.soon && <span style={{ position: 'absolute', top: 14, right: 14, fontSize: 8, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--gl-fg-4)', border: '1px solid var(--gl-border)', borderRadius: 4, padding: '2px 5px' }}>Soon</span>}
      <div style={{ width: 38, height: 38, borderRadius: 8, background: 'rgba(74,124,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4A7CFF', marginBottom: 14 }}>
        <Icon name={it.icon} size={19} />
      </div>
      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--gl-fg-1)' }}>{it.label}</div>
      <div style={{ fontSize: 12, color: 'var(--gl-fg-3)', marginTop: 4, lineHeight: 1.5 }}>{it.desc}</div>
    </div>);

}

/* ═════════ COMPANY PROFILE ═════════ */
function CompanyProfileSettings({ onNavigate, onSave }) {
  return (
    <SettingsLayout active="setCompany" onNavigate={onNavigate} title="Company Profile" sub="Legal identity used across documents and reports"
    actions={<Button variant="primary" icon="check" onClick={onSave}>Save Changes</Button>}>
      <Card>
        <SectionHeader title="Identity" subtitle="Names shown on invoices and statements" marker="blue" />
        <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 96, height: 96, borderRadius: 12, background: 'var(--gl-input-bg)', border: '1px solid var(--gl-border-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gl-fg-3)' }}>
              <Icon name="building" size={34} />
            </div>
            <Button variant="secondary" icon="upload">Logo</Button>
          </div>
          <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            <Field label="Legal Name (English)" required placeholder="e.g. Al-Rashid Trading Co." value="Al-Rashid Trading Co." />
            <Field label="الاسم القانوني" required placeholder="مثال: شركة الراشد التجارية" dir="rtl" value="شركة الراشد التجارية" />
            <Field label="Trade Name" placeholder="Display name" value="GeniusLink" />
            <Field label="Commercial Registration" mono placeholder="1010xxxxxx" value="1010234567" />
          </div>
        </div>
      </Card>

      <Card>
        <SectionHeader title="Registered Address" marker="green" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <SCurSelect label="Country" value="Saudi Arabia" options={['Saudi Arabia', 'United Arab Emirates', 'Kuwait', 'Qatar']} />
          <Field label="City" placeholder="e.g. Riyadh" value="Riyadh" />
          <Field label="Street Address" placeholder="Building, street" value="King Fahd Rd, Olaya" />
          <Field label="District" placeholder="District" value="Al Olaya" />
          <Field label="Postal Code" mono placeholder="12211" value="12211" />
          <Field label="P.O. Box" mono placeholder="Optional" value="78231" />
        </div>
      </Card>

      <Card>
        <SectionHeader title="Tax Registration" subtitle="Identifiers printed on tax documents" marker="orange" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <Field label="VAT Number" mono required placeholder="3xxxxxxxxxxxxx3" value="300123456700003" />
          <Field label="Tax Identification No." mono placeholder="Optional" value="9100234567" />
          <SCurSelect label="Tax Authority" value="ZATCA (Saudi Arabia)" options={['ZATCA (Saudi Arabia)', 'FTA (UAE)', 'GAZT']} />
          <SCurSelect label="E-Invoicing Phase" value="Phase 2 — Integration" options={['Phase 1 — Generation', 'Phase 2 — Integration']} />
        </div>
      </Card>
    </SettingsLayout>);

}

/* ═════════ FINANCIAL ═════════ */
function FinancialSettings({ onNavigate, onSave }) {
  const [basis, setBasis] = React.useState('accrual');
  const [lockPeriods, setLockPeriods] = React.useState(true);
  const [autoFx, setAutoFx] = React.useState(true);
  return (
    <SettingsLayout active="setFinancial" onNavigate={onNavigate} title="Financial Settings" sub="Currency, calendar and posting rules"
    actions={<Button variant="primary" icon="check" onClick={onSave}>Save Changes</Button>}>
      <Card>
        <SectionHeader title="Currency & Calendar" marker="blue" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <SCurSelect label="Base Currency" value="SAR — Saudi Riyal" options={['SAR — Saudi Riyal', 'USD — US Dollar', 'AED — UAE Dirham']} />
          <SCurSelect label="Fiscal Year Start" value="January" options={['January', 'April', 'July', 'October']} />
          <SCurSelect label="Rounding Precision" value="2 decimals" options={['0 decimals', '2 decimals', '3 decimals']} />
          <SCurSelect label="Number Format" value="1,234.56" options={['1,234.56', '1.234,56', '1 234.56']} />
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 11, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--gl-fg-2)', marginBottom: 8 }}>Accounting Basis</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, maxWidth: 360 }}>
            {[['accrual', 'Accrual'], ['cash', 'Cash']].map(([id, label]) => {
              const on = basis === id;
              return (
                <button key={id} onClick={() => setBasis(id)} style={{ padding: 12, borderRadius: 4, cursor: 'pointer', background: on ? 'rgba(74,124,255,0.12)' : 'var(--gl-input-bg)', border: `1px solid ${on ? '#4A7CFF' : 'var(--gl-border)'}`, color: on ? '#4A7CFF' : 'var(--gl-fg-2)', fontFamily: 'var(--gl-font-body)', fontWeight: 700, fontSize: 12, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{label}</button>);

            })}
          </div>
        </div>
      </Card>

      <Card>
        <SectionHeader title="Default Posting Accounts" subtitle="Used by automated journal entries" marker="green" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <SCurSelect label="Retained Earnings" value="3100 — Retained Earnings" options={['3100 — Retained Earnings', '3001 — Owner Capital']} />
          <SCurSelect label="Rounding Account" value="5900 — Rounding Differences" options={['5900 — Rounding Differences', '5300 — Bank Charges']} />
          <SCurSelect label="Default Tax Account" value="2200 — VAT Payable" options={['2200 — VAT Payable', '1350 — VAT Receivable']} />
          <SCurSelect label="Suspense Account" value="9999 — Suspense" options={['9999 — Suspense']} />
        </div>
      </Card>

      <Card>
        <SectionHeader title="Posting Rules" marker="orange" />
        <SToggle label="Lock postings to open periods only" checked={lockPeriods} onChange={setLockPeriods} />
        <SToggle label="Auto-update FX rates daily from feed" checked={autoFx} onChange={setAutoFx} />
      </Card>
    </SettingsLayout>);

}

/* ═════════ TAXES ═════════ */
function TaxesSettings({ onNavigate, onSave }) {
  const [rules, setRules] = React.useState([
  { name: 'Standard VAT', rate: '15', type: 'VAT', scope: 'Sales & Purchases', on: true },
  { name: 'Zero-Rated', rate: '0', type: 'VAT', scope: 'Exports', on: true },
  { name: 'Exempt', rate: '0', type: 'VAT', scope: 'Financial services', on: true },
  { name: 'Withholding — Services', rate: '5', type: 'WHT', scope: 'Non-resident', on: false }]
  );
  const grid = '1.6fr 0.7fr 0.7fr 1.4fr 90px 40px';
  const toggle = (i) => setRules((r) => r.map((x, j) => j === i ? { ...x, on: !x.on } : x));
  const remove = (i) => setRules((r) => r.filter((_, j) => j !== i));
  return (
    <SettingsLayout active="setTaxes" onNavigate={onNavigate} title="Taxes" sub="VAT / GST and withholding rules"
    actions={<Button variant="primary" icon="check" onClick={onSave}>Save Changes</Button>}>
      <Card padding={0}>
        <div style={{ padding: '20px 24px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <SectionHeader title="Tax Rules" subtitle={`${rules.filter((r) => r.on).length} active · applied at line level`} marker="green" />
          <Button variant="secondary" icon="plus" onClick={() => setRules((r) => [...r, { name: 'New Rule', rate: '0', type: 'VAT', scope: '—', on: false }])}>Add Rule</Button>
        </div>
        <div style={{ padding: '16px 24px 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: grid, gap: 12, padding: '0 0 12px', borderBottom: '1px solid var(--gl-border)', fontWeight: 700, fontSize: 10, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--gl-fg-3)' }}>
            <span>Rule</span><span>Rate</span><span>Type</span><span>Scope</span><span>Status</span><span></span>
          </div>
          {rules.map((r, i) =>
          <div key={i} style={{ display: 'grid', gridTemplateColumns: grid, gap: 12, padding: '14px 0', alignItems: 'center', borderBottom: i < rules.length - 1 ? '1px solid var(--gl-border)' : 'none', fontSize: 13, color: 'var(--gl-fg-1)' }}>
              <span style={{ fontWeight: 600 }}>{r.name}</span>
              <span style={{ fontFamily: 'var(--gl-font-mono)', fontWeight: 600 }}>{r.rate}%</span>
              <span><StatusPill tone={r.type === 'VAT' ? 'info' : 'warning'} size="sm">{r.type}</StatusPill></span>
              <span style={{ color: 'var(--gl-fg-2)', fontSize: 12 }}>{r.scope}</span>
              <span>
                <button onClick={() => toggle(i)} style={{ width: 38, height: 22, borderRadius: 999, background: r.on ? '#4A7CFF' : 'var(--gl-input-bg)', border: '1px solid var(--gl-border-strong)', position: 'relative', cursor: 'pointer', padding: 0 }}>
                  <span style={{ position: 'absolute', top: 2, left: r.on ? 18 : 2, width: 16, height: 16, borderRadius: 999, background: '#fff', transition: 'left 150ms ease' }} />
                </button>
              </span>
              <IconBtn icon="trash" variant="danger" size={32} onClick={() => remove(i)} />
            </div>
          )}
        </div>
      </Card>
    </SettingsLayout>);

}

/* ═════════ CURRENCIES ═════════ */
function CurrenciesSettings({ onNavigate, onSave }) {
  const pairs = [
  { code: 'USD', name: 'US Dollar', rate: '3.750200', auto: true },
  { code: 'EUR', name: 'Euro', rate: '4.082100', auto: true },
  { code: 'GBP', name: 'British Pound', rate: '4.761000', auto: true },
  { code: 'AED', name: 'UAE Dirham', rate: '1.020800', auto: false },
  { code: 'KWD', name: 'Kuwaiti Dinar', rate: '12.18000', auto: false }];

  const grid = '90px 1.6fr 1.3fr 110px';
  return (
    <SettingsLayout active="setCurrencies" onNavigate={onNavigate} title="Currencies" sub="Exchange rates expressed per 1 SAR"
    actions={<div style={{ display: 'flex', gap: 8 }}><Button variant="secondary" icon="refresh">Pull Feed</Button><Button variant="primary" icon="check" onClick={onSave}>Save Rates</Button></div>}>
      <Card padding={20}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontWeight: 700, fontSize: 11, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--gl-fg-3)' }}>Base Currency</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'var(--gl-font-mono)', fontWeight: 600, fontSize: 14, color: 'var(--gl-fg-1)' }}>
            SAR <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.08em', color: '#4A7CFF', background: 'rgba(74,124,255,0.14)', padding: '2px 5px', borderRadius: 4 }}>BASE</span>
          </span>
          <span style={{ marginLeft: 'auto', fontFamily: 'var(--gl-font-mono)', fontSize: 12, color: 'var(--gl-fg-3)' }}>Effective Dec 18, 2025</span>
        </div>
      </Card>
      <Card padding={0}>
        <div style={{ padding: '20px 24px 0' }}>
          <SectionHeader title="Rates per 1 SAR" subtitle="Auto pairs sync daily; manual pairs are editable" marker="green" />
        </div>
        <div style={{ padding: '16px 24px 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: grid, gap: 12, padding: '0 0 12px', borderBottom: '1px solid var(--gl-border)', fontWeight: 700, fontSize: 10, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--gl-fg-3)' }}>
            <span>Code</span><span>Currency</span><span style={{ textAlign: 'right' }}>Rate</span><span>Source</span>
          </div>
          {pairs.map((p, i) =>
          <div key={p.code} style={{ display: 'grid', gridTemplateColumns: grid, gap: 12, padding: '12px 0', alignItems: 'center', borderBottom: i < pairs.length - 1 ? '1px solid var(--gl-border)' : 'none', fontSize: 13, color: 'var(--gl-fg-1)' }}>
              <span style={{ fontFamily: 'var(--gl-font-mono)', fontWeight: 600 }}>{p.code}</span>
              <span style={{ color: 'var(--gl-fg-2)' }}>{p.name}</span>
              <span><input defaultValue={p.rate} readOnly={p.auto} style={{ width: '100%', height: 32, padding: '0 10px', textAlign: 'right', background: p.auto ? 'transparent' : 'var(--gl-input-bg)', border: `1px solid ${p.auto ? 'transparent' : 'var(--gl-border-strong)'}`, borderRadius: 4, fontFamily: 'var(--gl-font-mono)', fontSize: 13, fontWeight: 600, color: 'var(--gl-fg-1)', outline: 'none', boxSizing: 'border-box' }} /></span>
              <span><StatusPill tone={p.auto ? 'info' : 'neutral'} size="sm">{p.auto ? 'Auto' : 'Manual'}</StatusPill></span>
            </div>
          )}
        </div>
      </Card>
    </SettingsLayout>);

}

/* ═════════ NUMBERING SEQUENCES ═════════ */
function NumberingSequences({ onNavigate, onSave }) {
  const [seqs, setSeqs] = React.useState([
  { doc: 'Sales Invoice', prefix: 'INV', next: '0412', pad: 4 },
  { doc: 'Journal Voucher', prefix: 'JV', next: '0227', pad: 4 },
  { doc: 'Deposit', prefix: 'DEP', next: '0183', pad: 4 },
  { doc: 'Purchase Order', prefix: 'PO', next: '0212', pad: 4 },
  { doc: 'Inventory Transfer', prefix: 'INV-TRF', next: '0118', pad: 4 }]
  );
  const yr = 2024;
  const setPrefix = (i, v) => setSeqs((s) => s.map((x, j) => j === i ? { ...x, prefix: v } : x));
  const preview = (s) => `${s.prefix}-${yr}-${String(s.next).padStart(s.pad, '0')}`;
  const grid = '1.4fr 1fr 0.8fr 1.6fr';
  return (
    <SettingsLayout active="setNumbering" onNavigate={onNavigate} title="Numbering Sequences" sub="Document reference formats — editable prefixes"
    actions={<Button variant="primary" icon="check" onClick={onSave}>Save Changes</Button>}>
      <Card padding={0}>
        <div style={{ padding: '20px 24px 0' }}>
          <SectionHeader title="Document Sequences" subtitle="Format: PREFIX-YEAR-NUMBER" marker="blue" />
        </div>
        <div style={{ padding: '16px 24px 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: grid, gap: 12, padding: '0 0 12px', borderBottom: '1px solid var(--gl-border)', fontWeight: 700, fontSize: 10, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--gl-fg-3)' }}>
            <span>Document</span><span>Prefix</span><span>Next No.</span><span>Preview</span>
          </div>
          {seqs.map((s, i) =>
          <div key={i} style={{ display: 'grid', gridTemplateColumns: grid, gap: 12, padding: '12px 0', alignItems: 'center', borderBottom: i < seqs.length - 1 ? '1px solid var(--gl-border)' : 'none', fontSize: 13, color: 'var(--gl-fg-1)' }}>
              <span style={{ fontWeight: 600 }}>{s.doc}</span>
              <input value={s.prefix} onChange={(e) => setPrefix(i, e.target.value)} style={{ width: '100%', height: 32, padding: '0 10px', background: 'var(--gl-input-bg)', border: '1px solid var(--gl-border-strong)', borderRadius: 4, fontFamily: 'var(--gl-font-mono)', fontSize: 13, fontWeight: 600, color: 'var(--gl-fg-1)', outline: 'none', boxSizing: 'border-box' }} />
              <span style={{ fontFamily: 'var(--gl-font-mono)', color: 'var(--gl-fg-2)' }}>{s.next}</span>
              <span style={{ fontFamily: 'var(--gl-font-mono)', fontWeight: 600, color: '#4A7CFF' }}>{preview(s)}</span>
            </div>
          )}
        </div>
      </Card>
    </SettingsLayout>);

}

/* ═════════ BRANCHES & STORES ═════════ */
function BranchesStores({ onNavigate, onCreate }) {
  const rows = [
  { code: 'ST-001', name: 'Downtown Central', ar: 'وسط المدينة', city: 'Riyadh', type: 'Store', status: 'active' },
  { code: 'ST-002', name: 'King Fahd Warehouse', ar: 'مستودع الملك فهد', city: 'Riyadh', type: 'Warehouse', status: 'active' },
  { code: 'ST-003', name: 'Jeddah Showroom', ar: 'صالة عرض جدة', city: 'Jeddah', type: 'Store', status: 'active' },
  { code: 'BR-010', name: 'Dammam Branch', ar: 'فرع الدمام', city: 'Dammam', type: 'Branch', status: 'inactive' }];

  const grid = '110px 1.8fr 1fr 1fr 90px';
  return (
    <SettingsLayout active="setBranches" onNavigate={onNavigate} title="Branches & Stores" sub="Physical locations and warehouses"
    actions={<Button variant="primary" icon="plus" onClick={onCreate}>Add Branch</Button>}>
      <Card padding={0}>
        <div style={{ padding: '20px 24px 0' }}>
          <SectionHeader title={`${rows.length} Locations`} subtitle="Used for inventory, sales and reporting scope" marker="blue" />
        </div>
        <div style={{ padding: '16px 24px 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: grid, gap: 12, padding: '0 0 12px', borderBottom: '1px solid var(--gl-border)', fontWeight: 700, fontSize: 10, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--gl-fg-3)' }}>
            <span>Code</span><span>Name</span><span>City</span><span>Type</span><span>Status</span>
          </div>
          {rows.map((r, i) =>
          <div key={r.code} style={{ display: 'grid', gridTemplateColumns: grid, gap: 12, padding: '14px 0', alignItems: 'center', borderBottom: i < rows.length - 1 ? '1px solid var(--gl-border)' : 'none', fontSize: 13, color: 'var(--gl-fg-1)' }}>
              <span style={{ fontFamily: 'var(--gl-font-mono)', color: 'var(--gl-fg-2)' }}>{r.code}</span>
              <span><div style={{ fontWeight: 600 }}>{r.name}</div><div dir="rtl" style={{ fontFamily: 'var(--gl-font-arabic)', fontSize: 12, color: 'var(--gl-fg-3)', marginTop: 2 }}>{r.ar}</div></span>
              <span style={{ color: 'var(--gl-fg-2)' }}>{r.city}</span>
              <span><StatusPill tone={r.type === 'Warehouse' ? 'info' : r.type === 'Branch' ? 'warning' : 'neutral'} size="sm">{r.type}</StatusPill></span>
              <span><StatusPill tone={r.status === 'active' ? 'success' : 'neutral'} size="sm">{r.status}</StatusPill></span>
            </div>
          )}
        </div>
      </Card>
    </SettingsLayout>);

}

Object.assign(window, {
  SettingsHub, CompanyProfileSettings, FinancialSettings, TaxesSettings,
  CurrenciesSettings, NumberingSequences, BranchesStores
});
window._settings = { SettingsLayout, SETTINGS_NAV };