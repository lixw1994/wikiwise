## ADDED Requirements

### Requirement: Preview Navigation Runtime Evidence
Electron preview navigation parity SHALL be covered by runtime audit evidence in addition to renderer and main-process behavior.

#### Scenario: Local preview navigation is audited
- **WHEN** the Electron runtime parity audit captures an opened-project scenario
- **THEN** the audit report records a local compiled-preview link click that selects the matching markdown source file
- **AND** the audit report records that app Back restores the previous markdown preview state
