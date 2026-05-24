## MODIFIED Requirements

### Requirement: Terminal Tab

The Electron right sidebar SHALL provide a PTY-backed interactive shell surface rooted at the opened project.

#### Scenario: Project terminal starts

- **WHEN** a project is opened or created
- **THEN** the renderer asks preload to start a terminal for the project root
- **AND** the main process starts a PTY session in that project root
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

### Requirement: Deferred Terminal Gaps

The right sidebar/terminal phase SHALL no longer list PTY-grade terminal emulation, ANSI rendering, resizing, or SwiftTerm parity as deferred after Electron adopts a PTY-backed terminal emulator.

#### Scenario: PTY terminal is available

- **WHEN** Electron can start a project-root terminal and exchange input/output
- **THEN** the phase verification records that PTY-grade terminal emulation, ANSI rendering, resizing, and SwiftTerm parity are implemented
- **AND** any remaining terminal deviations are explicitly tracked as accepted follow-up gaps
