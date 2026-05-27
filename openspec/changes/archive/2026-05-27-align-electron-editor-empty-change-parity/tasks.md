## 1. Regression Coverage

- [x] 1.1 Add Electron file-editing/save regression coverage for the native empty `contentChanged` guard.
- [x] 1.2 Run the targeted Electron file-editing/save test before implementation and retain the expected RED failure.

## 2. Implementation

- [x] 2.1 Update Electron editor-change handling to ignore empty payloads before mutating draft state.
- [x] 2.2 Preserve non-empty draft, dirty-state, save-state, and autosave behavior.

## 3. Verification and Archive

- [x] 3.1 Run targeted Electron file-editing/save tests and retain GREEN evidence.
- [x] 3.2 Run OpenSpec validation, full test/build/package checks, runtime audit, and release-readiness evidence.
- [x] 3.3 Archive the change, rerun OpenSpec validation, and record post-archive evidence.
