## Context

The SwiftUI app presents publishing feedback with native alerts: `Published!` includes `Open in Browser` and `OK`, `Publish Error` includes `OK`, and `Unpublish wiki?` uses a destructive confirmation with explanatory text. Electron has equivalent core publish/unpublish IPC, but it currently renders success/error as inline text and uses `window.confirm` for unpublish confirmation.

## Goals / Non-Goals

**Goals:**
- Render publish success, publish error, and unpublish confirmation as app-owned modal panels.
- Add an `Open in Browser` publish result action using the existing `wikiwise.openExternalUrl` bridge.
- Remove `window.confirm` from the unpublish flow.
- Preserve existing publish config refresh, availability checks, publish request, and unpublish request behavior.

**Non-Goals:**
- Change publishing service endpoints or `publish.json` semantics.
- Add real network runtime tests for publish/unpublish.
- Change the native Swift implementation.

## Decisions

1. Reuse the existing `.modal-backdrop` and `.modal-panel` system.

   This keeps visual behavior aligned with existing Electron dialogs and avoids adding another modal pattern.

2. Keep modal state in the existing renderer state object.

   `publishResult`, `publishError`, and a new unpublish confirmation flag are already close to the publish state machine. Keeping the state local avoids new IPC or preload surface area.

3. Use the existing external URL bridge for `Open in Browser`.

   The main process already validates external URLs before calling Electron `shell.openExternal`, so the publish result action can reuse that route without broadening renderer authority.

## Risks / Trade-offs

- [Risk] A modal result can overlap the publish dialog if state is not cleared consistently. -> Close the publish dialog before setting result state and render all publish feedback from a single render path.
- [Risk] Static tests can only prove contract presence, not live network behavior. -> Preserve existing core publishing tests and focus this phase on renderer state/markup parity.
- [Risk] Inline feedback removal could hide errors if modal rendering regresses. -> Tests assert modal ids, titles, OK actions, and renderer state wiring.

## Migration Plan

1. Add failing static tests for publish result/error/unpublish modal contracts.
2. Add modal markup and CSS.
3. Update renderer state and event handlers.
4. Run focused and full verification, archive the OpenSpec change, and commit.

Rollback removes the modal markup and state wiring and restores previous inline feedback.

## Open Questions

None for this phase.
