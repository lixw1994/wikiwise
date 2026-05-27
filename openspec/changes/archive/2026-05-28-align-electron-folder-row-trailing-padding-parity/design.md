## Context

The native SwiftUI `fileTreeRow` layout treats folder and file rows differently at the trailing edge. Folder rows apply `.padding(.leading, indent)` and `.padding(.vertical, 5)` only, while file rows apply `.padding(.leading, indent + 15)`, `.padding(.vertical, 5)`, and `.padding(.trailing, 8)`. Electron currently puts `padding: 5px 8px 5px ...` on the shared `.tree-row` rule, so folder and file rows both inherit the file-row trailing inset.

## Goals / Non-Goals

**Goals:**
- Match native folder-row trailing padding by removing the trailing inset from Electron folder rows.
- Keep the native file-row 8px trailing inset.
- Preserve existing indentation, vertical padding, selected-file accent alignment, typography, folder icon styling, and expansion behavior.
- Retain source-backed regression coverage and OpenSpec verification evidence.

**Non-Goals:**
- Redesign file-tree markup or interaction behavior.
- Change native SwiftUI code.
- Change selection, loading, watcher, package, or release workflows.

## Decisions

- Keep `.tree-row` as the shared baseline for row width, vertical padding, and depth-based leading padding, but remove the shared right padding. This mirrors folder rows because `.tree-folder-button` uses the shared baseline directly.
- Add an explicit `padding-right: 8px` to `.tree-file-button`. This mirrors the native file-row-only `.padding(.trailing, 8)` while preserving the existing selected row background and accent.
- Cover the behavior with a source-backed test that reads both `ContentView.swift` and `styles.css`, proving the native folder row has no trailing padding, the native file row has 8px trailing padding, and Electron applies the inset only on file rows.

## Risks / Trade-offs

- Pixel-level CSS padding assertions are source-based rather than rendered screenshots. Mitigation: keep the runtime audit in the verification set so live project scenarios still execute after the CSS change.
- Moving padding from the shared rule could accidentally affect file-row ellipsis or selected background width. Mitigation: explicitly preserve `padding-right: 8px` on `.tree-file-button` and run the full Electron test suite plus runtime audit.
