## ADDED Requirements

### Requirement: Terminal CSS Palette Parity
The Electron terminal panel and surface CSS SHALL use native SwiftTerm background and foreground colors for light and dark appearances.

#### Scenario: Terminal CSS fallback uses native palette
- **WHEN** the Electron terminal tab is rendered before or around xterm initialization
- **THEN** the terminal panel and terminal surface backgrounds use the native terminal background color for the active appearance
- **AND** the terminal surface foreground fallback uses the native terminal foreground color for the active appearance
- **AND** the light colors are `#F3EDDE` background and `#5B5240` foreground
- **AND** the dark colors are `#0E0C08` background and `#CFC3A3` foreground
- **AND** xterm runtime theme, PTY startup, terminal input/output, terminal resizing, terminal inset, ANSI rendering, Info tab behavior, tab switching, and sidebar resizing behavior are not changed for this requirement
