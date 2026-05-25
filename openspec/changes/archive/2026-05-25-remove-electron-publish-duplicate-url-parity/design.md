## Context

`Sources/Wikiwise/ContentView.swift` renders the native publish sheet with a single URL row: `https://`, the editable subdomain field, `.wiki-wise.com`, a spacer, and the availability indicator. The Electron publish dialog mirrors that row but also includes a separate `#publish-url` paragraph immediately below it, and `renderer.js` updates that paragraph on every dialog render.

## Goals / Non-Goals

**Goals:**

- Match the native publish sheet by showing the final URL shape only in the editable URL row.
- Remove renderer state updates for the duplicate URL paragraph.
- Preserve subdomain editing, availability feedback, publish/unpublish actions, and publish result feedback.

**Non-Goals:**

- Changing publishing service behavior or `publish.json` handling.
- Changing the publish success alert body, where the native app intentionally includes the published URL.
- Changing the new-wiki location path, which still uses the shared `location-path` style for a different dialog.

## Decisions

- Remove the `#publish-url` element instead of hiding it. Keeping a hidden element would preserve a stale DOM surface that the native sheet does not have and would invite future renderer updates to reintroduce duplicate copy.
- Remove the `publishUrl` DOM query and assignment from `renderer.js`. The URL row already carries the visible URL shape, so the renderer only needs to update the subdomain input and availability state.
- Keep `.location-path` styles intact because the new-wiki dialog still uses them.

## Risks / Trade-offs

- Regression tests that used `#publish-url` as a general publishing marker must be tightened to assert the native no-duplicate contract instead.
- Runtime behavior should be unchanged aside from the removed visual duplicate; the publish payload continues to use `state.publishSubdomain`.
