## Why

The native macOS publish toolbar action shows a small progress indicator before `PUBLISHING…` while a publish or unpublish request is running. Electron currently switches only the text label, so the busy state lacks a visible native affordance.

## What Changes

- Add a scoped busy indicator inside the Electron publish toolbar button.
- Render the indicator only while publishing or unpublishing, before the `PUBLISHING…` label.
- Preserve publish labels, disabled behavior, help text, button style, and publish dialog behavior.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `electron-publishing`: Require the toolbar publish action to mirror the native busy indicator structure.

## Impact

- Affects Electron renderer markup, CSS, and publish toolbar rendering.
- Adds publishing parity regression coverage.
- Updates the `electron-publishing` OpenSpec capability.
