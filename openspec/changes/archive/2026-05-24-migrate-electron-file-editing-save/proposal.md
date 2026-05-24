## Why

The Electron app can open files and show compiled wiki previews, but File mode is still read-only. Native Wikiwise is an editor: selected text files open in an editor, edits are saved to disk, markdown changes can be recompiled, and `Mod-S` forces an immediate save. The next parity step is to make Electron editing real while preserving the renderer sandbox.

## What Changes

- Add core text-file write and active-file tracking helpers.
- Add Electron main-process save IPC that validates project-relative writes before touching disk.
- Extend preload with a save API.
- Replace read-only File mode with an editable source surface, dirty/saving state, save button, `Mod-S`, and debounce-save behavior.
- Recompile saved markdown files and refresh Wiki preview with a main-created file URL.

## Success Criteria

- Core tests prove text writes persist UTF-8 content and active-file tracking writes the project-relative path.
- Electron tests prove save IPC/preload APIs, path safety, editable renderer state, save controls, keyboard save, debounce save, and markdown preview refresh hooks exist without launching Electron.
- Root `npm test` passes.
- `openspec validate migrate-electron-file-editing-save --strict` passes.
- Swift source files remain untouched.
- Retained verification records implemented editing behavior and remaining native editor gaps.

## Non-Goals

- No full CodeMirror-in-Electron migration in this phase.
- No scroll preservation parity.
- No filesystem watcher/live rebuild.
- No in-preview wikilink navigation parity.
- No new wiki scaffolding, publishing, terminal, menus, or packaging changes.

## Capabilities

### New Capabilities

- `electron-file-editing-save`: Editable source mode, sandboxed save flow, and save-triggered markdown preview refresh in the Electron app.

### Modified Capabilities

- `wikiwise-core-package`: Add text-file writing and active-file tracking helpers for Electron main-process use.
- `cross-platform-electron-workspace`: Add save IPC/preload APIs while preserving renderer sandboxing and path safety.
- `electron-compiler-preview`: Refresh compiled preview output after markdown saves.

## Impact

- Modifies `packages/wikiwise-core`.
- Modifies `apps/electron` main, preload, renderer, CSS, and tests.
- Adds OpenSpec artifacts and retained verification for the file editing/save phase.
- Does not modify Swift source or native release scripts.
