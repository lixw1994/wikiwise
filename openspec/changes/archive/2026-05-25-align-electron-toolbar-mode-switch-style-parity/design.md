## Context

`Sources/Wikiwise/ContentView.swift` renders FILE/WIKI as adjacent buttons inside `HStack(spacing: 0)`. Each text label uses 10pt regular monospaced text with tracking `0.8`, 10pt horizontal padding, 4pt vertical padding, a selected fill of `Color.sidebarSelectedBg`, muted text when unselected, selected text when active, a `Color.sidebarRule` stroke, and 3pt uneven rounded corners on the outer segment edges. Electron already has the correct controls and state wiring, but `.mode-button` uses 12px text, no tracking, 6px vertical padding, and `.mode-switch` applies a 6px rounded outer container.

## Goals / Non-Goals

**Goals:**

- Make Electron's File/Wiki mode switch match the native compact segmented badge styling.
- Preserve existing button IDs, mode selection behavior, disabled WIKI behavior, and detail rendering.
- Keep unrelated toolbar icon, publish, and sidebar controls unchanged.

**Non-Goals:**

- Changing File/Wiki mode behavior or enabling WIKI mode.
- Changing navigation history, preview rendering, or editor behavior.
- Changing native SwiftUI source.

## Decisions

- Update only `.mode-switch`, `.mode-button`, `.mode-button.selected`, and the first/last segment radii. This keeps the change scoped to the segmented mode control.
- Use native token mapping already present in the Electron palette: selected text maps to `--color-sidebar-selected-text`, unselected text maps to `--color-sidebar-text-muted`, selected fill maps to `--color-sidebar-selected-bg`, and stroke maps to `--color-sidebar-rule`.
- Cover the change with a CSS/source parity test in the toolbar suite, including a guard that publish button styling remains separate.

## Risks / Trade-offs

- Removing the outer 6px container radius makes the control visually tighter. This is intentional because native applies 3pt corner radius on the segment shapes themselves rather than a larger rounded container.
