## Context

In SwiftUI, the FILE/WIKI toolbar controls are plain buttons without `.disabled(...)` modifiers. The detail content handles unavailable compiled output by falling back to `EditorWebView` in the `.compiled` case when no `compiledFileURL` exists. Electron currently ties button enabled state to renderer availability checks:

- FILE disabled during guide/generated/no-file states.
- WIKI disabled during guide/generated/no-compiled-preview states.

That produces disabled toolbar chrome where the native app keeps the controls active.

## Decisions

- Remove static and runtime disabled state from the FILE/WIKI mode buttons.
- Keep `setDetailMode(mode)` as the click handler so both controls remain operable.
- Add a source-editor fallback for `detailMode === "wiki"` when no compiled preview is available, mirroring SwiftUI's `.compiled` fallback to `EditorWebView`.
- Keep the WIKI segment selected whenever `detailMode === "wiki"`, even if the detail surface falls back to source editing.
- Preserve generated page rendering priority so map/graph pages remain visible even if the user clicks FILE/WIKI.

## Risks

- Enabling WIKI when no compiled preview exists could reveal a blank pane unless the fallback is explicit. The regression test will require the fallback branch.
- Existing tests that treat disabled state as out of scope should remain valid because this change adds a specific enabled-state requirement.

## Verification

- Add a failing regression test for native enabled mode controls and Electron fallback behavior.
- Run the targeted Electron chrome/menu toolbar test for red and green.
- Run full repository verification, OpenSpec strict validation, Electron macOS packaging, archive the change, and rerun verification.
