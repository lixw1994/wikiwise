# electron-preview-navigation-map-graph Specification

## Purpose
Define Electron preview navigation, generated map/graph routing, external-link handling, and back-navigation behavior needed to match the native preview experience.
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

The Electron renderer SHALL match native generated-page reload behavior: active generated pages are not directly refreshed by watcher changes or by the manual Refresh Page command, while opening a generated page still loads the current compiler output.

#### Scenario: Active generated page receives watcher output changes

- **WHEN** a live rebuild, CSS change, or markdown change affects compiler output while a generated page is active
- **THEN** Electron does not directly call the generated-page refresh path from watcher handling
- **AND** this matches the native watcher path where generated pages have no selected source file and no reload token change

#### Scenario: Manual refresh command is invoked on a generated page

- **WHEN** the app menu Refresh Page command is invoked while a generated page is active
- **THEN** Electron leaves the active generated page unchanged
- **AND** the command does not call the generated-page refresh path directly

#### Scenario: Generated page is opened after output changes

- **WHEN** the user opens or navigates to a generated page after compiler output has changed
- **THEN** Electron asks the main process for that generated page
- **AND** the preview displays the generated page returned by the main process

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
