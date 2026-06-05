# GeniusLink — New Flutter Requirements · Build Checklist

Tracking the 10 new requirements for the `geniuslink_design_system_flutter` kit.
Each requirement is one **phase**. Every phase ships **both**:

1. **Interactive HTML demo** — `requirements/phase-NN-*.html` (real drag/copy/select, LTR + RTL toggle where relevant, dark/light), built on the live design-system tokens + `ds-kit.jsx`.
2. **Matching Flutter reference** — edits to the real source under
   `geniuslink_design_system_flutter/lib/design_system/components/…` (+ snippets surfaced inside the demo).

Components in play: **`BrowserStyleTabBar`** (`navigation/`), **`EditableTable`**, **`ReadableTable`**, **`Tree`** (`data/`).

> Hub: `requirements/index.html` · Conventions: tokens are law, MVC controllers stay the single source of truth, every interactive behavior works in both LTR and RTL.

---

## Phase 01 — Fix keyboard shortcut directions (LTR + RTL)  ✅
Arrow keys must map to the **visual** direction in `BrowserStyleTabBar`, `Tree`, `EditableTable`, `ReadableTable`. Right-arrow moves focus right (= previous index in RTL); Tree expand/collapse mirror. Tested in both directions.
- [x] HTML demo · `phase-01-keyboard-directions.html` — all 4 components, LTR/RTL toggle, live key-log
- [x] Flutter: shared `key_directions.dart` (`horizontalStep` / `arrowGoesInto`) threaded into all 4 key handlers via `Directionality.of(context)`

## Phase 02 — Scroll-on-focus  ✅
Focusing a cell/row via keyboard scrolls it into view in `ReadableTable` + `Tree` (both axes, RTL-correct).
- [x] HTML demo · `phase-02-scroll-on-focus.html` — overflowing grid + tall tree, keyboard reveals off-screen focus (live scroll readout)
- [x] Flutter: `ReadableTable` parks a `GlobalKey` on the active cell → `Scrollable.ensureVisible` (both axes); `Tree` `_scrollToFocused` now also fires on ← / → expand/step

## Phase 03 — `EditableTable` generic row type  ✅
Refactor to `EditableTable<T>` / `EditableColumn<T>` so rows are a typed value, not a loose map.
- [x] HTML demo · `phase-03-generic-row-type.html` — typed `Account` grid, edits flow into a live `List<Account>` inspector, before/after API
- [x] Flutter: `editable_table_generic.dart` — generic `EditableColumn<T>` (value/setValue), typed `NumericColumn<T>`/`ComputedColumn<T>`, `EditableTableController<T>`, map-backed `EditableRow` compat. Mirrors the shipped `ReadableTable<T>` pattern

## Phase 04 — Column resizing (Readable + Editable)  ✅
Drag handles on column headers; layout updates live; min/max width; RTL-correct drag.
- [x] HTML demo · `phase-04-column-resizing.html` — real pointer drag-resize, Readable/Editable toggle, reset, live width readout, RTL
- [x] Flutter: `resizeColumn(i, delta)` + `widthOf(i)` on controller; `PositionedDirectional` header handle with RTL-mirrored delta

## Phase 05 — Column reordering (Readable + Editable)  ✅
Drag-and-drop header reorder; underlying column order updates.
- [x] HTML demo · `phase-05-column-reordering.html` — real HTML5 drag-reorder, blue drop indicator, live order array, Readable/Editable toggle, RTL
- [x] Flutter: `order` index list + `moveColumn(from,to)` on controller; horizontal `ReorderableListView` header reading `columnAt(visualIndex)`

## Phase 06 — Column types in `ReadableTable`  ✅
Bring `EditableTable`'s typed column kinds (text/num/date/time/enum/color/…) to `ReadableTable` rendering.
- [x] HTML demo · `phase-06-readable-column-types.html` — one-of-every-type grid (text bilingual, number signed, enum badge, progress, color, date, time, link), sortable headers
- [x] Flutter: `ReadableColumnType` enum + `ReadableColumn.<kind>` factories in models; `ReadableCells` renderers in new `readable_table_cells.dart`. Legacy custom-`cell` constructor untouched

## Phase 07 — Copy rows & cells (TSV)  ✅
Copy single/multi row and single/multi cell as tab-separated values (spreadsheet-ready), both tables.
- [x] HTML demo · `phase-07-copy-rows-cells.html` — real multi-select (⇧ range, ⌘/Ctrl toggle, cell rectangle), real `navigator.clipboard`, live TSV preview + paste-to-verify box
- [x] Flutter: `rowsAsTsv` / `cellsAsTsv` serializers + `copyRowsToClipboard` / `copyCellsToClipboard` on both controllers; `Clipboard.setData`; ⌘C wired in key handlers

## Phase 08 — Single & multi-select in `Tree`  ✅
Shift-click range, Ctrl/⌘-click toggle, checkbox multi-select; selected nodes available for group actions.
- [x] HTML demo · `phase-08-tree-selection.html` — single / multi / checkbox modes, ⇧-range, ⌘/Ctrl-toggle, ⇧+arrows, ⌘A, tri-state folder checks, live group-action panel
- [x] Flutter: `TreeSelectionMode` (none/single/multi) + selection set & anchor on controller; `selectWith(id, toggle, range)`, `selectedNodes`, `selectAllVisible`, `clearSelection`; checkbox layer composes alongside

## Phase 09 — Add & remove nodes in `Tree`  ✅
Buttons + context-menu actions to add/delete nodes; tree data updates correctly.
- [x] HTML demo · `phase-09-tree-add-remove.html` — toolbar + per-row buttons + right-click menu + keyboard; add child/sibling/folder, inline rename, delete subtree, undo
- [x] Flutter: `addChild`/`addSibling`/`remove`/`duplicate` (already present) + new `removeSelected()` for whole-selection delete in one undoable step

## Phase 10 — `BrowserStyleTabBar` state preservation  ✅
Switching tabs must not rebuild/lose page state. Keep each tab's content alive.
- [x] HTML demo · `phase-10-tab-state.html` — keep-alive vs rebuild toggle; memo / stepper / scroll / mount-counter prove state survives switching (mounts stays 1)
- [x] Flutter: pages built once in an `IndexedStack` + `_KeepAliveTabPage` (AutomaticKeepAlive); switch changes visible index only; `lazyPages: true` opts back into single-page build; thumbnail `RepaintBoundary` wraps the stack

---

### 🎉 All 10 phases complete.

---

### Legend
⏳ not started · 🔧 in progress · ✅ done

### Working order
Phases run 01 → 10 in sequence. After each phase: demo verified (dark/light, LTR/RTL), Flutter reference written, this checklist updated, hub card flipped to ✅.
