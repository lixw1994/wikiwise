## Context

SwiftUI attaches contextual `.help(...)` text to the publish toolbar button in `ContentView.swift`. Electron has the same toolbar action and publish state, but `renderPublishStatus()` currently only updates disabled state and visible text.

## Goals / Non-Goals

**Goals:**

- Mirror the native unpublished publish help string.
- Mirror the native published help shape with last publish time, published URL, and URL-change hint.
- Keep the publish control accessible by applying the same contextual text to both `title` and `aria-label`.

**Non-Goals:**

- Change publish, update, or unpublish service behavior.
- Add Option-click behavior or change how the publish dialog opens.
- Change native SwiftUI code.

## Decisions

- Centralize help text generation in a small renderer helper so state formatting is easy to test and reuse.
- Call the helper from `renderPublishStatus()` because that function already reacts to publish config refreshes and publishing state changes.
- Use the same fallback as SwiftUI for unknown publish time: `never`.

## Risks / Trade-offs

- Browser tooltips are not visually identical to AppKit help balloons -> mitigated by matching content and making the accessibility label reflect the same state.
- Published configs without a URL would produce incomplete help -> mitigated by falling back to the unpublished destination text unless a URL exists.
