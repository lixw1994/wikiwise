## Context

SwiftUI owns a single `TerminalSession` as a `@StateObject` in `ContentView`. Folder opens call `terminalSession.startIfNeeded(workingDirectory:)`, and that method immediately returns once `isStarted` is true. Electron currently treats terminal startup like a restartable project service: the main process closes any existing PTY before spawning, and the renderer clears the terminal surface on every folder service start.

## Goals / Non-Goals

**Goals:**
- Match native terminal lifecycle by keeping one window-scoped PTY session alive across later folder opens.
- Keep the first terminal working directory unchanged after the session starts.
- Preserve terminal resize, input, output, and window-destroyed cleanup behavior.
- Keep standalone-file terminal behavior outside this slice except for avoiding regressions.

**Non-Goals:**
- Add multi-terminal support or a UI for changing terminal working directories.
- Change watcher, compiler, publishing, or file-tree project switching behavior.
- Claim signed/notarized release completion.

## Decisions

- Reuse the main-process terminal session when `terminalSessionsByWebContents` already has one for the window. This mirrors native `guard !isStarted else { return }` and avoids changing the first shell's cwd on subsequent folder opens.
- Return an explicit `reused`/`started` result from `startTerminal`. The renderer can preserve the terminal buffer when the main process reports reuse while still showing the startup line for a genuinely new PTY.
- Track the active terminal session root separately from `state.currentProject.projectRoot` in the renderer. After a folder switch, output events still belong to the first terminal session, not the newly opened folder.
- Leave explicit `stopTerminal` IPC and window-scoped cleanup intact. Those are lifecycle boundaries outside native folder switching and protect against leaking PTY processes.

## Risks / Trade-offs

- Existing terminal cwd can differ from the currently opened folder after a project switch -> This is intentional native parity and is covered by source-backed tests.
- Renderer output filtering may accidentally hide reused-terminal output if it keys only on the current project -> Track the terminal session root returned by the main process.
- A new shell could emit output before the renderer writes its startup banner -> Keep startup handling minimal and verify existing terminal tests continue to pass.
