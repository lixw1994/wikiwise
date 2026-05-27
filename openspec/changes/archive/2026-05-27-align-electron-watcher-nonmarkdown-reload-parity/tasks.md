## 1. Regression Coverage

- [x] 1.1 Add source-backed Electron regression coverage proving native CSS and rebuild watcher events reload any selected source file, not only Markdown.
- [x] 1.2 Verify the new regression test fails before implementation.

## 2. Renderer Behavior

- [x] 2.1 Update Electron watcher handling so selected non-Markdown source files are reread from disk on CSS and rebuild watcher events when no unsaved draft exists.
- [x] 2.2 Refresh INFO metadata after the selected non-Markdown watcher reload.
- [x] 2.3 Preserve existing Markdown preview refresh, generated-page no-op, tree rescan, and dirty-draft behavior.

## 3. Verification and Archive

- [x] 3.1 Run targeted Electron live-rebuild tests and retain GREEN evidence.
- [x] 3.2 Run OpenSpec validation, full test/build/package checks, runtime audit, and release-readiness evidence.
- [x] 3.3 Archive the change, rerun OpenSpec validation, and record post-archive evidence.
