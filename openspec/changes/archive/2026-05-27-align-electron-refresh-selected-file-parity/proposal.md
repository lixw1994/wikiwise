## Why

Native Refresh Page routes through `ContentView.recompileCurrentPage(_:)`, which reloads the active `selectedFileURL` through `loadFile(_:)` whenever a source file is selected. Electron currently gates the command to Markdown files, so selected plain-text/raw files do not reload from disk like the macOS app.

## What Changes

- Update Electron Refresh Page handling so a selected non-Markdown file is reread and rerendered from disk.
- Preserve existing Markdown refresh behavior, including preview invalidation.
- Preserve generated-page behavior: Refresh Page still does not directly refresh generated map or graph pages because they have no selected source file in the native app.

## Capabilities

### New Capabilities

### Modified Capabilities
- `electron-chrome-menus-persistence`: Refresh Page command behavior now covers selected non-Markdown source files in addition to Markdown and generated-page cases.
- `electron-preview-navigation-map-graph`: Generated-page refresh parity remains unchanged while selected-source refresh parity is clarified against native selected-file behavior.
- `electron-native-parity-roadmap`: Record this source-file refresh parity phase and its verification evidence.

## Impact

- Electron renderer refresh-command path in `apps/electron/src/renderer/renderer.js`.
- Electron menu/navigation parity tests under `apps/electron/test/`.
- OpenSpec delta specs for menu command behavior, generated-page refresh preservation, and roadmap tracking.
