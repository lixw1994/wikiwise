## ADDED Requirements

### Requirement: Toolbar Icon Runtime Evidence
The Electron runtime parity audit SHALL retain evidence that opened-project toolbar icon controls match native icon-only semantics.

#### Scenario: Runtime audit records toolbar icons
- **WHEN** the runtime audit captures an opened-project scenario
- **THEN** it records native symbol names for appearance, 3D map, left sidebar, and right sidebar controls
- **AND** it records the visible text for icon-only toolbar controls
- **AND** it records whether prohibited text labels remain visible

#### Scenario: Runtime audit fails visible toolbar text labels
- **WHEN** an opened-project toolbar shows `Auto`, `Light`, `Dark`, or `Map` text in icon-only controls
- **THEN** runtime audit fails the scenario

#### Scenario: Runtime audit fails missing toolbar symbol semantics
- **WHEN** an opened-project toolbar is missing native symbol evidence for appearance, 3D map, or sidebar controls
- **THEN** runtime audit fails the scenario
