## Context

Native watcher changes in `ContentView.startFileWatcher(directory:compiler:)` call `recompileCurrentPage(_:)` only when `selectedFileURL` is non-nil. Generated pages such as `map-3d.html` are represented through `compiledFileURL` with `selectedFileURL` set to nil. `WebView.updateNSView` reloads only when the `fileURL` or `reloadToken` changes, and watcher changes do not update either value for an already active generated page.

Electron currently computes `generatedOutputChanged` in `handleProjectChanged()` and calls `refreshGeneratedPage()` for rebuild, CSS, or markdown changes while a generated page is active. That keeps generated pages fresher than native, but it violates the "macOS native version exactly" acceptance standard.

## Goals / Non-Goals

**Goals:**

- Match native behavior by leaving active generated pages untouched during watcher events.
- Preserve selected Markdown watcher refresh behavior for rebuild, CSS, and changed selected markdown files.
- Preserve generated page routing, history, external-link handling, and opening generated pages through the main process.

**Non-Goals:**

- Do not change compiler output generation or background compilation.
- Do not change manual Refresh Page behavior, which is already scoped to selected Markdown.
- Do not remove `refreshGeneratedPage()` if it remains useful for future explicit generated-page refresh paths.

## Decisions

- Remove `generatedOutputChanged` handling from `handleProjectChanged()`.
  - Rationale: watcher delivery is the only Electron path that currently makes active generated pages reload unlike native.
  - Alternative considered: gate generated refresh to only rebuild events. Rejected because native rebuild also leaves generated pages active without changing `reloadToken`.

- Keep `refreshGeneratedPage()` defined but unused by watcher handling.
  - Rationale: it is a small helper around `openGeneratedPage()` and can support future explicit behavior without changing this native watcher contract.

## Risks / Trade-offs

- Active generated maps/graphs may show stale output until the user navigates away/reopens them.
  - Mitigation: this is the native behavior, and opening a generated page still loads current output through the main process.

- Existing tests/specs expected generated pages to refresh on watcher changes.
  - Mitigation: update the requirement and regression coverage to cite the native selected-file and WebView reload-token evidence.
