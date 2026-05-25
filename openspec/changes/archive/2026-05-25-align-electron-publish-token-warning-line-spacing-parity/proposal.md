## Why

The native publish sheet gives the publish-token warning `.lineSpacing(2)`, while the Electron dialog currently inherits the broader global summary line height. This makes the warning paragraph read looser than the macOS sheet even though the copy and font size already match.

## What Changes

- Add a scoped Electron class for the publish-token warning paragraph.
- Set that paragraph's line height to mirror native 12pt text with 2pt line spacing.
- Preserve all other summary paragraph spacing, publish dialog gaps, copy, action labels, and publish behavior.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `electron-publishing`: Require the publish-token warning paragraph to use native line spacing.

## Impact

- Affects Electron publish dialog markup and CSS only.
- Adds publishing parity regression coverage.
- Updates the `electron-publishing` OpenSpec capability.
