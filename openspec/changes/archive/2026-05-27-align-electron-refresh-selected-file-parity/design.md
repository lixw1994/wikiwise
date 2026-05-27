## Context

The native SwiftUI app exposes Refresh Page through the File command group and broadcasts it to each `ContentView`. When a compiler exists, `recompileCurrentPage(_:)` only guards that `selectedFileURL` is present, then invalidates the slug, calls `loadFile(_:)`, and increments the reload token. Because native tree selection can select non-Markdown plain-text files, manual refresh reloads both Markdown and non-Markdown selected files while generated pages remain unchanged because they clear `selectedFileURL`.

Electron currently receives the same app command but `refreshCurrentView()` only calls the Markdown preview refresh path when the selected path ends in `.md`. Non-Markdown selections keep stale file content until the user reselects the file.

## Goals / Non-Goals

**Goals:**
- Match native selected-file refresh behavior for non-Markdown source files by rereading the active file from disk.
- Preserve Markdown preview invalidation and refresh behavior.
- Preserve generated map/graph behavior: no selected file means no manual refresh.
- Keep the change local to the Electron renderer command path and its parity tests.

**Non-Goals:**
- Change file watching semantics for non-Markdown files.
- Refresh generated map/graph pages directly from the manual command.
- Alter save/autosave behavior or standalone/project open semantics.

## Decisions

- Add a selected-file refresh branch for non-Markdown files in `refreshCurrentView()`.
  - Rationale: this is the closest Electron equivalent of native `loadFile(_:)` for a selected text file and avoids changing selection history or toolbar state.
  - Alternative considered: call `selectFile(state.selectedFile, { pushHistory: false })`; rejected because it runs the broader selection path, including active-file side effects and mode calculation, when native refresh only reloads current-file state.
- Leave `refreshSelectedMarkdown()` Markdown-only.
  - Rationale: Markdown refresh owns preview compilation and document-info behavior. Extending it to all files would blur concerns and make generated/preview behavior easier to regress.
- Keep generated pages gated by the absence of `state.selectedFile`.
  - Rationale: native generated pages set `selectedFileURL = nil`, so `recompileCurrentPage(_:)` returns before loading anything.

## Risks / Trade-offs

- A dirty Electron editor draft could be overwritten by manual refresh if a user invokes Refresh while unsaved content exists. Native writes editor changes through its editor binding rather than maintaining the same dirty buffer model, so this matches the command's source-of-truth reload semantics; autosave coverage remains separate.
- Static parity tests could miss a runtime UI regression. Mitigation: keep the implementation in the small renderer command path and run the Electron test suite, package build, and runtime audit after the change.
