## Context

`RightSidebar.swift` builds optional INFO content with conditional SwiftUI blocks: `DIRECTIONS` appears only when `parseDirections(from:)` returns a value, and `LINKED` appears only when `wikilinkTargets(in:)` is non-empty. The Electron renderer already receives equivalent data from `summarizeDocumentInfo`, but its static HTML always contains both sections and `renderInfoTab()` fills empty values with `None` or blank placeholders.

## Goals / Non-Goals

**Goals:**
- Match native INFO behavior for markdown files with no directions or wikilinks.
- Preserve native INFO behavior for markdown files that do contain directions and/or wikilinks.
- Make the runtime audit click the INFO tab and retain evidence that scaffolded `home.md` hides both optional sections.

**Non-Goals:**
- Change document-info parsing rules.
- Change terminal behavior, right-sidebar resizing, or the default TERMINAL tab.
- Redesign right-sidebar typography or section spacing beyond what is needed for conditional visibility.

## Decisions

- Keep the static section containers in `index.html`, but give them stable IDs for `DIRECTIONS` and `LINKED`.
  - Rationale: the renderer can toggle `hidden` without rebuilding large DOM fragments, and tests/audit can inspect stable elements.
  - Alternative considered: fully creating/removing section nodes in JavaScript; rejected because it adds complexity without matching a user-visible requirement better.

- Treat optional sections as visible only when their data is present.
  - Rationale: this matches the native `if let directions` and `!wikilinkTargets(...).isEmpty` conditions.
  - Alternative considered: leaving headings visible with `None`; rejected because the native app omits those headings entirely.

- Use the existing scaffolded runtime project as the empty-state audit case.
  - Rationale: scaffolded `wiki/home.md` has no frontmatter directions and no wikilinks, making it a stable fixture for the native empty optional-section state.
  - Alternative considered: creating a second runtime fixture with directions/links; deferred because source tests already guard the populated branch and this change is closing the empty-state mismatch.

## Risks / Trade-offs

- Hiding sections can leave the INFO panel very compact for fresh files -> this is the native behavior and is preferable to placeholder-only sections.
- Runtime audit must temporarily switch from TERMINAL to INFO -> the audit should restore no user state because it runs in an isolated hidden window.
- If scaffold templates later add wikilinks or directions to `home.md`, the audit fixture may need to select another markdown file with empty optional INFO metadata.
