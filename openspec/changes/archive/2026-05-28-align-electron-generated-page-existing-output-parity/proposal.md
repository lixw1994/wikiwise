## Why

Native SwiftUI prepares generated map/graph output during project-open scanning, then generated-page navigation only checks whether the target HTML already exists. The toolbar 3D map button and generated-link fallback do not trigger a whole-site compile when clicked. Electron currently calls `compileAll()` inside both generated-page open paths, which can mutate compiler output and produce missing generated pages as a side effect of navigation.

## What Changes

- Treat generated map/graph navigation as an existing-output lookup, matching native file-exists guards.
- Keep project-open scanning as the lifecycle step that prepares generated map/graph output.
- Preserve no-op behavior when generated HTML is absent.
- Add source-backed coverage comparing native `ContentView` generated-page navigation with Electron main-process generated-page IPC resolution.

## Capabilities

### New Capabilities

### Modified Capabilities
- `electron-preview-navigation-map-graph`: Generated-page navigation now relies on already prepared compiler output and does not trigger full compilation from toolbar or generated-link navigation.
- `electron-native-parity-roadmap`: Record this generated-page existing-output parity slice and retained verification evidence.

## Impact

- Electron main-process generated-page helpers in `apps/electron/src/main/main.js`.
- Electron preview navigation parity tests under `apps/electron/test/preview-navigation-map-graph.test.js`.
- OpenSpec delta specs for generated-page routing and roadmap tracking.
