## 1. PTY Terminal Tests

- [x] 1.1 Add failing structural tests for PTY dependencies and package/runtime native-module handling.
- [x] 1.2 Add failing main/preload tests for PTY startup, raw input, resize, output, and lifecycle IPC.
- [x] 1.3 Add failing renderer/markup/style tests for xterm surface usage and removal of separate line-input command controls.
- [x] 1.4 Add failing runtime audit tests for xterm DOM evidence and terminal resize/input contracts.
- [x] 1.5 Verify `npm --prefix apps/electron test` fails for the new PTY parity expectations before implementation.

## 2. PTY Terminal Implementation

- [x] 2.1 Add Electron PTY and terminal emulator dependencies.
- [x] 2.2 Replace main terminal sessions with `node-pty`, project-root shell startup, raw write, resize, and cleanup.
- [x] 2.3 Extend preload with terminal resize IPC while preserving listener cleanup.
- [x] 2.4 Replace renderer terminal transcript/input controls with xterm.js initialization, direct input, output writing, fit/resize, and warm palette theming.
- [x] 2.5 Update terminal markup/styles and package/release handling for bundled terminal assets and native modules.
- [x] 2.6 Update runtime audit to exercise and record xterm terminal evidence.
- [x] 2.7 Verify `npm --prefix apps/electron test` passes.

## 3. Runtime Verification

- [x] 3.1 Verify `npm run electron:audit:runtime` passes.
- [x] 3.2 Inspect runtime report for xterm terminal surface, terminal output, and resize/input evidence.

## 4. Validation

- [x] 4.1 Verify `npm test` passes.
- [x] 4.2 Verify `openspec validate migrate-electron-pty-terminal-parity --strict` passes.
- [x] 4.3 Verify `swift build` passes.
- [x] 4.4 Verify `git diff --check` passes.
- [x] 4.5 Record retained verification evidence, archive the change, validate all specs, and commit.
