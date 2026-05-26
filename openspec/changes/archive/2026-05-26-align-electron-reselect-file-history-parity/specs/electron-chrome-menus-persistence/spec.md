## MODIFIED Requirements

### Requirement: Renderer History

The Electron renderer SHALL maintain navigation history for selected files and generated pages.

#### Scenario: User navigates between pages

- **WHEN** the user selects a different file or opens the generated 3D map
- **THEN** the previous view is pushed to back history
- **AND** forward history is cleared

#### Scenario: User reselects the active file

- **WHEN** the user selects the file that is already active
- **THEN** the back history is not changed
- **AND** forward history is not cleared
- **AND** the current file may still be reloaded and its document info refreshed

#### Scenario: User navigates back and forward

- **WHEN** the user invokes back or forward
- **THEN** the renderer restores the corresponding file or generated page view
