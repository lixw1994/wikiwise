## Context

Electron terminal parity depends on the real main-process `node-pty` lifecycle, preload input bridge, and xterm renderer. The current runtime audit loads the real renderer but replaces terminal IPC with synthetic handlers, so it can prove xterm rendering but not the real PTY startup/input path that native SwiftTerm parity requires.

## Goals / Non-Goals

**Goals:**

- Let opened-project runtime audit scenarios use the real `wikiwise:startTerminal` and `wikiwise:sendTerminalInput` handlers registered by `apps/electron/src/main/main.js`.
- Send a command through xterm and fail the audit unless the command output appears in the terminal buffer.
- Preserve existing audit isolation for publishing, file watching, scaffold, and other side-effect-prone flows.

**Non-Goals:**

- Change terminal UI styling or shell behavior.
- Contact publishing services or run release signing/notarization.
- Replace the existing screenshot/DOM runtime audit structure.

## Decisions

- Keep the existing `electron:audit:runtime` command and enhance its project terminal assertions.
  - Rationale: release readiness already relies on this command, so terminal proof belongs in the same retained evidence artifact.
  - Alternative considered: add a separate terminal smoke command. That would help local debugging but could be skipped by the canonical audit path.

- Stop stubbing only terminal startup/input IPC.
  - Rationale: the main process has already registered the real handlers before audit IPC overrides run. Leaving those handlers in place exercises the production PTY code while keeping unrelated audit stubs.
  - Alternative considered: remove all audit IPC stubs. That would create network/file side effects unrelated to terminal parity.

- Use terminal buffer output as the proof of input.
  - Rationale: an echoed command demonstrates xterm input, preload IPC, real `sendTerminalInput`, PTY write, shell execution, PTY output, and renderer output handling.
  - Alternative considered: assert only process existence. That would miss broken keyboard/input paths.

## Risks / Trade-offs

- Real shell startup can be slower than a stub -> wait for the command echo condition instead of using a fixed short delay.
- Shell prompt text varies by user -> assert the audit command output, not a prompt string.
- Real terminal sessions could linger if audit windows close unexpectedly -> rely on existing `webContents.once("destroyed", ...)` terminal cleanup and keep audit shutdown graceful.
