## ADDED Requirements

### Requirement: Standalone File Terminal Boundary
The Electron app SHALL not start a project-root terminal for standalone-file opens.

#### Scenario: Standalone file opens
- **WHEN** the renderer applies a standalone-file project result
- **THEN** it does not start a PTY terminal for the file's parent directory
- **AND** any previous terminal output subscription is stopped or cleaned up
- **AND** selected-document INFO metadata may still render for the standalone file

#### Scenario: Folder project opens
- **WHEN** the renderer applies a folder project result
- **THEN** existing project-root terminal startup behavior is retained
