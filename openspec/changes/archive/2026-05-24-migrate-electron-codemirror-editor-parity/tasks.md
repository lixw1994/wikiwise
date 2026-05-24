## 1. Editor Parity Tests

- [x] 1.1 Add failing structural tests for main/preload editor resource URL APIs, renderer CodeMirror iframe usage, and removal of textarea source editing.
- [x] 1.2 Add failing structural tests for shared `editor.html` Electron `postMessage` bridge while preserving Swift WebKit handlers.
- [x] 1.3 Verify `npm --prefix apps/electron test` fails for the new editor parity expectations before implementation.

## 2. Editor Parity Implementation

- [x] 2.1 Add main/preload editor resource URL APIs.
- [x] 2.2 Update `editor.html` with additive Electron parent `postMessage` bridge support.
- [x] 2.3 Replace Electron textarea source editing with the shared CodeMirror iframe and wire content, dirty state, save/autosave, and scroll restoration.
- [x] 2.4 Update runtime audit to exercise File mode and record CodeMirror editor evidence.
- [x] 2.5 Verify `npm --prefix apps/electron test` passes.

## 3. Runtime Verification

- [x] 3.1 Verify `npm run electron:audit:runtime` passes and report includes editor evidence.
- [x] 3.2 Inspect runtime report for CodeMirror iframe, editor ready state, and hidden textarea absence.

## 4. Validation

- [x] 4.1 Verify `npm test` passes.
- [x] 4.2 Verify `openspec validate migrate-electron-codemirror-editor-parity --strict` passes.
- [x] 4.3 Verify `swift build` passes.
- [x] 4.4 Verify `git diff --check` passes.
- [x] 4.5 Record retained verification evidence and archive the change.
