## 1. Regression Coverage

- [x] 1.1 Add source-backed Electron regression coverage proving native generated-page navigation checks existing output without compiling.
- [x] 1.2 Verify the new regression test fails before implementation.

## 2. Main Process Behavior

- [x] 2.1 Update toolbar generated-page IPC handling to return existing generated output without triggering `compileAll()`.
- [x] 2.2 Update generated preview-link fallback handling to return existing generated output without triggering `compileAll()`.
- [x] 2.3 Preserve publish/source compilation paths and generated-page no-op behavior.

## 3. Verification and Archive

- [x] 3.1 Run targeted Electron preview navigation tests and retain GREEN evidence.
- [x] 3.2 Run OpenSpec validation, full test/build/package checks, runtime audit, and release-readiness evidence.
- [x] 3.3 Archive the change, rerun OpenSpec validation, and record post-archive evidence.
