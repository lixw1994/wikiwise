## ADDED Requirements

### Requirement: Publish Dialog Title Typography Parity
The Electron publish dialog SHALL use the native publish sheet title typography.

#### Scenario: Publish dialog title uses native serif treatment
- **WHEN** the publish dialog is rendered
- **THEN** the `Publish your wiki` title uses an 18px serif font with medium weight matching the native publish sheet
- **AND** the typography override is scoped to the publish dialog title
