## 1. Regression Coverage

- [x] 1.1 Add source-backed Electron regression coverage proving native refresh paths rewrite active-file through `loadFile(_:)`.
- [x] 1.2 Add watcher regression coverage proving selected Markdown and non-Markdown refresh paths call the Electron active-file helper.
- [x] 1.3 Verify the new regression tests fail before implementation.

## 2. Renderer Behavior

- [x] 2.1 Update manual Markdown Refresh Page to rewrite active-file through the silent helper.
- [x] 2.2 Update manual non-Markdown Refresh Page to rewrite active-file after rereading the selected source from disk.
- [x] 2.3 Update watcher selected Markdown and non-Markdown refreshes to rewrite active-file without changing draft preservation or generated-page behavior.

## 3. Verification and Archive

- [x] 3.1 Run targeted Electron menu/preview and watcher tests and retain GREEN evidence.
- [x] 3.2 Run OpenSpec validation, full test/build/package checks, runtime audit, and release-readiness evidence.
- [x] 3.3 Archive the change, rerun OpenSpec validation, and record post-archive evidence.
