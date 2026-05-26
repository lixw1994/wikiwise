## ADDED Requirements

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
