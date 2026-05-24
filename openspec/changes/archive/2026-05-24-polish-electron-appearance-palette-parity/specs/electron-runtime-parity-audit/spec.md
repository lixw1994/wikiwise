## ADDED Requirements

### Requirement: Appearance Palette Evidence
The Electron runtime parity audit SHALL retain computed-color evidence for light and dark shell palettes.

#### Scenario: Runtime evidence includes appearance colors
- **WHEN** runtime audit captures a welcome or project scenario
- **THEN** the report includes computed body, welcome, project, sidebar, detail, and right-sidebar colors where those surfaces exist
- **AND** dark scenarios record whether dark shell palette evidence is active

#### Scenario: Dark appearance evidence fails parity
- **WHEN** a dark runtime scenario leaves key shell surfaces on light palette backgrounds
- **THEN** runtime audit fails the scenario
