## 1. Regression Coverage

- [x] 1.1 Add source-backed coverage proving native selected file rows use a 2px leading rectangle with leading-only padding.
- [x] 1.2 Add Electron CSS coverage proving `.tree-selected-accent` spans the full selected row height.
- [x] 1.3 Preserve existing coverage for selected background, italic styling, accent width, and leading offset.

## 2. Implementation

- [x] 2.1 Update Electron selected-accent CSS to remove the non-native vertical inset.
- [x] 2.2 Preserve selected row background, italic label styling, width, leading offset, row padding, typography, and expansion behavior.

## 3. Verification

- [x] 3.1 Run the targeted Electron file-tree expansion/visual test and capture the initial RED failure.
- [x] 3.2 Run the targeted Electron file-tree expansion/visual test after implementation.
- [x] 3.3 Run `openspec validate --all --strict`.
- [x] 3.4 Run full repo verification: `npm test`, `swift build`, Electron mac package, runtime parity audit, and release readiness gate.
- [x] 3.5 Archive the OpenSpec change after implementation verification.
