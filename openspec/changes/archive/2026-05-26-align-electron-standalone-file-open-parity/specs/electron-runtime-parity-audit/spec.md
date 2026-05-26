## ADDED Requirements

### Requirement: Standalone File Runtime Evidence
The Electron runtime parity audit SHALL retain evidence that standalone-file opens match native file-open service boundaries.

#### Scenario: Runtime audit records standalone file open
- **WHEN** the runtime audit captures a standalone-file scenario
- **THEN** it records that the selected standalone file is visible
- **AND** it records that the file tree is empty
- **AND** it records that project watcher and terminal services did not start
- **AND** it records that publish and generated-map affordances do not invoke project services

#### Scenario: Runtime audit fails standalone file mismatch
- **WHEN** a standalone-file scenario shows a populated file tree, starts project watcher or terminal services, enables publishing, opens generated map output, or loses the selected file
- **THEN** runtime audit fails the standalone-file scenario
