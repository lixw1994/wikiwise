## Context

`Sources/Wikiwise/RightSidebar.swift` renders `DIRECTIONS` with a native callout treatment: `Text(directions)` uses Fraunces 12pt, italic style, `Color.infoValue`, 3pt line spacing, 10pt vertical padding, 12pt horizontal padding, max-width leading alignment, `Color.accentGold.opacity(0.12)` background, and a 2pt leading `Color.accentGold` strip. Electron already conditionally hides and shows the `DIRECTIONS` section based on parsed frontmatter, but the text currently inherits the generic `.info-section p` monospace paragraph style.

## Goals / Non-Goals

**Goals:**

- Make Electron directions text match the native gold callout visual treatment.
- Preserve existing frontmatter parsing, conditional visibility, and text content.
- Keep ABOUT THIS DOCUMENT metadata, LINKED rows, right sidebar tabs, terminal behavior, and sidebar resizing unchanged.

**Non-Goals:**

- Changing directions extraction or markdown/frontmatter parsing.
- Changing LINKED section styling.
- Changing native SwiftUI source.

## Decisions

- Add a dedicated `info-directions-callout` class to the existing directions paragraph so the native callout styling is scoped to `DIRECTIONS` only.
- Use existing Electron palette tokens for native color mapping: `--color-info-value` for text and `--color-accent-gold` for the background/leading strip.
- Use a `::before` pseudo-element for the 2px leading accent strip, mirroring the SwiftUI `overlay(alignment: .leading)` without changing renderer logic.
- Cover the change with a source parity test in the right sidebar suite that verifies native callout properties, Electron markup, CSS typography, padding, background, and accent strip.

## Risks / Trade-offs

- Directions text becomes more visually prominent than before. This is intentional because the native app treats frontmatter directions as a guidance callout.
- The pseudo-element requires the callout to be positioned relative. This is local to the directions paragraph and should not affect other info sections.
