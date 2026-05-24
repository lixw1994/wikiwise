## ADDED Requirements

### Requirement: Right Sidebar Resize Evidence
The Electron runtime parity audit SHALL retain evidence that the right sidebar can be resized with native constraints.

#### Scenario: Project runtime evidence includes sidebar resize
- **WHEN** the runtime audit captures an opened-project scenario
- **THEN** it records the right sidebar width before and after a simulated drag
- **AND** it records whether the resize handle is present
- **AND** it records terminal resize evidence after the drag

#### Scenario: Sidebar resize evidence fails parity
- **WHEN** the resize handle is missing, the width does not change, or the resized width violates native constraints
- **THEN** runtime audit fails the scenario
