## Why

The native macOS terminal starts the user's shell as a login shell by passing an exec name with a leading dash, such as `-zsh`. Electron currently starts the PTY with no login-shell argument, so shell profile initialization can differ from the native app.

## What Changes

- Start Electron's project-root PTY using login-shell semantics on macOS/non-Windows platforms.
- Preserve the existing `$SHELL` lookup, project working directory, PTY sizing, environment, xterm rendering, and terminal cleanup behavior.
- Add regression coverage anchored to the SwiftTerm `execName: "-..."` source behavior.
- Retain runtime/package/build evidence while keeping the signed/notarized release gate open.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `electron-right-sidebar-terminal`: Terminal startup now includes native login-shell semantics in addition to project-root PTY startup.
- `electron-native-parity-roadmap`: Track terminal login-shell parity as an archived native terminal correction phase.

## Impact

- Affects Electron main-process PTY startup in `apps/electron/src/main/main.js`.
- Affects terminal parity tests in `apps/electron/test/right-sidebar-terminal.test.js`.
- Affects OpenSpec specs and retained verification evidence.
