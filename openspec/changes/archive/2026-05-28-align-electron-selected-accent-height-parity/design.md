## Context

`ContentView.fileTreeRow(_:)` renders the selected file row background with `Color.sidebarSelectedBg.overlay(alignment: .leading)`, then places a `Rectangle()` with `.frame(width: 2)` and `.padding(.leading, indent + 4)`. The native selected accent has no top or bottom padding, so it fills the selected row background height.

Electron already creates a `.tree-selected-accent` span with the correct 2px width and leading offset, but CSS sets `top: 5px` and `bottom: 5px`, shortening the accent to the label area instead of the full selected row.

## Goals / Non-Goals

**Goals:**
- Match native selected file accent height by spanning the full selected row background.
- Preserve the current native leading offset formula: `22px + depth * 16px`.
- Preserve existing selected row background, italic label, typography, row padding, and expansion behavior.

**Non-Goals:**
- Change selected colors, row indentation, special file treatment, folder icons, tooltips, or file-tree loading behavior.
- Change runtime audit structure beyond the existing selected-accent presence evidence.
- Revisit broader sidebar layout or publish/preview behavior.

## Decisions

- Set `.tree-selected-accent` to `top: 0` and `bottom: 0` so it fills the positioned `.tree-file-button` selected row.
- Keep `width: 2px` and `left: calc(22px + (var(--tree-depth, 0) * 16px))` unchanged because those already mirror native `.frame(width: 2)` and `indent + 4`.
- Add a focused CSS/source regression test that fails on the old 5px vertical inset.

## Risks / Trade-offs

- The selected accent will be taller than before, by design, and should visually match the native overlay more closely.
- The test remains source-backed to the current SwiftUI structure; if native selection styling changes later, the Electron requirement should be intentionally revisited.

## Migration Plan

Patch only the `.tree-selected-accent` vertical positioning and keep the change isolated to file-tree visual styling. Rollback is limited to the CSS positioning plus the associated test/spec delta.

## Open Questions

None.
