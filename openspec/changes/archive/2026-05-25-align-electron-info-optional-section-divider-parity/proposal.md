## Why

The native macOS INFO tab separates optional `DIRECTIONS` and `LINKED` sections with a sidebar-rule line at the section top and 18pt of top padding before content. Electron currently uses generic section margins without the native divider, so optional Info sections do not match the SwiftUI sidebar rhythm.

## What Changes

- Add native optional-section divider styling for Electron `DIRECTIONS` and `LINKED`.
- Align optional section top spacing to the native 18px padding after the divider.
- Remove the artificial metadata-list bottom margin that currently substitutes for native optional section spacing.
- Preserve directions callout, linked row styling, metadata content, conditional visibility, tabs, terminal behavior, and sidebar resizing.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `electron-right-sidebar-terminal`: Require optional INFO sections to use the native top divider and 18px top spacing.

## Impact

- Affects Electron renderer markup and CSS for Info optional sections.
- Adds right sidebar Info visual parity regression coverage.
- Updates the `electron-right-sidebar-terminal` OpenSpec capability.
