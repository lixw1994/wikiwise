## Why

Native `TerminalSession.startIfNeeded(workingDirectory:)` starts the SwiftTerm process once per window and ignores later calls. Electron currently closes and respawns the PTY on each folder-project service start, so switching folders can change or reset the existing terminal session in a way the native app does not.

## What Changes

- Make Electron terminal startup reuse an existing window-scoped PTY session instead of closing it before every folder open.
- Keep the first terminal working directory rooted at the first opened folder, matching native `startIfNeeded` behavior.
- Preserve window-destroyed cleanup and explicit stop IPC behavior for the terminal process.
- Add source-backed regression coverage comparing native `TerminalSession` lifecycle semantics with Electron main/renderer behavior.

## Capabilities

### New Capabilities

### Modified Capabilities
- `electron-right-sidebar-terminal`: Terminal startup lifecycle now matches native start-once-per-window behavior.
- `electron-native-parity-roadmap`: Record this terminal lifecycle parity slice and retained verification evidence.

## Impact

- Electron main-process terminal lifecycle in `apps/electron/src/main/main.js`.
- Electron renderer terminal service startup and output handling in `apps/electron/src/renderer/renderer.js`.
- Electron terminal parity tests under `apps/electron/test/right-sidebar-terminal.test.js`.
- OpenSpec delta specs for terminal behavior and roadmap tracking.
