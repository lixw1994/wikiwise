## 1. Regression Coverage

- [x] 1.1 Add core active-file tests for native-compatible writes when `.claude` exists.
- [x] 1.2 Add core active-file tests proving `.claude` is not created when missing.
- [x] 1.3 Add Electron lifecycle/save source tests anchored to native Swift `try?` active-file behavior and the shared helper call paths.
- [x] 1.4 Run targeted tests before implementation and retain the expected RED failure.

## 2. Implementation

- [x] 2.1 Update `writeActiveFile()` to skip writing when `.claude` is absent without creating directories.
- [x] 2.2 Preserve scaffolded-project active-file writes, relative path metadata, and explicit text-file write behavior.

## 3. Verification and Archive

- [x] 3.1 Run targeted active-file tests and retain GREEN evidence.
- [x] 3.2 Run OpenSpec validation, full test/build/package checks, runtime audit, and release-readiness evidence.
- [x] 3.3 Archive the change, rerun OpenSpec validation, and record post-archive evidence.
