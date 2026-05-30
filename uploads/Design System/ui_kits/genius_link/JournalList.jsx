/* global React, Page, Card, SectionHeader, Button, Icon, StatusPill */
// Screen: Journal Entries — list view

function JournalList({ onCreate, onOpenEntry }) {
  const [tab, setTab] = React.useState('all');
  const [query, setQuery] = React.useState('');

  const entries = [
    { ref: 'JV-2024-0042', date: 'Dec 15, 2025', desc: 'Opening balance — fiscal 2024',     debit: '5,000.00',  credit: '5,000.00',  status: 'posted',   lines: 2, type: 'Opening' },
    { ref: 'JV-2024-0058', date: 'Dec 16, 2025', desc: 'Cash sale — Customer 102',           debit: '1,250.00',  credit: '1,250.00',  status: 'posted',   lines: 2, type: 'Sales' },
    { ref: 'JV-2024-0071', date: 'Dec 18, 2025', desc: 'Petty cash reimbursement',           debit: '650.00',    credit: '650.00',    status: 'posted',   lines: 3, type: 'Expense' },
    { ref: 'JV-2024-0204', date: 'Dec 18, 2025', desc: 'Bank deposit DEP-2024-0182',         debit: '5,000.00',  credit: '5,000.00',  status: 'posted',   lines: 2, type: 'Banking' },
    { ref: 'JV-2024-0219', date: 'Dec 18, 2025', desc: 'External wire EXT-2024-0311',        debit: '12,045.00', credit: '12,045.00', status: 'posted',   lines: 3, type: 'Banking' },
    { ref: 'JV-2024-0225', date: 'Dec 19, 2025', desc: 'Depreciation — Q4 accrual',          debit: '3,400.00',  credit: '3,400.00',  status: 'draft',    lines: 4, type: 'Adjustment' },
    { ref: 'JV-2024-0188', date: 'Dec 12, 2025', desc: 'Reversal of JV-2024-0150',           debit: '880.00',    credit: '880.00',    status: 'reversed', lines: 2, type: 'Reversal' },
  ];

  const visible = entries.filter((e) => {
    if (tab !== 'all' && e.status !== tab) return false;
    if (!query) return true;
    const q = query.toLowerCase();
    return e.ref.toLowerCase().includes(q) || e.desc.toLowerCase().includes(q);
  });

  const grid = '130px 110px 1.8fr 1fr 1fr 60px 100px 40px';

  return (
    <Page
      breadcrumb={['Accounting', 'Ledger', 'Journals']}
      title="Journal Entries"
      titleRight={<Button variant="primary" icon="plus" onClick={onCreate}>New Entry</Button>}>

      <Card padding={20}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 4, background: 'var(--gl-input-bg)', padding: 4, borderRadius: 6, border: '1px solid var(--gl-border)' }}>
            {[
              { id: 'all',      label: 'All' },
              { id: 'posted',   label: 'Posted' },
              { id: 'draft',    label: 'Draft' },
              { id: 'reversed', label: 'Reversed' },
            ].map((t) => (
              <button key={t.id} onClick={() => setTab(t.id)}
                style={{
                  padding: '6px 14px', borderRadius: 4,
                  background: tab === t.id ? 'var(--gl-surface)' : 'transparent',
                  color: tab === t.id ? 'var(--gl-fg-1)' : 'var(--gl-fg-3)',
                  border: 'none', cursor: 'pointer',
                  fontFamily: 'var(--gl-font-body)', fontWeight: 700, fontSize: 10,
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                  boxShadow: tab === t.id ? '0 1px 2px rgba(0,0,0,0.2)' : 'none',
                  transition: 'background 150ms ease',
                }}>{t.label}</button>
            ))}
          </div>
          <div style={{ position: 'relative', flex: '0 0 300px' }}>
            <div style={{
              position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
              color: 'var(--gl-fg-3)', display: 'flex', pointerEvents: 'none',
            }}><Icon name="search" size={14} /></div>
            <input value={query} onChange={(e) => setQuery(e.target.value)}
              placeholder="Search reference or description…"
              style={{
                width: '100%', height: 40, padding: '0 16px 0 40px',
                background: 'var(--gl-input-bg)', border: '1px solid var(--gl-border-strong)',
                borderRadius: 4, fontFamily: 'var(--gl-font-body)', fontSize: 13,
                color: 'var(--gl-fg-1)', outline: 'none', boxSizing: 'border-box',
              }}/>
          </div>
        </div>
      </Card>

      <Card padding={0}>
        <div style={{ padding: '20px 24px 0' }}>
          <SectionHeader title={`${visible.length} Entr${visible.length === 1 ? 'y' : 'ies'}`}
                         subtitle="Click any row to open the full entry" marker="blue" />
        </div>
        <div style={{ padding: '20px 24px 24px' }}>
          <div style={{
            display: 'grid', gridTemplateColumns: grid, gap: 12, padding: '0 0 12px',
            borderBottom: '1px solid var(--gl-border)',
            fontWeight: 700, fontSize: 10, letterSpacing: '0.05em',
            textTransform: 'uppercase', color: 'var(--gl-fg-3)',
          }}>
            <span>Reference</span><span>Date</span><span>Description</span>
            <span style={{ textAlign: 'right' }}>Debit</span>
            <span style={{ textAlign: 'right' }}>Credit</span>
            <span style={{ textAlign: 'right' }}>Lines</span>
            <span>Status</span><span></span>
          </div>
          {visible.map((e) => (
            <JournalRow key={e.ref} e={e} grid={grid} onClick={() => onOpenEntry && onOpenEntry(e)} />
          ))}
          {visible.length === 0 && (
            <div style={{ padding: '48px 0', textAlign: 'center', color: 'var(--gl-fg-3)', fontSize: 13 }}>
              No entries match this filter.
            </div>
          )}
        </div>
      </Card>
    </Page>
  );
}

function JournalRow({ e, grid, onClick }) {
  const [hover, setHover] = React.useState(false);
  const toneMap = { posted: 'success', draft: 'neutral', reversed: 'danger' };
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        display: 'grid', gridTemplateColumns: grid, gap: 12,
        padding: '14px 8px', alignItems: 'center', margin: '0 -8px',
        borderBottom: '1px solid var(--gl-border)',
        background: hover ? 'var(--gl-hover)' : 'transparent',
        borderRadius: 4, cursor: 'pointer', fontSize: 13, color: 'var(--gl-fg-1)',
        transition: 'background 150ms ease',
      }}>
      <span style={{ fontFamily: 'var(--gl-font-mono)', color: '#4A7CFF' }}>{e.ref}</span>
      <span style={{ fontFamily: 'var(--gl-font-mono)', fontSize: 12, color: 'var(--gl-fg-2)' }}>{e.date}</span>
      <span>
        <div>{e.desc}</div>
        <div style={{ fontSize: 11, color: 'var(--gl-fg-3)', marginTop: 2 }}>{e.type}</div>
      </span>
      <span style={{ fontFamily: 'var(--gl-font-mono)', textAlign: 'right', color: '#1DB88A' }}>{e.debit}</span>
      <span style={{ fontFamily: 'var(--gl-font-mono)', textAlign: 'right', color: '#EF4444' }}>{e.credit}</span>
      <span style={{ fontFamily: 'var(--gl-font-mono)', textAlign: 'right', color: 'var(--gl-fg-3)' }}>{e.lines}</span>
      <span><StatusPill tone={toneMap[e.status]} size="sm">{e.status}</StatusPill></span>
      <span style={{ justifySelf: 'end', color: 'var(--gl-fg-3)', display: 'flex' }}>
        <Icon name="chevRight" size={14} />
      </span>
    </div>
  );
}

window.JournalList = JournalList;
