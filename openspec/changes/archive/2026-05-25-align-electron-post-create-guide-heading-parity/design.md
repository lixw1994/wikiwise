## Context

Native SwiftUI renders the post-create guide section labels with `.font(.system(size: 10, weight: .semibold))`, `.tracking(1.5)`, and `Color.sidebarHeader`. Electron currently uses the shared `.eyebrow` class, which is 12px bold with no tracking and is shared with non-guide surfaces.

## Goals / Non-Goals

**Goals:**
- Match native 10px semibold typography for the `OPEN YOUR AGENT` and `SEED YOUR WIKI` labels.
- Match native tracking of 1.5px and sidebar header color.
- Keep the guide heading change scoped to the post-create guide.
- Preserve existing guide layout, dividers, copy, commands, seed options, and dismiss behavior.

**Non-Goals:**
- Restyle sidebar/global `.eyebrow` usage.
- Change agent command rows, seed option rows, section body copy, final paragraph typography, or button chrome.
- Change native SwiftUI or scaffold creation behavior.

## Decisions

- Add a scoped `.post-create-guide .eyebrow` rule instead of changing the global `.eyebrow`.
  - Rationale: The native guide headings need a different density from other eyebrow text in the Electron shell.
  - Alternative considered: changing `.eyebrow` globally. That would risk changing sidebar and dialog surfaces that are unrelated to the post-create guide.
- Keep the existing `p class="eyebrow"` markup.
  - Rationale: The semantics and copy are already covered; this slice only needs scoped visual parity.
  - Alternative considered: introducing a new class. That would be slightly clearer but adds markup churn where a scoped selector is enough.
- Set `text-transform: none` in the scoped rule.
  - Rationale: Native renders explicit uppercase strings rather than relying on CSS transformation, so the visible text stays uppercase while behavior matches the source copy.

## Risks / Trade-offs

- The shared `.eyebrow` rule still applies outside the guide -> this is intentional to avoid unrelated visual churn.
- Other post-create guide typography remains imperfect -> section body copy, commands, seed rows, and final copy are left for later parity slices.
