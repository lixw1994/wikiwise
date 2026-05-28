## MODIFIED Requirements

### Requirement: Terminal Spawn Helper Permissions
The Electron right-sidebar terminal SHALL verify that every discovered macOS `node-pty` spawn helper is executable before starting a PTY session.

#### Scenario: Spawn helper lacks executable permission
- **WHEN** the Electron main process starts a project-root terminal on macOS and one or more discovered `node-pty` spawn helpers exist without executable permission
- **THEN** the main process makes each discovered helper executable before invoking `pty.spawn`
- **AND** terminal shell selection, login-shell arguments, project-root working directory, terminal output forwarding, input handling, resizing, and session reuse behavior remain unchanged

#### Scenario: Spawn helper permission cannot be corrected
- **WHEN** the Electron main process cannot make a discovered `node-pty` spawn helper executable
- **THEN** terminal startup fails with an actionable error that identifies the spawn-helper permission problem
- **AND** no terminal session is registered for the window
