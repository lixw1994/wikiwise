## ADDED Requirements

### Requirement: Standalone File Watcher Boundary
The Electron app SHALL not start project file watching for standalone-file opens.

#### Scenario: Standalone file opens
- **WHEN** the renderer applies a standalone-file project result
- **THEN** it does not start the project watcher
- **AND** any previous project watcher subscription is stopped or cleaned up

#### Scenario: Folder project opens
- **WHEN** the renderer applies a folder project result
- **THEN** existing project watcher startup behavior is retained
