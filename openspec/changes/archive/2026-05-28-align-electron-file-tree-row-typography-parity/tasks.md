## 1. Regression Coverage

- [x] 1.1 Add source-backed coverage proving native folder rows use 13pt regular serif typography.
- [x] 1.2 Add source-backed coverage proving native file rows use 13pt serif typography with regular default and medium special-file override.
- [x] 1.3 Add Electron CSS coverage proving folder and file row buttons use 13px regular serif typography while special files remain medium.

## 2. Implementation

- [x] 2.1 Update Electron folder row CSS to use native 13px regular serif typography.
- [x] 2.2 Update Electron file row CSS to use native 13px regular serif typography while preserving the special-file medium override.
- [x] 2.3 Preserve existing file-tree layout, icons, selected row styling, and expansion behavior.

## 3. Verification

- [x] 3.1 Run the targeted Electron file-tree expansion/visual test and capture the initial RED failure.
- [x] 3.2 Run the targeted Electron file-tree expansion/visual test after implementation.
- [x] 3.3 Run `openspec validate --all --strict`.
- [x] 3.4 Run full repo verification: `npm test`, `swift build`, Electron mac package, runtime parity audit, and release readiness gate.
- [x] 3.5 Archive the OpenSpec change after implementation verification.
