## Why

Native SwiftUI renders file-tree folder and file labels with 13pt regular serif typography, while Electron currently only sets the serif family on those buttons. Because Electron buttons inherit the global 16px shell font size, the sidebar file tree appears larger than the native macOS app.

## What Changes

- Align Electron file-tree folder and regular file row typography with native 13px regular serif labels.
- Preserve the existing special-file medium weight override for `home.md`, `index.md`, and `log.md`.
- Preserve file-tree indentation, row padding, selected-row italic styling, selected accent, folder icons, and expansion behavior.
- Add source-backed regression coverage anchored to native `fileTreeRow(_:)` typography.

## Capabilities

### New Capabilities

### Modified Capabilities

- `electron-file-tree-visual-parity`: File-tree folder and file labels now match native 13px regular serif typography.
- `electron-native-parity-roadmap`: Track this sidebar typography parity slice and retained verification evidence.

## Impact

- Electron renderer CSS in `apps/electron/src/renderer/styles.css`.
- Electron file-tree visual regression tests in `apps/electron/test/file-tree-expansion-parity.test.js`.
- OpenSpec delta specs and roadmap tracking for the Electron native parity migration.
