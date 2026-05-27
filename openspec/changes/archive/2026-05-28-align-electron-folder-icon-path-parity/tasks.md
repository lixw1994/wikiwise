## 1. Regression Coverage

- [x] 1.1 Add source-backed coverage proving native `FolderIcon` uses the Paper 14-by-12 Canvas path commands.
- [x] 1.2 Add Electron renderer coverage proving folder icons are rendered as inline SVG with the matching path data.
- [x] 1.3 Add Electron CSS coverage proving SVG shape and dot styling replace the visible CSS box/pseudo-tab approximation.

## 2. Implementation

- [x] 2.1 Render folder icons with an inline SVG using the native 14-by-12 path.
- [x] 2.2 Render the special folder center dot in the same SVG coordinate system.
- [x] 2.3 Update CSS to style the SVG shape/dot while preserving icon dimensions, colors, stroke width, and row layout.

## 3. Verification

- [x] 3.1 Run the targeted Electron file-tree expansion/visual test and capture the initial RED failure.
- [x] 3.2 Run the targeted Electron file-tree expansion/visual test after implementation.
- [x] 3.3 Run `openspec validate --all --strict`.
- [x] 3.4 Run full repo verification: `npm test`, `swift build`, Electron mac package, runtime parity audit, and release readiness gate.
- [x] 3.5 Archive the OpenSpec change after implementation verification.
