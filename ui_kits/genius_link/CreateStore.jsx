/* global React, Card, SectionHeader, BilingualPair, Field, Select, Textarea, Button, Page */
// Screen: Create Store

function CreateStore({ onCancel, onCreate }) {
  const [storeName, setStoreName] = React.useState({ en: '', ar: '' });
  const [code, setCode] = React.useState('ST-001');
  const [category, setCategory] = React.useState('Retail');
  const [note, setNote] = React.useState('');

  return (
    <Page
      breadcrumb={['Stores & Products', 'Stores']}
      title="Create Store">
      <Card>
        <SectionHeader
          title="Store Details"
          subtitle="Define store name and location information"
          marker="blue" />
        <BilingualPair
          enLabel="Name English"
          arLabel="الاسم بالعربية"
          enPlaceholder="e.g. Downtown Central Store"
          arPlaceholder="مثال: متجر وسط المدينة الرئيسي"
          required
          values={storeName}
          onChange={setStoreName} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <Field label="Location Code" value={code} onChange={setCode} mono />
          <Select label="Store Category" value={category} onChange={setCategory}
                  options={['Retail', 'Warehouse', 'Distribution Center', 'Showroom']} />
        </div>
        <Textarea label="Note"
                  placeholder="Add internal notes about this store's operational status or architectural details…"
                  value={note} onChange={setNote} />
      </Card>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
        <Button variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button variant="primary" onClick={() => onCreate && onCreate({ storeName, code, category, note })}>
          Create Store
        </Button>
      </div>
    </Page>
  );
}

window.CreateStore = CreateStore;
