## 1. Regression Coverage

- [x] 1.1 Add source-backed coverage proving native special file rows use `.medium` weight.
- [x] 1.2 Add Electron coverage proving `.tree-file-button.special-file` uses native medium CSS weight.

## 2. Implementation

- [x] 2.1 Update Electron special file row CSS from heavier semibold weight to native medium weight.
- [x] 2.2 Preserve special filename membership and existing file-tree row layout/selection behavior.

## 3. Verification

- [x] 3.1 Run the targeted Electron file-tree expansion/visual test.
- [x] 3.2 Run `openspec validate --all --strict`.
- [x] 3.3 Run full repo verification: `npm test`, `swift build`, Electron mac package, runtime parity audit, and release readiness gate.
- [x] 3.4 Archive the OpenSpec change after implementation verification.
