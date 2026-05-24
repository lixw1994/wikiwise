## ADDED Requirements

### Requirement: New Wiki Scaffold IPC

The Electron workspace SHALL expose new-wiki creation through the main process and preload bridge instead of direct renderer filesystem access.

#### Scenario: Renderer chooses a scaffold location

- **WHEN** the renderer asks to choose a wiki parent directory
- **THEN** preload sends an IPC request to the main process
- **AND** the main process shows an operating-system directory picker that can create directories
- **AND** the renderer receives the selected directory path or cancellation result

#### Scenario: Renderer creates a wiki

- **WHEN** the renderer submits a wiki name and parent location
- **THEN** preload sends an IPC request to the main process
- **AND** the main process creates the scaffold and returns a serializable project result
- **AND** the renderer does not access Node filesystem APIs directly
