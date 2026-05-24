# electron-runtime-parity-audit Specification

## Purpose
Define repeatable Electron runtime audit evidence for native shell parity checks.
## Requirements
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

### Requirement: Viewport And Detail Chrome Evidence
The Electron runtime parity audit SHALL retain evidence that project scenarios are bounded to the viewport and do not show non-native detail chrome.

#### Scenario: Project runtime evidence is captured
- **WHEN** the runtime audit captures an opened-project scenario
- **THEN** the report includes project shell rectangle dimensions
- **AND** the report includes detail header visibility evidence
- **AND** the report includes whether selected filename/save status/Save button chrome appears in visible body text

#### Scenario: Project runtime evidence fails parity
- **WHEN** project shell height exceeds the viewport height or detail header chrome is visible
- **THEN** runtime audit fails the scenario

### Requirement: Right Sidebar Resize Evidence
The Electron runtime parity audit SHALL retain evidence that the right sidebar can be resized with native constraints.

#### Scenario: Project runtime evidence includes sidebar resize
- **WHEN** the runtime audit captures an opened-project scenario
- **THEN** it records the right sidebar width before and after a simulated drag
- **AND** it records whether the resize handle is present
- **AND** it records terminal resize evidence after the drag

#### Scenario: Sidebar resize evidence fails parity
- **WHEN** the resize handle is missing, the width does not change, or the resized width violates native constraints
- **THEN** runtime audit fails the scenario

### Requirement: Left Sidebar Visibility Evidence
The Electron runtime parity audit SHALL retain evidence that the left file sidebar can be hidden and restored without breaking project layout.

#### Scenario: Project runtime evidence includes left-sidebar toggle
- **WHEN** the runtime audit captures an opened-project scenario
- **THEN** it records whether the left sidebar is visible before hiding
- **AND** it records whether the left sidebar is hidden after activating the toolbar control
- **AND** it records whether the left sidebar is visible again after restoring
- **AND** it records that the detail area expanded while the sidebar was hidden

#### Scenario: Left-sidebar visibility evidence fails parity
- **WHEN** the left-sidebar control is missing, the sidebar does not hide, the sidebar does not restore, or the detail area does not expand while hidden
- **THEN** runtime audit fails the scenario

### Requirement: File Tree Visual Evidence
The Electron runtime parity audit SHALL retain evidence that native file-tree visual markers are present.

#### Scenario: Project runtime evidence includes file tree visuals
- **WHEN** the runtime audit captures an opened-project scenario
- **THEN** it records folder icon presence
- **AND** it records special folder marker presence
- **AND** it records selected file accent evidence

#### Scenario: File tree visual evidence fails parity
- **WHEN** folder icons, special folder markers, or selected file accent evidence are missing
- **THEN** runtime audit fails the scenario
