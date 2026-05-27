## ADDED Requirements

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
