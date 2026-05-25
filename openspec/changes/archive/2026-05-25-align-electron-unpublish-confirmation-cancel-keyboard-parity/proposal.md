## Why

The native SwiftUI unpublish confirmation uses `Button("Cancel", role: .cancel)`, giving the destructive alert native cancel-key behavior. Electron currently presents the same app-owned confirmation with click-only actions, leaving Escape unable to dismiss a destructive confirmation the way the macOS app does.

## What Changes

- Add scoped Electron unpublish confirmation keyboard handling for the native cancel behavior.
- Preserve the existing in-progress guard while unpublishing is running.
- Add parity tests that compare the SwiftUI cancel role with Electron's confirmation key handling.

## Success Criteria

- Electron closes the unpublish confirmation when Escape is pressed.
- Electron does not close the confirmation via Escape while an unpublish request is in progress.
- Targeted Electron publishing tests fail before implementation and pass after implementation.
- Full Electron tests, Swift build, OpenSpec validation, whitespace check, and macOS Electron packaging all pass.

## Non-Goals

- Do not add Enter-to-unpublish behavior without stronger native evidence for the destructive default action.
- Do not change publish result, publish error, publish dialog, or unpublish API behavior.
- Do not change native Swift source.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `electron-publishing`: Require native cancel-key behavior for the unpublish confirmation.

## Impact

- Affected code: Electron renderer unpublish confirmation event handling, Electron publishing tests, OpenSpec specs.
- No dependency changes are planned.
