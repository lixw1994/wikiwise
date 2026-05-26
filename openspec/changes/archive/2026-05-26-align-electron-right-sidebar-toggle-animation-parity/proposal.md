## Why

The native SwiftUI project toolbar animates right-sidebar visibility changes with `withAnimation(.easeInOut(duration: 0.2))`. Electron currently hides or restores the right sidebar by immediately changing the project grid, which leaves a visible interaction mismatch in the main project shell.

## What Changes

- Add native-timed Electron layout styling so right-sidebar hide/show expands or restores the detail area over 200ms ease-in-out.
- Preserve the existing toolbar button label/state, right-sidebar terminal/info state, width persistence, and resize behavior.
- Add parity coverage tying the Electron layout transition to the Swift `showRightSidebar.toggle()` animation source.

## Capabilities

### New Capabilities
- None.

### Modified Capabilities
- `electron-right-sidebar-terminal`: right-sidebar visibility changes must animate with the native toolbar toggle timing.

## Impact

- Affected Electron renderer CSS: `apps/electron/src/renderer/styles.css`.
- Affected parity tests: `apps/electron/test/chrome-menus-persistence.test.js`.
- No IPC, terminal lifecycle, file tree, persistence, or Swift runtime changes.
