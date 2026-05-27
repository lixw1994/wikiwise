## MODIFIED Requirements

### Requirement: New Wiki Dialog

The Electron app SHALL provide a create-new-wiki flow from the welcome screen that captures a wiki name and target location.

#### Scenario: User opens create flow

- **WHEN** the user chooses Create a New Wiki from the welcome screen
- **THEN** Electron shows a dialog with a wiki name field
- **AND** it shows a target location initialized to the user's `wikis` folder
- **AND** it displays the native `~/wikis` fallback label when no selected location path is available
- **AND** it lets the user choose a different parent directory through the main process
- **AND** the location chooser uses the native message copy `Choose where to create your wiki`
- **AND** the location chooser does not set an explicit dialog title because the current SwiftUI `NSOpenPanel` does not set `panel.title`
- **AND** the location chooser action uses the native `Choose…` label
- **AND** the confirm action uses the native `Create` label
- **AND** the Create action is disabled only while the trimmed wiki name is empty
- **AND** the name field, location chooser, and cancel action do not expose a native-visible disabled state solely because an async create request is in progress
- **AND** the dialog closes through the native cancel keyboard shortcut
- **AND** the dialog submits through the native default keyboard shortcut when Create is enabled
