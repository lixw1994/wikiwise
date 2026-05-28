## Why

Electron terminal startup can fail on macOS with `posix_spawnp failed` when `node-pty`'s `spawn-helper` binary is present but lacks executable permissions. This prevents the right-sidebar terminal from matching native SwiftTerm startup and causes follow-on input errors because no terminal session exists.

## What Changes

- Ensure Electron verifies and fixes the macOS `node-pty` spawn helper executable bit before starting a PTY session.
- Ensure the macOS package command preserves an executable `node-pty` spawn helper inside `Wikiwise.app` before release signing/notarization steps.
- Keep terminal shell selection, login-shell semantics, project-root working directory, input/output, resizing, and session lifecycle unchanged.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `electron-right-sidebar-terminal`: Terminal startup must guard against a non-executable `node-pty` spawn helper before creating the PTY.
- `electron-macos-packaging`: The packaged Electron app must contain an executable `node-pty` spawn helper.
- `electron-native-parity-roadmap`: The roadmap must retain phase evidence for the terminal spawn-helper permission correction.

## Impact

- `apps/electron/src/main/main.js` terminal startup path.
- `scripts/package-electron-macos.mjs` local macOS app assembly.
- Electron terminal and packaging tests.
- OpenSpec terminal, packaging, and roadmap specs.
