## Context

The SwiftUI `newWikiSheet` is a purpose-built form sheet: a `VStack(spacing: 20)` with `padding(24)` and `frame(width: 400)`. Its title uses `.system(size: 16, weight: .semibold)`, and its field labels use `.system(size: 12, weight: .medium)`. Electron currently places the create-new-wiki form in the shared `.modal-panel`, whose generic spacing, padding, heading defaults, and bold labels were tuned for broader dialog use rather than this native sheet.

## Goals / Non-Goals

**Goals:**

- Match the new-wiki sheet's native frame width, padding, vertical spacing, title font, and field label weight.
- Preserve the existing create-new-wiki dialog IDs and renderer event binding.
- Keep publish dialog styles unchanged by scoping the polish to the new-wiki panel.

**Non-Goals:**

- Change scaffold generation, default locations, keyboard shortcuts, or post-create guide behavior.
- Replace the shared modal system for all dialogs.
- Change native SwiftUI code.

## Decisions

- Add a `new-wiki-panel` class to the create-new-wiki dialog panel so the sheet can match SwiftUI without altering publish, unpublish, or feedback dialogs.
- Wrap the name field and location area in new-wiki form groups to express the native field-label-to-control spacing directly instead of relying on the generic modal grid gap.
- Override only typography and layout tokens that map directly to SwiftUI source evidence; existing colors and button styles continue to come from the established renderer palette.

## Risks / Trade-offs

- A markup wrapper could disturb renderer queries if IDs move. The renderer binds by element IDs, so preserving those IDs keeps behavior stable.
- Global `.field-label` changes could affect publishing UI, so field label weight is scoped under `.new-wiki-panel`.
