## 1. Regression Coverage

- [x] 1.1 Add Electron new-wiki tests that exercise `middleTruncatePath` with supplementary-plane Unicode path characters.
- [x] 1.2 Anchor the test to native `ContentView.swift` `.truncationMode(.middle)` evidence and renderer character-safe truncation source.
- [x] 1.3 Run targeted new-wiki tests before implementation and retain the expected RED failure.

## 2. Implementation

- [x] 2.1 Update `middleTruncatePath` to truncate by iterable characters instead of UTF-16 code units.
- [x] 2.2 Preserve short-path display, middle ellipsis shape, full-path metadata, and create request behavior.

## 3. Verification and Archive

- [x] 3.1 Run targeted new-wiki tests and retain GREEN evidence.
- [x] 3.2 Run OpenSpec validation, broader project tests/build/package checks, runtime audit, and release-readiness evidence.
- [x] 3.3 Archive the change, rerun OpenSpec validation, and record post-archive evidence.
