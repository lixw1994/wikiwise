## Why

The native macOS right sidebar renders INFO/TERMINAL as a compact left-aligned pill switcher inside the sidebar header area. Electron currently stretches the two tabs across the full sidebar width with heavier text and active backgrounds, so the right sidebar still reads like a web tab bar rather than the SwiftUI surface.

## What Changes

- Align the Electron right sidebar INFO/TERMINAL switcher with the native pill-style tab bar structure, spacing, typography, active fill, inactive color, radius, and shadow.
- Preserve the existing tab IDs, selected state, default TERMINAL tab, tab switching behavior, right sidebar resize behavior, and terminal/info panel rendering.
- Add source parity coverage for the native right sidebar tab switch styling.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `electron-right-sidebar-terminal`: Require the right sidebar INFO/TERMINAL controls to match the native compact pill-style tab switcher.

## Impact

- Affects Electron renderer markup and CSS for the right sidebar tab switcher.
- Adds Electron right sidebar visual parity regression coverage.
- Updates the `electron-right-sidebar-terminal` OpenSpec capability.
