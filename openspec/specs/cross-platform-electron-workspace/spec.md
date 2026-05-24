# cross-platform-electron-workspace Specification

## Purpose
TBD - created by archiving change add-electron-workspace. Update Purpose after archive.
## Requirements
### Requirement: Parallel Electron Workspace

The repository SHALL include a private Electron app workspace at `apps/electron` that can evolve independently from the SwiftUI macOS app.

#### Scenario: Electron app is discoverable

- **WHEN** a developer inspects the root npm workspace configuration
- **THEN** `apps/electron` is included through the workspace package pattern
- **AND** the app declares the package name `@wikiwise/electron-app`

### Requirement: Minimal Electron Shell

The Electron app SHALL include a main process, preload bridge, renderer page, renderer script, and renderer stylesheet.

#### Scenario: Shell files exist

- **WHEN** workspace tests inspect the Electron package
- **THEN** the main entry, preload script, renderer HTML, renderer JavaScript, and renderer CSS files exist at documented paths

### Requirement: Narrow Renderer Bridge

The Electron renderer SHALL not receive direct Node integration in this initial shell and SHALL access native data only through a small preload API.

#### Scenario: BrowserWindow is created

- **WHEN** the Electron main process creates the application window
- **THEN** `nodeIntegration` is disabled
- **AND** `contextIsolation` is enabled
- **AND** the preload bridge exposes resource metadata through `window.wikiwise.resources`

### Requirement: Dependency-Light Verification

The initial Electron workspace SHALL include tests that verify package structure without requiring Electron dependencies to be installed.

#### Scenario: Workspace tests run before dependency install

- **WHEN** a developer runs the root workspace test command before installing Electron
- **THEN** tests for `@wikiwise/core` and `@wikiwise/electron-app` can execute with Node's built-in test runner
- **AND** the command does not launch Electron

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
