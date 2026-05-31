# GeniusLink Design System — Flutter Implementation Structure (V2 Stage L)

How the design system maps into a scalable, maintainable Flutter package. The HTML galleries in this folder are the **visual source of truth**; this document is the contract for the Flutter side. **No widget hardcodes a value a token already covers.**

---

## Folder structure

```
lib/
  design_system/
    foundations/
      foundations.md            # narrative: color, type, spacing, grid, motion, a11y, responsive
    tokens/
      tokens.dart               # GLColors, GLFonts, GLType, GLSpace, GLRadius,
                                #   GLShadows, GLDur, GLCurves, GLZ, GLBreak
    themes/
      app_theme.dart            # GLTheme.light / GLTheme.dark (built from tokens)
    components/
      buttons/                  # gl_button.dart, gl_icon_button.dart
      inputs/                   # gl_text_field.dart, gl_search_field.dart, gl_combo_box.dart
      surfaces/                 # gl_card.dart, gl_list_tile.dart, gl_divider.dart
      feedback/                 # gl_snackbar.dart, gl_dialog.dart, gl_bottom_sheet.dart,
                                #   gl_state_view.dart (empty/error/loading/notAllowed/notFound)
      display/                  # gl_avatar.dart, gl_badge.dart, gl_chip.dart, gl_pill.dart
      navigation/               # gl_app_bar.dart, gl_nav_bar.dart, browser_style_tab_bar.dart
      data/                     # gl_chart.dart (+ variants), gl_editable_table.dart
      skeletons/                # gl_skeleton.dart (Bone + presets) , gl_shimmer.dart
      domain/                   # chat_bubble.dart, message_composer.dart, attachment_menu.dart,
                                #   poll_bubble.dart, audio_bubble.dart, file_attachment_card.dart,
                                #   club_card.dart, member_tile.dart, task_card.dart, room_card.dart
    patterns/
      async_state.dart          # AsyncValue<T> → loading/empty/error/data switch
      pagination.dart           # paged list controller + GLPaginator
      confirm.dart              # showGLConfirm() / showGLDeleteConfirm()
      offline_sync.dart         # connectivity banner + pending-changes badge
      upload.dart               # upload controller + progress states
    motion/
      motion.dart               # re-exports GLDur/GLCurves + helpers (glFadeIn, glSlideIn, glStagger)
      reduced_motion.dart       # MediaQuery.disableAnimations gate
    accessibility/
      a11y.dart                 # min-target wrapper, semantics helpers, focus order utilities
    documentation_examples/
      *.dart                    # one runnable example screen per component (the "gallery")
```

---

## Component API design principles

- **Typed, explicit params** — no `Map<String, dynamic>`. Enums for variants/sizes/states:
  ```dart
  enum GLButtonVariant { primary, secondary, danger, ghost }
  enum GLButtonSize { sm, md }
  ```
- **No business-model coupling** — components take primitives + callbacks, never `Account` / `JournalEntry`.
  ```dart
  // ✅ generic
  GLListTile(title: String, subtitle: String?, leading: Widget?, trailing: Widget?, onTap: VoidCallback?)
  // ❌ never:  GLListTile(account: Account)
  ```
- **Small & composable** — a screen = primitives + domain widgets; no 800-line god-widgets.
- **Stateless where possible** — parent owns data; component emits `onChanged` / `onSelect` / `onClose`.
- **Theme-driven** — read `Theme.of(context)` / `GLColors`; light/dark is automatic. RTL via `Directionality` (use `EdgeInsetsDirectional`, `start`/`end`, never `left`/`right`).

### Example signatures

```dart
class GLButton extends StatelessWidget {
  const GLButton({super.key, required this.label, this.icon, this.onPressed,
    this.variant = GLButtonVariant.primary, this.size = GLButtonSize.md, this.loading = false});
}

class GLComboBox<T> extends StatefulWidget {
  const GLComboBox({super.key, required this.options, required this.value,
    required this.onChanged, this.multi = false, this.searchable = true,
    this.asyncLoader, this.errorText, this.enabled = true,
    required this.labelOf, this.descriptionOf, this.iconOf});
}

class GLEditableTable<T> extends StatefulWidget {
  const GLEditableTable({super.key, required this.rows, required this.columns,
    this.onRowSave, this.onRowDelete, this.onAddRow, this.selectable = true,
    this.pageSize = 10, this.state = GLDataState.data}); // data|loading|empty|error
}
```

### Async state → loading/empty/error (one switch everywhere)

```dart
enum GLDataState { loading, empty, error, data }

Widget glAsync<T>(GLDataState s, {required WidgetBuilder data, VoidCallback? onRetry}) =>
  switch (s) {
    GLDataState.loading => const GLSkeletonList(),
    GLDataState.empty   => GLStateView.empty(onAction: …),
    GLDataState.error   => GLStateView.error(onRetry: onRetry),
    GLDataState.data    => Builder(builder: data),
  };
```

The fully-worked widget lives in `BrowserStyleTabBar.dart` (Stage D) — use it as the reference implementation for tokens usage, semantics, RTL and animated state.

---

## Wiring it up

```dart
MaterialApp(
  theme: GLTheme.light,
  darkTheme: GLTheme.dark,
  themeMode: ThemeMode.system,
  supportedLocales: const [Locale('en'), Locale('ar')],
  localizationsDelegates: GlobalMaterialLocalizations.delegates,
  // Directionality flips automatically with the active locale.
)
```

---

## Long-term maintenance

1. **Single source of tokens** — `tokens.dart` mirrors `tokens.css`; a token change ripples everywhere. Keep them in sync (ideally generate one from the other in CI).
2. **One component, one file, one doc** — each `components/**` widget ships with a `documentation_examples/` screen and a `docs/<Component>.md` from the template in `DESIGN_SYSTEM.md`.
3. **States are first-class** — every data component implements the `GLDataState` switch; chat/media use shared status enums (`GLSendStatus`, `GLUploadStatus`).
4. **Test matrix in widget tests** — golden tests per component across: dark/light × LTR/RTL × each state × reduced-motion × 1.0/2.0 text scale.
5. **Additive evolution** — add variants via enum values, not new widgets; deprecate with `@Deprecated` + a migration note rather than breaking.
6. **Accessibility gate in CI** — assert min 44px targets and presence of semantic labels on interactive widgets.
