## Context

The native SwiftUI new-wiki sheet renders its `Name` and `Location` labels with `Color.sidebarText`. The Electron renderer has already aligned the sheet width, padding, spacing, title typography, label typography, text-field density, location truncation, and scoped button chrome, but `.new-wiki-panel .field-label` does not override the shared `.field-label` color.

## Goals / Non-Goals

**Goals:**
- Align the Electron new-wiki field label color with native `Color.sidebarText`.
- Keep the existing new-wiki 12px medium label typography.
- Preserve shared field label color behavior for publish and other modal surfaces.

**Non-Goals:**
- Rework the broader modal color system.
- Change publish, unpublish, feedback, or other non-new-wiki dialog label styling.
- Introduce new dependencies or runtime behavior.

## Decisions

- Add the color override to the scoped `.new-wiki-panel .field-label` selector.
  - Rationale: The mismatch is specific to the new-wiki sheet and SwiftUI's `Color.sidebarText` already maps to the Electron `--color-sidebar-text` token.
  - Alternative considered: changing the shared `.field-label` color. That would risk changing other dialogs whose styling is outside this parity slice.
- Cover the change with a source-level renderer parity test.
  - Rationale: Existing Electron parity tests compare SwiftUI declarations with renderer HTML/CSS source and are the lightweight contract for these incremental slices.

## Risks / Trade-offs

- Shared selectors can accidentally affect other dialogs if changed broadly -> keep the implementation under `.new-wiki-panel`.
- Source-level tests do not render pixels -> keep this as a narrow parity contract and rely on packaging/build checks for integration coverage.
