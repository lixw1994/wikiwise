## 1. Regression Coverage

- [x] 1.1 Add source-backed coverage proving native file-tree rows call `FolderIcon(size: 13, ...)`.
- [x] 1.2 Add source-backed coverage proving native `FolderIcon` uses `size * (12.0 / 14.0)` frame height.
- [x] 1.3 Add Electron CSS coverage proving folder icon height, special dot diameter, and special dot center match native 13px-scaled geometry.

## 2. Implementation

- [x] 2.1 Update Electron folder icon CSS height to the native 13px-scaled aspect.
- [x] 2.2 Update Electron special-folder marker CSS diameter and center position to native scaled coordinates.
- [x] 2.3 Preserve folder icon width, colors, special-folder membership, row typography, indentation, and expansion behavior.

## 3. Verification

- [x] 3.1 Run the targeted Electron file-tree expansion/visual test and capture the initial RED failure.
- [x] 3.2 Run the targeted Electron file-tree expansion/visual test after implementation.
- [x] 3.3 Run `openspec validate --all --strict`.
- [x] 3.4 Run full repo verification: `npm test`, `swift build`, Electron mac package, runtime parity audit, and release readiness gate.
- [x] 3.5 Archive the OpenSpec change after implementation verification.
