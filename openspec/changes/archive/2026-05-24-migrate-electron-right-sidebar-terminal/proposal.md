## Why

Native Wikiwise includes a right sidebar with INFO and TERMINAL tabs. The INFO tab gives immediate context for the selected document, and the TERMINAL tab lets users run their agent or shell commands inside the opened wiki. Electron currently has only the left file tree and editor/preview pane, so it is missing a major part of the native workspace loop after project creation.

## What Changes

- Add native-compatible document info helpers to `@wikiwise/core` for word count, directions frontmatter, wikilinks, and modified time metadata.
- Add Electron main-process IPC for document info and terminal session operations.
- Add preload APIs for document info, terminal start/input/stop, and terminal output subscription cleanup.
- Add a right sidebar in the Electron renderer with INFO and TERMINAL tabs.
- Start a shell session rooted at the current project and let the renderer send line input and display shell output.

## Success Criteria

- Core tests prove document info parsing for selected markdown files.
- Electron tests prove right-sidebar UI, INFO rendering, terminal IPC/preload APIs, output subscription cleanup, project-root terminal startup, and renderer command input exist without launching Electron.
- Root `npm test` passes.
- `openspec validate migrate-electron-right-sidebar-terminal --strict` passes before archive, and `openspec validate --all --strict` passes after archive.
- Swift source files remain untouched and `swift build` passes.
- Retained verification records implemented sidebar/terminal behavior and deferred PTY-level terminal gaps.

## Non-Goals

- No xterm.js or node-pty terminal emulator migration in this phase.
- No publish flow migration.
- No app chrome/menu persistence migration.
- No map/graph polish or preview navigation changes.
- No packaging/release changes.

## Capabilities

### New Capabilities

- `electron-right-sidebar-terminal`: Right sidebar INFO/TERMINAL tabs, document metadata display, and project-root shell interaction in Electron.

### Modified Capabilities

- `wikiwise-core-package`: Add native-compatible document info helpers.
- `cross-platform-electron-workspace`: Add document info and terminal IPC/preload bridge operations while preserving renderer sandboxing.

## Impact

- Modifies `packages/wikiwise-core`.
- Modifies `apps/electron` main, preload, renderer, HTML, CSS, and tests.
- Adds OpenSpec artifacts and retained verification for the right sidebar/terminal phase.
- Does not modify Swift source or release scripts.
