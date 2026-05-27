## Context

Native `RightSidebar.infoTab` receives only `selectedFileURL` and calls `formattedModDate(_:)`, `formattedWordCount(_:)`, `parseDirections(from:)`, and `wikilinkTargets(in:)` without checking the file extension. The Electron main process and shared core already support that shape: `getDocumentInfo()` validates project containment, then `summarizeDocumentInfo()` reads the selected file and returns metadata without a Markdown guard.

The mismatch is in the renderer. `refreshDocumentInfo()` returns early for non-Markdown paths, and `saveSelectedFile()` only refreshes INFO metadata after Markdown saves. A selected non-Markdown file therefore keeps fallback INFO rows even when metadata is available.

## Goals / Non-Goals

**Goals:**
- Request document-info metadata for every selected file path inside the current project root.
- Refresh INFO metadata after saving any selected text/source file.
- Refresh INFO metadata after manual Refresh Page reloads a selected non-Markdown file from disk.
- Preserve existing metadata fallback behavior when the IPC rejects or metadata is unavailable.

**Non-Goals:**
- Change the core document-info parser rules for directions or wikilinks.
- Change watcher semantics for non-Markdown file changes.
- Change terminal startup, tab behavior, or right-sidebar layout/styling.

## Decisions

- Remove the renderer Markdown extension guard from `refreshDocumentInfo()`.
  - Rationale: native `RightSidebar` scopes INFO metadata to the selected file URL, not to Markdown. Main-process path validation is already the safety boundary.
  - Alternative considered: add a separate non-Markdown metadata path. Rejected because it would duplicate the existing native-compatible core metadata helper.
- Refresh document info unconditionally after a successful save for the still-selected file.
  - Rationale: native metadata is derived from the current file, so saved source changes should update the INFO tab regardless of extension.
- Keep compile/preview refresh logic Markdown-only.
  - Rationale: this change is about INFO metadata, not compiled preview availability.

## Risks / Trade-offs

- Non-Markdown binary files could produce read errors if they enter the selected-file surface. Existing file-tree and picker filters are text/source oriented, and the renderer already handles document-info failures with native fallback rows.
- Running metadata extraction on large non-Markdown text files adds small extra work after selection or save. This matches the native sidebar behavior and reuses the existing synchronous core helper behind IPC.
