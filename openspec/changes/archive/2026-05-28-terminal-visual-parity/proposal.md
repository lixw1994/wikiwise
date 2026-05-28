## Why

The Electron terminal still looks different from the native SwiftTerm panel in opened-project screenshots: it injects a `Starting shell...` line that native does not show, and the visible prompt/cursor evidence is not yet strong enough to prove prompt color and cursor parity.

## What Changes

- Stop writing Electron-only startup text into the terminal buffer when a PTY session starts.
- Preserve native-like prompt rendering by allowing zsh ANSI prompt colors to render through the warm xterm palette instead of flattening to fallback foreground text.
- Ensure xterm styling and CSP permit style-only ANSI color rendering while keeping inline scripts disallowed.
- Strengthen runtime evidence for terminal prompt ANSI, xterm prompt cell colors, and rendered cursor visibility so screenshot review can catch this class of visual drift.
- Retain PTY startup, login-shell semantics, project-root cwd, terminal input/output, resizing, warm palette fallback, and one-session-per-window lifecycle.

## Capabilities

### New Capabilities

### Modified Capabilities
- `electron-right-sidebar-terminal`: Terminal startup and prompt rendering must match native SwiftTerm visual behavior without Electron-only buffer text.
- `electron-runtime-parity-audit`: Runtime evidence must capture terminal prompt ANSI color, xterm prompt cell color, and cursor visibility signals in opened-project scenarios.
- `electron-native-parity-roadmap`: Roadmap evidence must track terminal visual parity closure while preserving the final signed/notarized release gate.

## Impact

- Electron renderer terminal startup flow in `apps/electron/src/renderer/renderer.js`.
- Electron terminal runtime evidence in `scripts/audit-electron-runtime.mjs`.
- Electron terminal/runtime tests under `apps/electron/test/`.
