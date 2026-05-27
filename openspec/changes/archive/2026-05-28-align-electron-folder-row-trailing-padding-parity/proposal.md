## Why

Native SwiftUI folder rows only apply leading and vertical padding, while file rows add an explicit 8px trailing inset. Electron currently applies the 8px trailing inset through the shared `.tree-row` rule, so folder rows keep extra right-side spacing that the native sidebar does not.

## What Changes

- Move Electron file-tree trailing padding from the shared row rule to file rows only.
- Add source-backed regression coverage proving native folder rows omit trailing padding and native file rows keep the 8px trailing inset.
- Preserve folder/file indentation, vertical padding, row typography, selected file accent alignment, folder icons, and expansion behavior.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `electron-file-tree-visual-parity`: Adds folder-row trailing-padding parity for native project-browser row layout.
- `electron-native-parity-roadmap`: Records folder-row trailing padding as an archived native sidebar visual correction phase.

## Impact

- Affects Electron renderer CSS for project file-tree rows.
- Adds Electron file-tree parity regression coverage.
- No API, dependency, native Swift source, packaging script, or release workflow changes.
