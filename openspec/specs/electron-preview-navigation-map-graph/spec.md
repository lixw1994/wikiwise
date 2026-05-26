# electron-preview-navigation-map-graph Specification

## Purpose
TBD - created by archiving change migrate-electron-preview-navigation-map-graph. Update Purpose after archive.
## Requirements
### Requirement: Preview Local Link Routing

The Electron renderer SHALL route local compiled-preview links through app navigation state instead of letting iframe navigation own the state.

#### Scenario: Markdown-backed wiki link is selected

- **WHEN** the user selects a local HTML link in a compiled preview that maps to a markdown source file
- **THEN** Electron selects the corresponding markdown file in the file tree
- **AND** the previous view is added to back history

#### Scenario: Same-page anchor is selected

- **WHEN** the user selects an anchor link whose target is the same HTML page with a different fragment
- **THEN** Electron allows the iframe to handle the anchor scroll without changing app navigation state

### Requirement: Generated Page Routing

The Electron renderer SHALL route generated map and graph links through generated-page state.

#### Scenario: Generated page link is selected

- **WHEN** the user selects a local generated page link such as `map.html`, `map-3d.html`, or `graph.html`
- **THEN** Electron displays the generated page in the preview area
- **AND** app back and forward history include the generated page entry

### Requirement: External Preview Links

The Electron app SHALL open external preview links outside the app.

#### Scenario: External link is selected

- **WHEN** the user selects an `http` or `https` link inside a compiled preview or generated map/graph page
- **THEN** Electron asks the main process to open the URL in the system browser
- **AND** the iframe does not navigate to the external URL

### Requirement: Generated Page Refresh

The Electron renderer SHALL refresh active generated pages when project changes affect compiler output.

#### Scenario: Active generated page is stale

- **WHEN** a live rebuild, CSS change, or markdown change affects compiled output while a generated page is active
- **THEN** Electron refreshes the generated page through the main process

### Requirement: Map Graph Generated Page Coverage

The Electron app SHALL support every native generated map and graph HTML page used by the current bundled resources.

#### Scenario: Graph page is requested

- **WHEN** Electron resolves or opens `graph.html` for the active project
- **THEN** the page is accepted as a generated page when it exists in the compiler output directory

### Requirement: Preview Navigation Runtime Evidence
Electron preview navigation parity SHALL be covered by runtime audit evidence in addition to renderer and main-process behavior.

#### Scenario: Local preview navigation is audited
- **WHEN** the Electron runtime parity audit captures an opened-project scenario
- **THEN** the audit report records a local compiled-preview link click that selects the matching markdown source file
- **AND** the audit report records that app Back restores the previous markdown preview state
