## Context

SwiftUI renders the project sidebar as a `ScrollView` containing a `VStack`: a single `Text("FILES")` header with 9pt regular monospaced typography, 1.6 tracking, 18pt horizontal padding, 6pt top padding, and 10pt bottom padding, followed by the file tree rows. The project display name lives in the window toolbar, not inside the sidebar.

Electron currently renders `<p class="eyebrow">Files</p>`, a visible `<h2 id="project-name">Wikiwise</h2>`, then the file tree. The generic eyebrow style makes the header 12px bold uppercase and the file tree starts after an additional margin.

## Goals / Non-Goals

**Goals:**

- Match the native left-sidebar header structure: `FILES` then file tree.
- Keep project-name display in the toolbar only.
- Align Electron sidebar header typography and spacing with native source values.
- Preserve all existing file tree behavior.

**Non-Goals:**

- Rework the file tree renderer or row styles.
- Change sidebar width, resize, or visibility behavior.
- Change new-wiki, welcome, or right-sidebar UI.

## Decisions

- Remove the sidebar `<h2 id="project-name">` element and the renderer's `projectName` binding instead of hiding it with CSS. Native does not have that element, so removing it keeps DOM structure closer to the source of truth.
- Keep `#toolbar-project-name` as the only project-name binding in the project shell.
- Add a `.sidebar .eyebrow` override for native header values rather than changing the global `.eyebrow` style, because post-create guide headings still use the generic eyebrow class.
- Remove the file-tree top margin so the tree follows the header after the native-equivalent bottom padding.

## Risks / Trade-offs

- Some tests may have assumed `#project-name` exists. Updating them to use `#toolbar-project-name` keeps the app contract aligned with native behavior.
- CSS `letter-spacing: 1.6px` approximates SwiftUI `.tracking(1.6)` in browser layout; exact font rendering remains platform-dependent, but the structural values are now explicitly guarded.

## State Model

No state model changes. Project state still stores `projectName`, and `renderApp()` still writes it to the toolbar title when a project is open.

## Migration Plan

1. Add a failing structural parity test for native sidebar header structure and styling.
2. Remove the sidebar project heading from Electron markup and renderer bindings.
3. Add sidebar-specific CSS overrides for native header typography/spacing.
4. Run targeted and full validation, then archive the OpenSpec change.

## Open Questions

None.
