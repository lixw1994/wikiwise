## Why

The native macOS app records `.claude/active-file` only when the containing `.claude` directory already exists; the write is best-effort and silently does nothing for standalone files or ordinary folders. Electron currently uses the shared text writer for active-file tracking, which creates `.claude` as a side effect and can mutate folders the native app would leave untouched.

## What Changes

- Make the shared `writeActiveFile` helper preserve native best-effort behavior: write relative paths when `.claude` exists, and do not create `.claude` when it is missing.
- Preserve scaffolded wiki behavior, selected-file tracking, save behavior, and returned metadata for successful active-file writes.
- Add regression coverage anchored to the native Swift `try?` active-file write.
- Archive the phase with build/package/runtime evidence while keeping the signed/notarized release gate open.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `wikiwise-core-package`: Active-file tracking now includes native no-directory-creation behavior.
- `electron-project-lifecycle`: Standalone file and ordinary folder opens must not create `.claude` solely for active-file tracking.
- `electron-file-editing-save`: Save-triggered active-file tracking must preserve the same no-directory-creation behavior.
- `electron-native-parity-roadmap`: Track this active-file side-effect parity phase as archived native filesystem behavior evidence.

## Impact

- Affects `packages/wikiwise-core/src/index.js`.
- Affects core active-file tests and Electron lifecycle/save parity tests.
- Affects OpenSpec specs and retained verification evidence.
