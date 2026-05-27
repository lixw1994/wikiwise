## Why

Native `EditorWebView` drops empty `contentChanged` bridge payloads before writing to disk. The Swift comment calls out the reason: this protects against the editor firing before content is loaded. Electron currently accepts an empty `wikiwise:editorContentChanged` payload, marks the selected file dirty, and schedules autosave, which can clear a file in a case the native app ignores.

## What Changes

- Make Electron renderer editor-change handling ignore empty bridge payloads before mutating selected-file draft state.
- Preserve non-empty edit behavior, dirty-state updates, debounce saves, `Mod-S`, and save-triggered markdown preview refresh.
- Add regression coverage anchored to the native `EditorWebView` empty-content guard.
- Archive the phase with retained build/package/runtime evidence while keeping the signed/notarized release gate open.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `electron-file-editing-save`: Editor bridge changes must preserve the native empty-content save guard while keeping non-empty save behavior.
- `electron-native-parity-roadmap`: Track this editor empty-change parity phase as archived native editor behavior evidence.

## Impact

- Affects `apps/electron/src/renderer/renderer.js`.
- Affects Electron file editing/save parity tests.
- Affects OpenSpec specs and retained verification evidence.
