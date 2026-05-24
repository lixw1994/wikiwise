## ADDED Requirements

### Requirement: Document Info IPC

The Electron workspace SHALL expose selected-document info through the main process and preload bridge instead of direct renderer filesystem access.

#### Scenario: Renderer requests selected file info

- **WHEN** the renderer asks for document info for a selected project file
- **THEN** preload sends an IPC request to the main process
- **AND** the main process validates the path against the project root
- **AND** the renderer receives serializable document metadata

### Requirement: Terminal IPC

The Electron workspace SHALL expose project terminal operations through the main process and preload bridge.

#### Scenario: Renderer starts a project terminal

- **WHEN** the renderer asks to start a terminal for a project root
- **THEN** preload sends an IPC request to the main process
- **AND** the main process owns the shell process
- **AND** the renderer receives serializable terminal output events from preload

#### Scenario: Renderer sends terminal input

- **WHEN** the renderer submits terminal input
- **THEN** preload sends an IPC request to the main process
- **AND** the main process writes the input to the owned shell process

### Requirement: Terminal Cleanup

The Electron workspace SHALL clean up terminal sessions when projects change or renderer contents are destroyed.

#### Scenario: Watched project changes

- **WHEN** a renderer starts a terminal for a different project root
- **THEN** the previous terminal process for that renderer is stopped before the new one is created
