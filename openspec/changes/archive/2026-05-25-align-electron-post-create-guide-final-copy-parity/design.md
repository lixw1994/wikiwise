## Context

Native SwiftUI renders the final post-create guide paragraph as direct guide content after the last divider with `.font(.system(size: 13))`, `.foregroundStyle(Color.sidebarText)`, and `.lineSpacing(2)`. Electron currently represents that paragraph as the only direct child `<p>` in `.post-create-guide`, but it inherits the shared guide paragraph/list rule.

## Goals / Non-Goals

**Goals:**
- Match native 13px typography for the final guidance paragraph.
- Match native `Color.sidebarText` and `.lineSpacing(2)`.
- Keep this styling scoped to the direct final guide paragraph.

**Non-Goals:**
- Restyle summary text, section intro copy, headings, dividers, lists, command rows, or the dismiss button.
- Change post-create guide copy or native SwiftUI code.
- Change scaffold creation, watcher behavior, or project selection behavior.

## Decisions

- Add a scoped `.post-create-guide > p` rule for the direct final guidance paragraph.
  - Rationale: The existing HTML has exactly one direct child paragraph in the guide, matching the native final guidance position after the last divider.
  - Alternative considered: adding a dedicated class. The current structure already identifies the paragraph without markup churn.
- Use `line-height: calc(1.2em + 2px)` for native `.lineSpacing(2)`.
  - Rationale: Existing parity slices model SwiftUI line spacing as default line height plus the explicit line-spacing value.

## Risks / Trade-offs

- The selector assumes the only direct guide paragraph is the final guidance -> the test locks that current structure.
- Pixel-level text rendering remains approximate between SwiftUI and CSS -> this slice covers the explicit native font size, color, and line spacing declarations.
