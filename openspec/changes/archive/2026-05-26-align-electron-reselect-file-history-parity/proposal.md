## Why

The native SwiftUI app does not mutate navigation history when the user selects the file that is already active. Electron currently routes every file-tree click through `selectFile()`, which pushes the current file into back history and clears forward history even when the selected path is unchanged.

## What Changes

- Keep Electron file selection history behavior aligned with native `navigateTo(_:)`.
- Treat reselecting the active file as a refresh of the same selection, not a navigation event.
- Preserve normal history behavior when selecting a different file or leaving a generated map/graph page.
- Preserve generated-page routing, back/forward restoration, active-file writes, document info refresh, and detail-mode behavior.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `electron-chrome-menus-persistence`: Clarify that renderer history changes only for actual navigation targets and remains unchanged when the active file is reselected.
- `electron-native-parity-roadmap`: Track active-file reselect history parity as a native navigation closure phase.

## Impact

- Affected code: `apps/electron/src/renderer/renderer.js`
- Affected tests: `apps/electron/test/chrome-menus-persistence.test.js`
- Affected specs: Electron chrome/menus/persistence and native parity roadmap
- No main-process IPC, preload API, compiler, publishing, packaging, or Swift runtime changes.
