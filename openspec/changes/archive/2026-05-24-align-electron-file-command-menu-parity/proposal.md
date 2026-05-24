## Why

The native SwiftUI app adds Go Back, Go Forward, and Refresh Page to the File command group after the standard New item. Electron currently exposes those commands under a separate Navigate menu, which makes the macOS menu bar diverge from the native app during parity review.

## What Changes

- Move the Electron Go Back, Go Forward, and Refresh Page app menu commands into the File menu after Open Existing Folder.
- Remove the extra top-level Navigate menu from the Electron application menu.
- Preserve the existing accelerators and renderer command dispatch behavior.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `electron-chrome-menus-persistence`: App menu commands must match the native File command group placement while keeping existing command dispatch.

## Impact

- Affects `apps/electron/src/main/main.js` menu template.
- Adds/updates Electron menu parity tests.
- No new runtime dependency or IPC channel is required.
