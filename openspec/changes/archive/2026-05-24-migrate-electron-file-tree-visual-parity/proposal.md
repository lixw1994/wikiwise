## Why

The native SwiftUI file tree uses a custom folder icon, special raw/site folder styling, and a 2px selected-file accent bar. The Electron file tree currently renders mostly text-only rows, leaving a visible gap in the project browser.

## What Changes

- Add native-like folder icons to Electron directory rows.
- Distinguish `raw` and `site` folders with the same special folder tone and center dot used by the SwiftUI `FolderIcon`.
- Add the selected-file leading accent bar while preserving selected background, italic text, and tree indentation.
- Extend runtime audit evidence so project scenarios verify folder icon, special-folder marker, and selected-row accent presence.

## Capabilities

### New Capabilities

- `electron-file-tree-visual-parity`: Covers Electron file tree visual parity for folder icons, special folder markers, and selected row accents.

### Modified Capabilities

- `electron-native-parity-roadmap`: Records file-tree visual parity as a native visual gap closure phase.
- `electron-file-tree-expansion-parity`: Extends the file tree surface to include native visual row affordances.
- `electron-runtime-parity-audit`: Adds runtime evidence for file-tree visual markers.

## Impact

- `apps/electron/src/renderer/renderer.js`: Emits folder icon and selected accent markup while preserving existing tree state and events.
- `apps/electron/src/renderer/styles.css`: Adds folder icon CSS, special folder dot styling, and selected row accent positioning.
- `scripts/audit-electron-runtime.mjs`: Captures file tree visual evidence in project scenarios.
- Electron tests and OpenSpec specs document and verify the visual parity layer.
