## 1. Regression Coverage

- [x] 1.1 Add source-backed Electron regression coverage proving native standalone-file opens do not stop the terminal.
- [x] 1.2 Verify the new regression test fails before implementation.

## 2. Renderer Terminal Lifecycle

- [x] 2.1 Preserve terminal output listener, session root, and buffer for standalone-file project results.
- [x] 2.2 Continue avoiding parent-directory terminal startup for standalone-file project results.
- [x] 2.3 Preserve folder-project terminal startup and watcher/publishing standalone boundaries.

## 3. Verification and Archive

- [x] 3.1 Run targeted Electron project lifecycle and terminal tests and retain GREEN evidence.
- [x] 3.2 Run OpenSpec validation, full test/build/package checks, runtime audit, and release-readiness evidence.
- [x] 3.3 Archive the change, rerun OpenSpec validation, and record post-archive evidence.
