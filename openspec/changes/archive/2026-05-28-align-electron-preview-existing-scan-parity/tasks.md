## 1. Regression Coverage

- [x] 1.1 Add source-backed Electron regression coverage proving native selected preview compilation does not rescan.
- [x] 1.2 Verify the new regression test fails before implementation.

## 2. Main Process Behavior

- [x] 2.1 Remove per-preview `scanPages()` from selected Markdown preview compilation.
- [x] 2.2 Preserve folder-open scanning before home preview compilation.
- [x] 2.3 Preserve watcher-driven `rescan()` ownership before selected-file refreshes caused by file changes.

## 3. Verification and Archive

- [x] 3.1 Run targeted Electron compiler preview tests and retain GREEN evidence.
- [x] 3.2 Run OpenSpec validation, full test/build/package checks, runtime audit, and release-readiness evidence.
- [x] 3.3 Archive the change, rerun OpenSpec validation, and record post-archive evidence.
