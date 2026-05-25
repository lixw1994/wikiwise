## Context

`Sources/Wikiwise/ContentView.swift` renders `publishConfirmSheet` as `VStack(alignment: .leading, spacing: 16)`. The Electron publish dialog is a `.modal-panel.publish-dialog`; it now has the native 480px width and 24px padding, but still inherits `.modal-panel { gap: 12px; }`.

## Goals / Non-Goals

**Goals:**

- Match the native publish sheet's 16px vertical content spacing.
- Scope the spacing override to `.publish-dialog`.
- Preserve current publish dialog padding, width, URL row, copy, and behavior.

**Non-Goals:**

- Changing shared modal spacing for other dialogs.
- Changing publish dialog markup or JavaScript behavior.
- Changing SwiftUI source.

## Decisions

- Add `gap: 16px` to `.publish-dialog` instead of changing `.modal-panel`. The native evidence applies to this sheet, and other dialogs may intentionally keep the shared modal spacing.
- Cover the difference with the publishing source parity test by checking both the native `VStack` spacing and the Electron `.publish-dialog` block, while asserting the shared `.modal-panel` gap remains 12px.

## Risks / Trade-offs

- The publish sheet grows slightly taller, which is intended because the native sheet spaces its content groups farther apart.
