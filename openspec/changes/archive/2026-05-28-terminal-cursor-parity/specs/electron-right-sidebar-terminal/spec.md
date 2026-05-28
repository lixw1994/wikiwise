## ADDED Requirements

### Requirement: Terminal Cursor Visibility Parity
The Electron terminal tab SHALL render a visible native-like block cursor in the xterm surface.

#### Scenario: Terminal cursor is visible while terminal is active
- **WHEN** a folder project is open and the TERMINAL tab is visible
- **THEN** the xterm terminal uses a block cursor shape matching the native SwiftTerm terminal
- **AND** the cursor remains visible when the terminal surface is not focused
- **AND** terminal palette, PTY startup, input/output, resize, standalone-file boundaries, and one-session-per-window reuse behavior remain unchanged

#### Scenario: Terminal cursor uses native palette
- **WHEN** the terminal tab is rendered in light or dark appearance
- **THEN** the cursor uses the existing native warm cursor color for that appearance
- **AND** background, foreground, ANSI palette, and terminal content rendering remain unchanged
