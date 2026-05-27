## Context

`ContentView.fileTreeRow(_:)` renders folder labels with `.font(.system(size: 13, weight: .regular, design: .serif))` and file labels with `.font(.system(size: 13, weight: isSpecialFile ? .medium : .regular, design: .serif))`. Electron's `.tree-folder-button` and `.tree-file-button` rules set `font-family: Georgia, serif`, but they do not set a native-sized 13px label size or explicit regular weight for non-special rows.

## Goals / Non-Goals

**Goals:**
- Match native file-tree folder label typography at 13px regular serif.
- Match native regular file label typography at 13px regular serif.
- Keep special file rows at the existing native medium CSS weight.

**Non-Goals:**
- Change file-tree spacing, indentation, folder icons, tooltip copy, selected-row colors, or selected italic styling.
- Change file-tree data loading, expansion, refresh, or navigation behavior.
- Revisit standalone file preview/publish semantics.

## Decisions

- Add explicit `font-size: 13px` and `font-weight: 400` to `.tree-folder-button`.
- Add explicit `font-size: 13px` and `font-weight: 400` to `.tree-file-button`, allowing `.tree-file-button.special-file { font-weight: 500; }` to continue representing native `.medium`.
- Keep the source-backed regression test focused on the native Swift typography calls and the corresponding Electron CSS rules.

## Risks / Trade-offs

- Browser and SwiftUI font rendering are not pixel-identical, but the existing Electron visual system already uses Georgia as the serif stand-in. This change corrects the size and weight mismatch without changing the family decision.
- Explicit font weights make the CSS less dependent on inherited button defaults, which is more stable for this native parity surface.

## Migration Plan

Patch only file-tree CSS typography rules and keep the regression coverage in the existing file-tree parity test suite. Rollback is limited to the two CSS rule additions plus the associated test/spec delta.

## Open Questions

None.
