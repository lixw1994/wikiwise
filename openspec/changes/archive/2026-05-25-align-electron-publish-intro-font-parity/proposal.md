## Why

The native publish sheet renders the `Your wiki will be available at:` intro copy at 13pt secondary text. Electron currently reuses the 12px compact summary style for that intro, making the first line of the publish URL section smaller than the macOS sheet.

## What Changes

- Align the Electron publish dialog intro copy font size with the native 13pt treatment.
- Keep the publish token warning and other compact summary text at their existing 12px size.
- Preserve publish dialog copy, layout, URL row styling, and behavior.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `electron-publishing`: Require the Electron publish URL intro copy to match the native 13px publish sheet text treatment.

## Impact

- Affects Electron renderer markup and CSS for the publish dialog.
- Adds publishing visual parity regression coverage.
- Updates the `electron-publishing` OpenSpec capability.
