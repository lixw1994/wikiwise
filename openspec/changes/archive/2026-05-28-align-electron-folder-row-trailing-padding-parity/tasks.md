## 1. Regression Coverage

- [x] 1.1 Add source-backed coverage proving native folder rows have no `.padding(.trailing, 8)`.
- [x] 1.2 Add source-backed coverage proving native file rows keep `.padding(.trailing, 8)`.
- [x] 1.3 Add Electron CSS coverage proving folder rows omit the file-row trailing inset while file rows retain it.

## 2. Implementation

- [x] 2.1 Move Electron trailing row padding out of the shared `.tree-row` rule.
- [x] 2.2 Add the native 8px trailing inset explicitly to `.tree-file-button`.
- [x] 2.3 Preserve folder/file indentation, vertical padding, typography, selected accent alignment, folder icons, and expansion behavior.

## 3. Verification

- [x] 3.1 Run the targeted Electron file-tree expansion/visual test and capture the initial RED failure.
- [x] 3.2 Run the targeted Electron file-tree expansion/visual test after implementation.
- [x] 3.3 Run `openspec validate --all --strict`.
- [x] 3.4 Run full repo verification: `npm test`, `swift build`, Electron mac package, runtime parity audit, and release readiness gate.
- [x] 3.5 Archive the OpenSpec change after implementation verification.
