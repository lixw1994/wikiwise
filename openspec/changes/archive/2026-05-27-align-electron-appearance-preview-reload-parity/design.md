## Context

Native `ContentView` observes `appearanceMode` changes and delays a `webViewReloadToken += 1` update:

```swift
.onChange(of: appearanceMode) { _, _ in
    DispatchQueue.main.asyncAfter(deadline: .now() + 0.1) {
        webViewReloadToken += 1
        terminalSession.updateAppearance()
    }
}
```

Native `WebView.updateNSView` sets `wv.appearance = NSApp.effectiveAppearance` and reloads the same file URL whenever `lastReloadToken != reloadToken`, preserving scroll for same-URL reloads. Electron already updates document palette state and terminal theme when the user cycles appearance mode, but active preview iframes keep their current document without an explicit reload.

## Goals / Non-Goals

**Goals:**

- Match native appearance-change reload semantics for the visible compiled preview iframe.
- Match the same reload-token effect for visible generated-page iframes because native generated HTML uses the same `WebView` and reload token.
- Preserve preview scroll restoration for selected Markdown previews by reusing the existing preview render/load path.
- Keep shell palette and terminal theme behavior unchanged.

**Non-Goals:**

- Changing native SwiftUI behavior.
- Recompiling pages on appearance changes.
- Refreshing non-preview source-editor iframes beyond their existing CSS/media behavior.
- Claiming final migration completion; signed/notarized release evidence remains required.

## Decisions

- Add a renderer helper that reloads only the visible preview surface. For selected Markdown preview, it reuses `renderPreview()` so the existing `capturePreviewScrollFraction()` and preview load restoration path remain authoritative.
- For generated pages, reassign the current generated iframe `src` to mirror native's same-URL reload-token reload without changing generated-page state or app history.
- Call the helper after `cycleAppearanceMode()` persists and applies the new mode. This matches the native `@AppStorage` appearance change path that triggers the delayed reload token update.
- Leave watcher and manual Refresh Page behavior unchanged; those paths already have separate native parity requirements.

## Risks / Trade-offs

- Reassigning a generated iframe `src` reloads the generated document and may reset its internal scroll/interactive state. Native generated HTML is also reloaded by the shared `WebView` reload token, so this is the parity trade-off.
- Electron iframe media queries may sometimes update without a reload, but explicit reload keeps behavior aligned with the current native WKWebView implementation.
