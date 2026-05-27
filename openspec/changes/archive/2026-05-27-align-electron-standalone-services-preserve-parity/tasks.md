## 1. Regression Coverage

- [x] 1.1 Add source-backed Electron regression coverage proving native standalone-file opens do not stop watcher/background services.
- [x] 1.2 Verify the new regression test fails before implementation.

## 2. Project Service Lifecycle

- [x] 2.1 Preserve main-process window project-root/background ownership for standalone-file project results.
- [x] 2.2 Preserve renderer project-change listener and main-process watcher for standalone-file project results.
- [x] 2.3 Preserve folder-open replacement and window cleanup behavior.

## 3. Verification and Archive

- [x] 3.1 Run targeted Electron project lifecycle tests and retain GREEN evidence.
- [x] 3.2 Run OpenSpec validation, full test/build/package checks, runtime audit, and release-readiness evidence.
- [x] 3.3 Archive the change, rerun OpenSpec validation, and record post-archive evidence.
