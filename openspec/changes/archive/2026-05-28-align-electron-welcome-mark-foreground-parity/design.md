## Context

SwiftUI renders the no-folder welcome screen's large `W` mark as 48pt light italic serif text with `Color.sidebarSelectedText`. Electron already mirrors the typography and the visual value through `--color-tab-active`, but the token role is not the same native role. Because these palette variables may diverge as appearance polish continues, Electron should bind the centered mark to `--color-sidebar-selected-text`.

## Goals / Non-Goals

**Goals:**
- Match the native centered welcome mark foreground role with `--color-sidebar-selected-text`.
- Preserve existing 48px serif italic light typography and one-line mark layout.
- Keep toolbar brand mark styling unchanged; it already has separate native toolbar coverage.
- Add source-backed regression coverage that ties Electron `.welcome-mark` to the SwiftUI welcome content mark.

**Non-Goals:**
- Change native SwiftUI source.
- Change welcome copy, action buttons, toolbar brand chrome, line spacing, or shell layout.
- Change broader palette values or other uses of `--color-tab-active`.
- Change packaging, runtime audit scripts, or release workflows.

## Decisions

- Change only `.welcome-mark { color: ... }` from `--color-tab-active` to `--color-sidebar-selected-text`. This keeps the fix scoped to the centered welcome mark instead of altering tab/detail foreground roles globally.
- Add a dedicated native-shell parity test that distinguishes the content mark from the toolbar mark by asserting the 48pt SwiftUI font plus `Color.sidebarSelectedText`.
- Retain existing toolbar brand assertions so the two `W` marks remain independently covered.

## Risks / Trade-offs

- This change is semantically important even though the current light/dark palette values are identical. Mitigation: the test asserts the token role so future palette edits cannot silently reintroduce the mismatch.
