## ADDED Requirements

### Requirement: Left Sidebar Visibility Evidence
The Electron runtime parity audit SHALL retain evidence that the left file sidebar can be hidden and restored without breaking project layout.

#### Scenario: Project runtime evidence includes left-sidebar toggle
- **WHEN** the runtime audit captures an opened-project scenario
- **THEN** it records whether the left sidebar is visible before hiding
- **AND** it records whether the left sidebar is hidden after activating the toolbar control
- **AND** it records whether the left sidebar is visible again after restoring
- **AND** it records that the detail area expanded while the sidebar was hidden

#### Scenario: Left-sidebar visibility evidence fails parity
- **WHEN** the left-sidebar control is missing, the sidebar does not hide, the sidebar does not restore, or the detail area does not expand while hidden
- **THEN** runtime audit fails the scenario
