## Context

The native SwiftUI app presents publish success through a `Published!` alert. For first publish it renders `Your wiki is live at <url>` followed by a blank line and a reminder that `publish.json` was saved and must be kept safe as the key for future updates. For subsequent updates it renders `Updated <url>`.

Electron already uses a modal surface with the same title and actions, but the result body currently renders `Your wiki is live at:` or `Updated:` and then places the URL in a separate paragraph. That omits the first-publish safety reminder and creates a copy structure that does not match the native alert.

## Goals / Non-Goals

**Goals:**

- Match native publish result body text exactly for first-publish and update flows.
- Keep `Open in Browser` driven by `state.publishResult.url`.
- Keep the modal title and action labels unchanged.
- Prevent duplicate URL display outside the native-style result body.

**Non-Goals:**

- No changes to publishing IPC, publish service responses, or publish config refresh.
- No changes to publish error copy or unpublish confirmation copy.
- No visual redesign of the modal shell.

## Decisions

- Add a small renderer helper that maps a publish result to the native success message.
- Use the helper from `renderPublishFeedback()` so both first-publish and update flows are handled in one place.
- Keep the existing `publish-result-url` element in the DOM for structural stability, but hide and clear it while the native message contains the URL inline.
- Preserve `openPublishResultButton.disabled = !result?.url` and the existing `openPublishedUrl()` behavior.

## Risks / Trade-offs

- Source-level tests prove the copy and rendering logic, but they do not simulate a full publish request. Existing publishing integration and package checks continue to cover the broader Electron surface.
- Keeping the URL element hidden is less invasive than removing markup, but the code must ensure it cannot show a duplicate URL when a result is present.

## State Model

No state shape changes. Existing `state.publishResult` continues to provide `url` and `isFirstPublish`.

## Migration Plan

1. Add a failing publishing test for native publish result body copy and duplicate URL prevention.
2. Add the renderer helper and update `renderPublishFeedback()`.
3. Run targeted and full verification.
4. Archive the change.

## Open Questions

None.
