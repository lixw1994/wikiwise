## Context

`ContentView.openURL(_:)` has different history semantics for folder and standalone-file opens. The folder branch assigns `backHistory = []` and `forwardHistory = []` after replacing the project root, while the standalone-file branch assigns `rootURL`, clears the tree, selects the file, and calls `loadFile(url)` without mutating either history stack. Electron centralizes both paths in `applyProjectResult`, which currently resets history unconditionally.

## Goals / Non-Goals

**Goals:**
- Match native history preservation for standalone-file project results.
- Keep native destructive history reset behavior for folder project results.
- Keep service, terminal, watcher, publish, active-file, and guide behavior unchanged.

**Non-Goals:**
- Change normal in-project file navigation history behavior.
- Push standalone opens onto history; native `openURL(_:)` does not do that.
- Persist history across app launches or windows.

## Decisions

- Gate the history reset on `isProjectFolder()` after `state.currentProject` has been assigned. This keeps folder results unchanged and lets standalone file results inherit the existing stacks.
- Do not add a new option flag to `applyProjectResult`. The native distinction is derived from directory-vs-file open state, and Electron already exposes that as `projectKind`.
- Use source-backed tests to prove that the Swift folder branch clears history, the Swift standalone branch does not, and Electron's reset is scoped to folder project results.

## Risks / Trade-offs

- A preserved history entry may point to a file from a prior folder while the current selected file is standalone. This matches native state behavior, where the standalone branch also leaves existing URL stacks intact.
- Source-backed tests can become brittle if the Swift function is reorganized. Keep assertions focused on history writes inside the two native branches.

## Migration Plan

Patch the renderer state transition only. Rollback is a small revert of the history guard plus removal of the regression test and OpenSpec delta.

## Open Questions

None.
