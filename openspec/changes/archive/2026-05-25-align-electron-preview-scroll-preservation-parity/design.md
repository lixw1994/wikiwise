## Context

The SwiftUI app routes both source editing and compiled Wiki preview through WebView-backed surfaces. Before FILE/WIKI mode changes, `captureScrollAndSwitch` asks the active web view for a scroll fraction; `WebView` restores that fraction after compiled preview navigation completes. Electron already preserves CodeMirror editor scroll through shared editor helpers, but the compiled preview iframe is reloaded without first storing or later restoring its scroll fraction.

## Goals / Non-Goals

**Goals:**

- Preserve the current compiled preview scroll position when leaving WIKI mode.
- Restore the saved scroll position after the compiled preview iframe loads.
- Preserve preview scroll when refreshing the same compiled preview file.
- Keep existing CodeMirror editor scroll behavior unchanged.

**Non-Goals:**

- Change generated map/page iframe behavior.
- Change in-preview wikilink navigation, external link handling, or compiler output generation.
- Add a new dependency or shared state store.

## Decisions

- Store preview scroll on the selected file's existing `scrollFraction` field. This matches the native app's single scroll fraction binding shared by raw and compiled views and avoids introducing per-mode scroll state.
- Add renderer-only helpers for preview scroll capture and restore. The iframe already uses `allow-same-origin` for local compiled HTML, so the renderer can read `contentWindow.scrollY` and call `scrollTo` without main-process involvement.
- Restore on iframe `load`. This mirrors native `WebView.webView(_:didFinish:)` and handles both mode switches and same-file preview reloads after save/recompile.

## Risks / Trade-offs

- Cross-origin iframe access could throw if a future preview source is not same-origin → Catch access errors and treat the scroll fraction as zero rather than breaking rendering.
- Restoring too early could happen before layout settles → Use `requestAnimationFrame` after load, matching the existing editor restore pattern.
- Reusing one scroll fraction means FILE and WIKI continue sharing position, including imperfect cross-surface proportional mapping → This is intentionally native-compatible.
