## Why

The native SwiftUI new-wiki sheet wires `Cancel` to `.cancelAction` and `Create` to `.defaultAction`, so keyboard users can dismiss with Escape and submit with Enter. Electron currently only exposes click handlers for the same dialog, leaving a small but noticeable behavior gap in a flow that should feel identical to the macOS app.

## What Changes

- Add Electron new-wiki dialog keyboard handling for the native cancel shortcut.
- Add Electron new-wiki dialog keyboard handling for the native default action when Create is enabled.
- Add parity tests that compare the SwiftUI keyboard shortcuts with the Electron renderer behavior.

## Success Criteria

- Electron closes the new-wiki dialog when Escape is pressed, using the existing close guard while creation is in progress.
- Electron invokes the Create action from Enter only when the confirm button is enabled.
- Targeted Electron new-wiki scaffold tests fail before implementation and pass after implementation.
- Full Electron tests, Swift build, OpenSpec validation, whitespace check, and macOS Electron packaging all pass.

## Non-Goals

- Do not change scaffold creation, location choosing, project opening, or post-create guide behavior.
- Do not introduce additional shortcuts beyond the native cancel/default dialog actions.
- Do not claim full new-wiki parity beyond this keyboard-behavior slice.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `electron-new-wiki-scaffold`: Require native cancel/default keyboard behavior in the new-wiki dialog.

## Impact

- Affected code: Electron renderer new-wiki dialog event handling, Electron new-wiki scaffold tests, OpenSpec specs.
- No Swift source changes are planned.
- No dependency changes are planned.
