## Context

Native Wikiwise embeds SwiftTerm directly and starts the user's shell without writing app-owned text into the terminal buffer. Electron starts a PTY through node-pty and currently clears the xterm surface, writes `Starting shell...`, then appends shell output. That line is not native behavior and makes the first opened-project terminal screenshot diverge immediately.

The prompt itself is emitted by the user's shell using ANSI SGR sequences such as bright green and cyan. Electron has a warm xterm palette matching the native terminal feel, but xterm 6 can render ANSI color through DOM styles. If xterm CSS loads after the terminal opens, or the renderer CSP blocks xterm's style-only color rendering, the buffer can contain correct ANSI cells while the visible prompt is flattened to fallback foreground text. The runtime audit also only proved generic terminal output and the prior cursor configuration, so it did not specifically guard against prompt colors being flattened or cursor evidence disappearing from the first prompt.

## Goals / Non-Goals

**Goals:**
- Remove the Electron-only startup line from visible terminal output and audit text.
- Keep PTY shell output as the only source of terminal buffer content after startup.
- Add regression coverage that prompt ANSI color sequences are routed through xterm's warm green/cyan palette.
- Add runtime audit evidence for prompt color markers, xterm prompt cell colors, and visible cursor rendering in opened-project scenarios.

**Non-Goals:**
- Change native SwiftTerm code.
- Replace xterm or node-pty.
- Change login-shell args, cwd selection, terminal session reuse, resizing, or input forwarding.
- Pixel-match every anti-aliasing detail of terminal text rendering.

## Decisions

- Remove the renderer-side `terminalInstance.writeln("Starting shell...")` startup write. The terminal should clear on a newly-started session, then display whatever the PTY emits, matching SwiftTerm's ownership of the buffer.
- Keep `window.__wikiwiseTerminalText` as a capture of actual PTY output only. This prevents audit evidence from passing because of app-owned placeholder text.
- Treat ANSI prompt evidence as a contract between shell output, xterm buffer cells, and xterm theme: the runtime report should record whether prompt color SGR codes are observed, whether prompt cells carry green/cyan palette foregrounds, and whether the configured theme contains native-like bright green and cyan values.
- Wait for the xterm stylesheet before opening the terminal surface, retain critical local fallback styles for xterm accessibility layers, and allow inline style rendering only for `style-src` while keeping inline scripts disallowed. This prevents xterm's DOM color renderer from being covered by unstyled accessibility text or blocked by CSP.
- Keep a block cursor for focused terminal input, but use xterm's outline inactive cursor so screenshots taken while focus sits elsewhere match the native SwiftTerm capture more closely. Add a rendered cursor overlay aligned to the active xterm buffer position: it blinks only while the terminal surface has focus and remains continuously visible when focus sits elsewhere. Report that overlay alongside xterm cursor options.

## Risks / Trade-offs

- Shell startup output varies by user environment -> runtime assertions should look for audit command/prompt ANSI evidence rather than exact prompt text.
- Cursor blink timing can make screenshots flaky -> retain focused overlay animation and configuration/DOM evidence, and use screenshots as supporting artifacts.
- xterm DOM color rendering can be blocked by CSS load order or CSP -> wait for xterm CSS, allow style-only inline rendering, and assert xterm prompt cell color evidence.
- Removing `Starting shell...` reduces immediate placeholder feedback while the PTY initializes -> native behavior favors an empty terminal surface until shell output arrives, so parity wins here.
