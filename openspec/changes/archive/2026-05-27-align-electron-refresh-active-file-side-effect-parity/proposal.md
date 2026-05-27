## Why

Native SwiftUI rewrites `.claude/active-file` whenever a selected source file is loaded. Manual Refresh Page and selected-file watcher refreshes both call `recompileCurrentPage(_:)`, which calls `loadFile(url)`, so those refresh paths also rewrite the active-file marker. Electron already writes active-file on file selection and save, but its manual refresh and watcher reload paths update the selected content without that native side effect.

## What Changes

- Write the active-file marker after manual Refresh Page refreshes a selected Markdown source.
- Write the active-file marker after manual Refresh Page rereads a selected non-Markdown source.
- Write the active-file marker after watcher-driven selected Markdown and non-Markdown reloads that mirror native `recompileCurrentPage(_:)`.
- Preserve existing silent active-file error handling, generated-page refresh behavior, draft preservation, history behavior, and INFO metadata refresh behavior.
- Add source-backed regression coverage anchored to native `ContentView.loadFile(_:)` and `recompileCurrentPage(_:)`.

## Capabilities

### New Capabilities

### Modified Capabilities
- `electron-chrome-menus-persistence`: Manual Refresh Page now includes the native active-file side effect for selected source-file refreshes.
- `electron-live-rebuild-watching`: Selected-file watcher reloads now include the native active-file side effect when they refresh the selected source file.
- `electron-native-parity-roadmap`: Track this refresh/watch active-file side-effect parity slice and retained verification evidence.

## Impact

- Electron renderer refresh and watcher paths in `apps/electron/src/renderer/renderer.js`.
- Electron source-backed tests under `apps/electron/test/preview-navigation-map-graph.test.js` and `apps/electron/test/live-rebuild-watching.test.js`.
- OpenSpec delta specs for menu refresh, live rebuild watching, and roadmap tracking.
