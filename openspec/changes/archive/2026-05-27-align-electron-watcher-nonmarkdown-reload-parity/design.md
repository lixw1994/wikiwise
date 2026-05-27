## Context

Native watcher callbacks are not scoped to Markdown before they reload the selected source:

```swift
case .css:
    c.reloadCSS()
    c.invalidateAll()
    if selectedFileURL != nil { recompileCurrentPage(c) }

case .rebuild:
    c.rescan()
    c.invalidateAll()
    if selectedFileURL != nil { recompileCurrentPage(c) }
```

`recompileCurrentPage(_:)` guards only `selectedFileURL`, invalidates the selected slug, calls `loadFile(url)`, and bumps the WebView reload token. That means selected CSS, JSON, HTML, or other source files are reread on CSS and rebuild events in the native app.

Electron currently gates watcher-driven selected-file work behind `currentMarkdownSelected`, so non-Markdown selected source files stay stale after CSS or rebuild watcher events.

## Goals / Non-Goals

**Goals:**

- Reload the selected non-Markdown source file from disk after CSS and rebuild watcher events when Electron has no unsaved draft.
- Refresh selected-file INFO metadata after that watcher reload.
- Preserve existing Markdown watcher refresh behavior, including preview invalidation and CSS reload semantics.
- Preserve structure-priority behavior, generated-page watcher no-op behavior, and file-tree rebuild rescans.

**Non-Goals:**

- Changing native watcher behavior.
- Compiling previews for non-Markdown selected source files.
- Clobbering unsaved Electron editor drafts to mimic native's immediate-save editor model.
- Claiming final migration completion; signed/notarized release evidence remains required.

## Decisions

- Keep the non-Markdown branch inside `handleProjectChanged(change)` because the behavior depends on watcher summary kind and selected renderer state.
- Use the same dirty guard as the existing selected Markdown watcher reload so Electron does not discard unsaved editor content.
- Trigger the non-Markdown reload for `change.kind === "rebuild"` or `change.cssChanged`, matching the native `.rebuild` and `.css` cases that call `recompileCurrentPage(_:)`.
- Refresh INFO metadata after the reload so the right sidebar stays selected-file scoped for all file types.
- Do not call `refreshSelectedMarkdown()` for the non-Markdown branch because native only recompiles the current page when the selected file has a compiled page, and Electron's Markdown preview path remains Markdown-only.

## Risks / Trade-offs

- A dirty Electron non-Markdown editor will intentionally keep its draft during watcher events. This differs from native's direct `loadFile(_:)` call but preserves Electron's explicit unsaved-draft model.
- CSS watcher events can reread a selected non-Markdown file even when that file itself did not change. This mirrors native's selected-file reload side effect and keeps parity with the current SwiftUI implementation.
