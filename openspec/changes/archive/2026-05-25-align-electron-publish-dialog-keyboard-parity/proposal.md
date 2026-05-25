## Why

The native SwiftUI publish sheet wires `Cancel` to `.cancelAction` and `Publish` to `.defaultAction`, so keyboard users can dismiss with Escape and submit with Enter. Electron currently exposes the same visible actions only through click handlers, leaving another small interaction gap in a core publishing flow.

## What Changes

- Add scoped Electron publish dialog keyboard handling for the native cancel shortcut.
- Add scoped Electron publish dialog keyboard handling for the native default publish action when Publish is enabled.
- Add parity tests that compare the SwiftUI publish sheet shortcuts with the Electron renderer behavior.

## Success Criteria

- Electron closes the publish dialog when Escape is pressed, using the existing close guard while publish/unpublish work is in progress.
- Electron invokes Publish from Enter only when the confirm action is enabled.
- Targeted Electron publishing tests fail before implementation and pass after implementation.
- Full Electron tests, Swift build, OpenSpec validation, whitespace check, and macOS Electron packaging all pass.

## Non-Goals

- Do not change publish API contracts, availability checks, publish result alerts, or unpublish behavior.
- Do not introduce additional shortcuts beyond the native cancel/default publish sheet actions.
- Do not claim full publishing parity beyond this keyboard-behavior slice.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `electron-publishing`: Require native cancel/default keyboard behavior in the publish dialog.

## Impact

- Affected code: Electron renderer publish dialog event handling, Electron publishing tests, OpenSpec specs.
- No Swift source changes are planned.
- No dependency changes are planned.
