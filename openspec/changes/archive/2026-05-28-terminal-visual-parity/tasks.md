## 1. Regression Tests

- [x] 1.1 Add renderer terminal tests proving Electron does not write `Starting shell...` into the xterm buffer when a PTY starts.
- [x] 1.2 Add renderer/runtime tests proving terminal prompt ANSI colors, xterm prompt cell colors, and cursor evidence are captured through the warm native palette.

## 2. Implementation

- [x] 2.1 Remove the Electron-only terminal startup line while keeping PTY startup, clear-on-new-session, output subscription, and resize behavior intact.
- [x] 2.2 Extend runtime audit DOM evidence and assertions for prompt color/cell color/cursor visual parity.

## 3. Verification

- [x] 3.1 Run targeted terminal/runtime tests with RED/GREEN evidence.
- [x] 3.2 Run runtime audit and inspect generated terminal screenshots/report evidence.
- [x] 3.3 Archive the OpenSpec change after verification passes.
