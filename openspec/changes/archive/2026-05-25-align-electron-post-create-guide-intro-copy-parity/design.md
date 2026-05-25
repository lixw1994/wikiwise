## Context

Native SwiftUI renders the two post-create guide intro paragraphs with `.font(.system(size: 13))` and `.foregroundStyle(Color.sidebarText)`: the terminal instruction under `OPEN YOUR AGENT` and the seed intro under `SEED YOUR WIKI`. Electron currently uses the shared `.post-create-guide p, .post-create-guide li` rule, which colors all generic guide copy as linked text with a loose shared line height.

## Goals / Non-Goals

**Goals:**
- Match native 13px system text for the two section intro paragraphs.
- Match native `Color.sidebarText` using the Electron sidebar text token.
- Scope the rule so summary text, final guidance, list rows, command code, headings, and global paragraphs are preserved.

**Non-Goals:**
- Restyle agent command rows, seed option rows, list markup, final guidance, or the dismiss button.
- Change native SwiftUI, scaffold creation, watcher behavior, or post-create guide copy.
- Introduce new HTML classes unless the scoped selector proves insufficient.

## Decisions

- Use `.post-create-guide .guide-block:not(:first-of-type) > p:not(.eyebrow)` for the scoped intro copy.
  - Rationale: The first guide block is the title/summary block, and the later guide blocks each contain exactly one body intro paragraph after the eyebrow heading.
  - Alternative considered: adding a new class to the two paragraphs. That would work, but it changes markup for a styling distinction already represented by the native guide structure.
- Override `line-height` to `1.2` for these intro paragraphs.
  - Rationale: Native has no explicit `.lineSpacing` on these paragraphs, unlike the summary/final copy; keeping the shared `1.6` line height would continue to make these one-line instructions read unlike native text.

## Risks / Trade-offs

- The selector depends on the current guide block order -> parity tests lock the native order and the two matching Electron paragraphs.
- Remaining guide visual gaps stay visible -> command rows, seed rows, final guidance, and button chrome remain separate future slices.
