## ADDED Requirements

### Requirement: Terminal Start Once Per Window Parity

Electron terminal startup SHALL match native `TerminalSession.startIfNeeded(workingDirectory:)` by starting at most one PTY session per window across repeated folder opens.

#### Scenario: First folder open starts terminal
- **WHEN** a window opens a folder project and has no existing terminal session
- **THEN** Electron starts one PTY session rooted at that folder
- **AND** terminal output, input, and resize behavior remain available

#### Scenario: Later folder open reuses terminal
- **WHEN** the same window opens another folder project after the terminal has already started
- **THEN** Electron reuses the existing PTY session instead of closing and respawning it
- **AND** the terminal session keeps the working directory chosen for the first start
- **AND** terminal output from the reused session remains visible in the terminal tab

#### Scenario: Window close ends terminal
- **WHEN** the window owning a terminal session is destroyed
- **THEN** Electron closes the PTY session for that window
- **AND** no terminal process is leaked
