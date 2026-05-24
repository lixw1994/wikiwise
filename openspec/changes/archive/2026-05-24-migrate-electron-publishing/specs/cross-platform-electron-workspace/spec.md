## ADDED Requirements

### Requirement: Publish Config IPC

The Electron workspace SHALL expose publish config loading through the main process and preload bridge.

#### Scenario: Renderer requests publish config

- **WHEN** the renderer asks for publish config for the current project
- **THEN** preload sends an IPC request to the main process
- **AND** the main process loads config through `@wikiwise/core`
- **AND** the renderer receives a serializable config summary

### Requirement: Publish Availability IPC

The Electron workspace SHALL expose subdomain availability checks through the main process and preload bridge.

#### Scenario: Renderer checks availability

- **WHEN** the renderer asks whether a subdomain is available
- **THEN** preload sends an IPC request to the main process
- **AND** the main process calls `@wikiwise/core`
- **AND** the renderer receives a serializable availability state

### Requirement: Publish IPC

The Electron workspace SHALL expose publishing through the main process and preload bridge.

#### Scenario: Renderer publishes project

- **WHEN** the renderer submits a publish request
- **THEN** preload sends an IPC request to the main process
- **AND** the main process recompiles the wiki before upload
- **AND** the main process publishes through `@wikiwise/core`
- **AND** the renderer receives a serializable publish result

### Requirement: Unpublish IPC

The Electron workspace SHALL expose unpublish through the main process and preload bridge.

#### Scenario: Renderer unpublishes project

- **WHEN** the renderer submits an unpublish request
- **THEN** preload sends an IPC request to the main process
- **AND** the main process unpublishes through `@wikiwise/core`
- **AND** the renderer receives a serializable success result
