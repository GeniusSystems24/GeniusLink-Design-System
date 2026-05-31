/* global React, Page, Card, SectionHeader, Button, Icon, StatusPill, EditableTable */
// Screen: Units of Measure — grouped by physical dimension, ratio editing

const UOM_COLS = [
  { key: 'code',     label: 'Code',          w: 90,  type: 'text', mono: true, required: true },
  { key: 'name',     label: 'Name',          w: 170, type: 'text', required: true },
  { key: 'arName',   label: 'Arabic',        w: 130, type: 'text' },
  { key: 'ratio',    label: 'Ratio × Base',  w: 130, type: 'num',  align: 'right', mono: true, required: true },
  { key: 'precision',label: 'Decimals',      w: 90,  type: 'enum', opts: ['0','1','2','3','4'] },
  { key: 'isBase',   label: 'Base',          w: 90,  type: 'enum', opts: ['No','Yes'] },
];

const GROUPS = [
  { id: 'count',  name: 'Count',  base: 'PCS', icon: 'briefcase', tone: '#4A7CFF', units: [
    { code: 'PCS', name: 'Piece',   arName: 'قطعة',   ratio: '1',    precision: '0', isBase: 'Yes' },
    { code: 'DZN', name: 'Dozen',   arName: 'دستة',   ratio: '12',   precision: '0', isBase: 'No' },
    { code: 'BOX', name: 'Box',     arName: 'صندوق',  ratio: '24',   precision: '0', isBase: 'No' },
    { code: 'CTN', name: 'Carton',  arName: 'كرتون',  ratio: '144',  precision: '0', isBase: 'No' },
    { code: 'PLT', name: 'Pallet',  arName: 'طبلية',  ratio: '600',  precision: '0', isBase: 'No' },
  ]},
  { id: 'weight', name: 'Weight', base: 'KG', icon: 'briefcase', tone: '#1DB88A', units: [
    { code: 'G',   name: 'Gram',     arName: 'جرام',  ratio: '0.001', precision: '0', isBase: 'No' },
    { code: 'KG',  name: 'Kilogram', arName: 'كيلو',  ratio: '1',     precision: '3', isBase: 'Yes' },
    { code: 'TON', name: 'Tonne',    arName: 'طن',    ratio: '1000',  precision: '2', isBase: 'No' },
    { code: 'BAG', name: 'Bag 50kg', arName: 'كيس',   ratio: '50',    precision: '0', isBase: 'No' },
  ]},
  { id: 'length', name: 'Length', base: 'M', icon: 'compass', tone: '#F97316', units: [
    { code: 'MM',  name: 'Millimeter', arName: 'مم',  ratio: '0.001', precision: '0', isBase: 'No' },
    { code: 'CM',  name: 'Centimeter', arName: 'سم',  ratio: '0.01',  precision: '1', isBase: 'No' },
    { code: 'M',   name: 'Meter',      arName: 'متر', ratio: '1',     precision: '2', isBase: 'Yes' },
    { code: 'KM',  name: 'Kilometer',  arName: 'كم',  ratio: '1000',  precision: '3', isBase: 'No' },
  ]},
  { id: 'volume', name: 'Volume', base: 'L', icon: 'database', tone: '#4A7CFF', units: [
    { code: 'ML',  name: 'Milliliter',  arName: 'مل',   ratio: '0.001', precision: '0', isBase: 'No' },
    { code: 'L',   name: 'Liter',       arName: 'لتر',  ratio: '1',     precision: '2', isBase: 'Yes' },
    { code: 'M3',  name: 'Cubic Meter', arName: 'م³',   ratio: '1000',  precision: '3', isBase: 'No' },
  ]},
];

function UnitsOfMeasure({ onCreate }) {
  const [activeGroup, setActiveGroup] = React.useState('count');
  const [groups, setGroups] = React.useState(GROUPS.reduce((m, g) => { m[g.id] = g.units; return m; }, {}));
  const active = GROUPS.find(g => g.id === activeGroup);
  const rows = groups[activeGroup];

  return (
    <Page breadcrumb={['Commercial', 'Inventory', 'Units of Measure']} title="Units of Measure"
      titleRight={<Button variant="primary" icon="plus" onClick={onCreate}>New Group</Button>}>

      {/* Group tiles */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {GROUPS.map((g) => {
          const isActive = activeGroup === g.id;
          return (
            <button key={g.id} onClick={() => setActiveGroup(g.id)} style={{
              padding: 16, borderRadius: 8, cursor: 'pointer', textAlign: 'left',
              background: isActive ? `${g.tone}14` : 'var(--gl-surface)',
              border: `1px solid ${isActive ? g.tone : 'var(--gl-border)'}`,
              display: 'flex', gap: 12, alignItems: 'center',
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 8,
                background: `${g.tone}1F`, color: g.tone,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <Icon name={g.icon} size={16} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontWeight: 700, fontSize: 10, letterSpacing: '0.08em',
                  textTransform: 'uppercase', color: 'var(--gl-fg-3)',
                }}>{g.name}</div>
                <div style={{ marginTop: 4, fontSize: 13, color: 'var(--gl-fg-1)', fontWeight: 600 }}>
                  {groups[g.id].length} units · Base <span style={{ fontFamily: 'var(--gl-font-mono)', color: g.tone }}>{g.base}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <Card>
        <SectionHeader
          title={`${active.name} Units`}
          subtitle={`All units convert to base ${active.base} via the Ratio column — Base × Ratio = unit value`}
          marker={active.tone === '#4A7CFF' ? 'blue' : (active.tone === '#1DB88A' ? 'green' : 'orange')} />
        <EditableTable
          columns={UOM_COLS}
          rows={rows}
          onChange={(next) => {
            const yesIdx = next.findIndex((u, i) => u.isBase === 'Yes' && rows[i] && rows[i].isBase !== 'Yes');
            if (yesIdx >= 0) {
              next = next.map((u, i) => i === yesIdx ? { ...u, isBase: 'Yes', ratio: '1' } : { ...u, isBase: 'No' });
            }
            setGroups(g => ({ ...g, [activeGroup]: next }));
          }}
          addRowLabel={`Add ${active.name} Unit`}
          emptyRow={() => ({ code: '', name: '', arName: '', ratio: '', precision: '2', isBase: 'No' })}
          footer={
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--gl-fg-3)' }}>
              <Icon name="info" size={13} />
              <span>The base unit's ratio is locked at 1.0. Marking a different row "Yes" makes it the new base.</span>
            </div>
          } />
      </Card>

      {/* Quick converter */}
      <Card>
        <SectionHeader title="Conversion Preview" subtitle={`How 100 ${active.base} converts across the group`} marker="orange" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
          {rows.map((u) => {
            const r = parseFloat(u.ratio) || 1;
            const converted = (100 / r).toLocaleString('en-US', { maximumFractionDigits: parseInt(u.precision) || 0 });
            return (
              <div key={u.code} style={{
                padding: 14, background: u.isBase === 'Yes' ? `${active.tone}10` : 'var(--gl-bg)',
                border: `1px solid ${u.isBase === 'Yes' ? `${active.tone}40` : 'var(--gl-border)'}`,
                borderRadius: 6,
              }}>
                <div style={{ fontFamily: 'var(--gl-font-mono)', fontSize: 11, fontWeight: 700, color: u.isBase === 'Yes' ? active.tone : 'var(--gl-fg-3)', letterSpacing: '0.05em' }}>{u.code}</div>
                <div style={{ fontFamily: 'var(--gl-font-mono)', fontSize: 18, fontWeight: 600, color: 'var(--gl-fg-1)', marginTop: 4 }}>{converted}</div>
                <div style={{ fontSize: 11, color: 'var(--gl-fg-3)', marginTop: 4 }}>{u.name}</div>
              </div>
            );
          })}
        </div>
      </Card>
    </Page>
  );
}

window.UnitsOfMeasure = UnitsOfMeasure;
