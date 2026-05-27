## 1. Regression Coverage

- [x] 1.1 Add source-backed coverage proving native `FolderIcon` draws with `lineWidth: 0.8 * s`.
- [x] 1.2 Add source-backed coverage proving file-tree rows render `FolderIcon(size: 13, ...)`.
- [x] 1.3 Add Electron CSS coverage proving the folder icon body and tab use the native 0.74px scaled stroke width.

## 2. Implementation

- [x] 2.1 Update Electron folder icon body border width to native scaled stroke width.
- [x] 2.2 Update Electron folder icon tab border width to native scaled stroke width while keeping its bottom edge open.
- [x] 2.3 Preserve icon aspect, special marker geometry, colors, special-folder membership, row typography, indentation, and expansion behavior.

## 3. Verification

- [x] 3.1 Run the targeted Electron file-tree expansion/visual test and capture the initial RED failure.
- [x] 3.2 Run the targeted Electron file-tree expansion/visual test after implementation.
- [x] 3.3 Run `openspec validate --all --strict`.
- [x] 3.4 Run full repo verification: `npm test`, `swift build`, Electron mac package, runtime parity audit, and release readiness gate.
- [x] 3.5 Archive the OpenSpec change after implementation verification.
