/* global React, Page, Card, SectionHeader, Field, Textarea, Button, IconBtn, Icon, StatusPill, LockedField */
// Stage 5 — Currencies: List + Create + Details

const CURRENCIES = [
  { code: 'SAR', en: 'Saudi Riyal',    ar: 'ريال سعودي',   symbol: '﷼', rate: '1.000000', dec: 2, base: true,  status: 'active' },
  { code: 'USD', en: 'US Dollar',      ar: 'دولار أمريكي', symbol: '$', rate: '3.750200', dec: 2, base: false, status: 'active' },
  { code: 'EUR', en: 'Euro',           ar: 'يورو',         symbol: '€', rate: '4.082100', dec: 2, base: false, status: 'active' },
  { code: 'GBP', en: 'British Pound',  ar: 'جنيه إسترليني',symbol: '£', rate: '4.761000', dec: 2, base: false, status: 'active' },
  { code: 'AED', en: 'UAE Dirham',     ar: 'درهم إماراتي', symbol: 'د.إ',rate: '1.020800', dec: 2, base: false, status: 'active' },
  { code: 'KWD', en: 'Kuwaiti Dinar',  ar: 'دينار كويتي',  symbol: 'د.ك',rate: '12.18000', dec: 3, base: false, status: 'inactive' },
];

function CurrenciesList({ onCreate, onOpen }) {
  const grid = '80px 1.6fr 80px 1.1fr 70px 90px 40px';
  return (
    <Page breadcrumb={['Configuration', 'Currencies']} title="Currencies"
      titleRight={<Button variant="primary" icon="plus" onClick={onCreate}>Add Currency</Button>}>
      <Card padding={0}>
        <div style={{ padding: '20px 24px 0' }}>
          <SectionHeader title={`${CURRENCIES.length} Currencies`} subtitle="Base currency is SAR · rates expressed per 1 unit" marker="blue" />
        </div>
        <div style={{ padding: '20px 24px 24px' }}>
          <div style={{
            display: 'grid', gridTemplateColumns: grid, gap: 12, padding: '0 0 12px',
            borderBottom: '1px solid var(--gl-border)',
            fontWeight: 700, fontSize: 10, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--gl-fg-3)',
          }}>
            <span>Code</span><span>Currency</span><span>Symbol</span>
            <span style={{ textAlign: 'right' }}>Rate (SAR)</span>
            <span style={{ textAlign: 'right' }}>Decimals</span>
            <span>Status</span><span></span>
          </div>
          {CURRENCIES.map((c) => (
            <CurrencyRow key={c.code} c={c} grid={grid} onClick={() => onOpen && onOpen(c)} />
          ))}
        </div>
      </Card>
    </Page>
  );
}

function CurrencyRow({ c, grid, onClick }) {
  const [hover, setHover] = React.useState(false);
  return (
    <div onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        display: 'grid', gridTemplateColumns: grid, gap: 12, padding: '14px 8px', margin: '0 -8px',
        alignItems: 'center', borderBottom: '1px solid var(--gl-border)',
        background: hover ? 'var(--gl-hover)' : 'transparent', borderRadius: 4, cursor: 'pointer',
        fontSize: 13, color: 'var(--gl-fg-1)', transition: 'background 150ms ease',
      }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'var(--gl-font-mono)', fontWeight: 600 }}>
        {c.code}{c.base && <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.08em', color: '#4A7CFF', background: 'rgba(74,124,255,0.14)', padding: '2px 5px', borderRadius: 4 }}>BASE</span>}
      </span>
      <span>
        <div style={{ fontWeight: 600 }}>{c.en}</div>
        <div dir="rtl" style={{ fontFamily: 'var(--gl-font-arabic)', fontSize: 12, color: 'var(--gl-fg-3)', marginTop: 2 }}>{c.ar}</div>
      </span>
      <span style={{ fontSize: 16, color: 'var(--gl-fg-2)' }}>{c.symbol}</span>
      <span style={{ fontFamily: 'var(--gl-font-mono)', textAlign: 'right', fontWeight: 600 }}>{c.rate}</span>
      <span style={{ fontFamily: 'var(--gl-font-mono)', textAlign: 'right', color: 'var(--gl-fg-3)' }}>{c.dec}</span>
      <span><StatusPill tone={c.status === 'active' ? 'success' : 'neutral'} size="sm">{c.status}</StatusPill></span>
      <span style={{ justifySelf: 'end', color: 'var(--gl-fg-3)', display: 'flex' }}><Icon name="chevRight" size={14} /></span>
    </div>
  );
}

function CreateCurrency({ onCancel, onCreate }) {
  const [name, setName] = React.useState({ en: '', ar: '' });
  const [isBase, setIsBase] = React.useState(false);
  return (
    <Page breadcrumb={['Configuration', 'Currencies', 'New']} title="Add Currency">
      <Card>
        <SectionHeader title="Currency Definition" subtitle="ISO code, display names and symbol" marker="blue" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <Field label="ISO Code" required placeholder="e.g. USD" mono />
          <Field label="Symbol" required placeholder="e.g. $" />
          <Field label="Name English" required placeholder="e.g. US Dollar"
                 value={name.en} onChange={(v) => setName({ ...name, en: v })} />
          <Field label="الاسم بالعربية" required placeholder="مثال: دولار أمريكي" dir="rtl"
                 value={name.ar} onChange={(v) => setName({ ...name, ar: v })} />
        </div>
      </Card>

      <Card>
        <SectionHeader title="Precision &amp; Rate" subtitle="Decimal places and exchange rate against base" marker="green" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <CurSelect label="Decimal Places" value="2" options={['0', '2', '3']} />
          <Field label="Exchange Rate (per 1 SAR)" placeholder="e.g. 3.750200" mono />
        </div>
        <Toggle label="Set as base currency" checked={isBase} onChange={setIsBase} />
      </Card>

      <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
        <Button variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button variant="primary" icon="check" onClick={onCreate}>Add Currency</Button>
      </div>
    </Page>
  );
}

function CurrencyDetails({ onBack, onEdit, onDelete }) {
  const history = [
    { date: 'Dec 18, 2025', rate: '3.750200', by: 'System · ECB feed' },
    { date: 'Dec 11, 2025', rate: '3.751400', by: 'System · ECB feed' },
    { date: 'Dec 04, 2025', rate: '3.749800', by: 'Layla A. (manual)' },
    { date: 'Nov 27, 2025', rate: '3.752100', by: 'System · ECB feed' },
  ];
  return (
    <Page breadcrumb={['Configuration', 'Currencies', 'Details']} title="US Dollar" titleArabic="دولار أمريكي"
      titleRight={
        <div style={{ display: 'flex', gap: 8 }}>
          <Button variant="secondary" icon="edit" onClick={onEdit}>Edit</Button>
          <Button variant="danger" icon="trash" onClick={onDelete}>Delete</Button>
        </div>
      }>
      <Card>
        <SectionHeader title="Current Rate" subtitle="Per 1 SAR · updated Dec 18, 2025" marker="green"
                       right={<StatusPill tone="success">Active</StatusPill>} />
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
          <span style={{ fontFamily: 'var(--gl-font-mono)', fontSize: 16, color: 'var(--gl-fg-3)' }}>USD</span>
          <span style={{ fontFamily: 'var(--gl-font-mono)', fontSize: 40, fontWeight: 700, color: 'var(--gl-fg-1)', letterSpacing: '-0.02em' }}>3.750200</span>
          <span style={{ fontFamily: 'var(--gl-font-mono)', fontSize: 13, color: '#1DB88A' }}>▲ 0.03%</span>
        </div>
      </Card>

      <Card>
        <SectionHeader title="Definition" marker="blue" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, rowGap: 20 }}>
          <LockedField label="ISO Code" value="USD" mono />
          <LockedField label="Symbol" value="$" />
          <LockedField label="Name English" value="US Dollar" />
          <LockedField label="Name Arabic" value="دولار أمريكي" dir="rtl" />
          <LockedField label="Decimal Places" value="2" mono />
          <LockedField label="Source" value="ECB Daily Feed" />
        </div>
      </Card>

      <Card padding={0}>
        <div style={{ padding: '20px 24px 0' }}>
          <SectionHeader title="Rate History" subtitle="Last 4 updates" marker="orange" />
        </div>
        <div style={{ padding: '16px 24px 24px' }}>
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr 1.4fr', gap: 12, padding: '0 0 12px',
            borderBottom: '1px solid var(--gl-border)',
            fontWeight: 700, fontSize: 10, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--gl-fg-3)',
          }}>
            <span>Date</span><span style={{ textAlign: 'right' }}>Rate</span><span>Updated By</span>
          </div>
          {history.map((h, i) => (
            <div key={i} style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr 1.4fr', gap: 12, padding: '12px 0', alignItems: 'center',
              borderBottom: i < history.length - 1 ? '1px solid var(--gl-border)' : 'none', fontSize: 13, color: 'var(--gl-fg-1)',
            }}>
              <span style={{ fontFamily: 'var(--gl-font-mono)', fontSize: 12, color: 'var(--gl-fg-2)' }}>{h.date}</span>
              <span style={{ fontFamily: 'var(--gl-font-mono)', textAlign: 'right', fontWeight: 600 }}>{h.rate}</span>
              <span style={{ color: 'var(--gl-fg-2)' }}>{h.by}</span>
            </div>
          ))}
        </div>
      </Card>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Button variant="secondary" icon="back" onClick={onBack}>Back to List</Button>
      </div>
    </Page>
  );
}

/* helpers */
function CurSelect({ label, value, options }) {
  const [v, setV] = React.useState(value);
  return (
    <div>
      <div style={{ fontWeight: 700, fontSize: 11, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--gl-fg-2)', marginBottom: 8 }}>{label}</div>
      <div style={{ position: 'relative' }}>
        <select value={v} onChange={(e) => setV(e.target.value)}
          style={{ width: '100%', height: 40, padding: '0 40px 0 16px', background: 'var(--gl-input-bg)', border: '1px solid var(--gl-border-strong)', borderRadius: 4, fontFamily: 'var(--gl-font-body)', fontSize: 14, color: 'var(--gl-fg-1)', appearance: 'none', cursor: 'pointer', outline: 'none' }}>
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        <div style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--gl-fg-3)', display: 'flex', pointerEvents: 'none' }}><Icon name="chevDown" size={14} /></div>
      </div>
    </div>
  );
}

function Toggle({ label, checked, onChange }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 0' }}>
      <span style={{ fontWeight: 700, fontSize: 11, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--gl-fg-2)' }}>{label}</span>
      <button type="button" onClick={() => onChange(!checked)}
        style={{ width: 38, height: 22, borderRadius: 999, background: checked ? '#4A7CFF' : 'var(--gl-input-bg)', border: '1px solid var(--gl-border-strong)', position: 'relative', cursor: 'pointer', padding: 0, transition: 'background 150ms ease' }}>
        <span style={{ position: 'absolute', top: 2, left: checked ? 18 : 2, width: 16, height: 16, borderRadius: 999, background: '#fff', transition: 'left 150ms ease', boxShadow: '0 1px 2px rgba(0,0,0,0.3)' }} />
      </button>
    </div>
  );
}

window.CurrenciesList = CurrenciesList;
window.CreateCurrency = CreateCurrency;
window.CurrencyDetails = CurrencyDetails;
window._cfgShared = { CurSelect, Toggle };
