/* global React, Card, SectionHeader, BilingualPair, Field, Select, Textarea, Toggle, Button, Page, Icon */
// Screen: Create Store / Warehouse — full operational profile

function CreateStore({ onCancel, onCreate }) {
  const [storeName, setStoreName] = React.useState({ en: '', ar: '' });
  const [code, setCode] = React.useState('ST-006');
  const [category, setCategory] = React.useState('Warehouse');
  const [city, setCity] = React.useState('Riyadh');
  const [note, setNote] = React.useState('');

  // operational flags
  const [active, setActive] = React.useState(true);
  const [isDefault, setIsDefault] = React.useState(false);
  const [allowNegative, setAllowNegative] = React.useState(false);
  const [trackBins, setTrackBins] = React.useState(true);

  const Inner = ({ children }) => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 24, rowGap: 20 }}>{children}</div>
  );

  return (
    <Page
      breadcrumb={['Stores & Products', 'Warehouses', 'New']}
      title="Create Warehouse" titleArabic="إنشاء مستودع">

      {/* Identity */}
      <Card>
        <SectionHeader title="Warehouse Identity" subtitle="Code, names and classification" marker="blue" />
        <Inner>
          <Field label="Location Code" required value={code} onChange={setCode} mono />
          <Select label="Type" value={category} onChange={setCategory}
                  options={['Retail', 'Warehouse', 'Distribution Center', 'Showroom', 'Transit / Bonded']} />
        </Inner>
        <BilingualPair
          enLabel="Name English" arLabel="الاسم بالعربية"
          enPlaceholder="e.g. King Fahd Warehouse"
          arPlaceholder="مثال: مستودع الملك فهد"
          required values={storeName} onChange={setStoreName} />
      </Card>

      {/* Location */}
      <Card>
        <SectionHeader title="Location & Address" subtitle="Where this warehouse physically sits" marker="blue" />
        <Inner>
          <Select label="Region" value="Riyadh Province" onChange={() => {}}
                  options={['Riyadh Province', 'Makkah Province', 'Eastern Province', 'Madinah Province', 'Asir Province']} />
          <Field label="City" required value={city} onChange={setCity} />
          <Field label="District" placeholder="e.g. Al Olaya" />
          <Field label="Street Address" placeholder="Building no., street" />
          <Field label="Postal Code" placeholder="e.g. 12211" mono />
          <Field label="GPS Coordinates" placeholder="24.7136, 46.6753" mono />
        </Inner>
      </Card>

      {/* Contact & staff */}
      <Card>
        <SectionHeader title="Contact & Management" subtitle="Responsible manager and operating hours" marker="green" />
        <Inner>
          <Select label="Store Manager" value="— Unassigned —" onChange={() => {}}
                  options={['— Unassigned —', 'Layla Ahmed', 'Mohammed Saleh', 'Sara Al-Otaibi', 'Khalid Al-Rashid']} />
          <Field label="Phone" placeholder="+966 5X XXX XXXX" mono />
          <Field label="Email" placeholder="warehouse@company.com" />
          <Field label="Opening Time" value="08:00" mono />
          <Field label="Closing Time" value="18:00" mono />
          <Select label="Working Days" value="Sun – Thu" onChange={() => {}}
                  options={['Sun – Thu', 'Sat – Thu', 'All week', 'Custom']} />
        </Inner>
      </Card>

      {/* Inventory settings */}
      <Card>
        <SectionHeader title="Inventory Settings" subtitle="Costing, capacity and stock policy" marker="orange" />
        <Inner>
          <Select label="Default Currency" value="SAR — Saudi Riyal" onChange={() => {}}
                  options={['SAR — Saudi Riyal', 'USD — US Dollar', 'EUR — Euro', 'AED — UAE Dirham']} />
          <Select label="Costing Method" value="Weighted Average" onChange={() => {}}
                  options={['Weighted Average', 'FIFO', 'Standard Cost', 'Last Purchase']} />
          <Field label="Storage Capacity (units)" placeholder="e.g. 6000" mono />
          <Field label="Low-Stock Alert Threshold" placeholder="e.g. 20" mono />
        </Inner>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 8, marginTop: 4 }}>
          <Toggle label="Warehouse is active" checked={active} onChange={setActive} />
          <Toggle label="Set as default store" checked={isDefault} onChange={setIsDefault} />
          <Toggle label="Allow negative stock" checked={allowNegative} onChange={setAllowNegative} />
          <Toggle label="Track bins / locations" checked={trackBins} onChange={setTrackBins} />
        </div>
      </Card>

      {/* Notes */}
      <Card>
        <SectionHeader title="Notes" marker="orange" />
        <Textarea label="Internal Note"
                  placeholder="Add internal notes about this warehouse's operational status or layout…"
                  value={note} onChange={setNote} rows={4} />
      </Card>

      <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
        <Button variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button variant="primary" icon="check" onClick={() => onCreate && onCreate({ storeName, code, category, city, note })}>
          Create Warehouse
        </Button>
      </div>
    </Page>
  );
}

window.CreateStore = CreateStore;
