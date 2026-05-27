## Context

The native watcher intentionally filters paths before dispatching any callback:

```swift
} else if path.hasSuffix(".css") {
    watcher.pendingCSS = true
} else if path.hasSuffix(".md") {
    ...
}
```

These Swift string suffix checks are case-sensitive. The JavaScript core watcher summary currently uses `/\.css$/i` and `/\.md$/i`, which broadens the watcher surface beyond native behavior. Other app surfaces may still treat Markdown extensions case-insensitively where the native app does; this change is only about live watcher event classification.

## Goals / Non-Goals

**Goals:**

- Match native watcher classification for `.md` and `.css` suffix case sensitivity.
- Keep lower-case `.md` and `.css` watcher refresh behavior unchanged.
- Preserve structure-event priority and support-file watcher behavior.
- Add RED/GREEN coverage proving upper-case `.MD` and `.CSS` watcher events are ignored.

**Non-Goals:**

- Changing file-tree visibility, editor detail-mode selection, compiler resource scanning, or preview markdown lookup semantics.
- Changing native `FileWatcher` or broadening which site support files trigger structure refreshes.
- Claiming final migration completion; signed/notarized release evidence remains required.

## Decisions

- Change only `summarizeWatchEvents()` in `@wikiwise/core`. Electron main already routes watcher event coalescing through that helper, so the parity correction stays centralized.
- Use direct string suffix checks (`eventPath.endsWith(".css")`, `eventPath.endsWith(".md")`) to make the intended case-sensitive behavior clear.
- Add one core behavior test for upper-case watcher events and one Electron source parity test that anchors the main watcher path to native `FileWatcher`.

## Risks / Trade-offs

- Upper-case Markdown or CSS edits may still be visible or compilable elsewhere, but live watcher refresh will not fire for those upper-case extensions. This mirrors the current native app.
- Users relying on Electron's broader watcher behavior for `.MD`/`.CSS` will lose that extra refresh path; explicit refresh and lower-case wiki files remain unchanged.
