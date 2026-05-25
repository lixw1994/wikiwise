## Why

The native macOS terminal tab places `TerminalEmbed` with an 8pt leading inset and 4pt top inset. Electron currently puts the terminal panel at zero inset and adds a separate 10px xterm padding on every side, so the terminal content starts in a different position than the SwiftUI version.

## What Changes

- Align the Electron terminal tab outer inset to native: 4px top and 8px leading.
- Remove the extra xterm internal padding that shifts terminal content on all sides.
- Preserve PTY lifecycle, xterm rendering, terminal resizing, Info tab behavior, and right sidebar tab switching.
- Add source parity coverage for the native terminal tab inset.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `electron-right-sidebar-terminal`: Require the terminal tab surface to use the native top/leading inset and avoid extra all-sides terminal emulator padding.

## Impact

- Affects Electron renderer CSS for the terminal panel and xterm container.
- Adds right sidebar terminal visual parity regression coverage.
- Updates the `electron-right-sidebar-terminal` OpenSpec capability.
