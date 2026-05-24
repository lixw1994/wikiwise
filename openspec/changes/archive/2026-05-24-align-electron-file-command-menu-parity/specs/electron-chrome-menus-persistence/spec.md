## MODIFIED Requirements

### Requirement: App Menu Commands

The Electron app SHALL expose native-compatible app menu commands in the same File command group placement as the SwiftUI app.

#### Scenario: File command group contains navigation actions

- **WHEN** the Electron application menu is created
- **THEN** the File menu contains Open Existing Folder, Go Back, Go Forward, and Refresh Page in that order
- **AND** no separate top-level Navigate menu is exposed for those commands

#### Scenario: Navigation command is selected

- **WHEN** the user selects Go Back, Go Forward, or Refresh Page from the app menu
- **THEN** the focused renderer receives the matching app command event
- **AND** the renderer handles the command through its existing project state
