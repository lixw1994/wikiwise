## MODIFIED Requirements

### Requirement: Narrow Renderer Bridge

The Electron renderer SHALL not receive direct Node integration and SHALL access native data only through a small production preload API.

#### Scenario: BrowserWindow is created

- **WHEN** the Electron main process creates the application window
- **THEN** `nodeIntegration` is disabled
- **AND** `contextIsolation` is enabled
- **AND** the preload bridge exposes production app operations through `window.wikiwise`
- **AND** the preload bridge does not expose resource-debug metadata

### Requirement: Renderer State Shell

The Electron renderer SHALL maintain project, tree, selection, content, and error state for the project lifecycle phase.

#### Scenario: Project is opened

- **WHEN** the renderer receives a project result
- **THEN** it updates project state
- **AND** renders the project file tree
- **AND** renders the selected content and project errors through production UI state
