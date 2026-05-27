## Why

Native `FolderIcon` draws a single Paper-style 14-by-12 path with curved corners and a tab notch. Electron currently approximates that icon with CSS rectangles and pseudo-elements, so even after matching size, stroke, and dot geometry, the folder outline is not the native shape.

## What Changes

- Render Electron file-tree folder icons with an inline SVG path matching the native SwiftUI Canvas path.
- Keep native-scaled dimensions, stroke width, fill/stroke colors, and special-folder center dot behavior.
- Remove the CSS box-and-pseudo-tab approximation from the visible icon.
- Preserve file-tree row layout, accessibility-hidden icon semantics, special folder membership, typography, indentation, selection, and expansion behavior.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `electron-file-tree-visual-parity`: Adds native folder icon path parity for project-browser folder rows.
- `electron-native-parity-roadmap`: Records folder icon path parity as an archived native sidebar visual correction phase.

## Impact

- Affects Electron renderer folder-icon markup and CSS.
- Adds Electron file-tree visual regression coverage.
- No native Swift source, public API, dependency, packaging script, or release workflow changes.
