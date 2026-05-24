## ADDED Requirements

### Requirement: Text File Writing

The core package SHALL expose a UTF-8 text file write helper for main-process save operations.

#### Scenario: Text file is written

- **WHEN** JavaScript calls the write helper with a file path and content
- **THEN** the file contents are written as UTF-8 text
- **AND** the returned result identifies the written path and byte count

### Requirement: Active File Tracking

The core package SHALL expose an active-file tracking helper compatible with the native `.claude/active-file` behavior.

#### Scenario: Active file is tracked

- **WHEN** JavaScript records an active file for a project root
- **THEN** `.claude/active-file` is written under the project root
- **AND** its contents are the selected file path relative to the project root
