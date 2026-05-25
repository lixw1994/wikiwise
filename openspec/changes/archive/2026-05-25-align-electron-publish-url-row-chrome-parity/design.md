## Context

The native SwiftUI publish URL row applies padding and a sidebar-colored `RoundedRectangle(cornerRadius: 4)` fill. Electron already matches the row content and layout, but its `.publish-url-row` still includes a stroked border and a 6px radius.

## Goals / Non-Goals

**Goals:**

- Match the native fill-only URL row chrome.
- Align the row corner radius to 4px.
- Preserve the existing URL row grid, padding, typography, background color, and availability states.

**Non-Goals:**

- Change publish URL row layout columns.
- Change availability indicator rendering or publish state behavior.
- Change native SwiftUI code.

## Decisions

- Remove the CSS border instead of trying to recolor it to blend in. The native row is a filled rounded rectangle without a stroke.
- Keep the existing `background: var(--color-sidebar-bg)` because it maps to native `Color.sidebarBg`.
- Use a source-level regression test because this is a visual CSS parity rule and the current publishing tests already compare SwiftUI source to renderer CSS.

## Risks / Trade-offs

- CSS source checks do not prove every rendered pixel. Mitigation: lock the specific native constraints that caused the mismatch: no stroked border and 4px rounded fill.
