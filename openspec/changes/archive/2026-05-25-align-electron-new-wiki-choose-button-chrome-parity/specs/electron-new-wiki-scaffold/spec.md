## ADDED Requirements

### Requirement: New Wiki Location Chooser Button Chrome Parity
The Electron create-new-wiki dialog SHALL render the location `Choose…` control with native sheet button chrome instead of shared app-branded secondary action styling.

#### Scenario: New wiki location chooser is inspected
- **WHEN** the Electron create-new-wiki dialog is rendered
- **THEN** the location chooser keeps the `choose-new-wiki-location` ID and native `Choose…` label
- **AND** the location chooser does not use shared `secondary-action` or `compact` classes
- **AND** the location chooser uses scoped new-wiki sheet button styling
- **AND** welcome, publish, unpublish, feedback, and other non-new-wiki controls keep their existing shared action button styling
