## Context

Swift `ContentView.openURL(_:)` has two branches. Directory opens initialize the tree, compiler, background compilation, terminal, publish config, and watcher. File opens set `rootURL` to the parent directory, clear the tree, select the file, and call `loadFile(_:)` without initializing a compiler or project services. Electron's `createProjectResult(targetPath)` already distinguishes directories for home compilation and background compilation, but it always scans the parent directory into `tree`. The renderer then treats the result like a full project and starts watcher, terminal, publish config, and generated-page affordances.

## Goals / Non-Goals

**Goals:**

- Return explicit Electron project-kind evidence for folder vs standalone-file opens.
- For file opens, return an empty tree and selected file content with no compiled page.
- In the renderer, treat standalone-file state as an opened shell with selected file content, but without watcher, terminal, publish config, or generated-map service calls.
- Add runtime audit evidence that a standalone-file open has an empty file tree and stopped project services.

**Non-Goals:**

- Do not change opened-folder behavior, created-wiki behavior, or restored-folder startup.
- Do not remove the right sidebar or INFO metadata for standalone files; native still renders the project shell once `rootURL` is set.
- Do not change the OS picker labels or file filters in this slice.
- Do not introduce standalone-file persistence in app settings; native restore remains folder-based.

## Decisions

- Add `projectKind: "folder" | "file"` to project results.
  Existing callers can continue reading `projectRoot`, `projectName`, `tree`, and `selectedFile`, while renderer code gets an explicit branch.
- Keep `projectRoot` as the file's parent directory for standalone files.
  This preserves path validation for save/document-info IPC and mirrors native `rootURL = url.deletingLastPathComponent()`.
- Gate service startup with an `isProjectFolder()` helper.
  Folder-like results start watcher, terminal, publish config, and generated-map flows; file results stop or clear those services.
- Add a runtime audit `standalone-file` scenario that restores a synthetic standalone markdown file through the same renderer startup path.
  The audit should fail if the file tree is non-empty, watcher/terminal services start, publish is enabled, or generated-map IPC is used.

## Risks / Trade-offs

- [Risk] Disabling project services for standalone files could affect document metadata refresh. -> Mitigation: continue calling document-info refresh for selected files, because native INFO can still describe the selected document.
- [Risk] Older project results in tests may not include `projectKind`. -> Mitigation: treat missing `projectKind` as folder behavior for compatibility.
- [Risk] Runtime audit scenario count increases. -> Mitigation: add one light-mode standalone scenario only; folder/new-wiki visual coverage remains unchanged.
