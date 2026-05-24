## Context

Native Wikiwise uses `EditorWebView` with CodeMirror. The editor sends content changes back to Swift, Swift writes the file, and markdown pages can be recompiled and reloaded. Electron already has the compiler wrapper and preview iframe, so this phase can wire editable source content to the main process and reuse the existing compiler path after saves.

## Goals / Non-Goals

**Goals:**

- Preserve renderer sandboxing: all writes happen in main/core.
- Add an editable File mode for visible text files.
- Add save button, `Mod-S`, and debounce-save behavior.
- Recompile saved markdown and refresh the Wiki preview result.
- Track the active file in `.claude/active-file`, matching the native agent workflow hook.

**Non-Goals:**

- No CodeMirror iframe/editor migration yet.
- No scroll preservation.
- No watcher-driven live rebuild.
- No preview navigation interception.

## Decisions

- Add `writeTextFile()` and `writeActiveFile()` to `@wikiwise/core`.
- Keep path safety in the Electron main process because it owns the trusted `projectRoot`.
- Reuse `compileMarkdownFile(projectRoot, filePath)` after saves so the same scanner/compiler behavior powers selection and saving.
- Use an in-renderer `<textarea>` for this phase to establish save semantics before migrating the native CodeMirror asset.
- Use a debounce timer in renderer for native-like autosave, plus explicit save button and `Mod-S`.

## Risks / Trade-offs

- Textarea editing is not final CodeMirror parity; verification must record this gap.
- Debounced saves can race with rapid file switching; renderer state must only clear dirty state for the still-selected file.
- The main process must reject unsafe paths before writing.
- Markdown recompile uses the existing compiler cache and invalidation path; tests cover wiring, while deeper runtime visual parity remains later.

## State Model

- **clean:** selected file content equals last saved content.
- **dirty:** draft content differs from last saved content.
- **saving:** a save IPC request is in flight.
- **saved-preview-ready:** save completed and markdown compiled result includes a file URL.
- **save-error:** save failed and renderer retains dirty content.

## Migration Plan

1. Write failing core tests for text writes and `.claude/active-file` tracking.
2. Implement core write helpers.
3. Write failing Electron structural tests for save IPC/preload/renderer editing hooks.
4. Implement main-process save path safety and save result creation.
5. Implement preload save API.
6. Implement editable renderer source mode, save state, button, keyboard shortcut, debounce save, and preview refresh.
7. Verify tests, OpenSpec, Swift source untouched, and retained evidence.

## Open Questions

- Full CodeMirror parity and scroll preservation belong in a later editor fidelity phase.
- Watcher/live rebuild should be implemented after explicit save semantics are stable.
