## 1. Regression Coverage

- [x] 1.1 Add source-backed Electron regression coverage proving native Refresh Page reloads any selected source file and Electron must reread selected non-Markdown files.
- [x] 1.2 Verify the new regression test fails before implementation.

## 2. Renderer Behavior

- [x] 2.1 Update the Electron renderer Refresh Page command path to reread selected non-Markdown files from disk without touching generated pages.
- [x] 2.2 Preserve existing Markdown preview invalidation and generated-page no-op behavior.

## 3. Verification

- [x] 3.1 Run targeted Electron tests for preview/menu refresh behavior.
- [x] 3.2 Run strict OpenSpec validation, Electron tests, Swift build, macOS package build, and runtime audit.
