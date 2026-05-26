## Why

The native SwiftUI app uses `WindowGroup` and preserves the standard File menu New Window command group while adding Wikiwise navigation commands after it. Electron currently has File menu commands for opening, navigation, refresh, and close, but lacks the native New Window command.

## What Changes

- Add a File > New Window command to Electron with the native `Command+N` / `Ctrl+N` accelerator.
- Make the command create a fresh Electron main window through the existing window creation path.
- Preserve first-window-only startup restore behavior so the new window opens to the welcome screen like native later `ContentView` instances.
- Preserve existing Open Existing Folder, Go Back, Go Forward, Refresh Page, Close, Edit, View, and Window menu behavior.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `electron-chrome-menus-persistence`: Add native File > New Window command parity while preserving existing menu commands and first-window restore scope.
- `electron-native-parity-roadmap`: Track the New Window menu parity correction as a native shell/menu gap closure phase.

## Impact

- Affected code: `apps/electron/src/main/main.js`
- Affected tests: `apps/electron/test/chrome-menus-persistence.test.js`
- Affected specs: Electron chrome/menus/persistence and native parity roadmap
- No renderer UI, IPC bridge, filesystem, packaging, release, or Swift runtime changes.
