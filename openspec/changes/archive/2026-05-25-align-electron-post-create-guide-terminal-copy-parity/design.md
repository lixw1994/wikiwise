## Context

The native SwiftUI post-creation guide includes this agent startup instruction:

`Use the built-in terminal in the right sidebar, or open your own terminal:`

Electron already renders the post-creation guide and most native copy, but the corresponding sentence currently omits `in the right sidebar`. Because the Electron app now has a right-sidebar terminal, this missing phrase is both a parity issue and useful orientation for new users.

## Goals / Non-Goals

**Goals:**

- Match the native terminal instruction sentence exactly.
- Preserve existing guide structure, commands, seed options, and dismiss behavior.
- Add test coverage against the SwiftUI source and the Electron markup.

**Non-Goals:**

- No changes to scaffold files or core creation helpers.
- No changes to terminal lifecycle or right-sidebar behavior.
- No CSS/layout changes.

## Decisions

- Update the static renderer markup because the sentence is not state-dependent.
- Extend the existing `renderer mirrors native new-wiki and post-create guide copy` test so the coverage stays with the rest of the guide copy.
- Assert that the old shorter sentence is absent to catch regressions.

## Risks / Trade-offs

- This is a markup-only copy slice; broader guide workflow behavior remains covered by existing new-wiki tests and full runtime/package checks.

## State Model

No state changes.

## Migration Plan

1. Add a failing new-wiki scaffold test for the native terminal instruction sentence.
2. Update the Electron post-creation guide markup.
3. Run targeted and full verification.
4. Archive the change.

## Open Questions

None.
