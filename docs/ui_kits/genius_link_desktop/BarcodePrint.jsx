/* global React, Page, Card, SectionHeader, Button, Icon, StatusPill, Field */
// Screen: Barcode Print — label templates, print config, live preview

const TEMPLATES = [
  { id: 'sm', name: 'Small Tag',  w: 38, h: 19, copies: 1,  cols: 5, rows: 13 },
  { id: 'md', name: 'Medium Label', w: 50, h: 30, copies: 2,  cols: 4, rows: 8 },
  { id: 'lg', name: 'Large Shelf',  w: 80, h: 40, copies: 1,  cols: 2, rows: 6 },
  { id: 'sh', name: 'Shipping Box', w: 100, h: 50, copies: 1, cols: 2, rows: 5 },
];

const QUEUE = [
  { sku: 'STL-44021', name: 'Structural Steel I-Beam', barcode: '6 281000 044021', qty: 4,  price: '540.00' },
  { sku: 'CMT-90112', name: 'Portland Cement Type I',  barcode: '6 281000 901127', qty: 12, price: '28.00'  },
  { sku: 'AGG-21044', name: 'Coarse Aggregate 20mm',   barcode: '6 281000 210442', qty: 2,  price: '140.00' },
  { sku: 'PLY-30022', name: 'Plywood Sheet 18mm',      barcode: '6 281000 300229', qty: 6,  price: '105.00' },
];

function BarcodePrint({ onCancel, onCreate }) {
  const [tplId, setTplId] = React.useState('md');
  const [symbology, setSymbology] = React.useState('Code 128');
  const [opts, setOpts] = React.useState({
    name: true, price: true, sku: true, store: false, currency: true,
  });
  const tpl = TEMPLATES.find(t => t.id === tplId);
  const totalLabels = QUEUE.reduce((s, q) => s + q.qty, 0) * tpl.copies;
  const sheets = Math.ceil(totalLabels / (tpl.cols * tpl.rows));

  return (
    <Page breadcrumb={['Commercial', 'Inventory', 'Barcode Print']} title="Print Barcode Labels"
      titleRight={<Button variant="secondary" icon="download">Export PDF</Button>}>

      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 16, alignItems: 'start' }}>
        {/* Left: settings */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Card>
            <SectionHeader title="Label Template" subtitle="Select a label size — sheet capacity updates automatically" marker="blue" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
              {TEMPLATES.map((t) => {
                const isActive = tplId === t.id;
                return (
                  <button key={t.id} onClick={() => setTplId(t.id)} style={{
                    padding: 14, borderRadius: 8, cursor: 'pointer', textAlign: 'left',
                    background: isActive ? 'rgba(74,124,255,0.10)' : 'var(--gl-bg)',
                    border: `1px solid ${isActive ? '#4A7CFF' : 'var(--gl-border)'}`,
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 600, fontSize: 13, color: 'var(--gl-fg-1)' }}>{t.name}</span>
                      {isActive && <Icon name="check" size={14} color="#4A7CFF" />}
                    </div>
                    <div style={{ fontFamily: 'var(--gl-font-mono)', fontSize: 11, color: 'var(--gl-fg-3)', marginTop: 6 }}>
                      {t.w} × {t.h} mm · {t.cols * t.rows} per sheet
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>

          <Card>
            <SectionHeader title="Print Settings" marker="green" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 20 }}>
              <window._cfgShared.CurSelect label="Symbology" value={symbology} options={['Code 128', 'Code 39', 'EAN-13', 'QR Code', 'Data Matrix']} />
              <window._cfgShared.CurSelect label="Paper" value="A4 (210 × 297 mm)" options={['A4 (210 × 297 mm)', 'Letter', 'Avery 5160', 'Avery L7163']} />
              <Field label="Copies per Item" mono value={String(tpl.copies)} />
              <window._cfgShared.CurSelect label="Print Engine" value="System Printer" options={['System Printer', 'Brother QL-820', 'Zebra GK420t', 'Honeywell PM43']} />
            </div>
          </Card>

          <Card>
            <SectionHeader title="Label Content" subtitle="Toggle which fields appear on every label" marker="orange" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 8 }}>
              {[
                ['name', 'Product Name'],
                ['sku', 'SKU Code'],
                ['price', 'Selling Price'],
                ['currency', 'Currency Symbol'],
                ['store', 'Store / Location'],
              ].map(([key, label]) => (
                <LabelToggle key={key}
                             label={label}
                             on={opts[key]}
                             onToggle={() => setOpts(s => ({ ...s, [key]: !s[key] }))} />
              ))}
            </div>
          </Card>
        </div>

        {/* Right: queue + preview */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Card>
            <SectionHeader title="Live Preview" subtitle={`${symbology} · ${tpl.w}×${tpl.h}mm`} marker="green" />
            <div style={{
              padding: 24, background: '#FFFFFF', borderRadius: 6,
              display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 200,
            }}>
              <LabelPreview tpl={tpl} symbology={symbology} opts={opts}
                            item={{ name: 'Portland Cement Type I', sku: 'CMT-90112', barcode: '6 281000 901127', price: '28.00' }} />
            </div>
          </Card>

          <Card padding={0}>
            <div style={{ padding: '20px 24px 0' }}>
              <SectionHeader title="Print Queue" subtitle={`${QUEUE.length} products · ${totalLabels} labels · ${sheets} sheet${sheets===1?'':'s'}`} marker="blue" />
            </div>
            <div style={{ padding: '12px 24px 20px' }}>
              {QUEUE.map((q, i) => (
                <div key={q.sku} style={{
                  display: 'grid', gridTemplateColumns: '100px 1fr 70px 36px', gap: 12,
                  padding: '12px 0', alignItems: 'center', fontSize: 13,
                  borderBottom: i < QUEUE.length - 1 ? '1px solid var(--gl-border)' : 'none',
                }}>
                  <span style={{ fontFamily: 'var(--gl-font-mono)', color: 'var(--gl-fg-2)', fontSize: 11 }}>{q.sku}</span>
                  <span style={{ fontWeight: 500, color: 'var(--gl-fg-1)' }}>{q.name}</span>
                  <span style={{ fontFamily: 'var(--gl-font-mono)', textAlign: 'right', fontWeight: 600 }}>
                    {q.qty} <span style={{ fontSize: 10, color: 'var(--gl-fg-3)' }}>×{tpl.copies}</span>
                  </span>
                  <button style={{
                    width: 28, height: 28, borderRadius: 4, background: 'transparent',
                    border: 'none', color: 'var(--gl-fg-3)', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}><Icon name="trash" size={13} /></button>
                </div>
              ))}
            </div>
          </Card>

          <Card padding={20}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
              <BTile label="Labels" value={totalLabels} />
              <BTile label="Sheets" value={sheets} />
              <BTile label="Ink Coverage" value="~ 6%" sub="estimated" />
            </div>
          </Card>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
        <Button variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button variant="secondary" icon="download">Save Layout</Button>
        <Button variant="primary" icon="check" onClick={onCreate}>Print {totalLabels} Labels</Button>
      </div>
    </Page>
  );
}

function LabelToggle({ label, on, onToggle }) {
  return (
    <button onClick={onToggle} style={{
      display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
      background: on ? 'rgba(74,124,255,0.10)' : 'var(--gl-bg)',
      border: `1px solid ${on ? '#4A7CFF' : 'var(--gl-border)'}`,
      borderRadius: 4, cursor: 'pointer', textAlign: 'left',
    }}>
      <span style={{
        width: 16, height: 16, borderRadius: 3,
        background: on ? '#4A7CFF' : 'transparent',
        border: `1.5px solid ${on ? '#4A7CFF' : 'var(--gl-border-strong)'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>{on && <Icon name="check" size={11} color="#fff" stroke={2.5} />}</span>
      <span style={{
        fontWeight: 700, fontSize: 11, letterSpacing: '0.05em',
        textTransform: 'uppercase', color: on ? 'var(--gl-fg-1)' : 'var(--gl-fg-3)',
      }}>{label}</span>
    </button>
  );
}

function LabelPreview({ tpl, symbology, opts, item }) {
  // Scale mm → px for the preview (≈ 3px / mm)
  const scale = Math.min(360 / tpl.w, 220 / tpl.h, 5);
  const w = tpl.w * scale;
  const h = tpl.h * scale;
  const isQR = symbology === 'QR Code' || symbology === 'Data Matrix';
  return (
    <div style={{
      width: w, height: h, background: '#FFFFFF', border: '1px solid #D4D4D8',
      borderRadius: 3, padding: 8, boxSizing: 'border-box',
      display: 'flex', flexDirection: 'column', gap: 4, color: '#0B0C10',
      boxShadow: '0 6px 24px -8px rgba(0,0,0,0.3)',
    }}>
      {opts.name && <div style={{ fontSize: Math.max(8, scale * 1.6), fontWeight: 700, lineHeight: 1.1, color: '#0B0C10' }}>{item.name}</div>}
      <div style={{ flex: 1, display: 'flex', gap: 8, alignItems: 'center' }}>
        {isQR ? (
          <QRStub size={h * 0.65} />
        ) : (
          <CodeStub w={w * 0.6} h={h * 0.45} />
        )}
        {(opts.sku || opts.price) && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {opts.sku   && <div style={{ fontFamily: 'monospace', fontSize: Math.max(7, scale * 1.2), color: '#0B0C10' }}>{item.sku}</div>}
            {opts.price && <div style={{ fontWeight: 800, fontSize: Math.max(10, scale * 2), color: '#0B0C10' }}>{opts.currency ? 'SAR ' : ''}{item.price}</div>}
          </div>
        )}
      </div>
      <div style={{ fontFamily: 'monospace', fontSize: Math.max(7, scale * 1), textAlign: 'center', color: '#0B0C10', letterSpacing: '0.05em' }}>{item.barcode}</div>
    </div>
  );
}

function CodeStub({ w, h }) {
  const bars = [];
  let x = 0;
  while (x < w - 2) {
    const bw = Math.random() > 0.6 ? 3 : (Math.random() > 0.5 ? 2 : 1);
    bars.push({ x, w: bw });
    x += bw + (Math.random() > 0.55 ? 2 : 1);
  }
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      {bars.map((b, i) => <rect key={i} x={b.x} y={0} width={b.w} height={h} fill="#0B0C10" />)}
    </svg>
  );
}

function QRStub({ size }) {
  const cells = 10;
  const cs = size / cells;
  const fill = (r, c) => (r + c * 2 + r * c) % 3 !== 0;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <rect width={size} height={size} fill="#FFF" />
      {Array.from({ length: cells }).map((_, r) =>
        Array.from({ length: cells }).map((_, c) =>
          fill(r, c) ? <rect key={`${r}-${c}`} x={c * cs} y={r * cs} width={cs} height={cs} fill="#0B0C10" /> : null
        ))}
      {/* finder squares */}
      {[[0,0],[0,cells-3],[cells-3,0]].map(([r,c],i) => (
        <g key={i}>
          <rect x={c*cs} y={r*cs} width={cs*3} height={cs*3} fill="#FFF" />
          <rect x={c*cs} y={r*cs} width={cs*3} height={cs*3} fill="none" stroke="#0B0C10" strokeWidth={cs*0.6} />
          <rect x={(c+1)*cs} y={(r+1)*cs} width={cs} height={cs} fill="#0B0C10" />
        </g>
      ))}
    </svg>
  );
}

function BTile({ label, value, sub }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontWeight: 700, fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--gl-fg-3)' }}>{label}</div>
      <div style={{ fontFamily: 'var(--gl-font-mono)', fontSize: 22, fontWeight: 600, color: 'var(--gl-fg-1)', marginTop: 4 }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: 'var(--gl-fg-3)', marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

window.BarcodePrint = BarcodePrint;
