## Context

SwiftUI routes compiled preview links through `handleWikilink(_:)`. For generated pages, that function appends to `backHistory` only when `selectedFileURL` is non-nil. When the current view is already a generated page, `selectedFileURL` is nil, so generated-to-generated link navigation changes the displayed generated HTML without adding a redundant generated-page back entry.

Electron uses `navigateFromPreviewResult(result)` for both Markdown preview frames and generated preview frames. Its generated branch currently calls `showGeneratedPage(result)` with default history behavior, so a generated page can push another generated page entry where native SwiftUI would not.

## Goals / Non-Goals

**Goals:**
- Keep history insertion when a selected Markdown page opens a generated page link.
- Suppress generated-page history insertion when the current view is already generated.
- Preserve toolbar 3D map behavior, Back/Forward restore behavior, generated page rendering, manual refresh behavior, and watcher behavior.

**Non-Goals:**
- Change main-process generated page resolution.
- Change which generated pages are allowed.
- Change external link handling.
- Change native Swift code.

## Decisions

- Make the preview generated-link branch choose history behavior based on whether `state.selectedFile` is present. This directly mirrors the native `if let current = selectedFileURL` guard.
- Leave `showGeneratedPage` defaults unchanged so toolbar-driven generated page openings still use the same history behavior as before.
- Keep restore paths passing `pushHistory: false` so Back/Forward navigation remains stable.

## Risks / Trade-offs

- Source-level tests can miss runtime edge cases in generated HTML frames -> Keep the change scoped to the branch already covered by preview navigation tests and runtime generated-page evidence.
- Generated-to-generated navigation may feel less navigable than a browser stack -> This is intentional because native SwiftUI does not add that extra app-level history entry.
