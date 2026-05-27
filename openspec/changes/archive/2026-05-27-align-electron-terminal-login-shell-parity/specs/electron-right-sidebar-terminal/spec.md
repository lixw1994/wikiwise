## MODIFIED Requirements

### Requirement: Terminal Tab

The Electron right sidebar SHALL provide a PTY-backed interactive login-shell surface rooted at the opened project.

#### Scenario: Project terminal starts

- **WHEN** a project is opened or created
- **THEN** the renderer asks preload to start a terminal for the project root
- **AND** the main process starts a PTY session in that project root
- **AND** the PTY starts the user's resolved shell with native login-shell semantics matching SwiftTerm's leading-dash `execName`
- **AND** the terminal tab renders shell output through a terminal emulator surface
- **AND** keyboard input entered in the terminal emulator is sent to the PTY session

#### Scenario: Terminal is resized

- **WHEN** the right sidebar terminal surface changes size
- **THEN** the renderer calculates terminal columns and rows
- **AND** sends the dimensions through preload to the main process
- **AND** the main process resizes the PTY session

#### Scenario: Terminal renders ANSI behavior

- **WHEN** the PTY emits ANSI output, cursor movement, colors, or alternate-screen sequences
- **THEN** the renderer terminal emulator interprets those sequences instead of displaying raw escape text
- **AND** the terminal visual palette matches the native warm light/dark terminal palette

## ADDED Requirements

### Requirement: Terminal Login Shell Parity
The Electron project terminal SHALL mirror the native SwiftTerm login-shell startup contract.

#### Scenario: Project terminal shell is spawned
- **WHEN** Electron starts the project terminal on macOS/non-Windows platforms
- **THEN** it launches the resolved user shell as a login shell
- **AND** it keeps the opened project root as the PTY working directory
- **AND** terminal dimensions, environment, output routing, cleanup, and resize behavior remain unchanged
