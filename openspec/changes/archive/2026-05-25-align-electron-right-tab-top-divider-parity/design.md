## Context

`Sources/Wikiwise/RightSidebar.swift` renders `Rectangle().fill(Color.sidebarRule).frame(height: 1)`, then `tabBar`, then another matching `Rectangle` before the active panel stack. Electron currently represents the lower divider with `.right-tabs { border-bottom: 1px solid var(--color-sidebar-rule); }`, but it has no top border on `.right-tabs` or equivalent first divider.

## Goals / Non-Goals

**Goals:**

- Add a 1px top sidebar-rule divider above the Electron right tab header.
- Preserve the existing bottom divider and compact pill switcher styling.
- Avoid changing tab behavior, panel visibility, terminal behavior, Info behavior, or resize behavior.

**Non-Goals:**

- Changing left sidebar or toolbar dividers.
- Changing right tab padding, text styling, active tab styling, or layout alignment.
- Changing native SwiftUI source.

## Decisions

- Add `border-top: 1px solid var(--color-sidebar-rule)` to `.right-tabs`, mirroring the existing CSS approach for the bottom divider.
- Keep `padding: 8px 12px` unchanged because native tabBar padding remains 8 vertical and 12 horizontal inside the divider pair.
- Extend the existing right sidebar tab style parity test rather than creating a separate suite.

## Risks / Trade-offs

- The right tabs header becomes 1px taller due to the new divider. This is intentional and matches the native separate 1pt `Rectangle` above the tab bar.
