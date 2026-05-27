## Why

Native `FileWatcher` gives structure changes priority over markdown content changes by emitting `.structure` with no markdown payload. The shared Electron watcher summary currently preserves changed markdown paths inside a `structure` summary, which can make Electron reload the selected markdown during a structure event that native only rescans.

## What Changes

- Make shared watch-event structure summaries drop markdown path payloads like native `.structure`.
- Preserve normal markdown content summaries when no higher-priority structure or rebuild event is present.
- Preserve rebuild, CSS, support-file, output-prefix, and `/wiki/assets/` watcher behavior.
- Add RED/GREEN coverage anchored to native `FileWatcher` debounce priority and `ContentView` structure handling.
- Archive the phase with retained build/package/runtime and release-readiness evidence while keeping the signed/notarized release gate open.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `wikiwise-core-package`: Watch structure summaries now mirror native structure priority by omitting markdown path payloads.
- `electron-live-rebuild-watching`: Electron live rebuild watching must not refresh selected markdown solely from markdown paths when structure wins watcher priority.
- `electron-native-parity-roadmap`: Track this watcher structure-priority parity phase as archived native watcher behavior evidence.

## Impact

- Affects `packages/wikiwise-core/src/index.js`.
- Affects shared core watcher tests and Electron live-rebuild source parity tests.
- Affects OpenSpec specs and retained verification evidence.
