## Why

The native macOS publish sheet title uses an 18pt medium serif system font. The Electron publish dialog title currently inherits the generic dialog heading style, so it does not carry the native publish sheet's serif/medium title treatment.

## What Changes

- Align the Electron publish dialog title typography to the native 18px medium serif treatment.
- Scope the typography override to the publish dialog title only.
- Preserve existing publish dialog spacing, padding, width, copy, and behavior.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `electron-publishing`: Tighten publish dialog visual parity by requiring native title typography.

## Impact

- Affects Electron renderer CSS for the publish dialog title.
- Adds publishing parity regression coverage.
- Updates the `electron-publishing` OpenSpec capability.
