## ADDED Requirements

### Requirement: Left Sidebar Split-View Affordance Semantics
The Electron left-sidebar toolbar control SHALL distinguish the native system split-view toggle state from the native custom restore state while preserving icon-only toolbar styling.

#### Scenario: Visible sidebar affordance is rendered
- **WHEN** the left sidebar is visible
- **THEN** the left-sidebar toolbar control keeps icon-only plain button styling
- **AND** the control exposes `system-split-view-toggle` native affordance metadata
- **AND** the control exposes `hide` sidebar action metadata

#### Scenario: Hidden sidebar affordance is rendered
- **WHEN** the left sidebar is hidden
- **THEN** the left-sidebar toolbar control keeps icon-only plain button styling
- **AND** the control exposes `custom-restore-control` native affordance metadata
- **AND** the control exposes `show` sidebar action metadata
