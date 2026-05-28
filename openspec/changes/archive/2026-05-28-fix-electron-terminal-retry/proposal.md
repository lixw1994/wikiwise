## Why

The Electron terminal can get stuck after a failed PTY startup: the renderer keeps an xterm instance alive, but the main process has no terminal session, so later keystrokes only trigger `No terminal is running for this window`. Users need the terminal tab to recover by starting a real PTY session again instead of remaining in a half-started state.

## What Changes

- Retry terminal startup from the terminal tab when the renderer has no active session for the current project.
- Prevent xterm input from blindly sending to the main process while no terminal session exists.
- Preserve the existing native-style one-session-per-window reuse behavior once a session is running.
- Add packaged/runtime audit evidence that the packaged terminal path can actually spawn and echo through `node-pty`.

## Capabilities

### New Capabilities

### Modified Capabilities
- `electron-right-sidebar-terminal`: Terminal startup must recover from a missing main-process session after a prior failure.
- `electron-runtime-parity-audit`: Runtime evidence must cover the recovery behavior and packaged PTY spawn path.

## Impact

- Electron renderer terminal session lifecycle in `apps/electron/src/renderer/renderer.js`.
- Electron main packaged audit support in `apps/electron/src/main/main.js`.
- Electron terminal and runtime audit tests under `apps/electron/test/`.
- Packaged runtime audit output under `apps/electron/out/packaged-runtime-audit/report.json`.
