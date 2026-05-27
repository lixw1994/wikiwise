## Why

Native SwiftUI resets navigation history when opening a folder project, but its standalone-file branch only switches the selected file and leaves `backHistory` and `forwardHistory` intact. Electron currently clears both history stacks for every project result, so opening a standalone markdown/plain-text file is more destructive than the native app.

## What Changes

- Preserve existing Electron back/forward history when applying a standalone-file project result.
- Continue clearing back/forward history when applying folder project results, including Open Existing folders, restore, and newly scaffolded wiki folders.
- Preserve existing standalone-file service boundaries, selected-file display behavior, active-file side effects, and post-create guide behavior.
- Add source-backed regression coverage anchored to the native `openURL(_:)` folder and standalone branches.

## Capabilities

### New Capabilities

### Modified Capabilities

- `electron-project-lifecycle`: Standalone-file project application now preserves navigation history while folder project application still resets it.
- `electron-native-parity-roadmap`: Track this standalone-file history preservation parity slice and retained verification evidence.

## Impact

- Electron renderer project result application behavior in `apps/electron/src/renderer/renderer.js`.
- Electron project lifecycle regression tests in `apps/electron/test/project-lifecycle.test.js`.
- OpenSpec delta specs and roadmap tracking for the Electron native parity migration.
