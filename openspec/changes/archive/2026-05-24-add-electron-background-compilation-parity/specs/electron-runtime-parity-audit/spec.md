## ADDED Requirements

### Requirement: Background Compilation Runtime Evidence
The Electron runtime parity audit SHALL retain evidence that shared progressive compilation drains pending pages.

#### Scenario: Runtime audit records background compilation
- **WHEN** runtime audit creates its scaffold project
- **THEN** it scans and compiles the selected home page
- **AND** it records the result of draining pending compilation batches
- **AND** the report indicates that no pending pages remain

#### Scenario: Runtime audit fails missing background evidence
- **WHEN** background compilation evidence is absent or reports pending pages remaining
- **THEN** runtime audit fails the affected project scenario
