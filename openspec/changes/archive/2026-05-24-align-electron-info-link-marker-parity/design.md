## Context

SwiftUI's `RightSidebar` maps each wikilink target to `Text("↗ \(link)")`. Electron's `renderInfoLink()` currently builds the same list item with `-> ${target}`. The underlying wikilink parsing and optional-section rendering already exist; only the visible marker differs.

## Goals / Non-Goals

**Goals:**

- Use the same `↗` prefix for Electron INFO linked rows.
- Keep the current list structure and conditional rendering.
- Add a focused source test that prevents regression back to ASCII markers.

**Non-Goals:**

- Change wikilink parsing, sorting, or de-duplication.
- Make linked rows navigable.
- Change right sidebar layout or terminal behavior.

## Decisions

- Update only `renderInfoLink()` so the change is scoped to the visible row text.
- Test against `Sources/Wikiwise/RightSidebar.swift` so the Electron expectation tracks the native source.

## Risks / Trade-offs

- Unicode marker rendering depends on available fonts -> mitigated by using the exact native marker and existing text styling.
