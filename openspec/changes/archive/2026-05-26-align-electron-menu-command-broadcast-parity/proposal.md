## Why

The SwiftUI app posts Go Back, Go Forward, and Refresh Page through `NotificationCenter` without an object, and every `ContentView` instance listens with `.onReceive`. Electron currently sends those menu commands only to the focused window, so multi-window command dispatch is narrower than the native app.

## What Changes

- Broadcast the native custom navigation/refresh menu commands to every live Electron window.
- Keep Electron-specific `Open Existing Folder` targeted to the focused window so it does not open multiple file dialogs.
- Add regression coverage that ties Electron command fan-out to the native global `NotificationCenter` path.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `electron-chrome-menus-persistence`: Clarify multi-window dispatch semantics for native custom File menu commands.
- `electron-native-parity-roadmap`: Track menu-command broadcast parity as an archived native behavior correction.

## Impact

- `apps/electron/src/main/main.js`: Update app-command dispatch recipient selection.
- `apps/electron/test/chrome-menus-persistence.test.js`: Add source-level parity coverage for native global notifications and Electron multi-window broadcast.
- `openspec/specs/*`: Update archived capability contracts after implementation.
