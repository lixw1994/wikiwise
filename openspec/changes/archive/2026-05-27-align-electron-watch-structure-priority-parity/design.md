## Context

Native `FileWatcher` coalesces CSS, structure, rebuild, and markdown path state during the debounce window. When the work item fires, it calls `.rebuild` first, `.structure` second, and only emits `.markdown(mdPaths)` when no structure event is pending:

```swift
if hasRebuild {
    watcher.callback(.rebuild)
} else if hasStructure {
    watcher.callback(.structure)
} else {
    if hasCSS { watcher.callback(.css) }
    if !mdPaths.isEmpty { watcher.callback(.markdown(mdPaths)) }
}
```

`ContentView` also documents that structure changes do not recompile the current page. Electron currently returns a `structure` summary with `changedMarkdownPaths`, which lets the renderer read and recompile selected markdown during a structure event.

## Goals / Non-Goals

**Goals:**

- Match native structure-priority behavior by omitting markdown paths from structure summaries.
- Preserve markdown path payloads for content summaries when no structure/rebuild event wins priority.
- Preserve CSS, rebuild, support-file, output-prefix, and `/wiki/assets/` classification behavior.
- Retain RED/GREEN coverage anchored to native `FileWatcher` and `ContentView` source.

**Non-Goals:**

- Changing renderer refresh logic for normal markdown content events.
- Changing tree refresh behavior for structure or rebuild events.
- Changing FSEvents debounce timing or Electron watcher debounce timing.
- Claiming final migration completion; signed/notarized release evidence remains required.

## Decisions

- Change only the shared `summarizeWatchEvents()` structure-return branch to return an empty markdown path list. Electron main and renderer already consume this shared summary, so fixing it there keeps the call path centralized.
- Keep collecting markdown paths while scanning events; this preserves content behavior if no higher-priority event appears and keeps the implementation close to the existing shape.
- Add a core behavior test showing a markdown content event plus a rename structure event returns a structure summary with no markdown paths.
- Add an Electron source parity test that anchors the shared helper to native `.structure` and `ContentView`'s no-recompile structure branch.

## Risks / Trade-offs

- Electron will stop refreshing selected markdown content for a debounce batch that includes both a selected markdown edit and a structure event. That matches native behavior, but it can feel less eager when external edits and file additions land together.
- The behavior relies on the renderer respecting `changedMarkdownPaths` for selected markdown refreshes. Existing tests already cover that path, and this change narrows the payload produced for structure summaries.
