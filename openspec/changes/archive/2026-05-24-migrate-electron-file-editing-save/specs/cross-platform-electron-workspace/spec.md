## ADDED Requirements

### Requirement: Save IPC

The Electron workspace SHALL expose file save operations through the main process and preload bridge instead of direct renderer filesystem access.

#### Scenario: Renderer saves a file

- **WHEN** the renderer asks to save a selected file
- **THEN** preload sends an IPC request to the main process
- **AND** the main process writes the file through `@wikiwise/core`
- **AND** the renderer receives a serializable save result

### Requirement: Save Path Safety

The Electron main process SHALL reject renderer save requests that target files outside the current project root.

#### Scenario: Renderer attempts an unsafe save

- **WHEN** a save request contains a file path outside the project root
- **THEN** the main process rejects the request
- **AND** no file content is written
