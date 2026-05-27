## 1. Regression Coverage

- [x] 1.1 Add source-backed coverage proving the native centered welcome `W` mark uses `Color.sidebarSelectedText`.
- [x] 1.2 Add Electron CSS coverage proving `.welcome-mark` uses `--color-sidebar-selected-text` while preserving native-like typography.
- [x] 1.3 Capture the initial targeted RED failure before implementation.

## 2. Implementation

- [x] 2.1 Update Electron `.welcome-mark` foreground to use the native sidebar-selected text token.
- [x] 2.2 Preserve welcome mark typography, toolbar brand styling, copy, actions, and layout.

## 3. Verification

- [x] 3.1 Run the targeted Electron native-shell parity test after implementation.
- [x] 3.2 Run `openspec validate --all --strict`.
- [x] 3.3 Run full repo verification: `npm test`, `swift build`, Electron mac package, runtime parity audit, and release readiness gate.
- [x] 3.4 Archive the OpenSpec change after implementation verification.
