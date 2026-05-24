## ADDED Requirements

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
