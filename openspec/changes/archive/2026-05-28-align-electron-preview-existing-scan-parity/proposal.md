## Why

Native SwiftUI owns compiler scanning at folder-open and watcher-change boundaries. `openURL(_:)` calls `scanPages()` once for a folder, watcher markdown/rebuild/structure events call `rescan()`, and selected-page preview compilation through `loadFile(_:)` uses the existing scan state. Electron currently calls `scanPages()` inside every selected Markdown preview compilation, so source selection and manual Refresh Page perform extra metadata and generated-output work that native does not perform from that path.

## What Changes

- Keep folder-open scanning as the lifecycle step that prepares compiler metadata and generated map/graph output.
- Keep watcher summaries responsible for rescanning when file contents or structure change.
- Make selected Markdown preview compilation use the existing compiler scan state, matching native `loadFile(_:)`.
- Add source-backed regression coverage comparing native `ContentView` scan ownership with Electron main-process preview compilation.

## Capabilities

### New Capabilities

### Modified Capabilities
- `electron-compiler-preview`: Selected preview compilation now relies on the existing compiler scan lifecycle instead of rescanning per preview request.
- `electron-native-parity-roadmap`: Record this preview existing-scan parity slice and retained verification evidence.

## Impact

- Electron main-process preview compilation in `apps/electron/src/main/main.js`.
- Electron compiler preview parity tests under `apps/electron/test/compiler-preview.test.js`.
- OpenSpec delta specs for compiler preview behavior and roadmap tracking.
