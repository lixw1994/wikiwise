## Why

Electron currently edits files through a plain textarea, but the native macOS app edits markdown through the bundled CodeMirror editor resource. This leaves syntax styling, editor keybindings, and scroll-preservation behavior short of the "same as native" acceptance target.

## What Changes

- Replace the Electron source textarea with the bundled CodeMirror editor iframe.
- Extend the shared `editor.html` bridge so it still supports Swift WebKit message handlers and also supports Electron iframe `postMessage` events.
- Add a main/preload path for resolving the editor resource URL without renderer filesystem access.
- Preserve existing save/autosave behavior while reading editor content from the CodeMirror iframe.
- Update runtime audit/tests/specs to assert CodeMirror editor parity and close the deferred editor gap.

## Success Criteria

- Electron renders source mode through the same `editor.html` and `codemirror-bundle.js` resources as the native app.
- Electron save/autosave uses CodeMirror content, not a textarea value.
- Electron can restore editor scroll fraction when returning to source mode or switching selected files.
- Existing Swift editor behavior remains compatible with `window.webkit.messageHandlers`.
- Tests, OpenSpec validation, runtime audit, `npm test`, and `swift build` pass.

## Non-Goals

- Do not replace the native Swift editor implementation.
- Do not introduce a second CodeMirror bundle.
- Do not solve PTY-grade terminal parity in this change.
- Do not perform signed/notarized release execution in this change.

## Capabilities

### New Capabilities

- `electron-codemirror-editor-parity`: Electron source editing through the shared native CodeMirror editor resource.

### Modified Capabilities

- `electron-file-editing-save`: Replace the deferred CodeMirror editor gap with implemented shared-editor behavior.
- `electron-native-parity-roadmap`: Record CodeMirror editor parity progress while leaving remaining terminal/release execution gates explicit.

## Impact

- Affected code: `Sources/Wikiwise/Resources/editor.html`, Electron main/preload/renderer files, Electron tests, runtime audit script, OpenSpec specs.
- No new npm dependencies are planned.
- Swift resource behavior must remain backward compatible.
