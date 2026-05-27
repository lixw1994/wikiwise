## Context

Electron and native both load `Sources/Wikiwise/Resources/editor.html`, whose CodeMirror bundle debounces editor updates before posting `contentChanged`. Native `EditorWebView` receives that debounced message and immediately writes the non-empty content to disk with `try? content.write(...)`. Electron currently receives the same parent-frame message, marks the file dirty, then schedules another 500 ms renderer autosave before calling the save IPC path.

## Goals / Non-Goals

**Goals:**

- Match native save timing after a non-empty editor bridge payload reaches the app.
- Preserve the native empty-content guard that prevents initial editor-load messages from saving blank content.
- Preserve Electron's existing path-safe save IPC, markdown recompilation, dirty-state tracking, and manual save shortcut.
- Keep follow-up saves reliable when another editor payload arrives while a previous save is still in flight.

**Non-Goals:**

- Changing the shared CodeMirror debounce inside `codemirror-bundle.js`.
- Replacing the save IPC path or adding new main/preload APIs.
- Reintroducing visible detail save chrome that has already been hidden for native parity.

## Decisions

- Treat `wikiwise:editorContentChanged` as the debounced save trigger.
  The shared editor resource already owns the typing-settle debounce, so Electron should call its save path when that payload is handled. This keeps one debounce layer, matching native.

- Keep `saveSelectedFile()` as the single persistence path.
  Calling the existing save function preserves path validation, markdown recompilation, document-info refresh, and active-file behavior instead of adding a renderer-only shortcut.

- Replace delayed autosave scheduling with an immediate follow-up save request.
  If a payload arrives while a save is already running, `saveSelectedFile()` returns because `file.isSaving` is true. When the in-flight save completes and detects that the draft changed again, it should queue the next save without adding another 500 ms delay.

## Risks / Trade-offs

- Faster save calls could expose pre-existing IPC failures sooner. Mitigation: keep existing error handling and preserve manual `Mod-S` behavior.
- A save triggered during an in-flight save can still need a follow-up pass. Mitigation: keep dirty-state comparison after save completion and immediately queue another save when needed.
- Source-level tests can prove the native/Electron timing contract, but not every real typing cadence. Mitigation: retain broad save, package, runtime, and Swift build verification for the slice.
