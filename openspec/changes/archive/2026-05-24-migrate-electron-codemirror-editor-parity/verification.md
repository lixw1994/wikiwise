## Completion Decision

implemented, verified, archived

## Commands Run

- `npm --prefix apps/electron test`
  - Red evidence after adding the view-mode scroll restoration assertion: 58 pass, 1 fail. The failing assertion showed `setDetailMode(mode)` changed `state.detailMode` without calling `captureEditorScrollFraction()`.
  - Green evidence after implementation: 59 pass, 0 fail.
- `node --check apps/electron/src/main/main.js`
  - Passed with exit code 0.
- `node --check apps/electron/src/renderer/renderer.js`
  - Passed with exit code 0.
- `node --check scripts/audit-electron-runtime.mjs`
  - Passed with exit code 0.
- `npm run electron:audit:runtime`
  - Passed all scenarios: `welcome-light`, `welcome-dark`, `project-light`, and `project-dark`.
- Runtime report inspection
  - `project-light`: `sourceEditorFramePresent=true`, `sourceEditorFrameReady=true`, `codeMirrorEditorPresent=true`, `sourceEditorFrameHidden=false`, `previewFrameHidden=true`.
  - `project-dark`: `sourceEditorFramePresent=true`, `sourceEditorFrameReady=true`, `codeMirrorEditorPresent=true`, `sourceEditorFrameHidden=false`, `previewFrameHidden=true`.
- `npm test`
  - Passed workspace tests: Electron 59 pass, core 24 pass.
- `openspec validate migrate-electron-codemirror-editor-parity --strict`
  - Passed.
- `swift build`
  - Passed and copied `editor.html` as a Swift resource.
- `git diff --check`
  - Passed with no whitespace errors.

## Manual Checks

- Confirmed Electron main resolves `Sources/Wikiwise/Resources/editor.html` and `codemirror-bundle.js` through a main-owned `wikiwise:getEditorResource` IPC path.
- Confirmed preload exposes `getEditorResource` without renderer filesystem access.
- Confirmed renderer source mode uses `#source-editor-frame` and no longer contains `<textarea id="source-editor">`.
- Confirmed renderer reads CodeMirror content through `getContent()` before saving and updates dirty/autosave state from `wikiwise:editorContentChanged`.
- Confirmed renderer restores CodeMirror content through `setContent()` and scroll position through `__scrollToFraction()`, including capturing scroll before switching away from File mode.
- Confirmed shared `editor.html` keeps `window.webkit.messageHandlers.editorReady` and `window.webkit.messageHandlers.contentChanged` for Swift while adding parent `postMessage` events for Electron.

## Evidence

- Runtime report path: `apps/electron/out/runtime-audit/report.json`.
- Screenshot artifacts path: `apps/electron/out/runtime-audit/screenshots`.
- Structural tests cover the Electron editor resource IPC, preload bridge, CodeMirror iframe, no-textarea source surface, save/autosave integration, scroll helpers, shared WebKit bridge, and Electron `postMessage` bridge.
- Swift compatibility evidence comes from preserving the WebKit handler names in the shared resource and running `swift build` successfully after the resource change.

## Residual Risks

- This phase intentionally does not close PTY-grade terminal parity.
- This phase intentionally does not perform an actual signed/notarized release run.
- Runtime audit proves CodeMirror iframe loading and ready state, but it does not simulate a long manual editing session with every native CodeMirror command.
