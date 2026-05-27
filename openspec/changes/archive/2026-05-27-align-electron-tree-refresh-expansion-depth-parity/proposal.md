## Why

The native SwiftUI `refreshTree()` rescans only the project root and intersects the previous expansion set with folders in that freshly scanned top-level tree. Electron currently restores every previously expanded path in depth order after a refresh, so nested folders can remain expanded across watcher rebuilds even though the native app drops nested expansion state during that refresh path.

## What Changes

- Narrow Electron project-tree refresh restoration to top-level folders that still exist after the rescan.
- Keep lazy nested expansion, nested selection, initial default expansion, and left-sidebar hide/show state preservation unchanged.
- Add regression coverage tying the Electron refresh behavior to the native `refreshTree()` implementation.
- Update the file-tree expansion spec wording so "preserves expansion" means native top-level refresh retention, not recursive restoration.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `electron-file-tree-expansion-parity`: clarify watcher-triggered tree refresh only preserves still-existing top-level expanded folders, matching native refresh depth.
- `electron-native-parity-roadmap`: record this refresh-depth correction as a file-tree parity polish phase.

## Impact

- Affected files: Electron renderer tree refresh restoration, file-tree parity tests, and OpenSpec artifacts.
- No IPC, compiler, editor, preview, terminal, publishing, packaging, or Swift source changes.
