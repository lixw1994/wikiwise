## ADDED Requirements

### Requirement: Project Lifecycle IPC

The Electron workspace SHALL expose project lifecycle operations through the main process and preload bridge instead of direct renderer Node access.

#### Scenario: Renderer requests a project picker

- **WHEN** the renderer invokes the open-existing API
- **THEN** the preload bridge sends the request through IPC
- **AND** the main process uses the operating system open dialog
- **AND** the renderer receives a serializable project result

### Requirement: Renderer State Shell

The Electron renderer SHALL maintain project, tree, selection, content, resource, and error state for the project lifecycle phase.

#### Scenario: Project is opened

- **WHEN** the renderer receives a project result
- **THEN** it updates project state
- **AND** renders the project file tree
- **AND** keeps resource metadata visible for debugging the shared core bridge

### Requirement: Dependency Lock

The repository SHALL include an npm lockfile once Electron dependencies are installed.

#### Scenario: Dependencies are installed

- **WHEN** a developer installs npm workspace dependencies
- **THEN** `package-lock.json` is present so the Electron dependency graph is reproducible
