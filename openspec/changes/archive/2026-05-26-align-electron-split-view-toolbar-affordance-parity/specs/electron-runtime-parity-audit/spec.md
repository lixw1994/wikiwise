## ADDED Requirements

### Requirement: Split-View Toolbar Affordance Runtime Evidence
The Electron runtime parity audit SHALL retain evidence that the left-sidebar toolbar control matches native split-view affordance states.

#### Scenario: Runtime audit records left-sidebar affordance metadata
- **WHEN** the runtime audit captures an opened-project scenario
- **THEN** it records the visible-sidebar toolbar affordance metadata before hiding the sidebar
- **AND** it records the hidden-sidebar toolbar affordance metadata after hiding the sidebar
- **AND** it records that restore returns to the visible sidebar state

#### Scenario: Runtime audit fails missing left-sidebar affordance metadata
- **WHEN** visible-sidebar or hidden-sidebar affordance metadata is absent or mismatched
- **THEN** runtime audit fails the affected project scenario
