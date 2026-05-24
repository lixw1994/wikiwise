## Why

The native SwiftUI app scans project metadata, opens `wiki/home.md`, and then drip-compiles the remaining pages in the background so search, graph/map data, and linked pages become ready without blocking the UI. Electron currently compiles the selected page and only forces full compilation for generated pages or publishing, leaving a native parity gap immediately after opening or rescanning a project.

## What Changes

- Add Electron main-process background batch compilation that uses the existing `WikiCompiler.compileNextBatch()` API.
- Start or restart background compilation after opening a wiki folder, creating a scaffolded wiki, and applying watcher summaries that rescan or invalidate compiler state.
- Retain deterministic tests and runtime audit evidence that the background compilation path exists and reaches completion.
- Preserve on-demand page compilation, save behavior, generated page compilation, publishing compilation, and watcher refresh semantics.

## Capabilities

### New Capabilities

- `electron-background-compilation-parity`: Covers native-style background batch compilation after project open and rebuild events.

### Modified Capabilities

- `electron-compiler-preview`: Closes the deferred background drip compilation gap in the compiler preview lifecycle.
- `electron-live-rebuild-watching`: Requires watcher-triggered rescans/invalidation to restart background compilation.
- `electron-runtime-parity-audit`: Adds retained evidence that the audit project can drain pending background compilation.
- `electron-native-parity-roadmap`: Records background compilation parity as a native compiler lifecycle phase.

## Impact

- `apps/electron/src/main/main.js`: Adds background compilation scheduling, lifecycle helpers, and project/watch integration.
- `packages/wikiwise-core/test/compiler.test.js`: Adds direct coverage for `compileNextBatch()` producing remaining page output.
- `scripts/audit-electron-runtime.mjs`: Captures background compilation completion evidence for the runtime audit report.
- Electron and OpenSpec tests document the parity contract and guard against regressing to on-demand-only compilation.
