/* global React */
// GeniusLink mobile — Accounts: list, detail, create account, create group, group details.
// Registers into window.MScreens.

const MA = window._mob;
const { C: MAC, MIcon: MAIcon, Pill: MAPill, MCard: MACard, MField: MAField, MBtn: MABtn, Scroll: MAScroll } = MA;

/* shared key/value row (accounts) */
function KV({ k, v, mono, ar }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
      <span style={{ fontWeight: 700, fontSize: 10, letterSpacing: '0.05em', textTransform: 'uppercase', color: MAC.fg3, fontFamily: MAC.body }}>{k}</span>
      <span dir={ar ? 'rtl' : 'ltr'} style={{ fontSize: 13.5, color: MAC.fg1, fontFamily: ar ? MAC.arabic : (mono ? MAC.mono : MAC.body), textAlign: 'right' }}>{v}</span>
    </div>
  );
}

/* ───────── Accounts list ───────── */
function MAccounts({ go }) {
  const rows = [
    { code: '1001', name: 'Cash Box', ar: 'الصندوق', bal: '42,500.00', neg: false },
    { code: '1100', name: 'Bank · NCB Main', ar: 'البنك الأهلي', bal: '186,420.00', neg: false },
    { code: '1200', name: 'Inventory (WIP)', ar: 'مخزون', bal: '54,890.00', neg: false },
    { code: '2001', name: 'Accounts Payable', ar: 'الموردون', bal: '-23,140.00', neg: true },
    { code: '4001', name: 'Sales Revenue', ar: 'المبيعات', bal: '-89,200.00', neg: true },
  ];
  return (
    <MAScroll>
      <div style={{ height: 44, padding: '0 14px', background: MAC.input, border: `1px solid ${MAC.borderStrong}`, borderRadius: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
        <MAIcon name="searchO" size={16} color={MAC.fg3} /><MAIcon name="search" size={16} color={MAC.fg3} style={{ marginLeft: -22 }} />
        <span style={{ color: MAC.fg3, fontSize: 14, fontFamily: MAC.body }}>Search accounts…</span>
      </div>
      <MACard pad={8}>
        {rows.map((r, i) => (
          <div key={r.code} onClick={() => go('accountDetail')} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 8px', borderBottom: i < rows.length - 1 ? `1px solid ${MAC.border}` : 'none', cursor: 'pointer' }}>
            <span style={{ fontFamily: MAC.mono, fontSize: 12, color: MAC.fg3, width: 36 }}>{r.code}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: MAC.fg1, fontFamily: MAC.body }}>{r.name}</div>
              <div dir="rtl" style={{ fontFamily: MAC.arabic, fontSize: 12, color: MAC.fg3 }}>{r.ar}</div>
            </div>
            <span style={{ fontFamily: MAC.mono, fontSize: 13, fontWeight: 600, color: r.neg ? MAC.red : MAC.fg1 }}>{r.bal}</span>
            <MAIcon name="chevR" size={15} color={MAC.fg4} />
          </div>
        ))}
      </MACard>
    </MAScroll>
  );
}

/* ───────── Create Account ───────── */
function MCreateAccount() {
  return (
    <MAScroll>
      <MACard marker={MAC.blue} title="Account Details" sub="Identify and place in the tree">
        <MAField label="Account Code" placeholder="e.g. 1102" mono required />
        <MAField label="Account Type" value="Asset" />
        <MAField label="Name English" placeholder="e.g. Bank · Al Rajhi" required />
        <MAField label="الاسم بالعربية" placeholder="مثال: بنك الراجحي" ar required />
        <MAField label="Parent Group" value="Current Assets (1000)" />
      </MACard>
      <MACard marker={MAC.green} title="Settings">
        <MAField label="Currency" value="SAR — Saudi Riyal" />
        <MAField label="Opening Balance" placeholder="0.00" mono />
        <div>
          <div style={{ fontWeight: 700, fontSize: 10, letterSpacing: '0.05em', textTransform: 'uppercase', color: MAC.fg2, marginBottom: 7, fontFamily: MAC.body }}>Normal Balance</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <div style={{ padding: 12, textAlign: 'center', borderRadius: 8, background: `${MAC.green}14`, border: `1px solid ${MAC.green}`, color: MAC.green, fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.04em', fontFamily: MAC.body }}>Debit</div>
            <div style={{ padding: 12, textAlign: 'center', borderRadius: 8, background: MAC.input, border: `1px solid ${MAC.border}`, color: MAC.fg2, fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.04em', fontFamily: MAC.body }}>Credit</div>
          </div>
        </div>
      </MACard>
      <div style={{ display: 'flex', gap: 10 }}>
        <MABtn variant="secondary" full>Cancel</MABtn>
        <MABtn variant="primary" icon="check" full>Create</MABtn>
      </div>
    </MAScroll>
  );
}

/* ───────── Account Detail ───────── */
function MAccountDetail() {
  const tx = [
    { ref: 'JV-2024-0042', amt: '+5,000.00', tone: MAC.green },
    { ref: 'TR-9042', amt: '-1,800.00', tone: MAC.red },
    { ref: 'JV-2024-0071', amt: '+650.00', tone: MAC.green },
  ];
  return (
    <MAScroll>
      <MACard marker={MAC.green} title="Current Balance" right={<MAPill tone="success">Active</MAPill>}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span style={{ fontFamily: MAC.mono, fontSize: 14, color: MAC.fg3 }}>SAR</span>
          <span style={{ fontFamily: MAC.mono, fontSize: 32, fontWeight: 700, color: MAC.green, letterSpacing: '-0.02em' }}>42,500.00</span>
        </div>
      </MACard>
      <MACard marker={MAC.blue} title="Information">
        <KV k="Code" v="1001" mono /><KV k="Type" v="Asset · Cash" />
        <KV k="Tree" v="Assets Tree (1)" /><KV k="Currency" v="SAR" />
      </MACard>
      <MACard marker={MAC.green} title="Recent Transactions" pad={8}>
        <div style={{ padding: '0 8px' }}>
          {tx.map((t, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: i < tx.length - 1 ? `1px solid ${MAC.border}` : 'none' }}>
              <span style={{ fontFamily: MAC.mono, fontSize: 12.5, color: MAC.blue }}>{t.ref}</span>
              <span style={{ fontFamily: MAC.mono, fontSize: 13, fontWeight: 600, color: t.tone }}>{t.amt}</span>
            </div>
          ))}
        </div>
      </MACard>
      <MABtn variant="secondary" icon="back" full>Back to List</MABtn>
    </MAScroll>
  );
}

/* ───────── Create Account Group ───────── */
function MCreateGroup() {
  return (
    <MAScroll>
      <MACard marker={MAC.blue} title="Group Details" sub="Name and tree association">
        <MAField label="Name English" placeholder="e.g. Current Assets" required />
        <MAField label="الاسم بالعربية" placeholder="مثال: الأصول المتداولة" ar required />
        <MAField label="Account Tree" value="Assets Tree (1)" />
      </MACard>
      <MACard marker={MAC.orange} title="Additional Information">
        <MAField label="Note" placeholder="Add any notes about this group…" />
      </MACard>
      <div style={{ display: 'flex', gap: 10 }}>
        <MABtn variant="secondary" full>Cancel</MABtn>
        <MABtn variant="primary" icon="check" full>Create</MABtn>
      </div>
    </MAScroll>
  );
}

/* ───────── Account Group Details ───────── */
function MGroupDetails() {
  return (
    <MAScroll>
      <MACard marker={MAC.blue} title="Group Information" right={<MAPill tone="success">Active</MAPill>}>
        <KV k="ID" v="1042" mono /><KV k="Name English" v="Current Assets" />
        <KV k="Name Arabic" v="الأصول المتداولة" ar /><KV k="Account Tree" v="Assets Tree (1)" />
      </MACard>
      <MACard marker={MAC.orange} title="Notes">
        <div dir="rtl" style={{ fontFamily: MAC.arabic, fontSize: 14, color: MAC.fg2, padding: '10px 14px', background: MAC.input, border: `1px solid ${MAC.border}`, borderRadius: 8 }}>تشمل النقدية والحسابات المدينة والمخزون</div>
      </MACard>
      <MACard marker={MAC.green} title="Audit">
        <KV k="Created By" v="Admin User (ID: 5)" /><KV k="Created At" v="Dec 04, 2025 11:58 PM" />
      </MACard>
      <MABtn variant="secondary" icon="back" full>Back to List</MABtn>
    </MAScroll>
  );
}

Object.assign(window.MScreens = window.MScreens || {}, {
  accounts: MAccounts,
  createAccount: MCreateAccount,
  accountDetail: MAccountDetail,
  createGroup: MCreateGroup,
  groupDetail: MGroupDetails,
});
