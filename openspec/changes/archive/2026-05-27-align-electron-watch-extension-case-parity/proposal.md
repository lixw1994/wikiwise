## Why

Native `FileWatcher` classifies watched markdown and CSS paths with case-sensitive suffix checks: `path.hasSuffix(".md")` and `path.hasSuffix(".css")`. The Electron shared core currently uses case-insensitive regular expressions for those watcher paths, so `.MD` and `.CSS` changes trigger live refresh work that the native app would ignore.

## What Changes

- Make shared watch-event classification use native case-sensitive `.md` and `.css` suffix semantics.
- Preserve existing lower-case markdown/CSS watcher behavior, structure-event priority, `.rebuild` priority, output-directory ignoring, and project watcher IPC.
- Add regression coverage anchored to the native `FileWatcher` suffix checks.
- Archive the phase with retained build/package/runtime and release-readiness evidence while keeping the signed/notarized release gate open.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `wikiwise-core-package`: Watch event classification now mirrors native case-sensitive markdown/CSS suffix handling.
- `electron-live-rebuild-watching`: Electron live rebuild watching must ignore upper-case `.MD` and `.CSS` changes just as native `FileWatcher` does.
- `electron-native-parity-roadmap`: Track this watcher extension-case parity phase as archived native watcher behavior evidence.

## Impact

- Affects `packages/wikiwise-core/src/index.js`.
- Affects shared core watcher tests and Electron live-rebuild source parity tests.
- Affects OpenSpec specs and retained verification evidence.
