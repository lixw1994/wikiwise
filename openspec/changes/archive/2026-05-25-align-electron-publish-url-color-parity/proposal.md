## Why

The native publish sheet renders the URL row with secondary-colored fixed URL affixes and a primary editable subdomain field. Electron currently styles the URL row through one row color, leaving the protocol and suffix without their own native secondary treatment.

## What Changes

- Add explicit Electron renderer styling for the `https://` prefix and `.wiki-wise.com` suffix as secondary URL affixes.
- Keep the editable subdomain field visually primary and editable.
- Preserve publish URL row copy, layout, spacing, typography, chrome, and behavior.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `electron-publishing`: Require the Electron publish URL row color hierarchy to match the native sheet, with secondary affixes and a primary editable subdomain field.

## Impact

- Affects Electron renderer markup and CSS for the publish dialog URL row.
- Adds publishing visual parity regression coverage.
- Updates the `electron-publishing` OpenSpec capability.
