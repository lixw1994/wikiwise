## Why

Native `ContentView.openURL(_:)` stops the previous watcher/background compiler only when opening another folder. Its standalone-file branch updates selection state and calls `loadFile(url)` without stopping `fileWatcher`, invalidating `backgroundTimer`, or clearing `compiler`; Electron currently treats standalone files as a project-service teardown boundary.

## What Changes

- Preserve existing folder-owned watcher/background compilation ownership when a standalone file is opened after a folder project.
- Continue avoiding watcher/background startup for a standalone file's parent directory.
- Keep folder-open watcher/background replacement and window cleanup behavior unchanged.
- Add source-backed regression coverage comparing native standalone-file service behavior with Electron main/renderer project-service boundaries.

## Capabilities

### New Capabilities

### Modified Capabilities
- `electron-project-lifecycle`: Standalone-file project results now preserve existing folder services that native leaves alive while avoiding parent-directory service startup.
- `electron-native-parity-roadmap`: Record this standalone service preservation parity slice and retained verification evidence.

## Impact

- Electron main-process project root ownership and background compilation lifecycle in `apps/electron/src/main/main.js`.
- Electron renderer watcher startup boundary in `apps/electron/src/renderer/renderer.js`.
- Electron project lifecycle tests under `apps/electron/test/project-lifecycle.test.js`.
- OpenSpec delta specs for project lifecycle behavior and roadmap tracking.
