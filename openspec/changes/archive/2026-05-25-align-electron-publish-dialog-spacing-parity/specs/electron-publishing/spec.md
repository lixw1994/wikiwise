## ADDED Requirements

### Requirement: Publish Dialog Content Spacing Parity
The Electron publish dialog SHALL use the native publish sheet's content spacing.

#### Scenario: Publish dialog panel uses native content gap
- **WHEN** the publish dialog is rendered
- **THEN** the dialog panel spaces its direct content groups with a 16px gap matching the native publish sheet
- **AND** the shared modal panel gap for unrelated dialogs is not changed for this requirement
