## Context

The native first post-create guide paragraph uses `.font(.system(size: 14))`, `.foregroundStyle(Color.sidebarText)`, and `.lineSpacing(3)`. Electron currently applies the shared `.post-create-guide p, .post-create-guide li` rule to all guide paragraphs, which uses linked text color and a generic `line-height: 1.6`.

## Goals / Non-Goals

**Goals:**
- Match the native first summary paragraph's 14px font size.
- Match native `Color.sidebarText` using the Electron sidebar text token.
- Match native `.lineSpacing(3)` with a scoped line-height expression.
- Keep later guide intro/final paragraphs and list copy on their existing shared guide rule.

**Non-Goals:**
- Add native dividers, command-row chrome, seed option icons, or agent command styling in this slice.
- Change post-create guide title or container layout already covered by earlier slices.
- Change non-guide paragraph styling.

## Decisions

- Add a scoped selector for `.post-create-guide > .guide-block:first-of-type p`.
  - Rationale: The native 14px sidebar-text paragraph is the summary directly under the title, and this selector avoids changing later guide paragraphs.
  - Alternative considered: changing all `.post-create-guide p` styles. That would also affect agent instructions, seed intro, and final guidance, which have separate native declarations.
- Use `line-height: calc(1.2em + 3px)` for `.lineSpacing(3)`.
  - Rationale: Existing parity slices model SwiftUI line spacing as base line height plus the explicit line-spacing value.

## Risks / Trade-offs

- The selector depends on the current guide block order -> the HTML already represents the native title/summary block first, and the test locks that relationship.
- Pixel-perfect SwiftUI text rendering remains approximate in HTML/CSS -> this slice covers the explicit font size, color, and line-spacing declarations.
