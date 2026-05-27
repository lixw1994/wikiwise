## ADDED Requirements

### Requirement: Refresh Page Selected File Reload
The Electron app SHALL handle the Refresh Page menu command for any selected source file the native app can select, not only Markdown files.

#### Scenario: Refresh Page command is selected for non-Markdown source
- **WHEN** the user selects Refresh Page while a non-Markdown source file is selected
- **THEN** Electron rereads the selected file content from disk
- **AND** Electron rerenders the selected file without adding a history entry

#### Scenario: Refresh Page command keeps Markdown preview behavior
- **WHEN** the user selects Refresh Page while a Markdown source file is selected
- **THEN** Electron continues to invalidate and refresh the selected Markdown preview
- **AND** the command remains routed through existing renderer project state
