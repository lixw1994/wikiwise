## Why

The native publish sheet places its action `HStack` as a normal child of `VStack(alignment: .leading, spacing: 16)`. Electron already gives the publish dialog a 16px panel gap, but the shared `.modal-actions` rule adds an extra top margin, making the publish actions sit farther from the token warning than the macOS sheet.

## What Changes

- Add a scoped Electron publish actions hook that removes the extra shared modal action top margin.
- Preserve shared modal action spacing for other dialogs.
- Preserve publish dialog copy, action labels, keyboard behavior, layout gap, and button enablement.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `electron-publishing`: Require publish dialog action spacing to rely on the native content gap without extra top margin.

## Impact

- Affects Electron renderer markup and CSS for the publish dialog action row.
- Adds publishing visual parity regression coverage.
- Updates the `electron-publishing` OpenSpec capability.
