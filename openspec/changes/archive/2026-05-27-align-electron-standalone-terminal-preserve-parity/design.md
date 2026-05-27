## Context

Native `ContentView.openURL(_:)` handles folder and standalone-file opens in separate branches. The folder branch starts the terminal with `terminalSession.startIfNeeded(workingDirectory: url)`. The standalone-file branch only updates `rootURL`, clears the tree, selects the file, and calls `loadFile(url)`. It does not start, stop, or clear the SwiftTerm session.

Electron currently runs `startTerminal()` as part of project services for every project result. Its standalone-file branch calls `window.wikiwise.stopTerminal()`, clears the xterm surface, and drops the tracked terminal root, which turns a standalone file open into a terminal teardown boundary that native does not have.

## Goals / Non-Goals

**Goals:**
- Preserve any existing terminal process, buffer, output subscription, and tracked session root when a standalone file is opened.
- Avoid starting a new terminal for the standalone file's parent directory when no terminal exists.
- Keep watcher shutdown and publishing/generated-map boundaries for standalone files unchanged.

**Non-Goals:**
- Add a close-project flow or explicit terminal reset affordance.
- Change folder-open terminal start-once behavior.
- Change standalone-file editor, INFO metadata, publishing, watcher, or generated-page behavior beyond terminal lifecycle.

## Decisions

- Move terminal-output listener cleanup to the folder-start path instead of running it before every branch. This lets standalone-file opens preserve the active subscription while folder opens can still refresh the listener around `wikiwise.startTerminal`.
- Make the standalone-file branch return after rendering the terminal tab without invoking `stopTerminal`, clearing the xterm buffer, or resetting `terminalSessionProjectRoot`.
- Keep `stopTerminal` available through preload and IPC. Explicit stop and window-destroyed cleanup remain useful process boundaries even though standalone file opens no longer trigger them.

## Risks / Trade-offs

- A terminal can remain rooted at a previously opened folder while a standalone file is selected -> This is native parity and already follows the start-once terminal model.
- A standalone file opened before any folder will show a blank terminal surface rather than starting a shell -> This matches native because the standalone branch never calls `startIfNeeded`.
- Listener cleanup changes could duplicate listeners on folder reopen -> Folder starts still remove the previous listener before creating a new one, and targeted tests will pin this structure.
