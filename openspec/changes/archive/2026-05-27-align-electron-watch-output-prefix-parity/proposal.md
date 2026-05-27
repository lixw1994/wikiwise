## Why

Native `FileWatcher` skips any watched event whose absolute path has the output directory as a prefix. The shared Electron watcher summary currently skips only paths that are inside the output directory, so sibling-prefix paths such as `site/output-note.md` can trigger Electron refreshes that native ignores.

## What Changes

- Make shared watch-event output filtering match native `path.hasPrefix(watcher.outputDir)` semantics.
- Preserve existing output-directory ignoring, `.rebuild` priority, markdown/CSS casing behavior, support-file structure events, and `/wiki/assets/` containment behavior.
- Add RED/GREEN coverage anchored to the native `FileWatcher` output-prefix guard.
- Archive the phase with retained build/package/runtime and release-readiness evidence while keeping the signed/notarized release gate open.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `wikiwise-core-package`: Watch event filtering now mirrors native output-directory prefix behavior.
- `electron-live-rebuild-watching`: Electron live rebuild watching must ignore output-prefix paths like native `FileWatcher`.
- `electron-native-parity-roadmap`: Track this watcher output-prefix parity phase as archived native watcher behavior evidence.

## Impact

- Affects `packages/wikiwise-core/src/index.js`.
- Affects shared core watcher tests and Electron live-rebuild source parity tests.
- Affects OpenSpec specs and retained verification evidence.
