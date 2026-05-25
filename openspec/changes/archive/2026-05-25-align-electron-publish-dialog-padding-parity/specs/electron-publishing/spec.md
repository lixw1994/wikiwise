## ADDED Requirements

### Requirement: Publish Dialog Panel Padding Parity
The Electron publish dialog SHALL use the native publish sheet's panel inset.

#### Scenario: Publish dialog panel uses native content padding
- **WHEN** the publish dialog is rendered
- **THEN** the dialog panel uses a 24px content inset matching the native publish sheet
- **AND** the shared modal panel padding for unrelated dialogs is not changed for this requirement
