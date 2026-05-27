## MODIFIED Requirements

### Requirement: Standalone File Terminal Boundary
The Electron app SHALL not start a project-root terminal for standalone-file opens, and SHALL preserve an existing window terminal session when native SwiftUI would leave it untouched.

#### Scenario: Standalone file opens with no running terminal
- **WHEN** the renderer applies a standalone-file project result and no terminal session is running
- **THEN** it does not start a PTY terminal for the file's parent directory
- **AND** selected-document INFO metadata may still render for the standalone file

#### Scenario: Standalone file opens after terminal started
- **WHEN** the renderer applies a standalone-file project result after a folder project has already started the terminal
- **THEN** it preserves the existing PTY session
- **AND** it preserves the existing terminal output subscription and visible terminal buffer
- **AND** it does not reset the tracked terminal session root to the standalone file's parent directory
- **AND** selected-document INFO metadata may still render for the standalone file

#### Scenario: Folder project opens
- **WHEN** the renderer applies a folder project result
- **THEN** existing project-root terminal startup behavior is retained
