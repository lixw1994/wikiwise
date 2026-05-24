## ADDED Requirements

### Requirement: Compiler IPC

The Electron workspace SHALL expose compiler operations through the main process and preload bridge instead of direct renderer filesystem access.

#### Scenario: Renderer requests a page compile

- **WHEN** the renderer asks to compile a selected markdown file
- **THEN** preload sends an IPC request to the main process
- **AND** the main process uses `@wikiwise/core` compiler APIs
- **AND** the renderer receives a serializable compiled page result

### Requirement: Preview File URL Safety

The Electron workspace SHALL load compiled preview HTML from file URLs produced by the main process.

#### Scenario: Compiled preview is displayed

- **WHEN** a compiled page result includes an output path
- **THEN** the renderer uses a file URL created by the main process
- **AND** the renderer does not construct arbitrary filesystem URLs itself
