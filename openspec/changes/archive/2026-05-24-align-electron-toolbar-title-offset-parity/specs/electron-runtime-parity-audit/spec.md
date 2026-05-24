## ADDED Requirements

### Requirement: Toolbar Title Offset Runtime Evidence
The Electron runtime parity audit SHALL retain evidence that opened-project toolbar title offset matches the native left-sidebar compensation.

#### Scenario: Runtime audit records toolbar title offset
- **WHEN** the runtime audit captures an opened-project scenario
- **THEN** it records the visible left-sidebar width
- **AND** it records the toolbar title offset before hiding the left sidebar
- **AND** it records the toolbar title offset while the left sidebar is hidden
- **AND** it records the toolbar title offset after restoring the left sidebar

#### Scenario: Runtime audit fails title offset mismatch
- **WHEN** the left sidebar is visible and the toolbar title offset is not negative half of the visible sidebar width
- **THEN** runtime audit fails the scenario

#### Scenario: Runtime audit fails hidden title offset mismatch
- **WHEN** the left sidebar is hidden and the toolbar title offset is not `0`
- **THEN** runtime audit fails the scenario
