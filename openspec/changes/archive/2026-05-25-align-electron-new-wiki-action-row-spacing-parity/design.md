## Context

SwiftUI's `newWikiSheet` is a `VStack(spacing: 20)` containing the title, name field, location field, and a final `HStack` for Cancel/Create. The action `HStack` does not add its own top margin. Electron's shared `.modal-actions` style currently adds `margin-top: 8px`, so the new-wiki sheet action row receives 28px effective separation from the previous section after the `.new-wiki-panel` 20px gap.

## Goals / Non-Goals

**Goals:**

- Keep the new-wiki action row at the native 20px sheet spacing.
- Preserve the existing left/right action layout and button labels.
- Keep shared modal action spacing for other dialogs unchanged.

**Non-Goals:**

- Change button styling, keyboard shortcuts, disabled behavior, or create flow.
- Change publish/unpublish dialog spacing.
- Change native SwiftUI code.

## Decisions

- Add a `new-wiki-actions` class to the new-wiki dialog action row for an explicit scoped override.
- Set `.new-wiki-actions { margin-top: 0; }` so the parent `.new-wiki-panel` gap remains the only vertical spacing source.
- Leave `.modal-actions` as the shared baseline for other modal dialogs.

## Risks / Trade-offs

- A broad `.modal-actions` change could regress publish dialog spacing. The fix is scoped to the new-wiki action row to avoid that blast radius.
- Tests will require the new-wiki action row class and verify the shared `.modal-actions` margin remains available for other dialogs.
