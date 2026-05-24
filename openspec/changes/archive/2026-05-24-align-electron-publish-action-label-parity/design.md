## Context

The native SwiftUI toolbar publish button renders `Text("PUBLISHING\u{2026}")` while publishing and `Text("PUBLISH \u{2191}")` otherwise. The native publish confirmation sheet uses `Button("Publish")` for both first-publish and already-published flows; the surrounding sheet state and availability status communicate whether the action is an update.

Electron already mirrors the normal toolbar label (`PUBLISH ↑`) and the surrounding publish state, but it currently renders `PUBLISHING...` during publishing and changes the confirmation button to `Update` when `publishConfig.published` exists.

## Goals / Non-Goals

**Goals:**

- Match native publish action labels exactly.
- Preserve existing published-project workflow and `canPublish()` logic.
- Prevent regressions with source-level tests against SwiftUI labels.

**Non-Goals:**

- No changes to publish service calls or `publishConfig` refresh.
- No changes to publish success/error modal copy.
- No CSS/layout changes.

## Decisions

- Update `renderPublishStatus()` to use the native ellipsis in `PUBLISHING…`.
- Update `renderPublishDialog()` so the confirmation button text is `Publish` whenever not actively publishing.
- Leave the in-progress dialog label as `Publishing` because native closes the sheet before the async operation; this existing Electron transient state is not the target of this slice.
- Keep `state.publishConfig?.published` logic for saved subdomain, owned availability, unpublish visibility, and toolbar help.

## Risks / Trade-offs

- Users lose the explicit `Update` verb on an already published wiki, but that is required for native parity. Existing URL/subdomain context and toolbar help still communicate the publish target.
- This is a structural test; runtime workflow coverage remains in existing publishing tests and package/runtime checks.

## State Model

No state changes. Existing `publishConfig`, `publishAvailability`, `isPublishing`, and `isPublishDialogOpen` states remain unchanged.

## Migration Plan

1. Add a failing publishing test for toolbar and dialog publish action labels.
2. Update renderer labels.
3. Run targeted and full verification.
4. Archive the change.

## Open Questions

None.
