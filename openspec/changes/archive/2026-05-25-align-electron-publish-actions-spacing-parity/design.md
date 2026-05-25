## Context

`Sources/Wikiwise/ContentView.swift` renders the publish sheet with `VStack(alignment: .leading, spacing: 16)`, then places the action `HStack` directly after the token warning. Electron already sets `.publish-dialog { gap: 16px; }`, but the shared `.modal-actions { margin-top: 8px; }` still applies to the publish action row, adding spacing that the native sheet does not have.

## Goals / Non-Goals

**Goals:**

- Make the Electron publish action row rely only on the native 16px publish dialog content gap.
- Keep the shared `.modal-actions` top margin for other dialogs.
- Preserve publish action ordering, labels, keyboard behavior, and disabled state.

**Non-Goals:**

- Changing generic modal action spacing.
- Changing publish button styling, action labels, or publish/unpublish behavior.
- Changing publish dialog content gap, padding, or width.

## Decisions

- Add a scoped `publish-actions` class to the publish dialog action row. This keeps the override explicit and avoids coupling to DOM ancestry alone.
- Set `.publish-actions { margin-top: 0; }` so the row spacing is governed by `.publish-dialog { gap: 16px; }`, mirroring the native `VStack(spacing: 16)` contract.
- Cover the change with a source parity test that verifies the native `VStack` and action `HStack` relationship, the Electron action row hook, the zero publish-specific margin, and the unchanged shared `.modal-actions` margin.

## Risks / Trade-offs

- The publish action row moves closer to the token warning than before. This is intentional because the shared modal margin was extra spacing on top of the already native-aligned publish dialog gap.
