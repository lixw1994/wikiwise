## Context

`Sources/Wikiwise/RightSidebar.swift` renders the terminal tab as `TerminalEmbed(session:)` with `.padding(.leading, 8)` and `.padding(.top, 4)`. Electron currently sets `.terminal-panel { padding: 0; }` and `.terminal-surface .xterm { padding: 10px; }`, which creates a larger, symmetric terminal content inset instead of the native asymmetric outer inset.

## Goals / Non-Goals

**Goals:**

- Make the Electron terminal tab use the native 4px top and 8px leading inset.
- Remove xterm's extra all-sides padding so the outer panel owns terminal placement.
- Preserve terminal startup, input/output, resizing, ANSI rendering, and Info tab layout.

**Non-Goals:**

- Changing terminal color palette or xterm theme in this slice.
- Changing PTY process lifecycle or resize calculations.
- Changing native SwiftUI source.

## Decisions

- Set `.terminal-panel` padding to `4px 0 0 8px`, matching SwiftUI top and leading padding while leaving trailing/bottom flush.
- Set `.terminal-surface .xterm` padding to `0` so xterm content is not shifted again after the outer panel inset.
- Keep `.terminal-surface` full-size inside the padded panel so the fit addon continues to measure the visible terminal surface.
- Cover the change with a right sidebar parity test that asserts the native SwiftUI padding and the Electron CSS blocks.

## Risks / Trade-offs

- Removing the previous 10px xterm padding changes the terminal's text origin. This is intended: the native view places the terminal via outer top/leading padding, not an all-sides terminal content inset.
- Fit dimensions may change slightly because the visible terminal area becomes larger on the trailing and bottom edges. Existing resize tests and package verification should catch contract regressions.
