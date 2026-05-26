## Context

Native Wikiwise wires `Refresh Page` through `NotificationCenter` to `refreshWiki`, and `ContentView.recompileCurrentPage(_:)` immediately returns when `selectedFileURL` is nil. Generated map/graph pages set `selectedFileURL` to nil and use `compiledFileURL`, so the native command is a no-op for those pages.

Electron currently routes the menu command to `refreshCurrentView()`, which refreshes `state.generatedPage` before checking `state.selectedFile`. Separately, `handleProjectChanged()` already refreshes active generated pages when rebuild, CSS, or Markdown changes affect compiler output.

## Goals / Non-Goals

**Goals:**

- Match native command behavior by making manual `Refresh Page` affect only selected Markdown files.
- Keep generated page live-refresh behavior for watcher-driven output changes.
- Preserve existing menu labels, accelerators, history behavior, and generated page routing.

**Non-Goals:**

- Do not change generated page opening, map/graph navigation, or external-link routing.
- Do not change how selected Markdown refresh invalidates compiler output.
- Do not alter Swift code.

## Decisions

- Remove the generated-page branch from `refreshCurrentView()` instead of adding a new option flag.
  - Rationale: `refreshCurrentView()` is only used for the manual app command today, while watcher-driven generated refresh is already explicit in `handleProjectChanged()`.
  - Alternative considered: add `refreshCurrentView({ includeGenerated: true })`; rejected because no current caller needs the broader behavior and it would keep the manual command contract ambiguous.

- Keep watcher refresh through `handleProjectChanged()` untouched.
  - Rationale: generated map/graph pages should still update when compiler output changes, matching the existing preview-navigation capability.

## Risks / Trade-offs

- Users lose a convenience refresh for generated pages through Command-R.
  - Mitigation: this matches native behavior, and generated pages still refresh when project output changes.

- Source-level tests could miss future caller changes.
  - Mitigation: tests assert both halves of the contract: manual refresh omits `refreshGeneratedPage()`, while watcher changes still call it.
