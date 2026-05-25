## Context

The native `publishConfirmSheet` declares `Cancel` with `.keyboardShortcut(.cancelAction)` and `Publish` with `.keyboardShortcut(.defaultAction)`. Electron already mirrors the dialog copy, labels, availability states, and disabled publish rules, but the dialog only responds to button clicks.

This change applies the same keyboard parity pattern already used for the new-wiki dialog to the publish dialog.

## Goals / Non-Goals

**Goals:**

- Match the native Escape-to-cancel behavior for the publish dialog.
- Match the native Enter-to-publish behavior when the publish action is enabled.
- Preserve the existing `isPublishing` and `isUnpublishing` guards.
- Add source-level parity tests beside the existing publishing assertions.

**Non-Goals:**

- No changes to publishing IPC, core publish helpers, or publish config persistence.
- No modal styling or copy changes.
- No changes to native Swift source.
- No keyboard changes for publish result, error, or unpublish confirmation dialogs.

## Decisions

- Add a focused `handlePublishDialogKeydown(event)` handler in the renderer.
- Route Escape through `closePublishDialog()` so the existing in-progress guard remains authoritative.
- Route Enter through `publishCurrentProject()` only when `confirmPublishButton.disabled` is false.
- Do not intercept Enter while a button has focus; normal button activation should continue to work for Cancel, Publish, and Unpublish.
- Register the handler on the publish dialog element so it is scoped to the modal.

## Risks / Trade-offs

- Source-level tests verify handler wiring and guard shape rather than driving a live DOM. This matches the existing test style and keeps the slice narrow; broader runtime keyboard coverage can be added later.

## State Model

No new state is introduced. The handler reads the existing `state.isPublishDialogOpen` flag and the rendered confirm button disabled state.

## Migration Plan

1. Add failing publishing tests for native cancel/default keyboard parity.
2. Add scoped Electron renderer keydown handling.
3. Run targeted and full verification.
4. Archive the change.

## Open Questions

None.
