## 1. Regression Coverage

- [x] 1.1 Add source-backed coverage proving native folder project opens do not clear `showPostCreateGuide`.
- [x] 1.2 Add Electron coverage proving ordinary `applyProjectResult` calls preserve an already-visible post-create guide while successful new-wiki creation can explicitly show it.

## 2. Implementation

- [x] 2.1 Update Electron project result application to treat `showPostCreateGuide: true` as an explicit show request without defaulting ordinary project results to hide the guide.
- [x] 2.2 Preserve explicit dismissal and scaffold failure hide behavior.

## 3. Verification

- [x] 3.1 Run the targeted Electron new-wiki scaffold test.
- [x] 3.2 Run `openspec validate --all --strict`.
- [x] 3.3 Run full repo verification: `npm test`, `swift build`, Electron mac package, runtime parity audit, and release readiness gate.
- [x] 3.4 Archive the OpenSpec change after implementation verification.
