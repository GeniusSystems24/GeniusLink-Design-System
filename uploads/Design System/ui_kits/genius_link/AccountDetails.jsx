/* global React, Page, Card, SectionHeader, Button, LockedField, Icon, StatusPill */
// Screen: Account Details — master template (read-only)

function AccountDetails({ onBack, onEdit, onDelete }) {
  const tx = [
    { ref: 'JV-2024-0042', date: 'Dec 15, 2025 14:22', desc: 'Opening balance',        dr: '+5,000.00', cr: '',          balance: '+5,000.00' },
    { ref: 'JV-2024-0058', date: 'Dec 16, 2025 09:14', desc: 'Cash sale — Customer 102', dr: '+1,250.00', cr: '',         balance: '+6,250.00' },
    { ref: 'TR-9042',      date: 'Dec 17, 2025 11:48', desc: 'Transfer to NCB Bank',    dr: '',          cr: '-1,800.00', balance: '+4,450.00' },
    { ref: 'JV-2024-0071', date: 'Dec 18, 2025 16:33', desc: 'Petty cash reimbursement',dr: '+650.00',   cr: '',          balance: '+5,100.00' },
  ];

  const grid = '110px 110px 1.8fr 0.9fr 0.9fr 1fr';

  return (
    <Page
      breadcrumb={['Account Management', 'Accounts', 'Details']}
      title="Cash Box"
      titleArabic="الصندوق"
      titleRight={
        <div style={{ display: 'flex', gap: 8 }}>
          <Button variant="secondary" icon="download">Export Statement</Button>
          <Button variant="secondary" icon="edit" onClick={onEdit}>Edit</Button>
          <Button variant="danger" icon="trash" onClick={onDelete}>Delete</Button>
        </div>
      }>

      {/* Headline balance */}
      <Card>
        <SectionHeader
          title="Current Balance"
          subtitle="As of Dec 18, 2025 16:33"
          marker="green"
          right={<StatusPill tone="success">Active</StatusPill>} />
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24,
          paddingTop: 8,
        }}>
          <BalanceTile label="Balance" value="42,500.00" currency="SAR" big highlight />
          <BalanceTile label="Total Debits" value="148,920.00" currency="SAR" />
          <BalanceTile label="Total Credits" value="106,420.00" currency="SAR" />
        </div>
      </Card>

      {/* Identity */}
      <Card>
        <SectionHeader title="Account Information" marker="blue" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, rowGap: 20 }}>
          <LockedField label="Code" value="1001" mono />
          <LockedField label="Type" value="Asset · Cash Equivalents" />
          <LockedField label="Name English" value="Cash Box" />
          <LockedField label="Name Arabic" value="الصندوق" dir="rtl" />
          <LockedField label="Account Tree" value="Assets Tree (1)" />
          <LockedField label="Currency" value="SAR — Saudi Riyal" />
          <LockedField label="Parent Group" value="Current Assets (1000)" />
          <LockedField label="Tenant ID" value="9" mono />
        </div>
      </Card>

      {/* Recent transactions */}
      <Card padding={0}>
        <div style={{ padding: '20px 24px 0' }}>
          <SectionHeader
            title="Recent Transactions"
            subtitle="Latest entries posted against this account"
            marker="green"
            right={<Button variant="ghost" icon="chevRight">View Full Ledger</Button>} />
        </div>
        <div style={{ padding: '20px 24px 24px' }}>
          <div style={{
            display: 'grid', gridTemplateColumns: grid, gap: 12,
            padding: '0 0 12px',
            borderBottom: '1px solid var(--gl-border)',
            fontWeight: 700, fontSize: 10, letterSpacing: '0.05em',
            textTransform: 'uppercase', color: 'var(--gl-fg-3)',
          }}>
            <span>Reference</span><span>Date</span><span>Description</span>
            <span style={{ textAlign: 'right' }}>Debit</span>
            <span style={{ textAlign: 'right' }}>Credit</span>
            <span style={{ textAlign: 'right' }}>Running Balance</span>
          </div>
          {tx.map((t, i) => (
            <div key={i} style={{
              display: 'grid', gridTemplateColumns: grid, gap: 12,
              padding: '14px 0', alignItems: 'center',
              borderBottom: i < tx.length - 1 ? '1px solid var(--gl-border)' : 'none',
              fontSize: 13, color: 'var(--gl-fg-1)',
            }}>
              <span style={{ fontFamily: 'var(--gl-font-mono)', color: '#4A7CFF' }}>{t.ref}</span>
              <span style={{ fontFamily: 'var(--gl-font-mono)', color: 'var(--gl-fg-2)', fontSize: 12 }}>{t.date}</span>
              <span style={{ color: 'var(--gl-fg-2)' }}>{t.desc}</span>
              <span style={{ fontFamily: 'var(--gl-font-mono)', textAlign: 'right', color: t.dr ? '#1DB88A' : 'var(--gl-fg-4)' }}>{t.dr || '—'}</span>
              <span style={{ fontFamily: 'var(--gl-font-mono)', textAlign: 'right', color: t.cr ? '#EF4444' : 'var(--gl-fg-4)' }}>{t.cr || '—'}</span>
              <span style={{ fontFamily: 'var(--gl-font-mono)', textAlign: 'right', fontWeight: 600 }}>{t.balance}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Audit */}
      <Card>
        <SectionHeader title="Audit Information" marker="orange" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, rowGap: 16 }}>
          {[
            ['Created By', 'Admin User (ID: 5)'],
            ['Created At', 'Apr 12, 2024 09:21 AM'],
            ['Last Modified By', 'Layla A. (ID: 12)'],
            ['Last Modified At', 'Nov 02, 2025 03:48 PM'],
          ].map(([k, v]) => (
            <div key={k}>
              <div style={{
                fontWeight: 700, fontSize: 11, letterSpacing: '0.05em',
                textTransform: 'uppercase', color: 'var(--gl-fg-3)', marginBottom: 6,
              }}>{k}</div>
              <div style={{ fontSize: 14, color: 'var(--gl-fg-1)' }}>{v}</div>
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

function BalanceTile({ label, value, currency, big, highlight }) {
  return (
    <div style={{
      padding: '20px',
      background: highlight ? 'rgba(29,184,138,0.08)' : 'var(--gl-bg)',
      border: `1px solid ${highlight ? 'rgba(29,184,138,0.3)' : 'var(--gl-border)'}`,
      borderRadius: 6,
    }}>
      <div style={{
        fontWeight: 700, fontSize: 10, letterSpacing: '0.08em',
        textTransform: 'uppercase', color: 'var(--gl-fg-3)', marginBottom: 8,
      }}>{label}</div>
      <div style={{
        fontFamily: 'var(--gl-font-mono)',
        fontSize: big ? 28 : 20,
        fontWeight: 600,
        color: highlight ? '#1DB88A' : 'var(--gl-fg-1)',
        letterSpacing: '-0.01em',
        lineHeight: 1.1,
      }}>{value}</div>
      <div style={{
        fontFamily: 'var(--gl-font-mono)', fontSize: 11,
        color: 'var(--gl-fg-3)', marginTop: 6,
      }}>{currency}</div>
    </div>
  );
}

window.AccountDetails = AccountDetails;
