## Context

SwiftUI's `Got it — start reading` action sets `showPostCreateGuide = false`, builds `wiki/home.md` from `rootURL`, checks that it exists, assigns it to `selectedFileURL`, and calls `loadFile(home)`. Electron opens new projects with `selectedFile` already pointing at home.md when possible, but the dismiss handler itself only hides the guide and re-renders. That leaves the native button behavior indirect and fragile if initial selection changes.

## Goals / Non-Goals

**Goals:**
- Explicitly select and load `wiki/home.md` when dismissing the Electron post-create guide and the file is present.
- Avoid adding history entries for this automatic native dismiss action.
- Preserve the existing fallback that simply hides the guide if home.md is unavailable.

**Non-Goals:**
- Change scaffold creation, project opening defaults, or tree expansion behavior.
- Change guide visual styling, copy, command rows, seed rows, or button label.
- Add filesystem access to the renderer.

## Decisions

- Find `wiki/home.md` from the renderer's existing tree data rather than computing an absolute path or reading the filesystem.
  - Rationale: Renderer already receives the main-owned project tree and uses tree nodes for safe file selection. This keeps Node/filesystem access out of the renderer.
  - Alternative considered: construct `${projectRoot}/wiki/home.md` in the renderer. That is more brittle across path separators and bypasses existing tree selection semantics.
- Reuse `selectFile(homeNode, { pushHistory: false })`.
  - Rationale: It already reads the file through IPC, compiles markdown preview, updates active-file state, refreshes document info, and hides the guide. Suppressing history matches the native "start reading" transition rather than a user navigation jump.
  - Alternative considered: mutate `state.selectedFile` directly. That would duplicate file read/compile/active-file behavior and be easier to get wrong.

## Risks / Trade-offs

- If the `wiki` folder is not loaded in the tree, Electron will fall back to hiding the guide -> mitigated by the existing initial tree auto-expansion, which loads default folders after opening a project.
- Re-selecting home.md when it is already selected may do extra IPC work -> acceptable because this path runs once per post-create guide dismissal and makes behavior explicit.
