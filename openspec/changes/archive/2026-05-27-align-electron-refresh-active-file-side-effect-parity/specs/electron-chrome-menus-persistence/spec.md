## ADDED Requirements

### Requirement: Refresh Page Active File Side Effect Parity

Electron manual Refresh Page handling SHALL mirror native `recompileCurrentPage(_:)` by rewriting the selected source file path to the active-file marker after selected source-file refreshes.

#### Scenario: Refresh Page command is selected for Markdown active-file side effect
- **WHEN** the user selects Refresh Page while a Markdown source file is selected
- **THEN** Electron invalidates and refreshes the selected Markdown preview
- **AND** Electron rewrites `.claude/active-file` with the selected Markdown file path through the same silent active-file helper used by selection and save paths
- **AND** the command remains guarded by selected source-file state rather than generated-page state

#### Scenario: Refresh Page command is selected for non-Markdown active-file side effect
- **WHEN** the user selects Refresh Page while a non-Markdown source file is selected
- **THEN** Electron rereads the selected file content from disk
- **AND** Electron rerenders the selected file without adding a history entry
- **AND** Electron rewrites `.claude/active-file` with the selected non-Markdown file path through the same silent active-file helper used by selection and save paths

#### Scenario: Refresh Page command is selected for generated page
- **WHEN** the user selects Refresh Page while a generated map or graph page is active
- **THEN** Electron does not write an active-file marker solely for the generated page
- **AND** this matches the native `recompileCurrentPage(_:)` selected-file guard
