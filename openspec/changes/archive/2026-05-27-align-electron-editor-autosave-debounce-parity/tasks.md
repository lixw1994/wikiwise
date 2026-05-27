## 1. Regression Coverage

- [x] 1.1 Add file-editing coverage proving native `EditorWebView` writes immediately after a non-empty `contentChanged` message.
- [x] 1.2 Add renderer coverage proving Electron starts the save path from `handleEditorContentChanged` without scheduling an additional debounce timer.
- [x] 1.3 Run targeted file-editing tests before implementation and retain the expected RED failure.

## 2. Implementation

- [x] 2.1 Update Electron editor content-change handling to save from the received bridge payload without an extra renderer debounce.
- [x] 2.2 Preserve empty-payload guarding, dirty-state tracking, manual save shortcut, markdown recompilation refresh, and save error handling.
- [x] 2.3 Preserve follow-up saves when a newer edit arrives while an earlier save is still in flight.

## 3. Verification and Archive

- [x] 3.1 Run targeted file-editing tests and retain GREEN evidence.
- [x] 3.2 Run OpenSpec validation, broader project tests/build/package checks, runtime audit, and release-readiness evidence.
- [x] 3.3 Archive the change, rerun OpenSpec validation, and record post-archive evidence.
