## Context

Native file selection calls `ContentView.loadFile(_:)`, then writes the selected path to `.claude/active-file` through `writeActiveFile(_:)`. That helper uses `try? relativePath.write(...)`, so missing directories, permission failures, or other filesystem errors do not interrupt selection and do not show a user-facing error.

Electron already mirrors the no-directory side-effect boundary in `writeActiveFile(projectRoot, filePath)`: it returns `{ written: false }` when `.claude` is missing instead of creating it. The remaining drift is in the renderer selection bridge. `setActiveSelectedFile()` catches rejected `wikiwise.setActiveFile(...)` promises and calls `setError(error)`, turning this best-effort side effect into a visible global error.

## Goals / Non-Goals

**Goals:**

- Match native best-effort active-file write silence when the active-file side effect fails.
- Keep successful active-file writes for scaffolded wiki projects.
- Keep main-process project-root and file-path validation unchanged.
- Keep the shared core helper's no-directory-creation behavior unchanged.

**Non-Goals:**

- Changing save-path error handling or save-path active-file writes.
- Creating `.claude` for standalone folders or standalone file parents.
- Adding new telemetry, user-facing warnings, or IPC channels.

## Decisions

- Swallow renderer `setActiveFile` rejections in `setActiveSelectedFile()`.
  This mirrors native `try?` at the user-visible selection layer while preserving a `null` return for callers that ignore the side-effect result.

- Leave validation in the main process.
  `setActiveFile(payload)` should still assert the project root and selected file path before calling the shared core helper. The parity change is only that renderer selection should not promote those side-effect failures into global UI.

- Keep save behavior out of scope.
  Saves are user-initiated or editor-triggered persistence operations with their own failure semantics. This change only addresses active-file tracking performed as a selection side effect.

## Risks / Trade-offs

- Silencing renderer `setActiveFile` failures could hide a bad active-file path during development. Mitigation: retain source-backed tests for main-process validation and core helper behavior.
- Runtime behavior changes only for an ancillary side effect. Mitigation: preserve all selection, read, tree, compiler, save, package, and runtime verification.
