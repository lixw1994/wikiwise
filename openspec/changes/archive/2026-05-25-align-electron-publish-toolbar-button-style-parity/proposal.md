## Why

The native macOS publish toolbar button has a compact monospaced badge style, but the Electron toolbar publish button still uses larger text, looser padding, a larger radius, and a different foreground color. This makes one of the most visible project toolbar actions feel less native than the surrounding controls.

## What Changes

- Align the Electron publish toolbar button typography, tracking, padding, corner radius, background, border, and foreground color with the native SwiftUI label styling.
- Preserve publish labels, busy-state text, disabled behavior, help text, and publish dialog behavior.
- Add source parity coverage so future toolbar styling changes keep the native badge contract.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `electron-publishing`: Require the toolbar publish action to match the native compact badge styling.

## Impact

- Affects Electron renderer CSS for the toolbar publish button.
- Adds Electron publishing parity regression coverage.
- Updates the `electron-publishing` OpenSpec capability.
