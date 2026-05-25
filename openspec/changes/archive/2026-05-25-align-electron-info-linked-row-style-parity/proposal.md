## Why

The native macOS INFO tab renders `LINKED` wikilink rows as serif 13pt linked-text entries with tight 4pt spacing. Electron currently inherits the generic metadata paragraph style for linked rows, so the list looks smaller, more mechanical, and less like the SwiftUI sidebar.

## What Changes

- Align the Electron INFO `LINKED` rows with the native linked-row typography, color, and spacing.
- Preserve existing wikilink extraction, conditional visibility, row marker text, and list behavior.
- Keep ABOUT THIS DOCUMENT, DIRECTIONS, tab switching, terminal, and sidebar resize behavior unchanged.
- Add source parity coverage for native linked-row styling.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `electron-right-sidebar-terminal`: Require the INFO tab linked rows to render with the native linked-row serif style, linked-text color, and compact row spacing.

## Impact

- Affects Electron renderer CSS for the INFO linked list.
- Adds Electron right sidebar Info visual parity regression coverage.
- Updates the `electron-right-sidebar-terminal` OpenSpec capability.
