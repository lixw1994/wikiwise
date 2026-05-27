## Why

Native SwiftUI draws file-tree folder icons with `context.stroke(..., lineWidth: 0.8 * s)`, which is about 0.74px for the 13px sidebar icon. Electron still uses 1px borders for the folder body and tab, making the icons slightly heavier than native.

## What Changes

- Align Electron folder icon body and tab stroke width with native `FolderIcon(size: 13)` scaled stroke width.
- Preserve the already-aligned native icon aspect, special-folder marker geometry, colors, special-folder membership, row typography, indentation, and expansion behavior.
- Add source-backed regression coverage anchored to native `0.8 * s` stroke geometry.

## Capabilities

### New Capabilities

### Modified Capabilities

- `electron-file-tree-visual-parity`: Folder icon stroke weight now matches native scaled `FolderIcon(size: 13)` geometry.
- `electron-native-parity-roadmap`: Track this folder-icon stroke parity slice and retained verification evidence.

## Impact

- Electron renderer CSS in `apps/electron/src/renderer/styles.css`.
- Electron file-tree visual regression tests in `apps/electron/test/file-tree-expansion-parity.test.js`.
- OpenSpec delta specs and roadmap tracking for the Electron native parity migration.
