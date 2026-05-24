## Context

The native macOS app embeds SwiftTerm through `LocalProcessTerminalView`. That gives Wikiwise a real local process terminal: the shell runs under a pseudo-terminal, ANSI output is interpreted by the terminal view, keyboard input is delivered directly, the view responds to size changes, and terminal colors are remapped to Wikiwise's warm palette.

Electron currently starts a shell with `child_process.spawn`, appends stdout/stderr into a `<pre>`, and sends commands from a separate text input. This is useful for smoke testing but it is not equivalent to SwiftTerm: interactive programs cannot take over the screen, ANSI cursor movement is not rendered, raw key sequences are not delivered naturally, and resize information is not applied to the shell.

## Goals / Non-Goals

**Goals:**

- Run the Electron project terminal through a PTY session rooted at the opened project.
- Render the terminal with an xterm-compatible terminal emulator, including ANSI colors, cursor movement, selection, and direct keyboard input.
- Preserve the existing main/preload security boundary by exposing terminal lifecycle, data, input, and resize over IPC.
- Match the native terminal visual palette closely enough for runtime audit evidence in light and dark modes.
- Update tests, specs, runtime audit, and verification evidence so PTY parity is no longer deferred.

**Non-Goals:**

- Do not replace the native SwiftTerm implementation.
- Do not solve signed/notarized release execution in this change.
- Do not add remote terminal, multiplexing, tabs, or persistent scrollback beyond what the native app currently exposes.

## Decisions

1. **Use `node-pty` for the terminal backend.** It is the standard Node/Electron PTY binding and maps directly to the SwiftTerm `LocalProcessTerminalView` behavior we need. The rejected alternative is continuing with `child_process.spawn`; it cannot provide PTY semantics or correct full-screen terminal behavior.

2. **Use `@xterm/xterm` in the renderer.** xterm.js is the established browser terminal emulator, so it handles ANSI parsing, cursor state, selection, alternate screen behavior, and direct keyboard input without duplicating terminal logic in Wikiwise. The rejected alternative is hand-rendering ANSI in the existing `<pre>`.

3. **Use preload IPC as the only bridge.** The renderer will not receive filesystem or process primitives. It will receive terminal data events, send raw input strings, and send `cols`/`rows` resize messages through the existing `window.wikiwise` bridge.

4. **Fit and resize from renderer to PTY.** The renderer owns terminal dimensions because it knows the panel size. It will load the xterm fit addon, calculate rows/columns, and call `wikiwise.resizeTerminal({ cols, rows })`. Main will apply those dimensions to the PTY session.

5. **Keep runtime audit deterministic.** In audit mode, the main process can still use mocked IPC handlers, but the DOM evidence must prove the renderer creates an xterm surface and sends terminal resize/input contracts. A real runtime PTY smoke path should be covered by tests and, where possible, non-interactive command evidence.

## Risks / Trade-offs

- **Native module packaging risk** -> `node-pty` may require Electron-compatible native builds. Mitigation: include package/README/release notes and tests that check the dependency and packaging scripts include native module handling.
- **Renderer lifecycle races** -> xterm may initialize before a project or before the terminal panel has dimensions. Mitigation: lazily create the terminal surface, fit after render, and no-op resize until a project terminal is active.
- **Appearance mismatch** -> xterm defaults differ from SwiftTerm colors. Mitigation: encode the warm light/dark palette in renderer theme setup and update it when appearance changes.
- **Runtime audit environment risk** -> hidden BrowserWindow dimensions can produce unstable terminal fit values. Mitigation: assert presence of xterm DOM/classes and IPC contracts, and keep resize validation structural unless the audit window can measure stable cells.

## Migration Plan

1. Add tests for PTY dependencies, main lifecycle, preload resize API, renderer xterm surface, no separate command input, and runtime audit xterm evidence.
2. Install and wire terminal dependencies.
3. Replace main `spawn` terminal sessions with PTY sessions and add resize handling.
4. Replace renderer `<pre>`/input terminal UI with an xterm container and direct input bridge.
5. Update runtime audit, OpenSpec specs, README/package notes if needed, and retained verification.
6. Validate with Electron tests, runtime audit, `npm test`, OpenSpec validation, `swift build`, and diff hygiene before archive.
