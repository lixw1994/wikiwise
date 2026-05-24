## ADDED Requirements

### Requirement: Settings IPC

The Electron workspace SHALL expose app settings through the main process and preload bridge.

#### Scenario: Renderer reads settings

- **WHEN** the renderer asks for app settings
- **THEN** preload sends an IPC request to the main process
- **AND** the main process returns serializable settings

#### Scenario: Renderer updates appearance

- **WHEN** the renderer asks to set appearance mode
- **THEN** preload sends an IPC request to the main process
- **AND** the main process persists the mode and applies Electron native theme source

### Requirement: Restore Last Project IPC

The Electron workspace SHALL expose startup project restoration through the main process and preload bridge.

#### Scenario: Renderer restores startup project

- **WHEN** the renderer asks to restore the last project
- **THEN** preload sends an IPC request to the main process
- **AND** the main process returns a serializable project result or null

### Requirement: Generated Page IPC

The Electron workspace SHALL expose generated page navigation through the main process and preload bridge.

#### Scenario: Renderer opens generated map

- **WHEN** the renderer asks to open a generated page for the current project
- **THEN** preload sends an IPC request to the main process
- **AND** the main process validates the generated page name
- **AND** the renderer receives a serializable generated page result

### Requirement: App Command Events

The Electron workspace SHALL deliver main-process app commands to the renderer through preload events.

#### Scenario: Main process sends app command

- **WHEN** an Electron app menu command is invoked
- **THEN** preload forwards a `wikiwise:appCommand` event to the renderer
- **AND** the renderer can unsubscribe the event listener
