## ADDED Requirements

### Requirement: Optional Release Preflight Report
The Electron release preflight path SHALL support writing retained prerequisite evidence to a caller-provided JSON report path.

#### Scenario: Preflight report path is provided
- **WHEN** the Electron release preflight command is run with a report path
- **THEN** it writes a JSON report containing the requested version, production release command, preflight command, prerequisite checks, blocker list, and artifact production status
- **AND** it creates the report parent directory if needed
- **AND** it exits before runtime audit, Electron packaging, app signing, DMG creation, notarization submission, stapling, or assessment

#### Scenario: Preflight report is generated while blocked
- **WHEN** release preflight is blocked and a report path was provided
- **THEN** the report is still written
- **AND** the report records `status` as `blocked`
- **AND** the command exits non-zero
- **AND** the report does not claim that a signed or notarized release was produced
