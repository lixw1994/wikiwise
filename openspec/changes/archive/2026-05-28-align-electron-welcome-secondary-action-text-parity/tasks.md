## 1. Regression Coverage

- [x] 1.1 Add source-backed coverage proving the native "Open Existing Folder" welcome button uses `Color.sidebarSelectedText`.
- [x] 1.2 Add Electron CSS coverage proving only `.welcome-action.secondary-action` adopts `--color-sidebar-selected-text` while `.secondary-action` remains shared.
- [x] 1.3 Capture the initial targeted RED failure before implementation.

## 2. Implementation

- [x] 2.1 Add a welcome-only secondary action foreground override in Electron renderer CSS.
- [x] 2.2 Preserve welcome action labels, symbols, layout, border, padding, and click behavior.

## 3. Verification

- [x] 3.1 Run the targeted Electron native-shell parity test after implementation.
- [x] 3.2 Run `openspec validate --all --strict`.
- [x] 3.3 Run full repo verification: `npm test`, `swift build`, Electron mac package, runtime parity audit, and release readiness gate.
- [x] 3.4 Archive the OpenSpec change after implementation verification.
