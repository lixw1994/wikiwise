## 1. Regression Coverage

- [x] 1.1 Add source-backed coverage proving native folder opens clear history while standalone-file opens do not.
- [x] 1.2 Add Electron coverage proving `applyProjectResult` clears history only for folder project results.

## 2. Implementation

- [x] 2.1 Scope Electron history resets in `applyProjectResult` to folder project results.
- [x] 2.2 Preserve standalone-file project result behavior for selected file display, service boundaries, post-create guide state, and active-file recording.

## 3. Verification

- [x] 3.1 Run the targeted Electron project lifecycle test.
- [x] 3.2 Run `openspec validate --all --strict`.
- [x] 3.3 Run full repo verification: `npm test`, `swift build`, Electron mac package, runtime parity audit, and release readiness gate.
- [x] 3.4 Archive the OpenSpec change after implementation verification.
