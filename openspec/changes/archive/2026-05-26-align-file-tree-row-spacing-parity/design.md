## Context

Native `ContentView.fileTreeRow` nests folder children inside `VStack(alignment: .leading, spacing: 0)`, and the sidebar root container also uses `VStack(alignment: .leading, spacing: 0)`. Per-row vertical rhythm comes from each row's `.padding(.vertical, 5)`, not from extra space between rows.

Electron already mirrors the native row padding and indentation, but `.file-tree` and `.tree-children` set `gap: 1px`. That creates additional inter-row spacing on both top-level and nested file-tree rows.

## Goals / Non-Goals

**Goals:**

- Match native root file-tree row spacing by setting `.file-tree` to zero gap.
- Match native nested file-tree row spacing by setting `.tree-children` to zero gap.
- Preserve existing row padding, folder affordances, selected-file accent geometry, and tree behavior.

**Non-Goals:**

- Changing row padding, row font, indentation, disclosure icons, or selected-row styling.
- Changing tree expansion, lazy loading, active-file persistence, or file navigation.
- Changing left-sidebar width, visibility, or resize behavior.

## Decisions

- Use `gap: 0` for both `.file-tree` and `.tree-children`, matching the SwiftUI `spacing: 0` root and nested containers.
- Add a source parity test that checks the native zero-spacing declarations and asserts the Electron CSS no longer uses `1px` grid gaps.

## Risks / Trade-offs

- File rows become 1px denser than before. This is intentional parity with the native file browser, where row padding supplies the full vertical rhythm.
