## Context

The native app starts the built-in terminal through SwiftTerm's `LocalProcessTerminalView.startProcess`. It resolves `$SHELL` with `/bin/zsh` fallback, uses the opened project as the current directory, and passes `execName: "-<shell-name>"`. That leading dash is the conventional login-shell signal, so user shell startup behaves like Terminal.app.

Electron already matches the project-root PTY, terminal emulator, resize, palette, and environment surfaces, but it calls `pty.spawn(shellPath, [], ...)`, which starts a non-login shell.

## Goals / Non-Goals

**Goals:**

- Start Electron PTY shells with native login-shell semantics on macOS/non-Windows platforms.
- Preserve existing shell lookup, working directory, environment, terminal dimensions, output routing, cleanup, and xterm rendering.
- Add regression coverage that ties the Electron behavior to the SwiftTerm `execName` source.

**Non-Goals:**

- Changing terminal UI styling, ANSI palette, or xterm dependencies.
- Changing Windows shell startup behavior.
- Claiming final migration completion; signed/notarized release evidence remains required.

## Decisions

- Add a small main-process helper that returns `["-l"]` for non-Windows shells and `[]` for Windows. Passing `-l` is the portable login-shell form supported by the macOS shells Wikiwise targets, and it avoids needing node-pty-specific argv0 support.
- Keep the existing `$SHELL || ComSpec || /bin/zsh` resolution and PTY environment. The only startup difference is login-shell initialization.
- Cover the behavior with source-level tests in the terminal suite, because the relevant native evidence is source configuration and the PTY process itself is not deterministic in unit tests.

## Risks / Trade-offs

- Some unusual shell could reject `-l` -> Mitigation: Wikiwise is a macOS app and the native app already requests login-shell semantics for the resolved shell; the Electron path follows that native contract.
- Source tests can miss runtime shell startup failures -> Mitigation: retain the fresh runtime audit plus package/build checks as phase evidence.
