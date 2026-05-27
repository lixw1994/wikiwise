## Why

Native SwiftUI renders the selected file-tree accent as a full-height 2px leading rectangle inside the selected row background, but Electron currently insets that accent by 5px from the top and bottom. This creates a subtle but visible sidebar selection mismatch.

## What Changes

- Align Electron selected file-tree accent height with native SwiftUI by letting it span the selected row's full background height.
- Preserve the native accent width and leading indentation alignment.
- Preserve selected row background, italic label styling, file-tree row padding, folder icons, typography, and expansion behavior.
- Add source-backed regression coverage anchored to native `fileTreeRow(_:)` selected accent layout.

## Capabilities

### New Capabilities

### Modified Capabilities

- `electron-file-tree-visual-parity`: Selected file-tree accent now matches native full-height row treatment.
- `electron-native-parity-roadmap`: Track this selected-accent visual parity slice and retained verification evidence.

## Impact

- Electron renderer CSS in `apps/electron/src/renderer/styles.css`.
- Electron file-tree visual regression tests in `apps/electron/test/file-tree-expansion-parity.test.js`.
- OpenSpec delta specs and roadmap tracking for the Electron native parity migration.
