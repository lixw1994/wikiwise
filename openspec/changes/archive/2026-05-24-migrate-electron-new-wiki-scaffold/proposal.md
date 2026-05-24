## Why

Electron still shows "Create a New Wiki" as a deferred action, while native Wikiwise can create a complete scaffolded wiki from the welcome screen. The roadmap orders scaffold/new wiki immediately after live rebuild watching because it unlocks a first-run workflow: create a project, open it, compile `wiki/home.md`, and start working with the generated agent instructions and build tooling.

## What Changes

- Add native-compatible scaffold creation helpers to `@wikiwise/core`.
- Add Electron main-process IPC for choosing a scaffold location and creating a new wiki.
- Replace the deferred renderer message with a new-wiki dialog that captures name and location.
- Open the created wiki immediately, start watching it, compile/select `wiki/home.md`, and show a post-create guide.
- Update OpenSpec requirements so "Create a New Wiki" is no longer a deferred lifecycle action.

## Success Criteria

- Core tests prove scaffold slugging, directory creation, template copying, placeholder replacement, settings, version marker, `.gitignore`, and bundled build-tool copying.
- Electron tests prove new-wiki IPC, preload APIs, renderer dialog flow, post-create guide, and project opening wiring exist without launching Electron.
- Root `npm test` passes.
- `openspec validate migrate-electron-new-wiki-scaffold --strict` passes before archive, and `openspec validate --all --strict` passes after archive.
- Swift source files remain untouched.
- Retained verification records implemented scaffold behavior and deferred native gaps.

## Non-Goals

- No built-in terminal migration in this phase.
- No publishing setup or publish dialog migration.
- No persistence of the last opened folder.
- No CodeMirror editor parity.
- No app menu or packaging changes.

## Capabilities

### New Capabilities

- `electron-new-wiki-scaffold`: New wiki creation, scaffold copying, and post-create guide behavior in the Electron app.

### Modified Capabilities

- `wikiwise-core-package`: Add native-compatible scaffold creation helpers.
- `electron-project-lifecycle`: Replace deferred Create a New Wiki behavior with a working project creation path.
- `cross-platform-electron-workspace`: Add main/preload scaffold IPC while preserving renderer sandboxing.
- `electron-compiler-preview`: Created scaffolded wikis compile and select `wiki/home.md` immediately.

## Impact

- Modifies `packages/wikiwise-core`.
- Modifies `apps/electron` main, preload, renderer, HTML, CSS, and tests.
- Adds OpenSpec artifacts and retained verification for the scaffold/new wiki phase.
- Does not modify Swift source or bundled scaffold resources.
