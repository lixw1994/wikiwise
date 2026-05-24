## Context

The SwiftUI app is a native window surface: the project view is bounded by the window, and split panes scroll internally. Its detail area does not include a separate selected-file/save-status strip; editing is handled by the embedded CodeMirror web view with autosave behavior and the selected file is shown through the sidebar state.

The Electron app currently uses viewport-sized CSS in broad strokes, but runtime audit evidence shows the project shell can expand to tens of thousands of pixels tall. It also renders an extra detail header with selected filename, save status, and Save button, which appears in project screenshots and body text even though the native app has no corresponding chrome.

## Goals / Non-Goals

**Goals:**
- Bound Electron welcome/project shells to the app viewport.
- Make sidebar, detail, editor/preview, and right-sidebar panes scroll or clip internally.
- Hide non-native detail save/header chrome while preserving existing autosave, keyboard save, and state evidence.
- Add runtime audit assertions for project viewport bounds and hidden detail chrome.

**Non-Goals:**
- Replace the Electron custom toolbar with an actual native titlebar toolbar.
- Remove autosave or keyboard save behavior.
- Change compiler/editor/publishing logic.
- Run signed/notarized release distribution.

## Decisions

1. Use CSS viewport containment instead of JavaScript resize bookkeeping.

   The project shell should be a normal app window layout: `height: 100vh`, `max-height: 100vh`, and `overflow: hidden` on the shell/project frame, with `min-height: 0` on grid panes so xterm, iframe, and editor children cannot stretch the document. This keeps layout deterministic and avoids adding renderer resize state.

   Alternative considered: dynamically set pane heights from `window.innerHeight`. CSS is simpler and less fragile.

2. Hide detail header chrome rather than deleting save state.

   Existing renderer logic and tests use `selected-file`, `save-status`, and `save-file` as state anchors. Marking the detail header hidden removes it from visible layout and runtime body text while retaining keyboard save and evidence hooks. This is a smaller, lower-risk move toward native parity than deleting the state plumbing.

   Alternative considered: remove the elements and null-guard every call site. That would make the visual result the same but creates extra churn unrelated to the parity surface.

3. Make runtime audit stricter.

   Runtime audit should fail if `projectRect.height` materially exceeds the viewport or if the detail header contributes visible text. The audit already captures screenshots and DOM rectangles, so this phase strengthens the evidence rather than adding a new test harness.

## Risks / Trade-offs

- [Risk] Hiding the Save button may remove an explicit mouse save affordance. → Native app has no visible Save button; autosave and keyboard save remain intact.
- [Risk] Fixed viewport containment can clip content unexpectedly. → Panes get internal scroll/overflow behavior, matching native split panes.
- [Risk] Runtime audit could miss a visual regression in a non-project scenario. → Assertions cover both project light and dark scenarios and retain screenshot artifacts.

## Migration Plan

1. Add failing tests for hidden detail chrome and bounded runtime audit assertions.
2. Apply CSS/HTML changes to bound the shell and hide detail chrome.
3. Extend runtime audit DOM evidence and assertions.
4. Run focused tests, full tests, runtime audit, packaging, Swift build, and OpenSpec validation.

Rollback is contained to renderer shell markup/styles and audit checks; it does not affect project data or build artifacts.

## Open Questions

None for this phase.
