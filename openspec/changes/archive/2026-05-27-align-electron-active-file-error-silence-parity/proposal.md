## Why

Native `ContentView.writeActiveFile(_:)` records the current file path as a best-effort side effect using `try?`, so failures while updating `.claude/active-file` are not surfaced to the user. Electron's renderer currently routes `setActiveFile` failures into the global error banner, which can make the same best-effort side effect user-visible.

## What Changes

- Update Electron active-file selection handling so rejected `setActiveFile` calls are swallowed like the native Swift `try?` side effect.
- Preserve main-process project-root and file-path validation, shared core no-directory-creation behavior, and successful `.claude/active-file` writes for scaffolded projects.
- Add source-backed regression coverage proving native active-file writes are silent on failure and Electron no longer calls global `setError` from the selection side-effect path.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `electron-project-lifecycle`: tighten active-file side-effect handling so selection write failures remain best-effort and silent.
- `electron-native-parity-roadmap`: record this active-file error-silence parity correction as another completed migration slice after archive.

## Impact

- Affected Electron renderer: `apps/electron/src/renderer/renderer.js`.
- Affected tests: `apps/electron/test/project-lifecycle.test.js`.
- Affected specs: `electron-project-lifecycle`, `electron-native-parity-roadmap`.
- No new dependencies or IPC channels.
