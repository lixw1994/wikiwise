## Context

The native no-folder welcome view renders its two primary actions as plain SwiftUI buttons whose labels are `HStack` rows containing an SF Symbol and text: `plus.circle` for Create a New Wiki and `folder` for Open Existing Folder. Electron already matches the welcome copy, action labels, action column width, and create/open flows, but its welcome buttons are text-only.

## Goals / Non-Goals

**Goals:**

- Add stable native-symbol evidence to both Electron welcome actions.
- Keep the visible button labels and existing element IDs available for tests and renderer event binding.
- Keep the change scoped to welcome markup, button layout, and parity tests.

**Non-Goals:**

- Replace Electron's icon system globally.
- Change create/open project behavior.
- Change the native SwiftUI implementation.

## Decisions

- Represent each native symbol with an `aria-hidden` inline element carrying a `data-native-symbol` value. This gives tests and future visual audits a stable mapping to SwiftUI's `Image(systemName:)` calls without changing accessible button labels.
- Use a welcome-specific action class for inline-flex icon/text alignment, preserving the existing 220px action column and button styles.
- Keep glyph choice local to the welcome buttons; future icon work can swap the glyphs for a shared symbol renderer without changing the native-symbol contract.

## Risks / Trade-offs

- Text label regressions could break existing welcome tests, so the regression will assert both native symbol metadata and unchanged labels.
- Browser glyphs are not SF Symbols, so this slice records semantic symbol parity and layout readiness rather than claiming exact AppKit symbol rendering.
