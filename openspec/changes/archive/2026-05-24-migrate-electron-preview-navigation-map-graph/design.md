## Context

The SwiftUI app loads compiled HTML through `WKWebView.loadFileURL(_:allowingReadAccessTo:)`, opens http/https URLs with `NSWorkspace`, and intercepts local file link clicks so `ContentView` can map HTML pages back to markdown source files or generated pages. Electron currently renders compiled pages and generated map pages in sandboxed iframes by assigning `fileUrl` directly, so local link clicks stay inside the iframe and do not update selected file state, generated-page state, right-sidebar info, or back/forward history.

## Goals / Non-Goals

**Goals:**

- Route local links clicked in compiled preview and generated map/graph frames through Electron renderer state.
- Resolve local HTML URLs in the main process against the current project and compiler output directory.
- Match the native slug lookup behavior for markdown source files in `wiki/`, `raw/`, and the project root.
- Allow same-page anchors to scroll normally inside the frame.
- Open http/https preview links in the user's default browser.
- Refresh generated map/graph pages after project changes that affect compiled output.
- Include `graph.html` in generated-page navigation support.

**Non-Goals:**

- Do not modify Swift sources or bundled map/graph resource behavior in this phase.
- Do not replace iframe rendering with BrowserView/WebContentsView.
- Do not complete packaging, signing, notarization, DMG release, or final parity audit.
- Do not make pixel-level visual changes to the map/graph pages beyond making their existing navigation work in Electron.

## Decisions

1. **Intercept frame clicks from the renderer.** The renderer will attach `load` handlers to both preview iframes, inspect clicked anchors, allow same-document anchors, and prevent default navigation for http/https or local HTML links. Alternative: use Electron `webview` tags. I am keeping iframes because the app already uses them with a narrow preload bridge and no extra renderer privileges.

2. **Resolve local preview navigation in main.** The renderer will send the clicked URL and project root to main. Main will normalize the URL, derive the HTML slug, find matching markdown in `wiki/`, `raw/`, then root, or return an existing generated HTML page under the compiler output directory. Alternative: replicate filesystem lookup in renderer, but that would break the current security boundary.

3. **Keep generated pages as history entries.** Renderer history will continue storing small serializable entries. Local links to `map.html`, `map-3d.html`, `graph.html`, `index.html`, and `catalog.html` become generated entries; links to markdown-backed pages become file entries.

4. **External links go through main.** Renderer will ask preload/main to open http/https URLs. Main will validate protocols before calling Electron `shell.openExternal`, matching native behavior without letting arbitrary schemes escape.

5. **Generated-page refresh follows watcher summaries.** When live rebuild, CSS reload, or selected markdown changes can affect the compiled output, the renderer will refresh the active generated page through the existing generated-page IPC.

## Risks / Trade-offs

- **Iframe DOM access can fail for an unexpected origin** -> Guard frame listener attachment and leave default navigation as fallback only when interception is not possible.
- **Slug collisions across search directories** -> Match native order: `wiki/`, `raw/`, then project root.
- **Generated output may be missing** -> Resolve generated pages only after compiler output exists; map/graph toolbar flows already compile before opening.
- **External URL security** -> Main accepts only `http:` and `https:` URLs for external opening.
- **Structural tests do not drive a live Electron window** -> Retain static coverage in this phase and leave full browser/runtime parity proof for final audit.

## Migration Plan

1. Add failing Electron structural tests for preview navigation resolution, preload APIs, iframe interception, generated-page history, external opener validation, and generated-page refresh.
2. Implement main-process resolution/openExternal helpers and IPC.
3. Implement preload APIs.
4. Implement renderer frame click interception, navigation restoration, generated-page refresh, and `graph.html` support.
5. Run Electron, root, Swift, OpenSpec, and whitespace verification before archive.
