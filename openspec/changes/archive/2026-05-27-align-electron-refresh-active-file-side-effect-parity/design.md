## Context

Native `ContentView.loadFile(_:)` ends by writing the selected source path:

```swift
private func loadFile(_ url: URL) {
    ...
    writeActiveFile(url)
}
```

Native manual refresh and selected-file watcher refreshes route through `recompileCurrentPage(_:)`:

```swift
private func recompileCurrentPage(_ c: Compiler) {
    guard let url = selectedFileURL else { return }
    c.invalidateSingle(slug: slug(for: url))
    loadFile(url)
    webViewReloadToken += 1
}
```

Because `loadFile(url)` is reused, native refresh paths rewrite `.claude/active-file` for both Markdown and non-Markdown selected source files. Electron currently uses `setActiveSelectedFile()` for selection and save parity, and that helper already preserves native `try?`-style silence by swallowing preload failures. Refresh and watcher paths bypass the helper.

## Goals / Non-Goals

**Goals:**

- Match native active-file side effects for manual Refresh Page when a selected Markdown source is refreshed.
- Match native active-file side effects for manual Refresh Page when a selected non-Markdown source is reread from disk.
- Match native active-file side effects for watcher CSS/rebuild/selected-Markdown reload paths that refresh the currently selected source file.
- Reuse existing silent active-file error behavior.

**Non-Goals:**

- Changing native SwiftUI behavior.
- Writing active-file for generated pages, because native `recompileCurrentPage(_:)` returns when no source file is selected.
- Overwriting dirty non-Markdown watcher drafts; existing draft preservation remains authoritative.
- Claiming final migration completion; signed/notarized release evidence remains required.

## Decisions

- Keep `setActiveSelectedFile()` as the single renderer-side active-file side-effect helper. This preserves the existing no-global-error behavior already aligned with native `try?`.
- Add the helper call inside `refreshSelectedMarkdown()` after a selected Markdown refresh completes. Manual Markdown refresh, watcher CSS refresh, watcher rebuild refresh, and selected Markdown file-change refresh all share this path.
- Add the helper call to the manual non-Markdown Refresh Page path after the selected file is successfully reread and rendered.
- Add the helper call to `reloadSelectedFileFromDisk()` after watcher-driven selected non-Markdown reloads refresh the selected content.
- Leave generated-page Refresh Page behavior unchanged; it remains guarded by selected source file state.

## Risks / Trade-offs

- Writing active-file on watcher refresh may be redundant when the same file is already active, but native does the same by rerunning `loadFile(url)`.
- `refreshSelectedMarkdown()` becomes a side-effecting helper for active-file writes. Existing call sites are manual refresh and watcher refresh paths, which are the native paths being aligned.
