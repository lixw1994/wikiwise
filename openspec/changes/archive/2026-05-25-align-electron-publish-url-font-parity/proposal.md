## Why

The native publish sheet renders the editable URL row with 13pt monospaced text for the protocol, subdomain field, and domain suffix. Electron currently renders that row at 12px, making the URL editor visually smaller than the macOS sheet.

## What Changes

- Align the Electron publish URL row text size with the native 13pt monospaced treatment.
- Preserve the existing monospaced family, row layout, chrome, width, input inheritance, availability indicator sizing, and behavior.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `electron-publishing`: Require the Electron publish URL row text to match the native 13px monospaced URL row treatment.

## Impact

- Affects Electron renderer CSS for the publish dialog URL row.
- Adds publishing visual parity regression coverage.
- Updates the `electron-publishing` OpenSpec capability.
