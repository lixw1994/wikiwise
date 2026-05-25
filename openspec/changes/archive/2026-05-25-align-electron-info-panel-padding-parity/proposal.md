## Why

The native macOS INFO tab applies 14pt padding around the scroll content. Electron currently inherits the generic right-panel 18px padding for the INFO panel, making the metadata, directions, and linked sections sit farther from the sidebar edge than the SwiftUI version.

## What Changes

- Align Electron INFO panel padding to the native 14px content inset.
- Keep terminal panel padding and terminal emulator chrome unchanged.
- Preserve ABOUT THIS DOCUMENT, DIRECTIONS, LINKED, optional-section dividers, tab switching, terminal behavior, and sidebar resizing.
- Add source parity coverage for the native Info panel inset.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `electron-right-sidebar-terminal`: Require the INFO tab panel content inset to match native 14px padding.

## Impact

- Affects Electron renderer CSS for the Info panel.
- Adds right sidebar Info visual parity regression coverage.
- Updates the `electron-right-sidebar-terminal` OpenSpec capability.
