## 1. Regression Coverage

- [x] 1.1 Add source-backed Electron regression coverage proving native INFO metadata is selected-file scoped, not Markdown-scoped.
- [x] 1.2 Verify the new regression test fails before implementation.

## 2. Renderer Behavior

- [x] 2.1 Remove the renderer Markdown gate from selected-document INFO metadata refresh.
- [x] 2.2 Refresh INFO metadata after saving any selected file while preserving Markdown-only preview compilation.
- [x] 2.3 Refresh INFO metadata after manual Refresh Page reloads a selected non-Markdown file.

## 3. Verification

- [x] 3.1 Run targeted Electron right-sidebar tests.
- [x] 3.2 Run strict OpenSpec validation, Electron tests, Swift build, macOS package build, and runtime audit.
