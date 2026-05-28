## ADDED Requirements

### Requirement: Terminal Startup Recovery
The Electron terminal tab SHALL recover from a failed or missing main-process PTY session without leaving the xterm surface in a permanently half-started state.

#### Scenario: Terminal tab retries after failed startup
- **WHEN** a folder project is open, the terminal tab is active, and the renderer has no tracked terminal session
- **THEN** the renderer attempts to start a project-root terminal instead of only mounting the xterm surface
- **AND** repeated renders do not create overlapping terminal-start requests

#### Scenario: Input arrives with no terminal session
- **WHEN** keyboard input is entered into the xterm surface while no terminal session is tracked
- **THEN** the renderer starts a project-root terminal before sending that input to the main process
- **AND** it does not call `wikiwise:sendTerminalInput` while no terminal session exists

#### Scenario: Running terminal remains reused
- **WHEN** the renderer already tracks a terminal session for the current window
- **THEN** terminal tab rendering and keyboard input continue to use the existing PTY session
- **AND** the one-session-per-window reuse behavior remains unchanged
