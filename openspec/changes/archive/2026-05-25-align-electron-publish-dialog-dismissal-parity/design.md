## Context

SwiftUI's publish sheet button performs `showPublishConfirm = false` before calling `performPublish(subdomain:)`. That means the sheet is gone while the async publish work runs, and any later `Published!` or `Publish Error` alert appears on the app surface. Electron currently sets `state.isPublishing = true`, renders the still-open publish dialog, and only closes it after a successful publish.

## Goals / Non-Goals

**Goals:**
- Close the Electron publish dialog before invoking `window.wikiwise.publishSite`.
- Preserve the existing publish toolbar busy state, publish result modal, and publish error modal behavior.
- Ensure publish failures no longer leave the publish dialog open behind error feedback.

**Non-Goals:**
- Change publish availability validation or subdomain sanitization.
- Change publish service, preload, or main-process IPC behavior.
- Change unpublish confirmation behavior.

## Decisions

- Move `state.isPublishDialogOpen = false` to the start of `publishCurrentProject()`, after publish state is marked busy and before the preload publish request. This mirrors the native action order and works for both button click and Enter default submission because both call `publishCurrentProject()`.
- Keep result/error feedback in `renderPublishFeedback()`. Closing the dialog earlier only changes the underlying sheet lifecycle, not the modal feedback surface.
- Add source-level parity coverage in `apps/electron/test/publishing.test.js` because the existing publishing tests already verify SwiftUI-to-renderer behavioral contracts at the source level.

## Risks / Trade-offs

- A failed publish no longer leaves the user's edited subdomain field visible. This matches native behavior; the error alert is the authoritative feedback and the user can reopen the publish dialog to retry.
- Closing before the request means the publish dialog no longer shows a transient `Publishing` button label. Native closes before that label could be visible, so this is an intentional parity correction.
