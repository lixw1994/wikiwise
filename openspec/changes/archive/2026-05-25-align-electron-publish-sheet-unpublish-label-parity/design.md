## Context

The native SwiftUI publish sheet displays `Unpublish…` as a sheet action for already published projects. Electron already closes that sheet before the unpublish confirmation flow starts, but `renderPublishDialog()` still computes a transient `Unpublishing` label for the sheet-level action.

## Goals / Non-Goals

**Goals:**

- Keep the Electron publish sheet's `Unpublish…` action label static while it is visible.
- Preserve existing disabled-state behavior during publish and unpublish work.
- Cover the parity rule in the publishing regression tests.

**Non-Goals:**

- Change the separate destructive unpublish confirmation dialog.
- Change publish or unpublish IPC behavior.
- Change native SwiftUI code.

## Decisions

- Treat this as renderer text parity only. The existing state machine already hides the publish sheet before unpublish runs, so no data-flow or IPC change is needed.
- Keep disabled-state logic unchanged. The action can remain disabled during busy work; only the visible label should match the native sheet action.

## Risks / Trade-offs

- A future refactor could reintroduce a dynamic sheet action label. Mitigation: add a source-level parity test that rejects the `Unpublishing` branch on `unpublishButton.textContent`.
