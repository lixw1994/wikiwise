## Context

The native SwiftUI post-creation guide declares these section headings as uppercase literals:

- `OPEN YOUR AGENT`
- `SEED YOUR WIKI`

Electron currently renders title-case strings and relies on `.eyebrow { text-transform: uppercase; }` for the visual result. That is visually close, but the DOM text and accessible label text are not native-identical.

## Goals / Non-Goals

**Goals:**

- Match the native heading literals exactly in Electron markup.
- Preserve existing guide structure, commands, seed options, styling, and dismiss behavior.
- Add test coverage against the SwiftUI source and the Electron markup.

**Non-Goals:**

- No changes to scaffold files or core creation helpers.
- No changes to terminal lifecycle or right-sidebar behavior.
- No CSS/layout changes beyond leaving the existing styling in place.

## Decisions

- Update the static renderer markup because the headings are not state-dependent.
- Extend the existing `renderer mirrors native new-wiki and post-create guide copy` test so the coverage stays with the rest of the guide copy.
- Assert that the old title-case strings are absent to catch regressions.

## Risks / Trade-offs

- This is a markup-only parity slice. The existing CSS still uppercases eyebrow text, so visual output remains unchanged while DOM/accessibility text becomes native-identical.

## State Model

No state changes.

## Migration Plan

1. Add a failing new-wiki scaffold test for the native guide heading literals.
2. Update the Electron post-creation guide markup.
3. Run targeted and full verification.
4. Archive the change.

## Open Questions

None.
