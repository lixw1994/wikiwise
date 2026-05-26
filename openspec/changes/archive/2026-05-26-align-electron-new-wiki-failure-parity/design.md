## Context

SwiftUI's `createNewWiki()` wraps `WikiScaffold.create(at:name:)` in a `do/catch`. On success it dismisses the sheet, shows the post-create guide, and opens the wiki URL. On failure it prints the scaffold error and sets `showNewWikiSheet = false`; it does not set the post-create guide state or open a project.

Electron already mirrors the success path through `window.wikiwise.createNewWiki()` followed by `applyProjectResult(result.project, { showPostCreateGuide: true })`. The mismatch is isolated to the `catch` path, where Electron currently calls `setError(error)` and leaves the dialog open.

## Goals / Non-Goals

**Goals:**
- Match the native failure path by dismissing the create dialog after scaffold failure.
- Avoid applying a project result or showing the post-create guide after failure.
- Avoid keeping a visible shell error panel for scaffold creation failure.
- Keep the existing success path and disabled-in-progress behavior unchanged.

**Non-Goals:**
- Change main-process scaffold creation semantics or validation.
- Add a new user-facing failure alert that native SwiftUI does not currently show.
- Change create-new-wiki sheet layout, copy, keyboard shortcuts, or post-create guide styling.
- Change release readiness or signing behavior.

## Decisions

- Keep `setError(null)` before submission so prior visible errors are cleared before the attempt.
- In the renderer `catch`, log the failure with `console.error(error)`, close the dialog, and explicitly keep `showPostCreateGuide` false.
- Leave project application exclusively in the success branch so a failed scaffold cannot open or replace the current project.

## Risks / Trade-offs

- Users will not see a visible failure message if scaffold creation fails. This matches current native behavior, and console logging retains developer diagnostics.
- Dismissing on failure may make retry less direct. Mitigation: the welcome action remains available and the existing default location/name initialization is preserved on the next open.
- Source-level coverage cannot execute the real SwiftUI catch path. Mitigation: tests pin both the native source behavior and the Electron renderer catch branch.
