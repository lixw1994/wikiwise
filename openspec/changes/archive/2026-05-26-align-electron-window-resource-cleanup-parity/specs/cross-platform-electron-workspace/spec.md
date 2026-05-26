## ADDED Requirements

### Requirement: Destroyed WebContents Resource Cleanup
The Electron workspace SHALL release window-scoped main-process resources when the owning renderer contents are destroyed.

#### Scenario: Renderer contents are destroyed
- **WHEN** a renderer webContents is destroyed after starting project services
- **THEN** the main process closes the filesystem watcher owned by that webContents
- **AND** the main process stops the PTY terminal session owned by that webContents
- **AND** cleanup does not depend on renderer `beforeunload` handlers completing first

#### Scenario: Window destruction also clears restore scope
- **WHEN** a main window webContents is destroyed
- **THEN** Electron removes startup restore eligibility for that webContents
- **AND** stale webContents IDs do not retain project-service ownership

