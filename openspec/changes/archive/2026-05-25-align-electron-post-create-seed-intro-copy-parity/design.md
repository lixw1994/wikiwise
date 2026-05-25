## Context

The native SwiftUI post-creation guide includes this seed-options intro after the `SEED YOUR WIKI` heading:

`Once your agent is running, try:`

Electron already renders the seed option list, but currently omits this sentence. That makes the Electron first-run guide slightly more abrupt and not literal native parity.

## Goals / Non-Goals

**Goals:**

- Match the native seed-options intro sentence exactly.
- Preserve existing guide structure, command copy, seed options, and dismiss behavior.
- Add test coverage against the SwiftUI source and Electron markup.

**Non-Goals:**

- No changes to scaffold files or core creation helpers.
- No changes to terminal lifecycle or agent command generation.
- No CSS/layout changes beyond using the existing guide paragraph style.

## Decisions

- Update static renderer markup because the intro sentence is not state-dependent.
- Extend the existing `renderer mirrors native new-wiki and post-create guide copy` test so all guide copy parity assertions stay together.
- Keep the sentence as a plain paragraph between the `SEED YOUR WIKI` heading and the seed options list, matching the native ordering.

## Risks / Trade-offs

- This is a markup-only copy slice. It adds one visible line to the guide, which is intentional native parity.

## State Model

No state changes.

## Migration Plan

1. Add a failing new-wiki scaffold test for the native seed intro sentence.
2. Update the Electron post-creation guide markup.
3. Run targeted and full verification.
4. Archive the change.

## Open Questions

None.
