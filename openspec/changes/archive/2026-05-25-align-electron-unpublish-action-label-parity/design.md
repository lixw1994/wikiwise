## Context

The native SwiftUI confirmation is an alert with `Button("Cancel", role: .cancel)` and `Button("Unpublish", role: .destructive)`. Electron already mirrors the alert with an app-owned confirmation and disables the destructive button while `state.isUnpublishing` is true, but it also changes that button text to `Unpublishing` during the request.

## Goals / Non-Goals

**Goals:**
- Keep the Electron confirmation destructive action text identical to the native `Unpublish` label.
- Retain the in-flight disabled state so users cannot send duplicate unpublish requests.
- Add a regression test tied to the native SwiftUI source and the Electron renderer source.

**Non-Goals:**
- Change the separate publish dialog `Unpublish…` trigger button behavior.
- Add Enter-to-confirm behavior to the destructive confirmation.
- Change publish service, preload, or main-process unpublish behavior.

## Decisions

- Keep `confirmUnpublishButton.disabled = state.isUnpublishing` and make only the confirmation action text static. This preserves the existing duplicate-submit guard while removing the visible mismatch.
- Scope coverage to source-level parity in `apps/electron/test/publishing.test.js`, matching the existing publishing parity tests. This is enough for the copy-level regression and avoids creating a brittle DOM harness for a one-line renderer state.

## Risks / Trade-offs

- Users no longer see progress through the confirmation button label. The mitigation is that the button still disables during the in-flight state, which is already the control-state feedback used by this confirmation surface.
- The publish dialog trigger button may still show `Unpublishing` while hidden or disabled. That surface is intentionally out of scope for this change because the native-visible confirmation action is the parity target.
