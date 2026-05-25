## Why

The native macOS FILE/WIKI toolbar mode control is a compact segmented badge with 10pt monospaced text, 0.8 tracking, 4pt vertical padding, 10pt horizontal padding, and 3pt segment corners. Electron currently renders the same control with larger 12px text, no tracking, looser padding, and a 6px outer radius, so the opened-project toolbar still reads less native than the SwiftUI version.

## What Changes

- Align the Electron File/Wiki mode switch typography, tracking, padding, border radius, and selected/unselected color tokens with the native segmented control.
- Preserve the existing mode IDs, selected/disabled states, click behavior, and detail-mode rendering.
- Add source parity coverage for the native segmented mode styling.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `electron-chrome-menus-persistence`: Require the opened-project toolbar File/Wiki mode switch to match the native segmented badge styling.

## Impact

- Affects Electron renderer CSS for the toolbar mode switch.
- Adds Electron toolbar parity regression coverage.
- Updates the `electron-chrome-menus-persistence` OpenSpec capability.
