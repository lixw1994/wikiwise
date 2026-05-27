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

### Requirement: Generated Page Existing Output Parity

Electron generated-page navigation SHALL match native SwiftUI by opening generated map/graph HTML only when it already exists in the compiler output directory, without triggering a whole-site compile from the navigation action.

#### Scenario: Toolbar map opens existing output
- **WHEN** the user invokes the toolbar 3D map control after project-open scanning has produced `map-3d.html`
- **THEN** Electron displays the existing generated page from the compiler output directory
- **AND** the toolbar action does not trigger a whole-site compile

#### Scenario: Toolbar map output is absent
- **WHEN** the user invokes the toolbar 3D map control and `map-3d.html` is absent from the compiler output directory
- **THEN** Electron leaves the current view unchanged
- **AND** does not trigger a whole-site compile to create the missing generated page

#### Scenario: Generated preview link fallback uses existing output
- **WHEN** a local preview link has no markdown source match and resolves to generated output such as `graph.html` or `map-3d.html`
- **THEN** Electron displays the generated page only if that HTML already exists in the compiler output directory
- **AND** does not trigger a whole-site compile from preview-link navigation

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

### Requirement: Generated Link History Parity
The Electron renderer SHALL match native SwiftUI generated-page link history semantics by adding app back-history only when the generated page is opened from a selected source file.

#### Scenario: Markdown preview opens a generated page
- **WHEN** a selected Markdown-backed preview link resolves to a generated page
- **THEN** Electron displays the generated page
- **AND** Electron adds the selected Markdown file to app back-history

#### Scenario: Generated page opens another generated page
- **WHEN** the current app view is already a generated page
- **AND** a generated-frame link resolves to another generated page
- **THEN** Electron displays the target generated page
- **AND** Electron does not add the previous generated page to app back-history

#### Scenario: Toolbar opens generated map
- **WHEN** the user invokes the toolbar 3D map control
- **THEN** Electron preserves existing toolbar-driven generated-page history behavior

### Requirement: Raw Generated Link Routing Parity
Electron preview navigation SHALL match native Swift behavior for raw generated HTML links by treating raw namespaced HTML output as generated output rather than markdown-backed file selection.

#### Scenario: Raw generated page link is selected
- **WHEN** the user selects a local compiled-preview link whose target is a raw generated page such as `raw-source.html`
- **THEN** Electron displays the generated raw HTML page
- **AND** Electron does not select the matching `raw/source.md` markdown file

#### Scenario: Direct raw markdown selection still compiles with raw namespace
- **WHEN** the user directly selects a raw markdown file such as `raw/source.md`
- **THEN** Electron keeps compiling that file with the raw generated slug namespace
- **AND** the selected raw file can still render the corresponding `raw-source.html` preview output

### Requirement: Preview Target Slug Normalization Parity
Electron preview navigation SHALL derive local HTML target slugs with the same filename normalization as native Swift preview navigation.

#### Scenario: Local HTML target filename contains spaces
- **WHEN** the user selects a local compiled-preview link whose HTML target filename contains spaces, such as `My Page.html`
- **THEN** Electron normalizes the target slug to the native hyphenated form
- **AND** Electron can select the matching markdown-backed page such as `My Page.md`

#### Scenario: Generated fallback uses normalized target slug
- **WHEN** a local compiled-preview link with spaces in the HTML target filename has no matching markdown source
- **THEN** Electron checks generated output using the native-normalized slug filename

### Requirement: Preview Markdown Extension Case Parity
Electron preview navigation SHALL match native Swift markdown-source candidate filtering when resolving local HTML links back to markdown files.

#### Scenario: Candidate source uses uppercase markdown extension
- **WHEN** a local compiled-preview link maps by slug to a source file whose extension is uppercase, such as `Target.MD`
- **THEN** Electron does not select that uppercase-extension file through preview markdown-source lookup
- **AND** Electron continues to generated-page fallback handling

#### Scenario: Direct uppercase markdown selection remains supported
- **WHEN** the user directly opens or selects an uppercase-extension markdown file such as `Target.MD`
- **THEN** Electron keeps the existing direct markdown file handling for editing and preview compilation

### Requirement: Selected Source Refresh Scope
The Electron renderer SHALL keep manual Refresh Page scoped to selected source files, matching the native distinction between selected files and generated pages.

#### Scenario: Selected non-Markdown source is refreshed
- **WHEN** the app menu Refresh Page command is invoked while a selected non-Markdown source file is active
- **THEN** Electron refreshes that selected source file from disk
- **AND** Electron does not call the generated-page refresh path

#### Scenario: Generated page remains unchanged
- **WHEN** the app menu Refresh Page command is invoked while a generated map or graph page is active
- **THEN** Electron leaves the generated page unchanged
- **AND** Electron does not call the generated-page refresh path directly
