## Context

`Sources/Wikiwise/RightSidebar.swift` renders the Info scroll content with `.padding(14)` on the inner `VStack`. Electron currently uses a shared `.right-panel { padding: 18px; }`, while `.terminal-panel` overrides that to `padding: 0`. Because the INFO panel has no scoped padding rule, it remains 4px looser on every edge than native.

## Goals / Non-Goals

**Goals:**

- Scope INFO panel padding to 14px to match native.
- Leave terminal panel and xterm internal padding untouched in this slice.
- Preserve all existing Info content behavior and styling.

**Non-Goals:**

- Changing terminal tab padding or emulator padding.
- Changing Info section spacing, optional dividers, directions callout, or linked-row styling.
- Changing native SwiftUI source.

## Decisions

- Add an `.info-panel` CSS rule with `padding: 14px` instead of changing `.right-panel`, because `.right-panel` is shared and terminal already has its own override.
- Cover the change with a source parity test that proves native `.padding(14)` and Electron `.info-panel` padding stay aligned.
- Keep `.terminal-panel { padding: 0; }` and xterm padding as-is so this small visual correction cannot alter terminal behavior.

## Risks / Trade-offs

- The INFO content shifts 4px closer to the right sidebar edges. This is intentional and matches the native SwiftUI inset.
- A dedicated `.info-panel` rule slightly increases CSS specificity, but it cleanly scopes the parity rule to the Info tab.
