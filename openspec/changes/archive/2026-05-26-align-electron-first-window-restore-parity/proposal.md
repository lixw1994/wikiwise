## Why

The native SwiftUI app restores the persisted folder only for the first `ContentView`; subsequent windows intentionally show the welcome screen. Electron currently lets any renderer boot request `restoreLastProject`, which can auto-open the last wiki for later windows and diverge from native session behavior.

## What Changes

- Track Electron main-window creation order in the main process.
- Allow startup restore only for the first Electron window in the app process.
- Return no restore result for later windows so they remain on the welcome screen without surfacing an error.
- Extend parity tests to cover Swift `ContentView.instanceCount` semantics and Electron per-window restore gating.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `electron-chrome-menus-persistence`: add startup restore window-scope parity requirements.
- `electron-native-parity-roadmap`: record the archived first-window restore parity phase and remaining final release evidence.

## Impact

- Affects `apps/electron/src/main/main.js` window creation and restore IPC handling.
- Affects Electron chrome/menu persistence tests and OpenSpec chrome/roadmap specs.
- Does not change renderer startup, persisted settings format, project opening, packaging, or release scripts.
