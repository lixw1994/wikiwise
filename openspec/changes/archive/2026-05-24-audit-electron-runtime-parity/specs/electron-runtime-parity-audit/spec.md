## ADDED Requirements

### Requirement: Runtime Audit Command

The repository SHALL provide an npm command that runs a repeatable Electron runtime parity audit.

#### Scenario: Audit scripts are inspected

- **WHEN** package manifests are inspected
- **THEN** the root manifest exposes an Electron runtime audit command
- **AND** the Electron workspace manifest exposes a runtime audit command
- **AND** both commands delegate to a checked-in runtime audit script

### Requirement: Electron Renderer Runtime Capture

The runtime audit SHALL load the current Electron renderer through the current preload bridge in an Electron BrowserWindow.

#### Scenario: Audit script is inspected

- **WHEN** the audit script is inspected
- **THEN** it creates a BrowserWindow with context isolation enabled
- **AND** it uses the Electron preload script from `apps/electron/src/preload/preload.cjs`
- **AND** it loads the renderer HTML from `apps/electron/src/renderer/index.html`
- **AND** it captures screenshots through Electron runtime APIs

### Requirement: Native Shell Scenario Coverage

The runtime audit SHALL capture no-folder and opened-project shell states in both light and dark appearances.

#### Scenario: Audit scenarios run

- **WHEN** the runtime audit command completes successfully
- **THEN** it records scenarios named `welcome-light`, `welcome-dark`, `project-light`, and `project-dark`
- **AND** each scenario writes a PNG screenshot artifact
- **AND** each scenario writes DOM evidence to the JSON report

### Requirement: Runtime Parity Assertions

The runtime audit SHALL fail when required native-shell parity markers are missing.

#### Scenario: Audit assertions are evaluated

- **WHEN** the runtime audit evaluates a scenario
- **THEN** it verifies the document title is `Wikiwise`
- **AND** it verifies the renderer does not expose the shared-resources debug panel
- **AND** it verifies screenshots are nonblank at the expected viewport size
- **AND** welcome scenarios verify native welcome text and hidden project state
- **AND** project scenarios verify opened project chrome, selected document state, preview surface, and right sidebar state

### Requirement: Runtime Audit Artifacts

The runtime audit SHALL retain generated evidence under the Electron output directory.

#### Scenario: Audit artifacts are written

- **WHEN** the runtime audit command completes successfully
- **THEN** it writes `apps/electron/out/runtime-audit/report.json`
- **AND** it writes screenshots under `apps/electron/out/runtime-audit/screenshots/`
- **AND** it reports artifact locations in command output
