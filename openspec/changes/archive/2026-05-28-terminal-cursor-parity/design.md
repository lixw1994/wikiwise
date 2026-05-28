## Context

Native Wikiwise uses SwiftTerm's `LocalProcessTerminalView`, which displays a visible terminal cursor as part of the embedded terminal surface. Electron uses xterm with `cursorBlink: true` and matching warm cursor colors, but it does not pin the inactive cursor shape. xterm's default inactive style is `outline`, so the cursor can become visually faint when the terminal tab is visible but not focused.

## Goals / Non-Goals

**Goals:**
- Match native terminal cursor visibility with a block cursor in focused and inactive xterm states.
- Keep the current xterm warm palette and blink behavior.
- Retain PTY startup, terminal input/output, resize behavior, standalone-file boundaries, and session reuse.
- Extend runtime audit evidence so opened-project terminal screenshots/reports can prove cursor parity.

**Non-Goals:**
- Change native SwiftTerm code.
- Replace xterm or node-pty.
- Change shell startup, working directory, terminal sizing, or release signing behavior.

## Decisions

- Configure xterm with explicit `cursorStyle: "block"` and `cursorInactiveStyle: "block"`. The active style preserves native block cursor shape, and the inactive style keeps the cursor visible in screenshots and normal app focus states where focus may sit in the editor or shell chrome.
- Keep `cursorBlink: true`. Native terminal cursors are animated in normal use; retaining the existing blink option avoids changing the active terminal feel.
- Record cursor evidence through the runtime audit by checking the xterm surface plus configured focused/inactive cursor styles in project scenarios. xterm may render the cursor on canvas rather than as a DOM cursor element, so the audit records DOM cursor evidence when present but treats the configured block cursor contract as the stable signal.

## Risks / Trade-offs

- Blink timing can make screenshot-only checks flaky -> use DOM/class evidence in the audit report and rely on screenshots as supporting evidence.
- xterm can draw the cursor differently across renderers -> assert the configured xterm options and retain any cursor DOM class as supporting evidence instead of requiring pixel-perfect cursor geometry.
- Terminal focus behavior can vary while the audit drives the app -> make inactive cursor style block so the cursor remains visible even when the terminal is not focused.
