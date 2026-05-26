## ADDED Requirements

### Requirement: Welcome Toolbar Runtime Evidence
The Electron runtime parity audit SHALL retain evidence that welcome scenarios include the native toolbar brand row.

#### Scenario: Runtime audit records welcome toolbar
- **WHEN** the runtime audit captures a welcome scenario
- **THEN** it records whether the welcome toolbar is visible
- **AND** it records the welcome toolbar mark text
- **AND** it records the welcome toolbar title text
- **AND** it records welcome toolbar geometry evidence

#### Scenario: Runtime audit fails missing welcome toolbar
- **WHEN** the welcome toolbar is missing, hidden, or lacks the native `W` and `WikiWise` brand text
- **THEN** runtime audit fails the affected welcome scenario
