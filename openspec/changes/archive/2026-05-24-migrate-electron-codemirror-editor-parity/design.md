## Context

The native app wraps `Sources/Wikiwise/Resources/editor.html` in `EditorWebView` and uses CodeMirror for source editing, autosave, and scroll fraction helpers. Electron currently uses a plain textarea in `apps/electron/src/renderer/index.html`, which is a visible parity gap and leaves the deferred CodeMirror editor gap open.

## Goals / Non-Goals

**Goals:**

- Reuse `editor.html` and `codemirror-bundle.js` for Electron source editing.
- Preserve Swift compatibility with `window.webkit.messageHandlers`.
- Keep Electron renderer sandboxed and avoid direct filesystem URL construction.
- Preserve save, autosave, dirty state, and scroll restoration.

**Non-Goals:**

- Do not replace the native Swift WebView wrapper.
- Do not add another editor dependency.
- Do not solve terminal PTY parity in this phase.

## Decisions

1. **Use an iframe instead of a textarea.** The Electron renderer will load the same editor resource into `#source-editor-frame`, giving CodeMirror behavior without duplicating the bundle.

2. **Resolve editor URL in main.** The main process will expose `wikiwise:getEditorResource` so the renderer receives a main-created file URL for `editor.html`.

3. **Bridge through `postMessage`.** `editor.html` will keep WebKit handlers for Swift and additionally post `wikiwise:editorReady` and `wikiwise:editorContentChanged` messages to its parent window when loaded in Electron.

4. **Keep source content in renderer state.** The renderer will update `draftContent` from editor messages and call `getContent` before save to avoid stale state.

## Risks / Trade-offs

- The shared editor resource is used by both Swift and Electron, so bridge changes must be additive and conservative.
- File URL iframe loading may race editor readiness; renderer code needs pending content state and an explicit ready handler.
- Runtime audit must exercise File mode so the editor iframe is actually loaded.

## State Model

- **Editor URL unloaded:** no project or main has not returned the resource URL.
- **Editor loading:** iframe `src` points at `editor.html` and content waits for `wikiwise:editorReady`.
- **Editor ready:** renderer can call `setContent`, `getContent`, `__getScrollFraction`, and `__scrollToFraction`.
- **Dirty:** CodeMirror posts content changes, renderer updates draft and save state.
- **Saving:** renderer reads current CodeMirror content and persists through existing save IPC.

## Migration Plan

Add structural tests first, confirm they fail, then update main/preload, editor resource bridge, renderer DOM/JS/CSS, and runtime audit assertions. Run Electron tests, runtime audit, OpenSpec validation, `npm test`, `swift build`, and diff hygiene before archiving.

## Open Questions

None for this phase.
