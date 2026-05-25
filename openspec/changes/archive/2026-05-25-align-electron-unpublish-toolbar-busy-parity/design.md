## Context

SwiftUI drives both publish and unpublish work through `isPublishing`. The toolbar publish button reads that same state, so an in-flight unpublish disables the toolbar control and shows `PUBLISHING…`. Electron currently separates `state.isPublishing` and `state.isUnpublishing`; this is useful internally, but the toolbar publish control only reads `state.isPublishing`.

## Goals / Non-Goals

**Goals:**
- Make the Electron toolbar publish control enter the native busy state during unpublish.
- Refresh the toolbar state immediately when an unpublish request starts and when it finishes.
- Keep the existing unpublish confirmation dialog behavior and destructive action label unchanged.

**Non-Goals:**
- Rename Electron's internal `isUnpublishing` state.
- Change publish service, preload, or main-process IPC behavior.
- Change publish dialog availability checks or result/error modal copy.

## Decisions

- Use a renderer-local busy expression for toolbar publish state: `state.isPublishing || state.isUnpublishing`. This preserves separate internal lifecycle flags while matching the native toolbar behavior.
- Call `renderPublishStatus()` as soon as `confirmUnpublish()` enters the in-flight state. The existing `finally` render keeps the toolbar state synchronized when the request completes.
- Add source-level parity coverage in `apps/electron/test/publishing.test.js`, matching the existing publishing tests that compare SwiftUI state and renderer state.

## Risks / Trade-offs

- The toolbar still uses the text `PUBLISHING…` during unpublish because that is the native visible state inherited from SwiftUI's shared `isPublishing` flag.
- A separate `UNPUBLISHING…` label might be more semantically precise, but it would move Electron away from the current macOS app and is out of scope for strict parity.
