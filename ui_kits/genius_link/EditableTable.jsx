/* global React, Icon, Button, IconBtn */
// Shared Excel-style editable table.
// Based on the design system's components-table.html spreadsheet grid.
//
// Usage:
//   <EditableTable
//     columns={[
//       { key: 'sku',    label: 'SKU',     w: 130, mono: true, type: 'text', required: true },
//       { key: 'name',   label: 'Account', w: 240, type: 'text' },
//       { key: 'type',   label: 'Type',    w: 140, type: 'enum', opts: ['Asset','Liability'] },
//       { key: 'amount', label: 'Amount',  w: 140, align: 'right', mono: true, type: 'num' },
//     ]}
//     rows={rows}
//     onChange={setRows}
//     numbered            // show 01/02… row gutter
//     deleteCol           // show inline trash button in last column
//     addRowLabel="Add line"
//     emptyRow={() => ({ sku: '', name: '', type: 'Asset', amount: '' })}
//   />

const EDITABLE_TABLE_LETTERS = (i) => {
  let s = '';
  i = i + 1;
  while (i > 0) { const r = (i - 1) % 26; s = String.fromCharCode(65 + r) + s; i = Math.floor((i - 1) / 26); }
  return s;
};

function EditableTable({
  columns,
  rows,
  onChange,
  numbered = true,
  deleteCol = true,
  addRowLabel = 'Add Row',
  emptyRow,
  minRows = 1,
  footer,           // optional: arbitrary content rendered inside the grid wrapper bottom strip
  showFormulaBar = true,
}) {
  const blank = React.useCallback(() => {
    if (emptyRow) return emptyRow();
    const r = {};
    columns.forEach(c => { r[c.key] = c.type === 'enum' && c.opts ? c.opts[0] : ''; });
    return r;
  }, [columns, emptyRow]);

  // Ensure at least minRows
  React.useEffect(() => {
    if (rows.length < minRows) {
      const need = minRows - rows.length;
      const add = Array.from({ length: need }, blank);
      onChange([...rows, ...add]);
    }
  }, [rows.length, minRows]); // eslint-disable-line

  const [sel, setSel] = React.useState({ r: 0, c: 0 });
  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState('');
  const wrapRef = React.useRef(null);
  const inputRef = React.useRef(null);

  const nRows = rows.length;
  const nCols = columns.length;

  const focusGrid = () => { if (wrapRef.current) wrapRef.current.focus(); };
  React.useEffect(() => { if (editing && inputRef.current) inputRef.current.focus(); }, [editing]);

  const setCell = (r, c, val) => {
    const next = rows.map((row, i) => i === r ? { ...row, [columns[c].key]: val } : row);
    onChange(next);
  };

  const addRow = () => {
    onChange([...rows, blank()]);
    setSel({ r: nRows, c: 0 });
    setTimeout(focusGrid, 0);
  };

  const delRow = (idx) => {
    const target = idx == null ? sel.r : idx;
    if (nRows <= minRows) {
      // reset that row to blank rather than going below floor
      const next = rows.map((row, i) => i === target ? blank() : row);
      onChange(next);
      setSel({ r: target, c: 0 });
      return;
    }
    onChange(rows.filter((_, i) => i !== target));
    setSel(s => ({ r: Math.min(s.r, nRows - 2), c: s.c }));
    focusGrid();
  };

  const beginEdit = (initial) => {
    const cur = rows[sel.r]?.[columns[sel.c].key] ?? '';
    setDraft(initial != null ? initial : String(cur));
    setEditing(true);
  };
  const commit = (move) => {
    setCell(sel.r, sel.c, draft);
    setEditing(false);
    if (move) moveSel(move.dr, move.dc, true);
    focusGrid();
  };
  const cancel = () => { setEditing(false); focusGrid(); };

  const moveSel = (dr, dc, autoAddRow) => {
    setSel(s => {
      let r = s.r + dr, c = s.c + dc;
      if (c < 0) { c = nCols - 1; r -= 1; }
      if (c >= nCols) { c = 0; r += 1; }
      if (r < 0) r = 0;
      if (r >= nRows) {
        if (autoAddRow) { onChange([...rows, blank()]); }
        else { r = nRows - 1; }
      }
      return { r: Math.max(0, r), c: Math.max(0, Math.min(c, nCols - 1)) };
    });
  };

  const onKeyDown = (e) => {
    if (editing) {
      if (e.key === 'Enter') { e.preventDefault(); commit({ dr: 1, dc: 0 }); }
      else if (e.key === 'Tab') { e.preventDefault(); commit({ dr: 0, dc: e.shiftKey ? -1 : 1 }); }
      else if (e.key === 'Escape') { e.preventDefault(); cancel(); }
      return;
    }
    switch (e.key) {
      case 'ArrowUp':    e.preventDefault(); moveSel(-1, 0); break;
      case 'ArrowDown':  e.preventDefault(); moveSel(1, 0); break;
      case 'ArrowLeft':  e.preventDefault(); moveSel(0, -1); break;
      case 'ArrowRight': e.preventDefault(); moveSel(0, 1); break;
      case 'Tab':        e.preventDefault(); moveSel(0, e.shiftKey ? -1 : 1); break;
      case 'Enter':      e.preventDefault(); beginEdit(); break;
      case 'Backspace':
      case 'Delete':     e.preventDefault(); setCell(sel.r, sel.c, ''); break;
      default:
        if (e.key.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey) {
          beginEdit(e.key === ' ' ? '' : e.key);
        }
    }
  };

  const activeCol = columns[sel.c] || columns[0];
  const gutterW = numbered ? 40 : 0;
  const delW = deleteCol ? 40 : 0;
  const gridTemplate = `${gutterW ? gutterW + 'px ' : ''}${columns.map(c => c.w + 'px').join(' ')}${delW ? ' ' + delW + 'px' : ''}`;
  const totalW = gutterW + columns.reduce((s, c) => s + c.w, 0) + delW;

  const hStyle = (active) => ({
    padding: '9px 10px', fontWeight: 700, fontSize: 10, letterSpacing: '0.05em',
    textTransform: 'uppercase',
    color: active ? '#4A7CFF' : 'var(--gl-fg-3)',
    borderBottom: '1px solid var(--gl-border-strong)',
    background: active ? 'rgba(74,124,255,0.08)' : 'var(--gl-bg)',
    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
  });
  const gutStyle = (active) => ({
    display: 'flex', alignItems: 'center', justifyContent: 'center', height: 36,
    fontFamily: 'var(--gl-font-mono)', fontSize: 11,
    color: active ? '#4A7CFF' : 'var(--gl-fg-3)',
    fontWeight: active ? 700 : 400,
    background: active ? 'rgba(74,124,255,0.08)' : 'var(--gl-bg)',
    borderInlineEnd: '1px solid var(--gl-border-strong)',
    borderBottom: '1px solid var(--gl-border)',
    cursor: 'pointer',
  });
  const inStyle = (c) => ({
    width: '100%', height: '100%', padding: '0 9px',
    background: 'var(--gl-surface)', border: 'none', outline: 'none',
    fontFamily: c.mono ? 'var(--gl-font-mono)' : 'var(--gl-font-body)',
    fontSize: 13, color: 'var(--gl-fg-1)',
    textAlign: c.align === 'right' ? 'right' : 'left',
    boxSizing: 'border-box',
  });

  return (
    <div style={{ width: '100%' }}>
      {/* Formula bar */}
      {showFormulaBar && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, flexWrap: 'wrap' }}>
          <span style={{
            fontFamily: 'var(--gl-font-mono)', fontSize: 12, fontWeight: 700,
            color: 'var(--gl-fg-2)', minWidth: 44, textAlign: 'center',
            padding: '6px 10px', background: 'var(--gl-input-bg)',
            border: '1px solid var(--gl-border-strong)', borderRadius: 4,
          }}>{EDITABLE_TABLE_LETTERS(sel.c)}{sel.r + 1}</span>
          <div style={{
            flex: 1, minWidth: 180, height: 34, display: 'flex', alignItems: 'center',
            padding: '0 12px', background: 'var(--gl-input-bg)',
            border: '1px solid var(--gl-border)', borderRadius: 4,
            fontFamily: activeCol.mono ? 'var(--gl-font-mono)' : 'var(--gl-font-body)',
            fontSize: 13, color: 'var(--gl-fg-1)',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {editing
              ? draft
              : (rows[sel.r]?.[activeCol.key] !== '' && rows[sel.r]?.[activeCol.key] != null
                ? rows[sel.r][activeCol.key]
                : <span style={{ color: 'var(--gl-fg-4)' }}>empty</span>)}
          </div>
          <Button variant="secondary" icon="plus" onClick={addRow}>{addRowLabel}</Button>
        </div>
      )}

      {/* Grid */}
      <div ref={wrapRef} tabIndex={0} onKeyDown={onKeyDown}
        style={{
          width: '100%', maxWidth: '100%', overflowX: 'auto',
          border: '1px solid var(--gl-border-strong)', borderRadius: 6,
          userSelect: 'none', outline: 'none',
        }}>
        {/* Header row */}
        <div style={{ display: 'grid', gridTemplateColumns: gridTemplate, minWidth: totalW }}>
          {numbered && <div style={{ ...hStyle(false), borderInlineEnd: '1px solid var(--gl-border)' }}></div>}
          {columns.map((c, ci) => (
            <div key={c.key} style={{
              ...hStyle(ci === sel.c),
              textAlign: c.align || 'left',
              borderInlineEnd: (ci < nCols - 1 || deleteCol) ? '1px solid var(--gl-border)' : 'none',
            }}>
              {EDITABLE_TABLE_LETTERS(ci)} · {c.label}
              {c.required && <span style={{ color: '#EF4444' }}> *</span>}
            </div>
          ))}
          {deleteCol && <div style={hStyle(false)}></div>}
        </div>

        {/* Body rows */}
        {rows.map((row, r) => (
          <div key={r} style={{ display: 'grid', gridTemplateColumns: gridTemplate, minWidth: totalW }}>
            {numbered && (
              <div onClick={() => { setSel({ r, c: 0 }); focusGrid(); }} style={gutStyle(r === sel.r)}>
                {String(r + 1).padStart(2, '0')}
              </div>
            )}
            {columns.map((c, ci) => {
              const active = sel.r === r && sel.c === ci;
              const isEditing = active && editing;
              const val = row[c.key];
              const invalid = c.required && !String(val || '').trim();
              return (
                <div key={c.key}
                  onMouseDown={() => { if (!isEditing) setSel({ r, c: ci }); }}
                  onDoubleClick={() => { setSel({ r, c: ci }); beginEdit(); }}
                  style={{
                    position: 'relative', height: 36,
                    padding: isEditing ? 0 : '0 10px',
                    display: 'flex', alignItems: 'center',
                    justifyContent: c.align === 'right' ? 'flex-end' : 'flex-start',
                    borderInlineEnd: (ci < nCols - 1 || deleteCol) ? '1px solid var(--gl-border)' : 'none',
                    borderBottom: '1px solid var(--gl-border)',
                    background: active ? 'rgba(74,124,255,0.10)' : 'var(--gl-surface)',
                    boxShadow: active
                      ? 'inset 0 0 0 2px #4A7CFF'
                      : (invalid ? 'inset 0 0 0 1px rgba(239,68,68,0.6)' : 'none'),
                    fontFamily: c.mono ? 'var(--gl-font-mono)' : 'var(--gl-font-body)',
                    fontSize: 13,
                    color: val ? 'var(--gl-fg-1)' : 'var(--gl-fg-4)',
                    cursor: 'cell', zIndex: active ? 2 : 1,
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  }}>
                  {isEditing ? (
                    c.type === 'enum' && c.opts ? (
                      <select ref={inputRef} value={draft}
                        onChange={e => setDraft(e.target.value)}
                        onBlur={() => commit()} style={inStyle(c)}>
                        {c.opts.map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                    ) : (
                      <input ref={inputRef} value={draft}
                        onChange={e => setDraft(e.target.value)}
                        onBlur={() => commit()}
                        inputMode={c.type === 'num' ? 'decimal' : 'text'}
                        style={inStyle(c)} />
                    )
                  ) : (
                    val !== '' && val != null ? String(val) : (c.placeholder || '')
                  )}
                </div>
              );
            })}
            {deleteCol && (
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderBottom: '1px solid var(--gl-border)',
                background: r === sel.r ? 'rgba(74,124,255,0.05)' : 'var(--gl-surface)',
              }}>
                <button onClick={(e) => { e.stopPropagation(); delRow(r); }}
                  title="Delete row"
                  style={{
                    width: 26, height: 26, padding: 0,
                    background: 'transparent', border: 'none',
                    borderRadius: 4, cursor: 'pointer',
                    color: 'var(--gl-fg-3)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.12)'; e.currentTarget.style.color = '#EF4444'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--gl-fg-3)'; }}>
                  <Icon name="trash" size={13} />
                </button>
              </div>
            )}
          </div>
        ))}

        {/* "click to add" trailing row */}
        <div onClick={addRow}
          style={{
            display: 'grid', gridTemplateColumns: gridTemplate, minWidth: totalW,
            cursor: 'pointer', background: 'var(--gl-bg)',
          }}>
          {numbered && (
            <div style={{
              ...gutStyle(false),
              background: 'var(--gl-bg)',
              color: 'var(--gl-fg-4)', borderBottom: 'none',
            }}>+</div>
          )}
          <div style={{
            gridColumn: `${numbered ? '2' : '1'} / -1`,
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 14px',
            fontSize: 12, color: 'var(--gl-fg-3)',
            fontStyle: 'italic',
          }}>
            <Icon name="plus" size={12} /> Click here or start typing to add a row
          </div>
        </div>
      </div>

      {/* Status / footer */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginTop: 10, flexWrap: 'wrap', gap: 12,
      }}>
        <span style={{ fontSize: 12, color: 'var(--gl-fg-3)' }}>
          {nRows} row{nRows === 1 ? '' : 's'} · click a cell then type · Enter ↓ · Tab → · Esc cancels · Del clears
        </span>
        {footer}
      </div>
    </div>
  );
}

window.EditableTable = EditableTable;
