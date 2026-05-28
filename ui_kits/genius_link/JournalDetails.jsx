/* global React, Page, Card, SectionHeader, Button, Icon, LockedField, StatusPill, Footer, Breadcrumb */
// Screens: Journal Entry Details (standard) + Financial Operation Details (wide master template)

/* =========================================================
   JOURNAL ENTRY DETAILS — standard 720px detail
   ========================================================= */
function JournalEntryDetails({ onBack, onEdit, onDelete }) {
  const lines = [
    { account: '1100 — Bank · NCB Main', desc: 'Cash collected',        debit: '3,400.00', credit: '' },
    { account: '1200 — Inventory (WIP)', desc: 'Stock consumed',        debit: '',         credit: '1,400.00' },
    { account: '4001 — Sales Revenue',   desc: 'Revenue recognized',    debit: '',         credit: '2,000.00' },
  ];
  const grid = '40px 1.8fr 1.4fr 1fr 1fr';

  return (
    <Page
      breadcrumb={['Accounting', 'Ledger', 'JV-2024-0226']}
      title="Journal Entry"
      titleRight={
        <div style={{ display: 'flex', gap: 8 }}>
          <Button variant="secondary" icon="download">Export</Button>
          <Button variant="secondary" icon="edit" onClick={onEdit}>Edit</Button>
          <Button variant="danger" icon="trash" onClick={onDelete}>Reverse</Button>
        </div>
      }>
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ width: 4, borderRadius: 12, background: '#4A7CFF' }} />
            <div>
              <div style={{ fontFamily: 'var(--gl-font-mono)', fontSize: 13, color: '#4A7CFF' }}>JV-2024-0226</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--gl-fg-1)', marginTop: 4 }}>Mixed sale &amp; revenue recognition</div>
              <div style={{ fontSize: 12, color: 'var(--gl-fg-3)', marginTop: 4 }}>Posted Dec 19, 2025 · Fiscal 2024</div>
            </div>
          </div>
          <StatusPill tone="success">Posted</StatusPill>
        </div>
      </Card>

      <Card padding={0}>
        <div style={{ padding: '20px 24px 0' }}>
          <SectionHeader title="Entry Lines" subtitle="3 lines · balanced" marker="green" />
        </div>
        <div style={{ padding: '16px 24px 24px' }}>
          <div style={{
            display: 'grid', gridTemplateColumns: grid, gap: 12, padding: '0 0 12px',
            borderBottom: '1px solid var(--gl-border)',
            fontWeight: 700, fontSize: 10, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--gl-fg-3)',
          }}>
            <span>#</span><span>Account</span><span>Description</span>
            <span style={{ textAlign: 'right' }}>Debit</span>
            <span style={{ textAlign: 'right' }}>Credit</span>
          </div>
          {lines.map((l, i) => (
            <div key={i} style={{
              display: 'grid', gridTemplateColumns: grid, gap: 12, padding: '14px 0', alignItems: 'center',
              borderBottom: '1px solid var(--gl-border)', fontSize: 13, color: 'var(--gl-fg-1)',
            }}>
              <span style={{ fontFamily: 'var(--gl-font-mono)', color: 'var(--gl-fg-3)' }}>{String(i + 1).padStart(2, '0')}</span>
              <span style={{ fontWeight: 600 }}>{l.account}</span>
              <span style={{ color: 'var(--gl-fg-2)' }}>{l.desc}</span>
              <span style={{ fontFamily: 'var(--gl-font-mono)', textAlign: 'right', color: l.debit ? '#1DB88A' : 'var(--gl-fg-4)' }}>{l.debit || '—'}</span>
              <span style={{ fontFamily: 'var(--gl-font-mono)', textAlign: 'right', color: l.credit ? '#EF4444' : 'var(--gl-fg-4)' }}>{l.credit || '—'}</span>
            </div>
          ))}
          <div style={{
            display: 'grid', gridTemplateColumns: grid, gap: 12, padding: '14px 0 0',
            fontWeight: 700, fontSize: 13,
          }}>
            <span></span><span></span>
            <span style={{ textAlign: 'right', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--gl-fg-3)', alignSelf: 'center' }}>Totals</span>
            <span style={{ fontFamily: 'var(--gl-font-mono)', textAlign: 'right', color: '#1DB88A' }}>3,400.00</span>
            <span style={{ fontFamily: 'var(--gl-font-mono)', textAlign: 'right', color: '#EF4444' }}>3,400.00</span>
          </div>
        </div>
      </Card>

      <Card>
        <SectionHeader title="Audit Information" marker="orange" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, rowGap: 16 }}>
          {[
            ['Created By', 'Layla A. (ID: 12)'],
            ['Posted At', 'Dec 19, 2025 10:14 AM'],
            ['Approved By', 'Controller (ID: 3)'],
            ['Audit Hash', 'c2d9…f047'],
          ].map(([k, v]) => (
            <div key={k}>
              <div style={{ fontWeight: 700, fontSize: 11, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--gl-fg-3)', marginBottom: 6 }}>{k}</div>
              <div style={{ fontSize: 14, color: 'var(--gl-fg-1)', fontFamily: k === 'Audit Hash' ? 'var(--gl-font-mono)' : undefined }}>{v}</div>
            </div>
          ))}
        </div>
      </Card>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Button variant="secondary" icon="back" onClick={onBack}>Back to Journals</Button>
      </div>
    </Page>
  );
}

/* =========================================================
   FINANCIAL OPERATION DETAILS — wide master template
   2-column: main ledger content + right metadata rail.
   ========================================================= */
function FinancialOperationDetails({ onBack, onEdit, onDelete }) {
  const lines = [
    { num: '01', account: '1200 — Inventory (WIP)',  ar: 'مخزون قيد التشغيل', currency: 'SAR', amount: '+5,400.00', side: 'Debit',  desc: 'Issue for Project A-92' },
    { num: '02', account: '5001 — Cost of Goods Sold', ar: 'تكلفة البضاعة',    currency: 'SAR', amount: '+1,200.00', side: 'Debit',  desc: 'Direct labor allocation' },
    { num: '03', account: '1100 — Bank · NCB Main',   ar: 'البنك الأهلي',      currency: 'SAR', amount: '−6,600.00', side: 'Credit', desc: 'Settlement' },
  ];
  const grid = '36px 1.8fr 0.7fr 1fr 0.9fr 1.4fr';

  const timeline = [
    { label: 'Operation created', who: 'Layla A.', at: 'Dec 18, 09:21', done: true },
    { label: 'Lines validated',   who: 'System',   at: 'Dec 18, 09:21', done: true },
    { label: 'Submitted for review', who: 'Layla A.', at: 'Dec 18, 09:24', done: true },
    { label: 'Approved & posted', who: 'Controller', at: 'Dec 18, 10:05', done: true },
  ];

  return (
    <div style={{ maxWidth: 1120, margin: '0 auto', padding: '64px 32px 0', display: 'flex', flexDirection: 'column', gap: 32 }}>
      <Breadcrumb items={['Operations', 'Financial Operations', 'Details']} />

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 16 }}>
        <div>
          <h1 style={{
            fontFamily: 'var(--gl-font-display)', fontWeight: 700, fontSize: 30,
            letterSpacing: '-0.025em', color: 'var(--gl-fg-1)', margin: 0,
            display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap',
          }}>
            Material Issuance Operation
            <span style={{ fontFamily: 'var(--gl-font-arabic)', fontSize: 18, fontWeight: 400, color: '#4A7CFF', opacity: 0.8 }}>عملية صرف مواد</span>
          </h1>
          <div style={{ fontFamily: 'var(--gl-font-mono)', fontSize: 13, color: 'var(--gl-fg-3)', marginTop: 8 }}>OP-2024-0883 · INV-ISS-2024-0089</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button variant="secondary" icon="download">Export</Button>
          <Button variant="secondary" icon="edit" onClick={onEdit}>Edit</Button>
          <Button variant="danger" icon="trash" onClick={onDelete}>Void</Button>
        </div>
      </div>

      {/* 2-column body */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24, alignItems: 'start' }}>
        {/* MAIN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <Card>
            <SectionHeader title="Operation Summary" subtitle="Net financial impact across all ledger lines" marker="green"
                           right={<StatusPill tone="success">Posted</StatusPill>} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
              <FoTile label="Total Debits" value="6,600.00" currency="SAR" />
              <FoTile label="Total Credits" value="6,600.00" currency="SAR" />
              <FoTile label="Difference" value="0.00" currency="SAR" accent="#1DB88A" />
            </div>
          </Card>

          <Card padding={0}>
            <div style={{ padding: '20px 24px 0' }}>
              <SectionHeader title="Ledger Lines" subtitle="3 lines · balanced" marker="green" />
            </div>
            <div style={{ padding: '16px 24px 24px' }}>
              <div style={{
                display: 'grid', gridTemplateColumns: grid, gap: 12, padding: '0 0 12px',
                borderBottom: '1px solid var(--gl-border)',
                fontWeight: 700, fontSize: 10, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--gl-fg-3)',
              }}>
                <span>#</span><span>Account</span><span>Cur.</span>
                <span style={{ textAlign: 'right' }}>Amount</span><span>Side</span><span>Description</span>
              </div>
              {lines.map((l) => {
                const positive = l.amount.startsWith('+');
                return (
                  <div key={l.num} style={{
                    display: 'grid', gridTemplateColumns: grid, gap: 12, padding: '14px 0', alignItems: 'center',
                    borderBottom: '1px solid var(--gl-border)', fontSize: 13, color: 'var(--gl-fg-1)',
                  }}>
                    <span style={{ fontFamily: 'var(--gl-font-mono)', color: 'var(--gl-fg-3)' }}>{l.num}</span>
                    <span>
                      <div style={{ fontWeight: 600 }}>{l.account}</div>
                      <div dir="rtl" style={{ fontFamily: 'var(--gl-font-arabic)', fontSize: 11, color: 'var(--gl-fg-3)', marginTop: 2 }}>{l.ar}</div>
                    </span>
                    <span style={{ color: 'var(--gl-fg-2)' }}>{l.currency}</span>
                    <span style={{ fontFamily: 'var(--gl-font-mono)', textAlign: 'right', fontWeight: 600, color: positive ? '#1DB88A' : '#EF4444' }}>{l.amount}</span>
                    <span><StatusPill tone={positive ? 'info' : 'danger'} size="sm">{l.side}</StatusPill></span>
                    <span style={{ color: 'var(--gl-fg-2)', fontSize: 12 }}>{l.desc}</span>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card>
            <SectionHeader title="Attached Documents" marker="orange" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { name: 'delivery-note-A92.pdf', size: '248 KB', type: 'PDF' },
                { name: 'site-approval.pdf',     size: '112 KB', type: 'PDF' },
                { name: 'gate-pass-4892.jpg',    size: '1.2 MB', type: 'JPG' },
              ].map((d) => (
                <div key={d.name} style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
                  background: 'var(--gl-bg)', border: '1px solid var(--gl-border)', borderRadius: 6,
                }}>
                  <span style={{ color: '#4A7CFF', display: 'flex' }}><Icon name="doc" size={18} /></span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, color: 'var(--gl-fg-1)' }}>{d.name}</div>
                    <div style={{ fontFamily: 'var(--gl-font-mono)', fontSize: 11, color: 'var(--gl-fg-3)', marginTop: 2 }}>{d.type} · {d.size}</div>
                  </div>
                  <span style={{ color: 'var(--gl-fg-3)', display: 'flex', cursor: 'pointer' }}><Icon name="download" size={16} /></span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* RAIL */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, position: 'sticky', top: 32 }}>
          <Card padding={20}>
            <SectionHeader title="Details" marker="blue" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                ['Operation Type', 'Inventory Issue'],
                ['Store', 'Downtown Central'],
                ['Currency', 'SAR'],
                ['Fiscal Year', '2024'],
                ['Linked Journal', 'JV-2024-0089'],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontWeight: 700, fontSize: 10, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--gl-fg-3)' }}>{k}</span>
                  <span style={{ fontSize: 13, color: 'var(--gl-fg-1)', textAlign: 'right' }}>{v}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card padding={20}>
            <SectionHeader title="Activity" marker="green" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {timeline.map((t, i) => (
                <div key={i} style={{ display: 'flex', gap: 12 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{
                      width: 14, height: 14, borderRadius: 999,
                      background: t.done ? '#1DB88A' : 'var(--gl-input-bg)',
                      border: `2px solid ${t.done ? '#1DB88A' : 'var(--gl-border-strong)'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {t.done && <Icon name="check" size={8} color="#fff" stroke={3} />}
                    </div>
                    {i < timeline.length - 1 && <div style={{ width: 2, flex: 1, minHeight: 28, background: 'var(--gl-border-strong)' }} />}
                  </div>
                  <div style={{ paddingBottom: 16 }}>
                    <div style={{ fontSize: 13, color: 'var(--gl-fg-1)', fontWeight: 600 }}>{t.label}</div>
                    <div style={{ fontFamily: 'var(--gl-font-mono)', fontSize: 11, color: 'var(--gl-fg-3)', marginTop: 2 }}>{t.who} · {t.at}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card padding={20}>
            <SectionHeader title="Audit Hash" marker="orange" />
            <div style={{
              fontFamily: 'var(--gl-font-mono)', fontSize: 12, color: 'var(--gl-fg-2)',
              wordBreak: 'break-all', lineHeight: 1.6,
            }}>a7f8c2d9e1b3f047a7f8c2d9e1b3f047b161</div>
          </Card>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 8 }}>
        <Button variant="secondary" icon="back" onClick={onBack}>Back to Operations</Button>
      </div>
      <Footer />
    </div>
  );
}

function FoTile({ label, value, currency, accent }) {
  return (
    <div style={{ padding: 18, background: 'var(--gl-bg)', border: '1px solid var(--gl-border)', borderRadius: 6 }}>
      <div style={{ fontWeight: 700, fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--gl-fg-3)', marginBottom: 8 }}>{label}</div>
      <div style={{ fontFamily: 'var(--gl-font-mono)', fontSize: 22, fontWeight: 600, color: accent || 'var(--gl-fg-1)', lineHeight: 1.1 }}>{value}</div>
      <div style={{ fontFamily: 'var(--gl-font-mono)', fontSize: 11, color: 'var(--gl-fg-3)', marginTop: 6 }}>{currency}</div>
    </div>
  );
}

window.JournalEntryDetails = JournalEntryDetails;
window.FinancialOperationDetails = FinancialOperationDetails;
