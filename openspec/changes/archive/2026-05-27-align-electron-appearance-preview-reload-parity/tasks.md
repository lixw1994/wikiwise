## 1. Regression Coverage

- [x] 1.1 Add source-backed Electron regression coverage proving native appearance changes reload the visible WebView via `webViewReloadToken`.
- [x] 1.2 Verify the new regression test fails before implementation.

## 2. Renderer Behavior

- [x] 2.1 Update Electron appearance-mode handling to reload a visible selected Markdown preview after appearance changes.
- [x] 2.2 Reload a visible generated-page iframe after appearance changes without changing generated-page state or history.
- [x] 2.3 Preserve existing shell palette, terminal theme, preview scroll restoration, and non-preview behavior.

## 3. Verification and Archive

- [x] 3.1 Run targeted Electron appearance and preview tests and retain GREEN evidence.
- [x] 3.2 Run OpenSpec validation, full test/build/package checks, runtime audit, and release-readiness evidence.
- [x] 3.3 Archive the change, rerun OpenSpec validation, and record post-archive evidence.
