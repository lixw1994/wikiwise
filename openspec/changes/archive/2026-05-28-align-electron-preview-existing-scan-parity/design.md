## Context

Native folder open initializes compiler state once:

```swift
let c = Compiler(sourceDir: url)
compiler = c
c.scanPages()
```

Native selected-file loading then compiles from that existing scan:

```swift
private func loadFile(_ url: URL) {
    ...
    if !FileManager.default.fileExists(atPath: htmlFile.path) {
        if !c.compileSingle(slug: pageSlug) {
            c.compileAdhoc(filePath: url.path, outputPath: htmlFile.path)
        }
    }
}
```

Watcher events are the native paths that refresh scan metadata after content or structure changes. Electron already mirrors those watcher `rescan()` calls in `applyWatchSummary()`, but `compileMarkdownFile()` still calls `scanPages()` on every preview compile request.

## Goals / Non-Goals

**Goals:**

- Match native scan ownership for selected Markdown preview compilation.
- Preserve folder-open `scanPages()` before home preview compilation.
- Preserve watcher `rescan()` behavior before selected-file refreshes caused by file changes.
- Preserve selected-page on-demand compilation and ad-hoc fallback.

**Non-Goals:**

- Changing native SwiftUI behavior.
- Removing save-triggered preview compilation in Electron.
- Changing background compilation scheduling.
- Claiming final migration completion; signed/notarized release evidence remains required.

## Decisions

- Remove `compiler.scanPages()` from the main-process `compileMarkdownFile()` helper.
- Keep the existing project-open scan in `createProjectResult()` so scaffolded home previews compile against prepared metadata.
- Keep `applyWatchSummary()` rescans for markdown, rebuild, and structure changes so watcher-triggered preview refreshes still use fresh metadata.
- Use source-backed tests because the behavior is about which lifecycle path owns compiler scan side effects, not just a direct output value.

## Risks / Trade-offs

- Calling the compile-page IPC for a folder that has not gone through project-open scanning may rely on ad-hoc compile fallback. The native UI also reaches selected preview compilation through an active folder compiler lifecycle, so this preserves user-facing parity.
- Save-triggered preview refresh may still compile before the watcher rescan observes the disk write. That behavior is intentionally left unchanged in this slice because it is a separate save/watch timing question.
