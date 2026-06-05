/* global React, Page, Card, SectionHeader, Button, Icon, StatusPill, Field */
// Screen: Categories — collapsible tree + inline edit form

const TREE = [
  { id: 'steel', code: 'CAT-001', name: 'Steel', skus: 412, value: '1,820,420.00', children: [
    { id: 'rebar', code: 'CAT-001-01', name: 'Reinforcement Bars', skus: 88,  value: '420,180.00' },
    { id: 'beam',  code: 'CAT-001-02', name: 'Structural Beams',   skus: 142, value: '892,000.00' },
    { id: 'plate', code: 'CAT-001-03', name: 'Steel Plates',       skus: 64,  value: '321,840.00' },
  ]},
  { id: 'cement', code: 'CAT-002', name: 'Cement & Mortars', skus: 96, value: '188,640.00', children: [
    { id: 'ord',    code: 'CAT-002-01', name: 'Ordinary Portland',  skus: 42, value: '88,800.00' },
    { id: 'sulf',   code: 'CAT-002-02', name: 'Sulfate Resistant',  skus: 28, value: '54,200.00' },
    { id: 'mortar', code: 'CAT-002-03', name: 'Pre-mixed Mortars',  skus: 26, value: '45,640.00' },
  ]},
  { id: 'agg',     code: 'CAT-003', name: 'Aggregates',     skus: 64,  value: '142,800.00', children: [] },
  { id: 'timber',  code: 'CAT-004', name: 'Timber & Wood',  skus: 184, value: '484,210.00', children: [
    { id: 'sawn', code: 'CAT-004-01', name: 'Sawn Lumber', skus: 92, value: '218,400.00' },
    { id: 'ply',  code: 'CAT-004-02', name: 'Plywood',     skus: 92, value: '265,810.00' },
  ]},
  { id: 'finish', code: 'CAT-005', name: 'Finishing Materials', skus: 128, value: '184,390.00', children: [] },
];

function Categories({ onCreate }) {
  const [open, setOpen] = React.useState({ steel: true, cement: true });
  const [selected, setSelected] = React.useState('beam');
  const [editName, setEditName] = React.useState('Structural Beams');
  const [editAr, setEditAr]     = React.useState('كمرات إنشائية');
  const [parent, setParent]     = React.useState('Steel');

  const flat = [];
  TREE.forEach(c => { flat.push(c); (c.children || []).forEach(ch => flat.push(ch)); });
  const sel = flat.find(c => c.id === selected) || flat[0];

  return (
    <Page breadcrumb={['Commercial', 'Inventory', 'Categories']} title="Product Categories"
      titleRight={<Button variant="primary" icon="plus" onClick={onCreate}>New Category</Button>}>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 16, alignItems: 'start' }}>
        {/* Tree */}
        <Card padding={0}>
          <div style={{ padding: '20px 24px 0' }}>
            <SectionHeader title="Category Tree" subtitle={`${TREE.length} top-level groups · ${flat.length} nodes`} marker="blue" />
          </div>
          <div style={{ padding: '16px 12px 20px' }}>
            {TREE.map((node) => (
              <React.Fragment key={node.id}>
                <TreeRow node={node}
                         depth={0}
                         expanded={!!open[node.id]}
                         onToggle={() => setOpen(s => ({ ...s, [node.id]: !s[node.id] }))}
                         selected={selected === node.id}
                         onSelect={() => setSelected(node.id)}
                         hasChildren={(node.children || []).length > 0} />
                {open[node.id] && (node.children || []).map(child => (
                  <TreeRow key={child.id}
                           node={child}
                           depth={1}
                           expanded={false}
                           selected={selected === child.id}
                           onSelect={() => setSelected(child.id)}
                           hasChildren={false} />
                ))}
              </React.Fragment>
            ))}
          </div>
        </Card>

        {/* Inline form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Card>
            <SectionHeader title="Edit Category" subtitle={sel.code} marker="green" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 20 }}>
              <Field label="Code" required mono value={sel.code} />
              <Field label="Parent" value={parent} onChange={setParent} />
              <Field label="Name (English)" required value={editName} onChange={setEditName} />
              <Field label="الاسم بالعربية" required dir="rtl" value={editAr} onChange={setEditAr} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 20 }}>
              <Field label="Default Tax Rate" placeholder="e.g. 15%" mono />
              <Field label="Default Markup %" placeholder="e.g. 20" mono />
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <Button variant="danger" icon="trash">Delete</Button>
              <Button variant="primary" icon="check">Save Changes</Button>
            </div>
          </Card>

          <Card>
            <SectionHeader title="Rollup Stats" marker="orange" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
              <CatStat label="SKUs in Category" value={sel.skus.toLocaleString()} />
              <CatStat label="Stock Value (SAR)" value={sel.value} accent="#1DB88A" />
              <CatStat label="Code" value={sel.code} mono />
              <CatStat label="Depth" value={sel.code.split('-').length - 1} />
            </div>
          </Card>
        </div>
      </div>
    </Page>
  );
}

function TreeRow({ node, depth, expanded, onToggle, selected, onSelect, hasChildren }) {
  const [hover, setHover] = React.useState(false);
  return (
    <div onClick={onSelect}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        display: 'grid',
        gridTemplateColumns: `${24 + depth * 20}px 20px 1fr 80px 110px`,
        gap: 8, alignItems: 'center', padding: '10px 8px',
        borderRadius: 4, cursor: 'pointer', fontSize: 13,
        background: selected ? 'rgba(74,124,255,0.12)' : (hover ? 'var(--gl-hover)' : 'transparent'),
        color: selected ? '#4A7CFF' : 'var(--gl-fg-1)',
        marginBottom: 1,
      }}>
      <span style={{ display: 'flex', justifyContent: 'flex-end' }}>
        {hasChildren ? (
          <button onClick={(e) => { e.stopPropagation(); onToggle(); }} style={{
            width: 20, height: 20, borderRadius: 4, background: 'transparent',
            border: 'none', cursor: 'pointer', color: 'var(--gl-fg-2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transform: expanded ? 'rotate(0deg)' : 'rotate(-90deg)', transition: 'transform 150ms ease',
          }}>
            <Icon name="chevDown" size={12} />
          </button>
        ) : <span style={{ width: 20 }} />}
      </span>
      <Icon name={hasChildren ? 'briefcase' : 'doc'} size={14} color={selected ? '#4A7CFF' : 'var(--gl-fg-3)'} />
      <span style={{ fontWeight: hasChildren ? 600 : 500 }}>{node.name}</span>
      <span style={{ fontFamily: 'var(--gl-font-mono)', fontSize: 11, color: 'var(--gl-fg-3)', textAlign: 'right' }}>{node.skus}</span>
      <span style={{ fontFamily: 'var(--gl-font-mono)', fontSize: 11, color: 'var(--gl-fg-3)', textAlign: 'right' }}>{node.value} <span style={{ fontSize: 9 }}>SAR</span></span>
    </div>
  );
}

function CatStat({ label, value, accent, mono }) {
  return (
    <div style={{ padding: 14, background: 'var(--gl-bg)', border: '1px solid var(--gl-border)', borderRadius: 6 }}>
      <div style={{ fontWeight: 700, fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--gl-fg-3)', marginBottom: 6 }}>{label}</div>
      <div style={{ fontFamily: mono ? 'var(--gl-font-mono)' : 'var(--gl-font-mono)', fontSize: 16, fontWeight: 600, color: accent || 'var(--gl-fg-1)' }}>{value}</div>
    </div>
  );
}

window.Categories = Categories;
