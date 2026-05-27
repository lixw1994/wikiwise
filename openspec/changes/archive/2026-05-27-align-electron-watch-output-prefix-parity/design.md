## Context

Native `FileWatcher` filters generated output before classifying a watched path:

```swift
if path.hasPrefix(watcher.outputDir) { continue }
```

This is a raw absolute-path prefix check. Electron currently resolves event paths and calls `isPathInside(eventPath, outputDir)`, which ignores `site/out/home.html` but not sibling-prefix paths such as `site/output-note.md`. The latter is unusual in a scaffolded project, but native skips it because the path string starts with the output directory path.

## Goals / Non-Goals

**Goals:**

- Match native output-prefix filtering for watcher events.
- Preserve current ignoring for actual output directory descendants.
- Keep watcher priority behavior unchanged for `.rebuild`, structure, CSS, markdown, support-file, and `/wiki/assets/` events that are not output-prefix paths.
- Retain RED/GREEN evidence anchored to `Sources/Wikiwise/FileWatcher.swift`.

**Non-Goals:**

- Changing the compiler output directory layout.
- Changing generated site routing or preview navigation.
- Broadening filesystem filtering for other project paths.
- Claiming final migration completion; signed/notarized release evidence remains required.

## Decisions

- Update only the shared `summarizeWatchEvents()` filtering helper in `@wikiwise/core`. Electron main already delegates watcher coalescing to that helper, so this preserves a single classification source.
- Use a native-like helper that compares resolved absolute path strings with `startsWith(resolvedOutputDir)`. This intentionally mirrors Swift `hasPrefix` rather than path-boundary containment.
- Add a root behavior test for a real output descendant and a sibling-prefix path, plus an Electron source test that anchors the helper to the native `path.hasPrefix(watcher.outputDir)` guard.

## Risks / Trade-offs

- Prefix matching can ignore unusual sibling paths such as `site/output-note.md`. That is the point of this parity change: it follows native behavior exactly instead of imposing a stricter JavaScript interpretation.
- The helper is macOS-migration oriented. It still uses resolved Node paths, which is sufficient for the Electron macOS target and keeps the change minimal.
