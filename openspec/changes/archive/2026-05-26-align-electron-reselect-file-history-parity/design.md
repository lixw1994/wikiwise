## Context

SwiftUI `ContentView.navigateTo(_:)` appends to `backHistory` only when the requested file differs from `selectedFileURL`. It clears `forwardHistory` only inside that same actual-file-navigation branch. If the user clicks the active file again, SwiftUI still reloads the file, but the navigation stacks are left alone. Electron's renderer currently pushes `currentHistoryEntry()` and clears `state.forwardHistory` before it knows whether the clicked file is already selected.

## Goals / Non-Goals

**Goals:**

- Prevent active-file reselects from adding duplicate back-history entries.
- Prevent active-file reselects from clearing forward history.
- Keep active-file reselects able to reload content, refresh document info, and render the current detail view.
- Preserve generated-page-to-file navigation, different-file navigation, app Back/Forward, and map/graph history behavior.

**Non-Goals:**

- Change native SwiftUI code.
- Change history de-duplication for generated pages.
- Change watcher refresh, save behavior, file tree rendering, detail-mode selection, or generated-page refresh.
- Add new IPC or preload APIs.

## Decisions

- Compute whether the requested file path matches `state.selectedFile?.path` before mutating history.
  - Rationale: This mirrors the native `current != url` guard directly at the renderer decision point.
  - Alternative considered: Teach `pushHistoryEntry()` to compare against the current entry. That helper does not know whether the caller also intends to clear forward history, so it would leave half the bug in place.
- Keep content reload and info refresh after active-file reselects.
  - Rationale: SwiftUI still calls `loadFile(url)` after the history guard, so Electron should not early-return from `selectFile()`.
- Leave generated-page navigation unchanged.
  - Rationale: Native generated-page-to-file transitions do append the generated page to back history, and Electron already models generated pages separately through `state.generatedPage`.

## Risks / Trade-offs

- [Risk] Future code may reintroduce unconditional forward-history clearing in `selectFile()`. -> Mitigation: add focused source coverage asserting same-file selection preserves both history stacks while different-file and generated-page navigation keep existing behavior.
- [Risk] Avoiding an early return means same-file reselect still does file IO. -> Mitigation: this matches native reload behavior and preserves document info refresh.
