## MODIFIED Requirements

### Requirement: Generated Page Refresh

The Electron renderer SHALL refresh active generated pages when project changes affect compiler output, while keeping manual Refresh Page command behavior scoped to selected Markdown files.

#### Scenario: Active generated page is stale

- **WHEN** a live rebuild, CSS change, or markdown change affects compiled output while a generated page is active
- **THEN** Electron refreshes the generated page through the main process

#### Scenario: Manual refresh command is invoked on a generated page

- **WHEN** the app menu Refresh Page command is invoked while a generated page is active
- **THEN** Electron leaves generated-page refresh to watcher-driven project changes
- **AND** the command does not call the generated-page refresh path directly
