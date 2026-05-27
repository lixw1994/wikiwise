## Context

`ContentView.fileTreeRow(_:)` marks `home.md`, `index.md`, and `log.md` as special files and renders them with `.font(.system(size: 13, weight: isSpecialFile ? .medium : .regular, design: .serif))`. Electron already applies a `.special-file` class for the same filenames, but the CSS uses `font-weight: 600`, which is heavier than native `.medium`.

## Goals / Non-Goals

**Goals:**
- Match native file-tree special row weight for `home.md`, `index.md`, and `log.md`.
- Keep the existing special file classification and row structure.
- Keep selected row italic styling and accent behavior unchanged.

**Non-Goals:**
- Change folder row typography, selected-row colors, indentation, icons, or tooltip copy.
- Add new special filenames.
- Change file-tree data loading or expansion behavior.

## Decisions

- Use CSS `font-weight: 500` for `.tree-file-button.special-file`, matching SwiftUI `.medium` in this existing visual system.
- Keep the special filename logic in renderer JavaScript unchanged because it already matches native source.
- Extend the file-tree visual test with source-backed assertions for native `.medium` and Electron `500`.

## Risks / Trade-offs

- Font rendering may vary slightly across platforms, but macOS Electron and SwiftUI both map medium weight closer to 500 than 600.
- The assertion remains tied to current Swift source formatting around the special file expression. Keep it focused on the relevant expression rather than the whole row layout.

## Migration Plan

Patch the CSS weight only and keep the change isolated to file-tree visual styling. Rollback is a single CSS line plus test/spec removal.

## Open Questions

None.
