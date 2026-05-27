## Why

Native SwiftUI renders file-tree folder icons through `FolderIcon(size: 13)`, whose canvas height and special-folder dot are scaled from the original 14-by-12 SVG coordinate system. Electron currently uses rounded CSS boxes with an 11px body height and a 3px dot, leaving a small but visible aspect and marker-size mismatch.

## What Changes

- Align Electron folder icon body height with native `size * (12.0 / 14.0)` for the 13px sidebar icon.
- Align the special raw/site folder dot size and center point with the native 14pt SVG coordinates.
- Preserve folder icon width, stroke/fill colors, special-folder membership, folder row typography, disclosure marker, indentation, and expansion behavior.
- Add source-backed regression coverage anchored to native `FolderIcon(size: 13)` and its special-folder dot geometry.

## Capabilities

### New Capabilities

### Modified Capabilities

- `electron-file-tree-visual-parity`: Folder icon aspect and special marker geometry now match the native scaled SVG coordinates.
- `electron-native-parity-roadmap`: Track this folder-icon geometry parity slice and retained verification evidence.

## Impact

- Electron renderer CSS in `apps/electron/src/renderer/styles.css`.
- Electron file-tree visual regression tests in `apps/electron/test/file-tree-expansion-parity.test.js`.
- OpenSpec delta specs and roadmap tracking for the Electron native parity migration.
