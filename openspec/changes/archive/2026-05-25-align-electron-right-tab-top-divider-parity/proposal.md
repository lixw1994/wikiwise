## Why

The native macOS right sidebar draws a `sidebarRule` divider above and below the tab bar. Electron currently only draws the bottom rule on the right tab header, so the top edge of the sidebar header is missing a native divider.

## What Changes

- Add the native 1px top divider to the Electron right sidebar tab header.
- Keep the existing bottom divider, tab switcher styling, selected state, panel switching, terminal, Info tab, and resizing behavior unchanged.
- Add source parity coverage for the right sidebar tab header divider pair.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `electron-right-sidebar-terminal`: Require the right sidebar tab header to render native top and bottom sidebar-rule dividers.

## Impact

- Affects Electron renderer CSS for the right sidebar tab header.
- Adds right sidebar visual parity regression coverage.
- Updates the `electron-right-sidebar-terminal` OpenSpec capability.
