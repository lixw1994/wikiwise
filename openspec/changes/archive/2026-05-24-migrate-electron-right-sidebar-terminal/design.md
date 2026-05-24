## Context

Native Wikiwise wraps the main workspace with a right sidebar. The sidebar defaults to TERMINAL, includes INFO and TERMINAL tabs, can be hidden from toolbar chrome, and can be resized. INFO reads selected file metadata directly: path label, relative modified time, word count, optional `directions:` frontmatter, and wikilink targets. TERMINAL uses SwiftTerm's `LocalProcessTerminalView`, starts once per `ContentView`, and runs the user's shell with the opened wiki as the working directory.

Electron currently has project state, file tree, editable source, compiled preview, save, watcher, and scaffold creation. It lacks the right sidebar and has no terminal bridge.

## Goals / Non-Goals

**Goals:**

- Add document info parsing to `@wikiwise/core` so INFO behavior is testable without Electron.
- Keep document filesystem reads and shell process ownership in main process.
- Add preload APIs and output subscription cleanup for document info and terminal operations.
- Add a renderer right sidebar with INFO and TERMINAL tabs, defaulting to TERMINAL.
- Start a shell when a project opens/changes, rooted at the current project, and allow command input/output.

**Non-Goals:**

- No PTY emulator, xterm.js, ANSI rendering, or terminal resize parity in this phase.
- No right-sidebar drag resize in this phase.
- No app toolbar chrome toggle migration in this phase.
- No publishing or menus.

## Decisions

- `@wikiwise/core` will expose `summarizeDocumentInfo(filePath)`. It returns plain JSON-safe metadata: `path`, `name`, `modifiedAt`, `wordCount`, `directions`, and `wikilinks`.
- Electron main will add safe project path validation for document info and terminal start. Terminal sessions will be keyed by `webContents.id`, matching watcher lifecycle shape.
- Terminal implementation will use Node's built-in `child_process.spawn` with the user's shell and project root cwd. This avoids new native dependencies while still providing a real shell process and useful agent command entry point.
- Renderer terminal UI will be a lightweight transcript plus line input. It is deliberately not presented as full terminal emulator parity; retained verification will record the PTY gap.
- Existing project open/create flow will call `startProjectServices`, which starts watcher and terminal services for the current project.

## Risks / Trade-offs

- `spawn` without PTY does not behave like SwiftTerm for full-screen programs, ANSI control codes, or interactive prompts. This is acceptable only as an incremental phase because the residual risk is retained.
- Shell processes must be cleaned up when projects change or windows close to avoid orphaned processes.
- INFO metadata can become stale after external file changes. This phase refreshes on file selection and watcher events affecting the selected file; broader reactive polish remains later.

## State Model

- **right-sidebar-visible:** project is open and sidebar is rendered.
- **info-tab:** active right tab is INFO; selected document info is displayed.
- **terminal-tab:** active right tab is TERMINAL; transcript and command input are displayed.
- **terminal-starting:** renderer has requested terminal startup for the current project.
- **terminal-running:** main process owns a shell and sends output events.
- **terminal-stopped:** no terminal is active for the renderer.

## Migration Plan

1. Write failing core tests for document info parsing.
2. Implement `summarizeDocumentInfo` in `@wikiwise/core`.
3. Write failing Electron structural tests for document info IPC, terminal IPC, preload APIs, right sidebar UI, and renderer wiring.
4. Implement main-process document info and terminal lifecycle IPC.
5. Implement preload APIs and output event cleanup.
6. Implement renderer right sidebar, info refresh, terminal startup/input/output, and project-service startup.
7. Verify tests, OpenSpec, Swift source untouched, and retained evidence.

## Open Questions

- A later phase should choose the terminal emulator path: xterm.js plus node-pty, or another packaged PTY bridge.
- A later app chrome phase should migrate hide/show and resize behavior for the right sidebar.
