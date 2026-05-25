## Context

The native `newWikiSheet` declares `Cancel` with `.keyboardShortcut(.cancelAction)` and `Create` with `.keyboardShortcut(.defaultAction)`. Electron already has the same visible actions and disabled-state rules, but the dialog only responds to button clicks.

This change closes the keyboard interaction gap without changing the scaffold creation contract.

## Goals / Non-Goals

**Goals:**

- Match the native Escape-to-cancel behavior for the new-wiki dialog.
- Match the native Enter-to-create behavior when the default action is enabled.
- Preserve the existing `isCreatingWiki` guard so shortcuts do not duplicate in-flight creates.
- Add source-level parity tests near the existing new-wiki scaffold tests.

**Non-Goals:**

- No modal styling changes.
- No changes to main-process scaffold helpers or preload APIs.
- No changes to native Swift source.

## Decisions

- Add a focused `handleNewWikiDialogKeydown(event)` handler in the renderer.
- Route Escape through `closeNewWikiDialog()` so the existing in-progress guard remains authoritative.
- Route Enter through `createNewWiki()` only when `confirmCreateNewButton.disabled` is false.
- Avoid intercepting Enter while a button has focus, allowing normal button activation semantics to remain intact.
- Register the handler on the new-wiki dialog element instead of the whole document so the behavior is scoped to the modal.

## Risks / Trade-offs

- Source-level tests verify the expected handler shape rather than driving a live DOM. This matches the existing Electron parity test style and keeps the slice small; full interaction testing can come in a later UI automation phase.

## State Model

No new state is introduced. The handler reads the existing `state.isNewWikiDialogOpen` flag and the rendered confirm button disabled state.

## Migration Plan

1. Add failing new-wiki scaffold tests for native cancel/default keyboard parity.
2. Add scoped Electron renderer keydown handling.
3. Run targeted and full verification.
4. Archive the change.

## Open Questions

None.
