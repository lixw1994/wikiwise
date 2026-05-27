## Why

Native SwiftUI gives `home.md`, `index.md`, and `log.md` file-tree rows a `.medium` font weight, but Electron currently styles those special file rows with a heavier CSS weight. This creates a small but visible sidebar typography mismatch in the Electron shell.

## What Changes

- Align Electron special file row font weight with native SwiftUI `.medium` weight.
- Preserve the existing special file set: `home.md`, `index.md`, and `log.md`.
- Preserve folder icons, selected row accent, serif file typography, spacing, indentation, and row selection behavior.
- Add source-backed regression coverage anchored to the native `isSpecialFile ? .medium : .regular` expression.

## Capabilities

### New Capabilities

### Modified Capabilities

- `electron-file-tree-visual-parity`: Special file rows now match native medium typography.
- `electron-native-parity-roadmap`: Track this file-tree special-row typography parity slice and retained verification evidence.

## Impact

- Electron renderer CSS in `apps/electron/src/renderer/styles.css`.
- Electron file-tree visual regression tests in `apps/electron/test/file-tree-expansion-parity.test.js`.
- OpenSpec delta specs and roadmap tracking for the Electron native parity migration.
