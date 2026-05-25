## Why

The native publish sheet builds the editable URL row with `HStack(spacing: 0)`, so the protocol, subdomain field, suffix, spacer, and availability indicator do not receive extra inter-item spacing. Electron currently adds `gap: 4px` to the URL row, making the row looser than the macOS sheet.

## What Changes

- Remove the extra Electron URL row grid gap by setting the publish URL row spacing to 0.
- Preserve the existing grid columns, row padding, rounded background chrome, 13px monospaced text, input inheritance, and availability indicator sizing.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `electron-publishing`: Require the Electron publish URL row to match the native zero-spacing URL row.

## Impact

- Affects Electron renderer CSS for the publish dialog URL row.
- Adds publishing visual parity regression coverage.
- Updates the `electron-publishing` OpenSpec capability.
