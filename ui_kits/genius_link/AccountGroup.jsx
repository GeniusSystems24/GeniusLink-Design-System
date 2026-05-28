/* global React, Card, SectionHeader, BilingualPair, Field, LockedField, Select, Textarea, Toggle, Button, IconBtn, Page, StatusPill, Icon */
// Screen: Create Account Group  +  Account Group Details (read-only)

function CreateAccountGroup({ onCancel, onCreate }) {
  const [name, setName] = React.useState({ en: '', ar: '' });
  const [tree, setTree] = React.useState('Assets Tree (1)');
  const [note, setNote] = React.useState('');
  const [open, setOpen] = React.useState(true);

  return (
    <Page
      breadcrumb={['Account Management', 'Account Groups']}
      title="Create Account Group">
      <Card>
        <SectionHeader
          title="Group Details"
          subtitle="Identify the group and bind it to an account tree"
          marker="blue"
          right={
            <button type="button"
              onClick={() => setOpen(!open)}
              style={{
                background: 'transparent', border: 'none', cursor: 'pointer',
                color: 'var(--gl-fg-3)', display: 'flex', padding: 4,
              }}>
              <Icon name={open ? 'chevUp' : 'chevDown'} size={16} />
            </button>
          } />
        {open && (
          <>
            <BilingualPair
              enLabel="Name (English)"
              arLabel="الاسم بالعربية"
              enPlaceholder="e.g. Current Assets"
              arPlaceholder="مثال: الأصول المتداولة"
              required
              values={name}
              onChange={setName} />
            <Select label="Account Tree" value={tree} onChange={setTree}
                    options={['Select account tree…', 'Assets Tree (1)', 'Liabilities Tree (2)', 'Equity Tree (3)']} />
          </>
        )}
      </Card>

      <Card>
        <SectionHeader
          title="Additional Information"
          subtitle="Optional notes captured against this group"
          marker="orange" />
        <Textarea label="Note"
                  placeholder="Add any notes about this account group…"
                  value={note} onChange={setNote} />
      </Card>

      <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
        <Button variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button variant="primary" onClick={() => onCreate && onCreate({ name, tree, note })}>
          Create Group
        </Button>
      </div>
    </Page>
  );
}

function AccountGroupDetails({ onBack, onEdit, onDelete }) {
  return (
    <Page
      breadcrumb={['Account Management', 'Account Groups', 'Details']}
      title="Current Assets"
      titleRight={
        <div style={{ display: 'flex', gap: 8 }}>
          <Button variant="secondary" icon="edit" onClick={onEdit}>Edit</Button>
          <Button variant="danger" icon="trash" onClick={onDelete}>Delete</Button>
        </div>
      }>
      <Card>
        <SectionHeader title="Group Information" marker="blue" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, rowGap: 20 }}>
          <LockedField label="ID" value="1042" mono />
          <div>
            <div style={{
              fontWeight: 700, fontSize: 11, letterSpacing: '0.05em',
              textTransform: 'uppercase', color: 'var(--gl-fg-2)', marginBottom: 8,
            }}>Status</div>
            <StatusPill tone="success">Active</StatusPill>
          </div>
          <LockedField label="Name Arabic" value="الأصول المتداولة" dir="rtl" />
          <LockedField label="Name English" value="Current Assets" />
          <LockedField label="Account Tree" value="Assets Tree (1)" />
          <LockedField label="Tenant ID" value="9" mono />
        </div>
      </Card>

      <Card>
        <SectionHeader title="Notes" marker="orange" />
        <div dir="rtl" style={{
          background: 'var(--gl-input-bg)',
          border: '1px solid var(--gl-border)',
          borderRadius: 4,
          padding: '12px 16px',
          fontFamily: 'var(--gl-font-arabic)',
          fontSize: 14,
          color: 'var(--gl-fg-2)',
          minHeight: 56,
        }}>تشمل النقدية والحسابات المدينة والمخزون</div>
      </Card>

      <Card>
        <SectionHeader title="Audit Information" marker="blue" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, rowGap: 16 }}>
          {[
            ['Created By', 'Admin User (ID: 5)'],
            ['Created At', 'Dec 04, 2025 11:58 PM'],
            ['Updated By', 'Admin User (ID: 5)'],
            ['Updated At', 'Dec 04, 2025 11:58 PM'],
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

window.CreateAccountGroup = CreateAccountGroup;
window.AccountGroupDetails = AccountGroupDetails;
