## Context

`Sources/Wikiwise/RightSidebar.swift` renders the right sidebar tabs as a compact pill switcher. The outer tab bar uses sidebar background with horizontal 12pt and vertical 8pt padding. The inner switch uses 2pt padding, `Color.tabBarBg`, and a 5pt rounded rectangle. Each tab label uses 10pt regular monospaced text with 0.8 tracking, 14pt horizontal padding, 3pt vertical padding, inactive `Color.tabInactive`, active `Color.tabActive`, and a 4pt active rounded rectangle filled with `Color.tabActiveBg` plus a subtle shadow. Electron already has the right tab IDs, state wiring, and panels, but the CSS lays the controls out as two full-width grid tabs with 12px bold labels and divider borders.

## Goals / Non-Goals

**Goals:**

- Make Electron's INFO/TERMINAL switcher match the native compact left-aligned pill style.
- Preserve existing tab IDs, default Terminal tab, selected state, click behavior, panel visibility, terminal lifecycle, and right-sidebar resizing.
- Keep unrelated right sidebar Info content, terminal surface, resize handle, and toolbar controls unchanged.

**Non-Goals:**

- Changing document metadata or terminal behavior.
- Changing right sidebar width constraints or resize interactions.
- Changing native SwiftUI source.

## Decisions

- Add a `right-tab-switch` wrapper around the existing tab buttons so Electron can model the native inner pill container without changing the button IDs or renderer event wiring.
- Keep `right-tabs` as the outer header row with sidebar background and native padding, and move the tablist role to the inner switcher so the accessible control still describes the actual tab group.
- Update only the right tab switch CSS selectors. This keeps the change scoped to visual parity and avoids touching Info/Terminal panel layout.
- Cover the change with a source parity test in the right sidebar suite that checks the native SwiftUI tabBar contract, the Electron wrapper markup, and the key CSS tokens.

## Risks / Trade-offs

- The tab controls will no longer stretch across the full sidebar width. This is intentional because native leaves the compact switcher on the left and fills the remaining row with spacer background.
- Adding a wrapper changes the HTML shape around the buttons. Renderer selectors use button IDs, so behavior remains stable; the regression test will guard those IDs and roles.
