## Why

Native SwiftUI only starts the terminal from the folder-open branch. Opening a standalone file later does not call `terminalSession.startIfNeeded`, but it also does not stop or clear the existing `TerminalSession`; Electron currently stops and clears the PTY during standalone-file service setup.

## What Changes

- Preserve an existing Electron terminal session when a standalone file is opened.
- Keep standalone-file opens from starting a new terminal rooted at the file's parent directory.
- Keep project watcher and publishing/generated-map service boundaries unchanged for standalone files.
- Add source-backed regression coverage comparing the native standalone branch with Electron renderer terminal lifecycle behavior.

## Capabilities

### New Capabilities

### Modified Capabilities
- `electron-right-sidebar-terminal`: Standalone-file terminal lifecycle now preserves an existing terminal session while avoiding parent-directory terminal startup.
- `electron-native-parity-roadmap`: Record this standalone terminal lifecycle parity slice and retained verification evidence.

## Impact

- Electron renderer terminal service boundary in `apps/electron/src/renderer/renderer.js`.
- Electron project lifecycle and right-sidebar terminal tests under `apps/electron/test/`.
- OpenSpec delta specs for terminal behavior and roadmap tracking.
