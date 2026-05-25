## Why

The native publish sheet spaces title and body content through the `VStack`'s 16pt spacing. The Electron publish dialog now uses the native 16px panel gap, but still inherits the shared modal title `margin-bottom: 4px`, which adds extra title spacing that the native sheet does not have.

## What Changes

- Remove the extra title bottom margin for the Electron publish dialog title.
- Keep the shared modal title margin unchanged for unrelated dialogs.
- Preserve existing publish dialog typography, spacing, padding, width, copy, and behavior.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `electron-publishing`: Tighten publish dialog visual parity by requiring the publish title to rely on the native 16px panel gap without an additional title margin.

## Impact

- Affects Electron renderer CSS for the publish dialog title.
- Adds publishing parity regression coverage.
- Updates the `electron-publishing` OpenSpec capability.
