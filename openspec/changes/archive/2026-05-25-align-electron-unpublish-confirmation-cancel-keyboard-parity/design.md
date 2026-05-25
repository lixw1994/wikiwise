## Context

The native publishing flow uses a SwiftUI alert for unpublishing. Its cancel button is declared with `role: .cancel`, so the alert has the native cancel affordance. Electron mirrors the confirmation copy and buttons, but only the visible Cancel button dismisses it.

Because this confirmation controls a destructive action, the change intentionally adds only the proven native cancel behavior.

## Goals / Non-Goals

**Goals:**

- Match the native Escape-to-cancel behavior for the unpublish confirmation.
- Reuse `closeUnpublishConfirmation()` so the existing `isUnpublishing` guard remains authoritative.
- Add source-level parity tests beside the existing publishing tests.

**Non-Goals:**

- No Enter shortcut for the destructive `Unpublish` action.
- No changes to publish success/error dialogs.
- No changes to core publishing helpers or IPC.
- No native Swift changes.

## Decisions

- Add `handleUnpublishConfirmationKeydown(event)` in the Electron renderer.
- Scope the handler to `unpublishConfirmDialog`.
- Handle only `Escape`, prevent the browser default, and route to `closeUnpublishConfirmation()`.
- Preserve click handlers for both visible actions.

## Risks / Trade-offs

- This does not attempt to infer the default destructive button behavior from SwiftUI alerts. That keeps the change conservative and aligned with explicit source evidence.

## State Model

No new state is introduced. The handler reads `state.isUnpublishConfirmOpen` and delegates to the existing close helper.

## Migration Plan

1. Add failing publishing tests for native unpublish cancel-key parity.
2. Add scoped Electron renderer keydown handling.
3. Run targeted and full verification.
4. Archive the change.

## Open Questions

None.
