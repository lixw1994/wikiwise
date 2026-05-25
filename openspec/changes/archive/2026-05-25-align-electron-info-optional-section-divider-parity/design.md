## Context

`Sources/Wikiwise/RightSidebar.swift` wraps optional `DIRECTIONS` and `LINKED` sections in a `VStack` with `.padding(.top, 18)` and an `.overlay(alignment: .top)` that draws `Rectangle().fill(Color.sidebarRule).frame(height: 1)`. The parent Info `VStack` uses zero spacing, so the divider owns the separation between the base metadata and optional content. Electron currently uses a generic `.info-section { margin-top: 20px; }` rule and `.info-list { margin: 0 0 24px; }`, which creates spacing but no native rule.

## Goals / Non-Goals

**Goals:**

- Add a scoped optional-section class for `DIRECTIONS` and `LINKED`.
- Render the native 1px sidebar-rule top divider and 18px top padding for optional sections.
- Keep `ABOUT THIS DOCUMENT` as the non-divider first section with no artificial bottom spacing.
- Preserve existing optional section visibility, directions callout styling, linked row styling, document metadata, terminal behavior, and right sidebar resizing.

**Non-Goals:**

- Changing directions parsing or wikilink extraction semantics.
- Changing the native SwiftUI source.
- Changing tab switcher, terminal, or sidebar resize behavior.

## Decisions

- Add `info-optional-section` to the existing directions and linked section markup so the divider does not affect `ABOUT THIS DOCUMENT`.
- Use `border-top: 1px solid var(--color-sidebar-rule)` and `padding-top: 18px` to mirror the SwiftUI top overlay and top padding.
- Change the generic `.info-section` margin to zero and remove the metadata list bottom margin so optional sections own their native separation.
- Keep the existing `.info-about-section` and content-specific styles intact, aside from no longer depending on extra list bottom margin.

## Risks / Trade-offs

- Removing the previous metadata-list bottom margin tightens layouts when only the metadata section is visible. This matches native, where the optional-section divider owns separation and absent optional sections leave no extra trailing spacer below metadata content.
- Border and padding are CSS approximations of SwiftUI overlay and padding; using existing sidebar-rule color keeps light/dark palette parity.
