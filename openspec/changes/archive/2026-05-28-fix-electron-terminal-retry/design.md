## Context

The Electron renderer creates an xterm instance before asking the main process to start the PTY. If `wikiwise:startTerminal` fails, the xterm instance remains mounted while `terminalSessionProjectRoot` is restored to the previous value. Later keyboard input still flows through the xterm `onData` handler, which calls `wikiwise:sendTerminalInput` even though no main-process session exists.

The current runtime audit proves the development app can spawn `node-pty`, and a direct packaged `node-pty` probe proves the packaged helper can spawn `/bin/zsh` on this machine. The remaining defect is the half-started renderer state and the lack of packaged audit coverage for actual PTY spawn.

## Goals / Non-Goals

**Goals:**
- Make the terminal tab retry startup when a folder project is active but no terminal session is registered.
- Prevent user input from being routed to `sendTerminalInput` before a PTY session exists.
- Extend packaged runtime smoke evidence from file-permission checks to a real PTY echo check.

**Non-Goals:**
- Change native SwiftTerm behavior.
- Change the one-terminal-session-per-window reuse contract.
- Add a new terminal UI or replace xterm/node-pty.

## Decisions

- Track renderer terminal startup as an in-flight promise. This prevents repeated renders from starting duplicate IPC calls while still allowing retry after a failure.
- Gate xterm input on `terminalSessionProjectRoot`. If no session exists, start the terminal and send the buffered input only after startup succeeds.
- Keep the main process session reuse behavior unchanged. Recovery is a renderer concern unless `pty.spawn` itself throws.
- Add packaged terminal smoke evidence inside the existing packaged audit mode. This keeps release validation in one command while proving the actual packaged `node-pty` spawn path can echo a command.

## Risks / Trade-offs

- Repeated tab renders could restart terminal startup too aggressively -> mitigate with a single in-flight startup promise.
- Sending buffered input after a retry could duplicate a keystroke if the first send partially succeeded -> only retry when the renderer has no session root, which means no `sendTerminalInput` call has been made for that input.
- Packaged audit PTY startup can be sensitive to shell profile side effects -> use a simple echo marker and timeout, and record enough report evidence to diagnose failures.
