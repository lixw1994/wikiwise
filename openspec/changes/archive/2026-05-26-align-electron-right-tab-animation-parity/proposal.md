## Why

The native SwiftUI right-sidebar tab switcher animates INFO/TERMINAL selection changes with a 0.15s ease-in-out transition. Electron currently changes the pill state instantly, leaving a visible interaction mismatch in an otherwise polished native-parity surface.

## What Changes

- Add Electron styling so the right-sidebar tab text, active pill background, and active shadow transition over the native 150ms ease-in-out duration.
- Add parity coverage that ties the Electron CSS transition to the Swift `withAnimation(.easeInOut(duration: 0.15))` source.
- Preserve the existing default TERMINAL tab, INFO/TERMINAL selection state, panel visibility, terminal behavior, and sidebar resize behavior.

## Capabilities

### New Capabilities
- None.

### Modified Capabilities
- `electron-right-sidebar-terminal`: right-sidebar tab selection animation timing must match native SwiftUI.

## Impact

- Affected Electron renderer CSS: `apps/electron/src/renderer/styles.css`.
- Affected parity tests: `apps/electron/test/right-sidebar-terminal.test.js`.
- No IPC, persistence, terminal, or Swift runtime changes.
