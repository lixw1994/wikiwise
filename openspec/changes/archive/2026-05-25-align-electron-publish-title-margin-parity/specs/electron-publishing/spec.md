## ADDED Requirements

### Requirement: Publish Dialog Title Margin Parity
The Electron publish dialog title SHALL not add spacing beyond the native publish sheet content gap.

#### Scenario: Publish dialog title relies on panel gap
- **WHEN** the publish dialog is rendered
- **THEN** the title has no additional bottom margin beyond the dialog's native 16px content gap
- **AND** the shared modal title margin for unrelated dialogs is not changed for this requirement
