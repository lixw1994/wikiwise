## Why

Electron terminal startup still fails for users with `posix_spawnp failed` when a Darwin `node-pty` `spawn-helper` in the runtime install is present without executable permissions. The current runtime guard only targets one helper path, so a mixed-architecture install can keep the same failure alive for the helper that `node-pty` loads.

## What Changes

- Repair every discovered Darwin `node-pty` `prebuilds/darwin-*/spawn-helper` before starting a PTY session.
- Keep the existing permission repair for build `spawn-helper` locations used by source builds.
- Preserve terminal shell selection, login-shell arguments, project-root working directory, session reuse, input, output, resizing, and cleanup behavior.
- Retain diagnostic evidence for the local `darwin-x64` helper permission mismatch that reproduced the reported failure class.

## Capabilities

### New Capabilities

### Modified Capabilities
- `electron-right-sidebar-terminal`: Runtime terminal startup must repair all discovered Darwin `node-pty` helpers before invoking `pty.spawn`.
- `electron-native-parity-roadmap`: Track the runtime all-helper correction as a retained terminal reliability phase.

## Impact

- Affected code: `apps/electron/src/main/main.js`.
- Affected tests: `apps/electron/test/right-sidebar-terminal.test.js`.
- Affected specs: Electron right-sidebar terminal and native parity roadmap.
