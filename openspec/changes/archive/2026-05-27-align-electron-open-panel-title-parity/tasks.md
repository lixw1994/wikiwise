## 1. Regression Coverage

- [x] 1.1 Add Open Existing picker tests that prove Swift uses message-only `NSOpenPanel` chrome and Electron omits an explicit dialog title.
- [x] 1.2 Add new-wiki location picker tests that prove Swift uses message-only `NSOpenPanel` chrome and Electron omits an explicit dialog title.
- [x] 1.3 Run the targeted tests before implementation and retain the expected RED failure.

## 2. Implementation

- [x] 2.1 Remove explicit Electron `title` overrides from the Open Existing and new-wiki location picker configurations.
- [x] 2.2 Preserve picker messages, file/folder constraints, default location behavior, and renderer IPC boundaries.

## 3. Verification and Archive

- [x] 3.1 Run targeted lifecycle and new-wiki tests and retain GREEN evidence.
- [x] 3.2 Run OpenSpec validation, full test/build/package checks, and release-readiness evidence.
- [x] 3.3 Archive the change, rerun OpenSpec validation, and record post-archive evidence.
