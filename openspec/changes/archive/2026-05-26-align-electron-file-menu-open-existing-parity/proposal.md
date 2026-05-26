## Why

The current Electron File menu exposes `Open Existing Folder`, but the current SwiftUI app's visible command group only adds Go Back, Go Forward, and Refresh Page after the native New Window command. Removing the extra File-menu command improves native menu parity while keeping the welcome-screen Open Existing Folder entry point intact.

## What Changes

- Remove `Open Existing Folder` from the Electron application File menu.
- Keep the welcome screen `Open Existing Folder` action and its picker behavior unchanged.
- Keep native-compatible New Window, Go Back, Go Forward, Refresh Page, and Close File-menu behavior.
- Update tests and specs so menu parity is based on the current SwiftUI command source.

## Capabilities

### New Capabilities

### Modified Capabilities

- `electron-chrome-menus-persistence`: File-menu command requirements should not include an Open Existing command that the native app does not visibly provide.
- `electron-native-parity-roadmap`: Track the File-menu open-existing correction as a visible menu parity slice.

## Impact

- Updates `apps/electron/src/main/main.js`.
- Updates Electron chrome/menu static tests.
- Updates OpenSpec menu and roadmap specifications.
