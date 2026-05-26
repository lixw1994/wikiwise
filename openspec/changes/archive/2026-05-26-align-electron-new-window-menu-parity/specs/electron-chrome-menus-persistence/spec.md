## MODIFIED Requirements

### Requirement: App Menu Commands

The Electron app SHALL expose native-compatible app menu commands in the same File command group placement as the SwiftUI app.

#### Scenario: File command group contains navigation actions

- **WHEN** the Electron application menu is created
- **THEN** the File menu contains New Window, Open Existing Folder, Go Back, Go Forward, and Refresh Page in that order
- **AND** New Window uses the native new-window accelerator
- **AND** no separate top-level Navigate menu is exposed for those commands

#### Scenario: New window command is selected

- **WHEN** the user selects New Window from the app menu
- **THEN** Electron creates a new main window through the same window creation path as app startup
- **AND** the later window remains subject to the native first-window-only startup restore rule

#### Scenario: Navigation command is selected

- **WHEN** the user selects Go Back, Go Forward, or Refresh Page from the app menu
- **THEN** the focused renderer receives the matching app command event
- **AND** the renderer handles the command through its existing project state
