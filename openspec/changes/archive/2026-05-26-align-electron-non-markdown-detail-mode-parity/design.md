## Context

SwiftUI initializes `detailMode` as `.compiled` and only changes it when the user presses the FILE or WIKI toolbar segment. Its detail view has a separate branch for non-Markdown files, so selecting a `.txt`, `.css`, or similar file displays the editor while preserving the current toolbar-selected mode.

Electron currently uses `initialDetailModeForFile(file)` to set every non-Markdown selection to `"file"`. That keeps the editor visible, but it also changes toolbar state in a way the native app does not.

## Goals / Non-Goals

**Goals:**

- Keep Electron non-Markdown files rendering in the source editor.
- Preserve the current FILE/WIKI mode when selecting non-Markdown files, including standalone file opens.
- Keep markdown selections defaulting to WIKI mode and preserving the existing editor fallback when compiled output is unavailable.
- Replace tests/spec wording that conflates editor fallback with FILE selection.

**Non-Goals:**

- Change SwiftUI behavior.
- Change compiler output, save IPC, standalone file project boundaries, generated page routing, or release packaging.
- Add runtime audit scenarios for this source-level toolbar state correction.

## Decisions

- Preserve non-Markdown mode in `initialDetailModeForFile(file)` by returning the current renderer `state.detailMode` for non-Markdown files.
  - Rationale: This mirrors SwiftUI, where `navigateTo(_:)` and `openURL(_:)` do not assign `detailMode` when the selected file cannot render as a compiled wiki page.
  - Alternative considered: keep forcing FILE because the editor is visible. That matches the rendered pane but not the native toolbar state, so it is weaker parity.
- Keep render-time source editor fallback for non-Markdown files.
  - Rationale: SwiftUI chooses the editor in `detail` before switching on `detailMode`; Electron should make the same distinction between selected mode and rendered surface.
  - Alternative considered: disable WIKI for non-Markdown files. Native toolbar buttons remain enabled, so disabling would reopen a previously closed parity gap.
- Use source-level regression tests.
  - Rationale: The relevant behavior is encoded in renderer state and SwiftUI source; existing tests already compare these native detail-mode contracts without needing a separate runtime screenshot.

## Risks / Trade-offs

- [Risk] WIKI can appear selected while a non-Markdown file shows the editor, which may look counterintuitive in isolation. -> Mitigation: this is the native behavior, and the test names/specs will state that editor rendering is independent from selected mode for non-Markdown files.
- [Risk] Future refactors might reintroduce forced FILE selection through another helper. -> Mitigation: tests will assert native `detailMode` is initialized once, native non-Markdown rendering does not mutate it, and Electron preserves current mode for non-Markdown files.
