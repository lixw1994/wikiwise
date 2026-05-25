## Context

`Sources/Wikiwise/RightSidebar.swift` renders `LINKED` as a section with a header, then a nested `VStack(alignment: .leading, spacing: 4)` whose rows use `Text("\u{2197} \(link)")`, Fraunces 13pt, and `Color.linkedText`. Electron already extracts unique wikilink targets, hides the section when none exist, and uses the native north-east marker, but `.info-links` currently inherits generic 12px monospace metadata styling and a looser 7px grid gap.

## Goals / Non-Goals

**Goals:**

- Make Electron linked rows match the native serif 13px linked-text styling.
- Match the native compact 4px linked-row spacing.
- Preserve existing marker text, target extraction, unique target behavior, and empty-section hiding.
- Keep ABOUT THIS DOCUMENT metadata, DIRECTIONS callout, right sidebar tabs, terminal behavior, and sidebar resizing unchanged.

**Non-Goals:**

- Changing wikilink parsing semantics or deduplication.
- Changing section divider/optional-section spacing in this slice.
- Changing native SwiftUI source.

## Decisions

- Scope the visual change to `.info-links` so generic INFO paragraphs and the `DIRECTIONS` callout remain unchanged.
- Use existing Electron palette token `--color-linked-text`, matching the native `Color.linkedText` light/dark mapping.
- Use `Georgia, serif` as the Electron serif stand-in for native Fraunces, consistent with the existing Electron Info value and directions parity work.
- Cover the change with a source parity test that checks the native SwiftUI linked-row contract and the Electron CSS block.

## Risks / Trade-offs

- Linked rows become visually larger than the previous generic metadata text. This is intentional because native linked rows use a larger 13pt serif treatment.
- The shared `.info-section p, .info-links` CSS rule needs to be split so linked rows can diverge without affecting directions or metadata values.
