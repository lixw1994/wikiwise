## Why

Native `FileWatcher` treats any watched path containing `/wiki/assets/` as a structure change. The shared Electron watcher summary currently only matches paths that start with `wiki/assets/` relative to the project root. That misses nested paths such as `notes/wiki/assets/image.png` even though the native watcher would mark them as structure changes.

## What Changes

- Make shared watch-event classification match native `/wiki/assets/` containment semantics.
- Preserve root `wiki/assets/` behavior, output-directory ignoring, support-file structure events, `.rebuild` priority, and markdown/CSS content handling.
- Add RED/GREEN coverage anchored to the native `FileWatcher` assets-path check.
- Stabilize the runtime audit shutdown path uncovered during verification so passing audit assertions produce a clean command exit.
- Archive the phase with retained build/package/runtime and release-readiness evidence while keeping the signed/notarized release gate open.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `wikiwise-core-package`: Watch event classification now mirrors native `/wiki/assets/` containment behavior.
- `electron-live-rebuild-watching`: Electron live rebuild watching must classify nested `/wiki/assets/` paths as structure changes like native `FileWatcher`.
- `electron-runtime-parity-audit`: Runtime audit closes its BrowserWindow gracefully before the main process calls `app.quit()`.
- `electron-native-parity-roadmap`: Track this watcher assets-path parity phase as archived native watcher behavior evidence.

## Impact

- Affects `packages/wikiwise-core/src/index.js`.
- Affects shared core watcher tests and Electron live-rebuild source parity tests.
- Affects runtime audit shutdown script coverage.
- Affects OpenSpec specs and retained verification evidence.
