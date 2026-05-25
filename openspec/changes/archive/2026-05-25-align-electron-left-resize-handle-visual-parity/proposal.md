## Why

The native macOS left sidebar explicitly renders a 1px trailing divider while the split-view resize affordance remains visually quiet. Electron currently paints a generic hover/focus fill over its left-sidebar resize handle, which creates a visible highlight that does not match the native sidebar edge.

## What Changes

- Keep the Electron left-sidebar resize hit target, cursor, and width clamping behavior.
- Align the handle's hover/focus-visible visual state with the native quiet divider by keeping it transparent.
- Add regression coverage that connects the Electron handle styling to the SwiftUI split-view divider source.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `electron-left-sidebar-width-parity`: Adds visual parity requirements for the left-sidebar resize handle.

## Impact

- Affected files are expected to stay within Electron renderer CSS and existing left-sidebar width parity tests.
- No native Swift code, IPC, dependencies, file-tree behavior, or sidebar width constraints are intended to change.
