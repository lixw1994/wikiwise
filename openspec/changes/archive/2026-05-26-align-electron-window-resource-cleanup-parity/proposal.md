## Why

The native SwiftUI app invalidates its background compiler timer and stops its file watcher when the content view disappears or a different folder is opened. Electron currently tracks watchers and terminals per webContents, but background compilation is only project-root scoped, so closing a window or switching away from a folder can leave project work alive beyond the native view lifecycle.

## What Changes

- Track the current directory-backed project root for each Electron webContents.
- Stop background compilation for the previous project root when that webContents switches to another folder or a standalone file.
- Add one main-process cleanup path for destroyed webContents that closes the project watcher, stops background compilation, stops the terminal, and removes startup-restore eligibility.
- Extend parity tests to cover Swift `onDisappear` cleanup semantics and Electron window-scoped resource teardown.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `electron-background-compilation-parity`: add window/project lifecycle ownership for background jobs.
- `cross-platform-electron-workspace`: add explicit destroyed-webContents cleanup scenarios for watcher and terminal resources.
- `electron-native-parity-roadmap`: record the archived window resource cleanup parity phase and remaining final release evidence.

## Impact

- Affects `apps/electron/src/main/main.js` project result creation, watcher startup, terminal cleanup, and BrowserWindow destruction handling.
- Affects Electron background compilation, project lifecycle, watcher, terminal, and chrome persistence tests.
- Does not change renderer UI, project result shape, IPC channel names, packaged metadata, or release scripts.
