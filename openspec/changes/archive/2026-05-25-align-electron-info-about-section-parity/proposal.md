## Why

The native macOS INFO tab groups selected-document metadata under an `ABOUT THIS DOCUMENT` section header and renders each metadata row as a compact label/value line. Electron currently shows the PATH/EDITED/WORDS values directly as a vertical definition list, including a `No document` placeholder, so the right sidebar Info surface still diverges from the SwiftUI app.

## What Changes

- Align the Electron INFO metadata block with the native `ABOUT THIS DOCUMENT` section.
- Hide the metadata block when no document is selected, matching the native conditional `if let file = selectedFileURL` behavior.
- Align metadata row layout and typography with the native label/value rows while preserving existing document info data and updates.
- Add source parity coverage for the native Info metadata grouping.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `electron-right-sidebar-terminal`: Require the INFO tab document metadata block to match native grouping, conditional visibility, row layout, and typography.

## Impact

- Affects Electron renderer markup, CSS, and Info tab render state.
- Adds Electron right sidebar Info visual parity regression coverage.
- Updates the `electron-right-sidebar-terminal` OpenSpec capability.
