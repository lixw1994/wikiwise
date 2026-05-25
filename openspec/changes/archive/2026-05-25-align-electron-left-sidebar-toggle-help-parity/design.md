## Context

The native SwiftUI toolbar only shows its custom left-sidebar button when the sidebar is closed. That button uses the `sidebar.left` symbol and the help text `Show Sidebar`. Electron uses a persistent left-sidebar toolbar button for both hide and restore states, but its help text currently stays generic: `Toggle left sidebar`.

## Goals / Non-Goals

**Goals:**

- Expose `Show Sidebar` when Electron's left sidebar is hidden and the toolbar button will restore it.
- Keep `sidebar.left` native symbol evidence unchanged.
- Keep `aria-pressed` and existing visibility behavior unchanged.

**Non-Goals:**

- No changes to the sidebar grid layout, width clamping, resize behavior, or runtime audit mechanics.
- No changes to right-sidebar label behavior.
- No visual redesign.

## Decisions

- Add a tiny helper that returns the left-sidebar control's native-aware help text from `state.isLeftSidebarVisible`.
- Use the helper in `renderProjectToolbar()` after updating the selected/pressed state.
- Keep the static HTML label as a fallback only; runtime render will set the active native-aware label.

## Risks / Trade-offs

- Electron keeps a persistent control while SwiftUI's custom control only appears for restore. This slice does not alter that interaction model; it only moves the restore-state help text closer to native.
- Source-level tests cover the renderer logic. Existing runtime sidebar tests continue to cover hide/restore behavior.

## State Model

No state shape changes. Existing `state.isLeftSidebarVisible` drives the label.

## Migration Plan

1. Add a failing toolbar test for native `Show Sidebar` restore help.
2. Add renderer helper and wire `title` / `aria-label` for the left-sidebar control.
3. Run targeted and full verification.
4. Archive the change.

## Open Questions

None.
