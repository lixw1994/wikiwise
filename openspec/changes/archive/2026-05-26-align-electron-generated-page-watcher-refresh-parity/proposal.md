## Why

Native Wikiwise does not directly reload an active generated map/graph page from file watcher events: watcher refresh paths only call `recompileCurrentPage(_:)` when `selectedFileURL` is present, and generated pages have `selectedFileURL == nil`. Electron currently refreshes active generated pages on rebuild, CSS, or markdown watcher changes, which is broader than the native WKWebView reload behavior.

## What Changes

- Stop Electron watcher events from directly refreshing the currently active generated map/graph page.
- Preserve generated page routing and refresh-on-open behavior so reopening or navigating to a generated page loads the latest compiler output.
- Add regression coverage tying Electron watcher behavior to native `selectedFileURL` and `reloadToken` evidence.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `electron-preview-navigation-map-graph`: Correct generated page watcher refresh semantics to match native non-reload behavior.
- `electron-native-parity-roadmap`: Track generated-page watcher refresh parity as an archived behavior correction.

## Impact

- `apps/electron/src/renderer/renderer.js`: Remove watcher-triggered generated page refresh from `handleProjectChanged()`.
- `apps/electron/test/preview-navigation-map-graph.test.js`: Update generated page watcher parity coverage.
- `openspec/specs/*`: Update archived capability contracts after implementation.
