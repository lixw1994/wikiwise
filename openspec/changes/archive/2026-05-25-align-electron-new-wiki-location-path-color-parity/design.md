## Context

The SwiftUI new-wiki sheet renders `Text(newWikiLocation?.path ?? "~/wikis")` with `.foregroundStyle(Color.sidebarTextMuted)`. Electron's `.location-path` already matches the native 12px system-font treatment, 6px label spacing, and middle truncation behavior, but it uses `--color-muted-text` instead of the sidebar muted token that maps to `Color.sidebarTextMuted`.

## Goals / Non-Goals

**Goals:**
- Align the Electron selected location path color with native `Color.sidebarTextMuted`.
- Preserve the existing `.location-path` font size, spacing, truncation, and full-path metadata behavior.
- Avoid changing publish, feedback, availability, or other surfaces that intentionally use shared muted text styling.

**Non-Goals:**
- Rework the global muted color palette.
- Change field label color, button chrome, or text-field density already covered by prior slices.
- Add runtime behavior or dependencies.

## Decisions

- Change only the `.location-path` color token to `--color-sidebar-text-muted`.
  - Rationale: The native color declaration is specific to the new-wiki selected path, and the Electron palette already exposes the matching adaptive sidebar muted token.
  - Alternative considered: changing `--color-muted-text` globally. That would affect publish URL affixes, availability text, and other non-new-wiki copy outside this parity slice.
- Add a source-level parity test that ties the SwiftUI `Color.sidebarTextMuted` declaration to the Electron `.location-path` token.
  - Rationale: Existing new-wiki tests use this lightweight source comparison pattern for incremental visual parity.

## Risks / Trade-offs

- The color token change is subtle and source-level tests do not compare rendered pixels -> keep the assertion tied directly to the native SwiftUI color declaration and continue relying on package/build checks for integration coverage.
- Other components may still use broader muted tokens -> keep this slice scoped to the selected location path and defer unrelated color audits to later OpenSpec changes.
