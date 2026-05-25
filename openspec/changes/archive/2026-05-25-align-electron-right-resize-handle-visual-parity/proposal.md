## Why

The native macOS right-sidebar resize handle is a transparent 5px hit target that only changes the cursor and drag behavior. Electron currently exposes a visible hover/focus fill on that handle, which makes the sidebar edge look different from the SwiftUI implementation.

## What Changes

- Align the Electron right-sidebar resize handle visual states with the native transparent overlay.
- Preserve the existing 5px hit target, column-resize cursor, and right-sidebar drag behavior.
- Add regression coverage that ties the Electron styling back to the SwiftUI `Color.clear` overlay.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `electron-right-sidebar-terminal`: Adds visual parity requirements for the right-sidebar resize handle.

## Impact

- Affected files are expected to stay within Electron renderer CSS and the existing right-sidebar terminal parity tests.
- No API, dependency, IPC, terminal lifecycle, or native Swift behavior changes are intended.
