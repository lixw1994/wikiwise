## Context

SwiftUI's `NavigationSplitView` supplies the native sidebar toolbar affordance while the left sidebar is visible. `ContentView.swift` adds a custom `sidebar.left` button only when `sidebarVisibility != .all`, and that custom control uses the `Show Sidebar` help text with disabled toolbar coloring.

Electron cannot receive SwiftUI's system split-view toolbar item, so it keeps a web-rendered `#toggle-left-sidebar` button for both directions. Previous phases aligned the icon, color, width, title offset, and hide/restore behavior, but retained split-view toolbar affordance parity as a known follow-up because the button did not distinguish the native visible and hidden affordance states.

## Goals / Non-Goals

**Goals:**

- Make the Electron left-sidebar toolbar button expose which native affordance state it represents.
- Preserve one stable control so the sidebar remains hideable and restorable in Electron.
- Record runtime audit evidence before hiding and while hidden.
- Keep existing layout, title offset, file-tree state, and terminal evidence unchanged.

**Non-Goals:**

- Replace the Electron renderer toolbar with native macOS `NSToolbar` APIs.
- Change right-sidebar toolbar behavior.
- Persist sidebar visibility or width.
- Change the local unsigned packaging or signed release workflow.

## Decisions

- Use state metadata on the existing button rather than adding a second button. When the sidebar is visible, the button will expose `data-native-affordance="system-split-view-toggle"` and `data-sidebar-action="hide"`; when hidden, it will expose `data-native-affordance="custom-restore-control"` and `data-sidebar-action="show"`.
- Keep visual treatment tied to existing native color rules. The visible system-surrogate state stays toolbar text colored; the hidden restore state stays toolbar disabled colored with `Show Sidebar` help text.
- Extend runtime audit evidence inside the existing left-sidebar toggle capture. The audit already hides and restores the sidebar, so recording `title`, `aria-label`, `data-native-symbol`, `data-native-affordance`, and `data-sidebar-action` before and after hiding gives direct evidence without adding a new scenario.
- Update roadmap requirements that previously kept split-view toolbar affordance parity open. Signed/notarized release execution remains outside this local slice.

## Risks / Trade-offs

- [Risk] A web-rendered button is still not a real SwiftUI system toolbar item. -> Mitigation: represent the native state contract explicitly and keep behavior testable; native toolbar replacement remains a larger architectural decision if Electron later adopts native window toolbar integration.
- [Risk] Metadata-only evidence could drift from actual behavior. -> Mitigation: runtime audit pairs the metadata with real hide/restore interaction, detail expansion, and toolbar title offset checks.
- [Risk] Existing tests expect generic left-sidebar toggle labels. -> Mitigation: update tests to require state-specific `Hide Sidebar` and `Show Sidebar` semantics.

## Migration Plan

1. Add failing source tests for split-view affordance metadata and runtime audit evidence.
2. Update renderer toolbar rendering to write state-specific affordance metadata.
3. Extend the runtime audit left-sidebar evidence and assertions.
4. Validate the OpenSpec change, run focused and full verification, archive, commit, and push.
