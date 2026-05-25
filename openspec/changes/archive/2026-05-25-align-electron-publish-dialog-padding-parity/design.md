## Context

`Sources/Wikiwise/ContentView.swift` defines `publishConfirmSheet` with `.padding(24)` and `.frame(width: 480)`. The Electron dialog already sets `.publish-dialog { width: min(480px, 100%); }`, but it inherits `.modal-panel { padding: 22px; }` from the shared modal panel style.

## Goals / Non-Goals

**Goals:**

- Match the native publish sheet's 24px content inset.
- Scope the padding override to the publish dialog only.
- Keep the current dialog width and all publishing behavior unchanged.

**Non-Goals:**

- Changing shared modal panel spacing for other dialogs.
- Changing publish dialog copy, row layout, or availability behavior.
- Changing SwiftUI source.

## Decisions

- Add `padding: 24px` to `.publish-dialog` rather than changing `.modal-panel`. The native evidence applies to the publish sheet specifically, and other Electron modals have their own parity requirements.
- Add a source-level parity test that checks the native `.padding(24)` and the Electron publish dialog CSS block. This keeps the regression focused and avoids brittle visual screenshot tolerances for a two-pixel inset difference.

## Risks / Trade-offs

- The effective outer width may shift by two pixels of content inset inside the same panel width. This is intended because the native sheet uses the larger inset while keeping the 480pt frame.
