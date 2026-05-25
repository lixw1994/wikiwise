## Context

Native SwiftUI wraps the post-create guide content in a `VStack(alignment: .leading, spacing: 24)` and places `Divider()` between the title summary, agent quick-start, seed options, and final guidance. Electron currently uses separate `.guide-block` containers and final copy/button elements without structural separators, so the post-create guide reads as grouped copy rather than the native divided sections.

## Goals / Non-Goals

**Goals:**
- Render three Electron guide dividers in the same section boundaries as native SwiftUI.
- Scope divider width and color to the existing 560px guide column and sidebar rule token.
- Preserve existing title, summary, command, seed, final copy, and dismiss behavior.

**Non-Goals:**
- Restyle agent command rows, seed options, eyebrow headings, or final paragraph typography in this slice.
- Change scaffold creation, watcher behavior, selected file behavior, or native SwiftUI code.
- Replace the existing guide structure with a larger semantic refactor.

## Decisions

- Add explicit `<hr class="guide-divider">` elements between the existing Electron sections.
  - Rationale: Native `Divider()` is a structural separator, and explicit DOM nodes make section parity easy to inspect and test.
  - Alternative considered: using borders/margins on `.guide-block`. That would hide the count and placement of native dividers behind styling and make it easier to accidentally miss a section boundary.
- Include `.post-create-guide > .guide-divider` in the existing direct-child width constraint group.
  - Rationale: Native dividers live inside the same 560px leading column as the rest of the guide content.
  - Alternative considered: full-width dividers. That would not match the native frame-constrained guide content.
- Use `border-top: 1px solid var(--color-sidebar-rule)` with zero side effects on shared `.guide-block` spacing.
  - Rationale: The app already maps native sidebar rules to `--color-sidebar-rule`, and an `hr` with no border except top reads as a native divider.

## Risks / Trade-offs

- DOM structure becomes slightly more verbose -> the explicit nodes improve parity coverage and mirror native section boundaries.
- Remaining guide visual gaps stay visible after this slice -> command rows, seed rows, headings, and final paragraph are intentionally separate future parity slices.
