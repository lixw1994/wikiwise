## Why

The native macOS publish sheet lays out its content in a `VStack` with 16pt spacing. The Electron publish dialog still inherits the shared modal panel's 12px grid gap, so the content groups sit closer together than the native sheet.

## What Changes

- Align the Electron publish dialog content spacing to the native 16px gap.
- Keep shared modal panel spacing unchanged for unrelated dialogs.
- Preserve existing publish dialog padding, width, row layout, copy, and publish/unpublish behavior.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `electron-publishing`: Tighten publish dialog visual parity by requiring native 16px content spacing.

## Impact

- Affects Electron renderer CSS for the publish dialog.
- Adds publishing parity regression coverage.
- Updates the `electron-publishing` OpenSpec capability.
