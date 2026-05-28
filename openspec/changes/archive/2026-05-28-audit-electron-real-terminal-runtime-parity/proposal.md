## Why

The runtime parity audit currently stubs the terminal IPC handlers, so it can pass even when the real Electron main-process `node-pty` terminal startup or input path is broken. Recent terminal debugging showed that terminal parity needs retained evidence from the real PTY path, not only renderer/xterm stub output.

## What Changes

- Run project-scenario terminal audit evidence through the real main-process `wikiwise:startTerminal` and `wikiwise:sendTerminalInput` handlers.
- Keep the existing renderer runtime audit scenario coverage, screenshots, and report output.
- Record and assert that a command sent through xterm reaches the real PTY and echoes back in the terminal buffer.
- Preserve stubbed audit handlers for unrelated services where production network/file side effects are intentionally avoided.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `electron-runtime-parity-audit`: Runtime audit must retain real PTY terminal startup/input evidence for opened-project scenarios.
- `electron-native-parity-roadmap`: Roadmap must track real terminal runtime evidence as a final parity-evidence closure phase.

## Impact

- `scripts/audit-electron-runtime.mjs` runtime audit terminal handling.
- `apps/electron/test/runtime-parity-audit.test.js` source coverage for real terminal audit evidence.
- OpenSpec runtime-audit and roadmap specs.
