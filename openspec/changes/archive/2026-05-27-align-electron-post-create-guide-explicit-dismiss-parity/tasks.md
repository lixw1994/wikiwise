## 1. Regression Coverage

- [x] 1.1 Add source-backed Electron regression coverage proving native guide dismissal only clears `showPostCreateGuide` from the guide button path.
- [x] 1.2 Verify the new regression test fails before implementation.

## 2. Renderer Behavior

- [x] 2.1 Preserve `state.showPostCreateGuide` during file selection.
- [x] 2.2 Preserve `state.showPostCreateGuide` during generated-page navigation.
- [x] 2.3 Preserve existing explicit guide dismissal, home-file selection, successful create, and scaffold failure behavior.

## 3. Verification and Archive

- [x] 3.1 Run targeted Electron new-wiki tests and retain GREEN evidence.
- [x] 3.2 Run OpenSpec validation, full test/build/package checks, runtime audit, and release-readiness evidence.
- [x] 3.3 Archive the change, rerun OpenSpec validation, and record post-archive evidence.
