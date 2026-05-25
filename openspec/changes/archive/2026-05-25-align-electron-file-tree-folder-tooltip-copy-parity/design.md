## Context

The native `folderTooltip(_:)` helper in `ContentView.swift` returns exact help text for important top-level folders:

- `wiki`: `Wiki pages — your editable knowledge base`
- `sources`: `Source summaries — one page per ingested source`
- `raw`: `Raw source documents — read-only originals`
- `site`: `Build tooling and compiled HTML output`

Electron already applies folder tooltip text to directory row buttons, but the first three strings use ` - ` instead of the native em dash punctuation. Because those strings are user-visible help text, they should match the native app literally.

## Goals / Non-Goals

**Goals:**

- Match native folder tooltip literals exactly for `wiki`, `sources`, `raw`, and preserve `site`.
- Keep tooltip generation centralized in the existing Electron `folderTooltip(name)` helper.
- Add tests that compare the SwiftUI source literals with the Electron renderer source.

**Non-Goals:**

- No file tree behavior changes.
- No visual icon, indentation, selected state, or runtime audit changes.
- No changes to native Swift source.

## Decisions

- Update only the static strings returned by the Electron renderer helper.
- Extend the existing file-tree parity test file because the tooltip helper lives with tree rendering and visual affordances.
- Assert that the old hyphenated strings are absent so the regression is obvious.

## Risks / Trade-offs

- This is a low-risk copy-only change. The only behavior change is the exact tooltip/help text users see for folder rows.

## State Model

No state changes.

## Migration Plan

1. Add a failing file-tree parity test for native tooltip copy.
2. Update the Electron `folderTooltip(name)` strings.
3. Run targeted and full verification.
4. Archive the change.

## Open Questions

None.
