## ADDED Requirements

### Requirement: Publish Availability Hint Color Parity
The Electron publish dialog SHALL render availability hint text with the native state-specific foreground styling.

#### Scenario: Publish availability hint colors match native states
- **WHEN** the publish dialog renders an availability hint
- **THEN** available, checking, unknown, and fallback hints use secondary text coloring
- **AND** the owned hint uses blue text coloring
- **AND** the taken hint uses red text coloring
- **AND** the invalid hint uses orange text coloring
- **AND** availability hint copy, publish eligibility, and inline indicator styling are not changed for this requirement
