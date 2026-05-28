## Why

The native SwiftTerm terminal shows a visible block cursor even when the right sidebar is not focused. Electron currently relies on xterm's default inactive outline cursor, which is easy to miss in the terminal panel and leaves the migrated terminal visually different from the macOS app.

## What Changes

- Make the Electron xterm cursor use a native-like block shape in both focused and inactive states.
- Retain the existing warm terminal cursor colors, blinking behavior, PTY startup, input/output, resize, and one-session-per-window lifecycle.
- Add regression and runtime evidence for visible terminal cursor parity.

## Capabilities

### New Capabilities

### Modified Capabilities
- `electron-right-sidebar-terminal`: Terminal cursor visibility and shape must match the native SwiftTerm terminal.
- `electron-runtime-parity-audit`: Runtime evidence must record terminal cursor visibility in opened-project scenarios.
- `electron-native-parity-roadmap`: Roadmap evidence must track the cursor parity closure while preserving the final signed/notarized release gate.

## Impact

- Electron renderer terminal options in `apps/electron/src/renderer/renderer.js`.
- Electron runtime audit evidence in `scripts/audit-electron-runtime.mjs`.
- Electron terminal/runtime tests under `apps/electron/test/`.
