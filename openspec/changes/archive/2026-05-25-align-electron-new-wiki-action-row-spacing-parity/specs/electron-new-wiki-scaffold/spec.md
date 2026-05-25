## ADDED Requirements

### Requirement: New Wiki Action Row Spacing Parity
The Electron create-new-wiki dialog SHALL match the native sheet's action row spacing.

#### Scenario: New wiki action row is inspected
- **WHEN** the Electron create-new-wiki dialog is rendered
- **THEN** the Cancel/Create action row uses only the parent sheet's native 20px vertical spacing
- **AND** it does not add extra top margin above the action row
- **AND** the Cancel and Create controls keep their IDs and labels
- **AND** shared modal action spacing remains available for non-new-wiki dialogs
