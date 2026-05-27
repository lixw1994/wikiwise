## Why

Native watcher CSS and rebuild callbacks call `recompileCurrentPage(_:)` whenever `selectedFileURL` exists; that reloads the selected source file through `loadFile(_:)` without a Markdown extension gate. Electron currently only refreshes watcher-driven CSS/rebuild changes when the selected file is Markdown, leaving selected non-Markdown source files stale after native would reread them.

## What Changes

- Update Electron watcher handling so CSS and rebuild events reload the selected non-Markdown source file from disk when there is no unsaved draft.
- Refresh INFO metadata after the watcher reloads a selected non-Markdown source file.
- Preserve existing Markdown preview refresh, file tree rescan, generated-page no-op, and watcher event priority behavior.

## Capabilities

### New Capabilities

### Modified Capabilities
- `electron-live-rebuild-watching`: Renderer watcher refresh behavior now covers selected non-Markdown source files for CSS and rebuild events.
- `electron-native-parity-roadmap`: Record this watcher selected-source reload parity phase and its verification evidence.

## Impact

- Electron renderer watcher event handling in `apps/electron/src/renderer/renderer.js`.
- Electron live rebuild watcher parity tests under `apps/electron/test/live-rebuild-watching.test.js`.
- OpenSpec delta specs for live rebuild watcher behavior and roadmap tracking.
