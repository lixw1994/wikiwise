## Context

SwiftUI declares the publish sheet confirmation as `Button("Publish")`, and the previous dismissal parity change now closes the dialog before the publish request begins. Electron still computes the confirmation label from `state.isPublishing`, which leaves a non-native `Publishing` branch in the dialog renderer even though the dialog is no longer supposed to remain visible during the publish request.

## Goals / Non-Goals

**Goals:**
- Keep the Electron publish dialog confirmation action text fixed at `Publish`.
- Preserve existing disabled-state behavior through `canPublish()`.
- Update the publishing parity test so it asserts the native static confirmation label instead of the stale transient label.

**Non-Goals:**
- Change toolbar busy text; the toolbar still uses native `PUBLISHING…`.
- Change publish submission timing or publish result/error modal behavior.
- Change availability validation or publish service behavior.

## Decisions

- Replace the renderer's `state.isPublishing ? "Publishing" : "Publish"` branch with a static `Publish` assignment. This mirrors the SwiftUI action label and removes a branch that became obsolete once the dialog started closing before publish work begins.
- Keep the test in `apps/electron/test/publishing.test.js` source-level, matching the rest of the publishing parity suite.

## Risks / Trade-offs

- If a future bug leaves the dialog open while publishing, it will still show `Publish` while disabled. That is acceptable for parity because native closes the sheet before publishing work and never exposes a `Publishing` sheet button.
