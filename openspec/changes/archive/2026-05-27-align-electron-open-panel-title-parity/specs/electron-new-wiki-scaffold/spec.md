## MODIFIED Requirements

### Requirement: New Wiki Dialog

The Electron app SHALL provide a create-new-wiki flow from the welcome screen that captures a wiki name and target location.

#### Scenario: User opens create flow

- **WHEN** the user chooses Create a New Wiki from the welcome screen
- **THEN** Electron shows a dialog with a wiki name field
- **AND** it shows a target location initialized to the user's `wikis` folder
- **AND** it lets the user choose a different parent directory through the main process
- **AND** the location chooser uses the native message copy `Choose where to create your wiki`
- **AND** the location chooser does not set an explicit dialog title because the current SwiftUI `NSOpenPanel` does not set `panel.title`
- **AND** the location chooser action uses the native `Choose…` label
- **AND** the confirm action uses the native `Create` label
- **AND** the Create action is disabled while the trimmed wiki name is empty
- **AND** the Create action remains disabled while a create request is in progress
- **AND** the dialog closes through the native cancel keyboard shortcut
- **AND** the dialog submits through the native default keyboard shortcut when Create is enabled

## ADDED Requirements

### Requirement: New Wiki Location Picker Title Parity
The Electron new-wiki location picker SHALL preserve native message-only dialog chrome.

#### Scenario: New wiki location picker is configured
- **WHEN** the Electron main process opens the new-wiki location picker
- **THEN** the dialog message matches the native SwiftUI `NSOpenPanel` message
- **AND** the dialog does not set an explicit title override
- **AND** directory-only selection, directory creation, and the default `~/wikis` path remain unchanged
