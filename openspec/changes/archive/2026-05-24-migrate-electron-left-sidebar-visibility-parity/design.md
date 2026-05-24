## Context

SwiftUI uses `NavigationSplitView(columnVisibility:)` for the file sidebar. Users can hide the sidebar to give the detail view more space, and the toolbar exposes a restore control when the sidebar is hidden. The Electron renderer currently uses a fixed three-column CSS grid with a permanently visible `.sidebar` column.

## Goals / Non-Goals

**Goals:**
- Add Electron left-sidebar hide/show behavior for opened projects.
- Preserve selected file, expanded tree state, detail mode, right-sidebar visibility, right-sidebar width, and terminal session across toggles.
- Let the detail area occupy the left-sidebar column when hidden.
- Retain runtime audit evidence that the sidebar hides and restores without viewport overflow.

**Non-Goals:**
- Add manual drag resizing for the left sidebar; the native custom resize gap only exists on the right sidebar.
- Replace the Electron toolbar with native macOS toolbar APIs in this phase.
- Change file tree scanning, expansion, or selection semantics beyond preserving them across visibility changes.

## Decisions

1. Store left-sidebar visibility in renderer state.

   `state.isLeftSidebarVisible` mirrors SwiftUI's `sidebarVisibility` at the level needed by Electron. This keeps the feature local to the renderer and avoids persistence because the native app does not store this visibility as an app setting.

2. Drive layout through a project-shell class.

   The project grid will add `left-sidebar-hidden` when hidden. CSS changes the grid from `260px minmax(0, 1fr) var(--right-sidebar-width)` to `minmax(0, 1fr) var(--right-sidebar-width)`, and assigns the detail column to the first visible content column. This avoids removing file tree DOM nodes and naturally preserves tree expansion state.

3. Keep one toolbar control for Electron.

   SwiftUI relies on the native split-view toggle when visible and shows a restore button when hidden. Electron does not have a native split-view control, so one stable `#toggle-left-sidebar` toolbar button will hide and restore the left sidebar while exposing selected state for visual feedback and runtime tests.

4. Runtime audit will exercise both directions.

   Project scenarios will click the left-sidebar control, record before/hidden/restored sidebar visibility and detail width, and fail when the sidebar does not hide, does not restore, or the detail area fails to expand while hidden.

## Risks / Trade-offs

- [Risk] Hiding the sidebar could discard tree state if DOM is rebuilt. -> Keep the sidebar DOM mounted and only apply `hidden`, preserving renderer `expandedTreePaths`.
- [Risk] CSS grid column changes could conflict with the already draggable right sidebar. -> Reuse `--right-sidebar-width` and keep right-sidebar hidden and visible grid variants explicit.
- [Risk] Runtime audit might click the control before the project layout settles. -> Wait for opened-project state and tree evidence before toggling.

## Migration Plan

1. Add contract tests for the toolbar button, renderer state, CSS hidden-grid class, and runtime audit evidence.
2. Implement left-sidebar state, toolbar toggle, class updates, and CSS grid variants.
3. Extend runtime audit to click hide/show and assert evidence.
4. Run focused and full verification, archive the OpenSpec change, and commit.

Rollback is limited to removing the toolbar control, visibility state, CSS grid variants, and audit fields; the fixed visible sidebar behavior would return.

## Open Questions

None for this phase.
