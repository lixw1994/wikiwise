## 1. Regression Coverage

- [x] 1.1 Add source-backed Electron regression coverage proving native terminal startup is start-once per window.
- [x] 1.2 Verify the new regression test fails before implementation.

## 2. Terminal Lifecycle Behavior

- [x] 2.1 Reuse an existing main-process PTY session for repeated folder starts in the same window.
- [x] 2.2 Preserve the renderer terminal buffer and output stream when the main process reports a reused terminal session.
- [x] 2.3 Preserve explicit terminal stop and window-destroyed cleanup behavior.

## 3. Verification and Archive

- [x] 3.1 Run targeted Electron terminal tests and retain GREEN evidence.
- [x] 3.2 Run OpenSpec validation, full test/build/package checks, runtime audit, and release-readiness evidence.
- [x] 3.3 Archive the change, rerun OpenSpec validation, and record post-archive evidence.
