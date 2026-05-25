## Context

`Sources/Wikiwise/TerminalEmbed.swift` applies `nativeBackgroundColor` as light `#F3EDDE` and dark `#0E0C08`, and `nativeForegroundColor` as light `#5B5240` and dark `#CFC3A3`. Electron's `terminalTheme()` already returns these values for xterm, but CSS still sets `.terminal-panel { background: #161714; }` and `.terminal-surface { background: #10110f; color: #d7ead0; }`. Those hard-coded colors are visible before xterm finishes opening and anywhere xterm's viewport is transparent.

## Goals / Non-Goals

**Goals:**

- Add explicit terminal CSS palette tokens for native background and foreground colors.
- Use the tokens on terminal panel and terminal surface styling.
- Preserve the existing xterm runtime theme object and all PTY behavior.

**Non-Goals:**

- Changing the ANSI color map or cursor/selection colors in this slice.
- Changing terminal inset, resize behavior, or xterm lifecycle.
- Changing native SwiftUI source.

## Decisions

- Define `--color-terminal-bg` and `--color-terminal-fg` in `:root` and the dark appearance override so the CSS fallback can exactly match native SwiftTerm values.
- Set both `.terminal-panel` and `.terminal-surface` backgrounds to `var(--color-terminal-bg)` because SwiftTerm's terminal view owns the background color directly.
- Set `.terminal-surface` text color to `var(--color-terminal-fg)` for fallback consistency before xterm takes over rendering.
- Keep `terminalTheme()` untouched because it already mirrors the native SwiftTerm color values.

## Risks / Trade-offs

- The terminal panel will become light in Light appearance instead of remaining dark. This is intentional: the native SwiftTerm background is light in Aqua and dark in Dark Aqua.
- CSS fallback colors and xterm runtime theme now share the same values through separate mechanisms; tests cover both so drift is easier to catch.
