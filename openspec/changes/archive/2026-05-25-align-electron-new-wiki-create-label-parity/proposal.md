## Why

The native SwiftUI new-wiki sheet labels its default action `Create` and does not swap that label during creation. Electron currently changes the button text to `Creating`, which leaves a transient but user-visible copy mismatch in the create-new-wiki flow.

## What Changes

- Keep the Electron new-wiki confirmation button label as the native `Create` text even while creation is in progress.
- Preserve the existing disabled state while creation is running so duplicate submissions remain blocked.
- Add native-source parity tests that prevent the Electron-only `Creating` label from returning.

## Success Criteria

- Electron renderer keeps `confirmCreateNewButton.textContent` on `Create`.
- Electron renderer no longer contains `Creating` for the new-wiki confirm action.
- Targeted Electron new-wiki scaffold tests fail before implementation and pass after implementation.
- Full Electron tests, Swift build, OpenSpec validation, whitespace check, and macOS Electron packaging all pass.

## Non-Goals

- Do not change scaffold creation, location choosing, project opening, or post-create guide behavior.
- Do not remove the in-progress disabled state that prevents duplicate create requests.
- Do not claim full new-wiki parity beyond this action-label slice.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `electron-new-wiki-scaffold`: Require the native `Create` action label in the new-wiki dialog.

## Impact

- Affected code: Electron renderer new-wiki dialog rendering, Electron new-wiki scaffold tests, OpenSpec specs.
- No Swift source changes are planned.
- No dependency changes are planned.
