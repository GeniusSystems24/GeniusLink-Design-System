/* global React */
// GeniusLink mobile — V3 Stage H · Accounts parity.
// 1) Full Account Details (raises mobile to desktop parity — overrides the simpler
//    'accountDetail' registered by MobileAccounts.jsx; this file loads after it).
// 2) Interactive Account Tree (recursive expand/collapse hierarchy).
// Mirrors desktop AccountDetails.jsx + AccountsExtra.jsx.

const MAx = window._mob;
const { C: AC, MIcon: AIcon, Pill: APill, MCard: ACard, MBtn: ABtn, Scroll: AScroll, Mini: AMini } = MAx;
const { useState: useAState } = React;

/* ═════════ FULL ACCOUNT DETAILS ═════════ */
function MAccountDetailFull() {
  const tx = [
    { ref: 'JV-2024-0042', date: 'Dec 15, 14:22', desc: 'Opening balance', dr: '+5,000.00', cr: '', bal: '5,000.00' },
    { ref: 'JV-2024-0058', date: 'Dec 16, 09:14', desc: 'Cash sale — Customer 102', dr: '+1,250.00', cr: '', bal: '6,250.00' },
    { ref: 'TR-9042', date: 'Dec 17, 11:48', desc: 'Transfer to NCB Bank', dr: '', cr: '-1,800.00', bal: '4,450.00' },
    { ref: 'JV-2024-0071', date: 'Dec 18, 16:33', desc: 'Petty cash reimbursement', dr: '+650.00', cr: '', bal: '5,100.00' },
  ];
  return (
    <AScroll>
      <ACard marker={AC.green} title="Current Balance" sub="As of Dec 18, 2025 16:33" right={<APill tone="success">Active</APill>}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span style={{ fontFamily: AC.mono, fontSize: 14, color: AC.fg3 }}>SAR</span>
          <span style={{ fontFamily: AC.mono, fontSize: 32, fontWeight: 700, color: AC.green, letterSpacing: '-0.02em' }}>42,500.00</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <AMini label="Total Debits" value="148,920" sub="SAR" />
          <AMini label="Total Credits" value="106,420" sub="SAR" />
        </div>
      </ACard>

      <ACard marker={AC.blue} title="Account Information">
        {[['Code', '1001', true], ['Type', 'Asset · Cash Equivalents'], ['Name English', 'Cash Box'], ['Name Arabic', 'الصندوق', false, true], ['Account Tree', 'Assets Tree (1)'], ['Currency', 'SAR — Saudi Riyal'], ['Parent Group', 'Current Assets (1000)'], ['Tenant ID', '9', true]].map(([k, v, mono, ar]) => (
          <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
            <span style={{ fontWeight: 700, fontSize: 10, letterSpacing: '0.05em', textTransform: 'uppercase', color: AC.fg3, fontFamily: AC.body, flexShrink: 0 }}>{k}</span>
            <span dir={ar ? 'rtl' : 'ltr'} style={{ fontSize: 13, color: AC.fg1, fontFamily: ar ? AC.arabic : (mono ? AC.mono : AC.body), textAlign: 'right' }}>{v}</span>
          </div>
        ))}
      </ACard>

      <ACard marker={AC.green} title="Recent Transactions" sub="Latest entries · running balance" pad={8}>
        <div style={{ padding: '0 8px' }}>
          {tx.map((t, i) => (
            <div key={i} style={{ padding: '12px 0', borderBottom: i < tx.length - 1 ? `1px solid ${AC.border}` : 'none' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
                <span style={{ fontFamily: AC.mono, fontSize: 12, color: AC.blue }}>{t.ref}</span>
                <span style={{ fontFamily: AC.mono, fontSize: 13, fontWeight: 600, color: t.dr ? AC.green : AC.red }}>{t.dr || t.cr}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
                <span style={{ fontSize: 12, color: AC.fg3, fontFamily: AC.body }}>{t.desc} · {t.date}</span>
                <span style={{ fontFamily: AC.mono, fontSize: 11.5, color: AC.fg2 }}>Bal {t.bal}</span>
              </div>
            </div>
          ))}
        </div>
      </ACard>

      <ACard marker={AC.orange} title="Audit Information">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {[['Created By', 'Admin User (ID: 5)'], ['Created At', 'Apr 12, 2024 09:21'], ['Modified By', 'Layla A. (ID: 12)'], ['Modified At', 'Nov 02, 2025 15:48']].map(([k, v]) => (
            <div key={k}><div style={{ fontWeight: 700, fontSize: 9.5, letterSpacing: '0.05em', textTransform: 'uppercase', color: AC.fg3, marginBottom: 5, fontFamily: AC.body }}>{k}</div><div style={{ fontSize: 12.5, color: AC.fg1, fontFamily: AC.body }}>{v}</div></div>
          ))}
        </div>
      </ACard>

      <div style={{ display: 'flex', gap: 10 }}>
        <ABtn variant="secondary" icon="download" full>Export</ABtn>
        <ABtn variant="secondary" icon="edit" full>Edit</ABtn>
      </div>
    </AScroll>
  );
}

/* ═════════ ACCOUNT TREE (interactive hierarchy) ═════════ */
const TREE = [
  { code: '1000', name: 'Assets', ar: 'الأصول', type: 'Asset', balance: '425,790.00', children: [
    { code: '1001', name: 'Current Assets', ar: 'أصول متداولة', type: 'Asset', balance: '283,790.00', children: [
      { code: '1010', name: 'Cash Box', ar: 'الصندوق', type: 'Asset', balance: '42,500.00' },
      { code: '1100', name: 'Bank · NCB Main', ar: 'البنك الأهلي', type: 'Asset', balance: '186,420.00' },
      { code: '1200', name: 'Inventory (WIP)', ar: 'مخزون قيد التشغيل', type: 'Asset', balance: '54,890.00' },
    ] },
    { code: '1500', name: 'Fixed Assets', ar: 'أصول ثابتة', type: 'Asset', balance: '142,000.00', children: [
      { code: '1510', name: 'Equipment', ar: 'معدات', type: 'Asset', balance: '98,000.00' },
      { code: '1520', name: 'Vehicles', ar: 'مركبات', type: 'Asset', balance: '44,000.00' },
    ] },
  ] },
  { code: '2000', name: 'Liabilities', ar: 'الخصوم', type: 'Liability', balance: '103,140.00', children: [
    { code: '2001', name: 'Accounts Payable', ar: 'الموردون', type: 'Liability', balance: '23,140.00' },
    { code: '2100', name: 'Long-Term Debt', ar: 'ديون طويلة الأجل', type: 'Liability', balance: '80,000.00' },
  ] },
  { code: '3000', name: 'Equity', ar: 'حقوق الملكية', type: 'Equity', balance: '322,650.00', children: [
    { code: '3001', name: 'Owner Capital', ar: 'رأس المال', type: 'Equity', balance: '260,670.00' },
    { code: '3100', name: 'Retained Earnings', ar: 'أرباح محتجزة', type: 'Equity', balance: '61,980.00' },
  ] },
];
const TYPE_DOT = { Asset: '#4A7CFF', Liability: '#F97316', Equity: '#1DB88A', Income: '#1DB88A', Expense: '#EF4444' };

function TreeNode({ node, depth, go }) {
  const hasKids = node.children && node.children.length > 0;
  const [open, setOpen] = useAState(depth < 1);
  return (
    <div>
      <div onClick={() => hasKids ? setOpen(!open) : go('accountDetail')} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '11px 8px', paddingLeft: 8 + depth * 18, cursor: 'pointer', borderRadius: 8 }}>
        <span style={{ width: 16, display: 'flex', color: AC.fg3, flexShrink: 0 }}>{hasKids ? <AIcon name={open ? 'chevD' : 'chevR'} size={14} /> : null}</span>
        <span style={{ width: 7, height: 7, borderRadius: 999, background: TYPE_DOT[node.type], flexShrink: 0 }} />
        <span style={{ fontFamily: AC.mono, fontSize: 11, color: AC.fg3, flexShrink: 0 }}>{node.code}</span>
        <span style={{ flex: 1, minWidth: 0, fontSize: 13, fontWeight: depth === 0 ? 700 : 600, color: AC.fg1, fontFamily: AC.body, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{node.name}</span>
        <span style={{ fontFamily: AC.mono, fontSize: 12, fontWeight: depth === 0 ? 700 : 500, color: AC.fg1, flexShrink: 0 }}>{node.balance}</span>
      </div>
      {hasKids && open && (
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', left: 8 + depth * 18 + 7, top: 0, bottom: 12, width: 1, background: AC.border }} />
          {node.children.map((c) => <TreeNode key={c.code} node={c} depth={depth + 1} go={go} />)}
        </div>
      )}
    </div>
  );
}

function MAccountTree({ go }) {
  return (
    <AScroll>
      <ACard pad={14}>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          {['Asset', 'Liability', 'Equity', 'Income', 'Expense'].map((k) => (
            <span key={k} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 11.5, color: AC.fg2, fontFamily: AC.body }}>
              <span style={{ width: 8, height: 8, borderRadius: 999, background: TYPE_DOT[k] }} />{k}
            </span>
          ))}
        </div>
      </ACard>
      <ACard marker={AC.blue} title="Chart of Accounts" sub="Tap a group to expand · tap a leaf to open" pad={8}>
        {TREE.map((n) => <TreeNode key={n.code} node={n} depth={0} go={go} />)}
      </ACard>
    </AScroll>
  );
}

/* ───────── register (accountDetail overrides the simpler MobileAccounts version) ───────── */
Object.assign(window.MScreens = window.MScreens || {}, {
  accountDetail: MAccountDetailFull,
  accountTree: MAccountTree,
});
