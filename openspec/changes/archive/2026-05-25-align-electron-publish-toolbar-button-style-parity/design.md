## Context

`Sources/Wikiwise/ContentView.swift` styles the publish toolbar label as a compact badge: 10pt regular monospaced text, tracking `0.8`, selected-sidebar foreground, 10pt horizontal padding, 4pt vertical padding, selected background fill, a 3pt rounded rectangle, and a sidebar-rule stroke. Electron already has the right labels and publish state wiring, but `.publish-button` currently uses larger text, no tracking, more vertical padding, a 6px radius, and a different foreground token.

## Goals / Non-Goals

**Goals:**

- Make Electron's toolbar publish button visually match the native compact badge style.
- Preserve normal/busy labels, disabled state wiring, help text, click behavior, and publish dialog behavior.
- Keep shared toolbar icon button styling unchanged.

**Non-Goals:**

- Changing publish dialog layout or publishing IPC behavior.
- Changing appearance, map, sidebar, mode, back, or forward toolbar controls.
- Changing native SwiftUI source.

## Decisions

- Update only `.publish-button` in Electron CSS. It is already scoped to the publish toolbar control, so no additional markup hook is needed.
- Map native values directly to CSS where possible: `font-size: 10px`, `letter-spacing: 0.8px`, `padding: 4px 10px`, `border-radius: 3px`, `background: var(--color-sidebar-selected-bg)`, `border: 1px solid var(--color-sidebar-rule)`, and `color: var(--color-sidebar-selected-text)`.
- Cover the change with a publishing parity test that compares the native SwiftUI label styling with the Electron CSS block and verifies the shared `.toolbar-icon-button` radius remains unchanged.

## Risks / Trade-offs

- The publish button will become slightly smaller and tighter than before. This is intentional because it follows the native badge sizing, and the button label remains unchanged for recognition and accessibility.
