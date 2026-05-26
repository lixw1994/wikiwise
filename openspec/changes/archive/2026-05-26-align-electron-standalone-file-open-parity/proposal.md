## Why

The native SwiftUI app treats an opened standalone file differently from an opened wiki folder: it sets the parent as the root, leaves the project tree empty, and does not start compiler-backed project services. Electron currently scans the file's parent directory as a project tree, which creates a visible mismatch in the standalone-file state.

## What Changes

- Align Electron `createProjectResult` for file targets with native `openURL(_:)` file behavior.
- Keep standalone-file opens path-safe by retaining the parent directory as the project root.
- Prevent standalone-file opens from scanning/rendering the parent directory tree or starting project watcher, terminal, compiler, publish, and generated-map flows.
- Extend parity tests and runtime audit evidence for standalone-file opens.

## Capabilities

### New Capabilities

### Modified Capabilities

- `electron-project-lifecycle`: Standalone-file opens now have a native-compatible file state distinct from folder project opens.
- `electron-live-rebuild-watching`: Watchers are not started for standalone-file opens.
- `electron-right-sidebar-terminal`: Project-root terminal services are not started for standalone-file opens.
- `electron-runtime-parity-audit`: Runtime audit records standalone-file tree and service evidence.
- `electron-native-parity-roadmap`: Roadmap records this native project-lifecycle gap closure while preserving the final release gate.

## Impact

- Affected files: Electron main project result creation, renderer project-service guards, project lifecycle tests, runtime audit script/tests, and OpenSpec specs.
- No dependency, Swift source, or release-script changes.
- No change to opened-folder behavior, created-wiki behavior, file editing, or document info rendering.
