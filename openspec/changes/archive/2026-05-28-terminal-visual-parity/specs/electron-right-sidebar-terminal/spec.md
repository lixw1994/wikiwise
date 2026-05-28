## MODIFIED Requirements

### Requirement: Terminal Tab

The Electron right sidebar SHALL provide a PTY-backed interactive login-shell surface rooted at the opened project.

#### Scenario: Project terminal starts

- **WHEN** a project is opened or created
- **THEN** the renderer asks preload to start a terminal for the project root
- **AND** the main process starts a PTY session in that project root
- **AND** the PTY starts the user's resolved shell with native login-shell semantics matching SwiftTerm's leading-dash `execName`
- **AND** the terminal tab renders shell output through a terminal emulator surface
- **AND** the terminal buffer does not include Electron-only startup text such as `Starting shell...`
- **AND** keyboard input entered in the terminal emulator is sent to the PTY session

#### Scenario: Terminal is resized

- **WHEN** the right sidebar terminal surface changes size
- **THEN** the renderer calculates terminal columns and rows
- **AND** sends the dimensions through preload to the main process
- **AND** the main process resizes the PTY session

#### Scenario: Terminal renders ANSI behavior

- **WHEN** the PTY emits ANSI output, cursor movement, colors, or alternate-screen sequences
- **THEN** the renderer terminal emulator interprets those sequences instead of displaying raw escape text
- **AND** prompt ANSI colors render through the native warm light/dark terminal palette
- **AND** the xterm stylesheet is loaded before opening the terminal surface so accessibility text does not flatten colored prompt rendering
- **AND** the renderer content policy permits xterm's style-only ANSI color rendering while keeping inline script disallowed
- **AND** the terminal visual palette matches the native warm light/dark terminal palette

### Requirement: Terminal Cursor Visibility Parity

The Electron terminal tab SHALL render a visible native-like cursor in the xterm surface.

#### Scenario: Terminal cursor is visible while terminal is active

- **WHEN** a folder project is open and the TERMINAL tab is visible
- **THEN** the xterm terminal uses a block cursor shape while focused for text input
- **AND** the cursor remains visible with an outline shape when the terminal surface is not focused
- **AND** a rendered cursor layer remains aligned to the active xterm buffer cursor position
- **AND** the rendered cursor layer blinks while the terminal surface has focus
- **AND** the rendered cursor layer remains non-blinking and visible while the terminal surface is not focused
- **AND** terminal palette, PTY startup, input/output, resize, standalone-file boundaries, and one-session-per-window reuse behavior remain unchanged

#### Scenario: Terminal cursor uses native-like insertion color

- **WHEN** the terminal tab is rendered in light or dark appearance
- **THEN** Electron uses a visible pale insertion-cursor color instead of the prior warm accent cursor override
- **AND** background, foreground, ANSI palette, and terminal content rendering remain unchanged
