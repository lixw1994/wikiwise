# electron-viewport-detail-chrome-parity Specification

## Purpose
Define Electron visible shell parity for fixed viewport project layout and native detail-pane chrome, ensuring editor and preview surfaces fill the pane without non-native selected-file/save header UI.
## Requirements
### Requirement: Bounded Project Viewport
The Electron project shell SHALL remain bounded to the app viewport like the native macOS window surface.

#### Scenario: Project view is rendered
- **WHEN** a project is open in the Electron app
- **THEN** the project shell height does not exceed the viewport height
- **AND** editor, preview, sidebar, and terminal content scroll or clip within their panes
- **AND** the document body does not grow into a page-style scroll surface for project content

### Requirement: Native Detail Chrome
The Electron detail pane SHALL not show a separate selected-file, save-status, or Save-button strip that is absent from the native macOS app.

#### Scenario: Markdown editor is displayed
- **WHEN** the Electron app displays a selected markdown file in File mode
- **THEN** the CodeMirror editor occupies the detail pane directly below the toolbar
- **AND** selected filename, save status, and Save button chrome are not visible in the detail pane
- **AND** autosave and keyboard save behavior remain available

#### Scenario: Wiki preview is displayed
- **WHEN** the Electron app displays a compiled wiki preview
- **THEN** the preview occupies the detail pane directly below the toolbar
- **AND** no non-native detail header is visible above the preview

### Requirement: Runtime Audit Coverage
The Electron runtime audit SHALL verify fixed viewport and hidden detail chrome parity.

#### Scenario: Runtime audit inspects project scenarios
- **WHEN** runtime audit captures project light and dark scenarios
- **THEN** it records project shell bounds, detail chrome visibility, and body text evidence
- **AND** it fails if the project shell exceeds the viewport
- **AND** it fails if non-native detail save/header chrome is visible

### Requirement: Native Detail Empty State
The Electron detail pane SHALL render the native empty-state placeholder when no selected file, generated page, or post-create guide is active.

#### Scenario: No detail content is selected
- **WHEN** an Electron project is open without a selected file or generated page
- **THEN** the detail pane shows a centered `doc.text` native-symbol placeholder
- **AND** it shows the copy `Select a file to read`
- **AND** the placeholder uses native muted sidebar color, 8px vertical spacing, 32px light icon styling, 13px text, and content background
- **AND** editor, preview, generated-page, post-create guide, hidden save chrome, toolbar, file tree, and right-sidebar behavior are unchanged
