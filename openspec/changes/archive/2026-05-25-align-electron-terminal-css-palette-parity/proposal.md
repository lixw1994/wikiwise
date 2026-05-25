## Why

Electron already maps xterm's runtime theme to the native SwiftTerm warm palette, but the surrounding terminal panel and terminal surface CSS still use hard-coded dark greenish fallback colors. During xterm startup and in transparent viewport regions, those CSS colors diverge from the native macOS terminal background and foreground.

## What Changes

- Add terminal-specific light/dark CSS palette tokens matching native SwiftTerm background and foreground colors.
- Use those tokens for the terminal panel and terminal surface CSS fallback colors.
- Preserve the existing xterm runtime theme, PTY behavior, terminal inset, resizing, and Info tab behavior.
- Add source parity coverage for the terminal CSS palette.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `electron-right-sidebar-terminal`: Require terminal panel and surface CSS colors to match the native SwiftTerm light/dark background and foreground palette.

## Impact

- Affects Electron renderer CSS terminal color tokens and terminal panel/surface styling.
- Adds right sidebar terminal visual parity regression coverage.
- Updates the `electron-right-sidebar-terminal` OpenSpec capability.
