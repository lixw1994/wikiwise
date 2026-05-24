## ADDED Requirements

### Requirement: Left Sidebar Width Runtime Evidence
The Electron runtime parity audit SHALL retain evidence that the opened-project left sidebar matches native width constraints and resize behavior.

#### Scenario: Runtime audit records left-sidebar width
- **WHEN** the runtime audit captures an opened-project scenario
- **THEN** it records the left-sidebar resize handle presence
- **AND** it records native min, ideal, and max widths
- **AND** it records the initial sidebar width
- **AND** it records the resized sidebar width after a simulated drag
- **AND** it records the toolbar title offset after resizing

#### Scenario: Runtime audit fails left-sidebar width mismatch
- **WHEN** the initial left sidebar width is not the native ideal width
- **THEN** runtime audit fails the scenario

#### Scenario: Runtime audit fails left-sidebar resize mismatch
- **WHEN** the resize handle is missing, the width does not change after drag, the resized width violates native constraints, or the toolbar title offset does not match the resized width
- **THEN** runtime audit fails the scenario
