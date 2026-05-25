## ADDED Requirements

### Requirement: Publish Dialog Actions Spacing Parity
The Electron publish dialog SHALL render the action row with native publish sheet spacing.

#### Scenario: Publish actions rely on native content gap
- **WHEN** the publish dialog is rendered
- **THEN** the action row has no extra top margin beyond the publish dialog content gap
- **AND** shared modal action spacing for other dialogs is not changed for this requirement
- **AND** publish action labels, ordering, keyboard behavior, and disabled state are not changed for this requirement
