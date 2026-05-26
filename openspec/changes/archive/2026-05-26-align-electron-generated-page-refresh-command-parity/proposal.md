## Why

The SwiftUI app's `Refresh Page` command posts `refreshWiki`, but the refresh path only recompiles when `selectedFileURL` is present. Electron currently refreshes generated map/graph pages from the same command, which makes the menu command broader than the native app.

## What Changes

- Keep Electron's `Refresh Page` menu/app command scoped to the selected Markdown file.
- Preserve generated map/graph refresh for live rebuild, CSS, and Markdown output changes.
- Add regression coverage tying the Electron command behavior to the native `selectedFileURL` guard.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `electron-chrome-menus-persistence`: Clarify that the Refresh Page command refreshes selected Markdown files but does not directly refresh generated pages.
- `electron-preview-navigation-map-graph`: Clarify that generated pages refresh from project-output changes, not from the manual Refresh Page command.
- `electron-native-parity-roadmap`: Track this generated-page refresh command parity correction as an archived parity slice.

## Impact

- `apps/electron/src/renderer/renderer.js`: Narrow the manual refresh handler to selected Markdown pages.
- `apps/electron/test/preview-navigation-map-graph.test.js`: Add source-level parity coverage for manual refresh vs watcher refresh.
- `openspec/specs/*`: Update archived capability contracts after implementation.
