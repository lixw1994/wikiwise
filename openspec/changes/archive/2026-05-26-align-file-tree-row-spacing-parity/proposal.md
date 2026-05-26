## Why

The native macOS file tree lays out root rows and expanded child rows with SwiftUI `VStack(..., spacing: 0)`. Electron currently renders `.file-tree` and `.tree-children` as CSS grids with a `1px` gap, adding extra vertical separation that makes the project browser less dense than the native app.

## What Changes

- Remove the Electron file-tree grid gap for root rows.
- Remove the Electron nested child-row grid gap.
- Preserve the existing row padding, disclosure/folder/icon styling, indentation math, selected-file accent, and expansion behavior.
- Add parity coverage tying the Electron CSS to the native SwiftUI `spacing: 0` source.

## Capabilities

### New Capabilities
- None.

### Modified Capabilities
- `electron-file-tree-visual-parity`: file-tree root and nested row spacing must match native SwiftUI zero-spacing layout.

## Impact

- Affected Electron renderer CSS: `apps/electron/src/renderer/styles.css`.
- Affected parity tests: `apps/electron/test/native-shell-parity.test.js`.
- No IPC, tree scanning, selection, expansion, packaging, or Swift runtime changes.
