## Why

The native macOS publish sheet uses 24pt inner padding around the sheet content. The Electron publish dialog currently inherits the shared modal panel padding of 22px, leaving the publish sheet slightly tighter than the native version.

## What Changes

- Align the Electron publish dialog panel padding to the native 24px inset.
- Keep shared modal panel padding unchanged for other dialogs.
- Preserve the existing publish dialog width, row layout, copy, and publish/unpublish behavior.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `electron-publishing`: Tighten publish dialog visual parity by requiring the native 24px panel padding.

## Impact

- Affects Electron renderer CSS for the publish dialog.
- Adds publishing parity regression coverage.
- Updates the `electron-publishing` OpenSpec capability.
