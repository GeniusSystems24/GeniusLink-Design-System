// ============================================================
// BrowserStyleTabBar — Flutter reference (V2 Stage D, documentation)
// Mirrors design_system/BrowserTabs.jsx. Generic & reusable; reads
// GL* tokens, supports light/dark via Theme and RTL via Directionality.
//   File: lib/design_system/components/browser_style_tab_bar.dart
// ============================================================

import 'package:flutter/material.dart';
import '../tokens/tokens.dart';

class BrowserTab {
  final String id;
  final String title;
  final IconData icon;
  final bool dirty; // unsaved-changes indicator
  const BrowserTab({required this.id, required this.title, required this.icon, this.dirty = false});
}

/// Horizontal browser-style tab strip. Stateless: parent owns [tabs] &
/// [activeId]. Emits select / close / add callbacks.
class BrowserStyleTabBar extends StatelessWidget {
  final List<BrowserTab> tabs;
  final String activeId;
  final ValueChanged<String> onSelect;
  final ValueChanged<String> onClose;
  final VoidCallback onAdd;
  /// When non-null, tabs become drag-reorderable. Receives old & new index.
  final void Function(int fromIndex, int toIndex)? onReorder;

  const BrowserStyleTabBar({
    super.key,
    required this.tabs,
    required this.activeId,
    required this.onSelect,
    required this.onClose,
    required this.onAdd,
    this.onReorder, // (fromIndex, toIndex) — enables drag-to-reorder when provided
  });

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    return Container(
      color: scheme.background, // darker top container
      padding: const EdgeInsets.fromLTRB(GLSpace.s2, GLSpace.s2, GLSpace.s2, 0),
      child: Row(
        children: [
          Expanded(
            child: SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: Row(
                children: [
                  for (int i = 0; i < tabs.length; i++)
                    _maybeDraggable(
                      context, i,
                      _TabChip(
                        tab: tabs[i],
                        active: tabs[i].id == activeId,
                        onSelect: () => onSelect(tabs[i].id),
                        onClose: () => onClose(tabs[i].id),
                      ),
                    ),
                ],
              ),
            ),
          ),
          // add (+) button
          Semantics(
            button: true, label: 'New tab',
            child: IconButton(
              iconSize: 16,
              constraints: const BoxConstraints.tightFor(width: 32, height: 32),
              icon: const Icon(Icons.add),
              color: scheme.onSurface.withOpacity(0.6),
              onPressed: onAdd,
            ),
          ),
        ],
      ),
    );
  }

  /// Wraps [child] in a Draggable + DragTarget so tabs can be reordered.
  /// No-op passthrough when [onReorder] is null.
  Widget _maybeDraggable(BuildContext context, int index, Widget child) {
    if (onReorder == null) return child;
    final feedbackChild = Material(
      color: Colors.transparent,
      child: Opacity(opacity: 0.9, child: child),
    );
    return DragTarget<int>(
      onWillAcceptWithDetails: (d) => d.data != index,
      onAcceptWithDetails: (d) => onReorder!(d.data, index),
      builder: (ctx, candidate, rejected) {
        final highlighted = candidate.isNotEmpty;
        return Container(
          decoration: BoxDecoration(
            border: BorderDirectional(
              start: BorderSide(
                color: highlighted ? GLColors.blue500 : Colors.transparent,
                width: 2,
              ),
            ),
          ),
          child: LongPressDraggable<int>(
            data: index,
            axis: Axis.horizontal,
            feedback: feedbackChild,
            childWhenDragging: Opacity(opacity: 0.4, child: child),
            child: child,
          ),
        );
      },
    );
  }
}

class _TabChip extends StatefulWidget {
  final BrowserTab tab;
  final bool active;
  final VoidCallback onSelect, onClose;
  const _TabChip({required this.tab, required this.active, required this.onSelect, required this.onClose});
  @override
  State<_TabChip> createState() => _TabChipState();
}

class _TabChipState extends State<_TabChip> {
  bool _hover = false;
  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    final active = widget.active;
    final bg = active
        ? scheme.surface
        : (_hover ? scheme.onSurface.withOpacity(0.06) : Colors.transparent);

    return MouseRegion(
      onEnter: (_) => setState(() => _hover = true),
      onExit: (_) => setState(() => _hover = false),
      child: Semantics(
        selected: active, button: true, label: widget.tab.title,
        child: GestureDetector(
          onTap: widget.onSelect,
          child: AnimatedContainer(
            duration: GLDur.base,
            curve: GLCurves.standard,
            constraints: const BoxConstraints(minWidth: 120, maxWidth: 200),
            height: 36,
            padding: const EdgeInsetsDirectional.only(start: 12, end: 8),
            decoration: BoxDecoration(
              color: bg,
              borderRadius: const BorderRadius.vertical(top: Radius.circular(9)),
            ),
            child: Row(
              children: [
                Icon(widget.tab.icon, size: 14, color: active ? GLColors.blue500 : scheme.onSurface.withOpacity(0.5)),
                const SizedBox(width: 8),
                Expanded(
                  child: Tooltip(
                    message: widget.tab.title, // tooltip for long titles
                    child: Text(
                      widget.tab.title,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis, // truncation
                      style: GLType.body14.copyWith(
                        fontSize: 13,
                        fontWeight: active ? FontWeight.w600 : FontWeight.w500,
                        color: active ? scheme.onSurface : scheme.onSurface.withOpacity(0.6),
                      ),
                    ),
                  ),
                ),
                // dirty dot, or close button on hover/active
                if (widget.tab.dirty && !_hover)
                  Container(width: 8, height: 8, margin: const EdgeInsetsDirectional.only(end: 4),
                    decoration: const BoxDecoration(color: GLColors.warning, shape: BoxShape.circle))
                else if (_hover || active)
                  Semantics(button: true, label: 'Close tab',
                    child: InkWell(
                      borderRadius: BorderRadius.circular(5),
                      onTap: widget.onClose,
                      child: const Padding(padding: EdgeInsets.all(3), child: Icon(Icons.close, size: 12)),
                    )),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

// ---- Usage ----------------------------------------------------
// class _WorkspaceState extends State<Workspace> {
//   final _tabs = <BrowserTab>[ BrowserTab(id: '1', title: 'Chart of Accounts', icon: Icons.menu_book) ];
//   String _active = '1'; int _seed = 1;
//   @override Widget build(BuildContext c) => BrowserStyleTabBar(
//     tabs: _tabs, activeId: _active,
//     onSelect: (id) => setState(() => _active = id),
//     onClose: (id) => setState(() { _tabs.removeWhere((t) => t.id == id); /* pick neighbour */ }),
//     onAdd: () => setState(() { final id = '${++_seed}'; _tabs.add(BrowserTab(id: id, title: 'New Tab', icon: Icons.public)); _active = id; }),
//     // drag-to-reorder: omit onReorder to disable
//     onReorder: (from, to) => setState(() { final t = _tabs.removeAt(from); _tabs.insert(to, t); }),
//   );
// }
