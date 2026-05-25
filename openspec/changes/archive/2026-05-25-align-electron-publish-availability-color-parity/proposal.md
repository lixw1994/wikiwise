## Why

The native publish sheet uses distinct availability hint colors: default and available states stay secondary, owned is blue, taken is red, and invalid is orange. Electron currently groups available with owned and invalid with taken, which makes the hint color hierarchy differ from macOS.

## What Changes

- Align Electron publish availability hint text colors with the native SwiftUI switch styling.
- Keep existing availability hint copy, state names, publish enablement, and inline indicator behavior.
- Preserve publish dialog layout and typography.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `electron-publishing`: Require publish availability hint colors to match native state-specific foreground styling.

## Impact

- Affects Electron renderer CSS for the publish dialog availability hint.
- Adds publishing visual parity regression coverage.
- Updates the `electron-publishing` OpenSpec capability.
