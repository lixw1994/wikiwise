## Why

The native SwiftUI left-sidebar restore control animates sidebar visibility with `withAnimation(.easeInOut(duration: 0.2))`. Electron currently hides or restores the left sidebar by switching to a shorter grid track list, so the detail and right-sidebar layout jump instead of interpolating like the native split-view surface.

## What Changes

- Add native-timed Electron layout styling so left-sidebar hide/show expands or restores the project layout over 200ms ease-in-out.
- Keep the hidden left sidebar represented by a zero-width left grid track so the grid can interpolate between visible and hidden states.
- Preserve the existing toolbar affordance metadata, selected state, help labels, file-tree state, saved sidebar width, right-sidebar state, terminal behavior, and resize behavior.
- Add parity coverage tying the Electron layout transition and grid placement to the Swift left-sidebar animation source.

## Capabilities

### New Capabilities
- None.

### Modified Capabilities
- `electron-left-sidebar-visibility-parity`: left-sidebar visibility changes must animate with native toolbar restore timing while preserving layout/state behavior.

## Impact

- Affected Electron renderer CSS: `apps/electron/src/renderer/styles.css`.
- Affected parity tests: `apps/electron/test/chrome-menus-persistence.test.js`.
- No IPC, file tree, terminal lifecycle, persistence, or Swift runtime changes.
