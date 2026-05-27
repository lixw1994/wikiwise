## MODIFIED Requirements

### Requirement: Active File Tracking

The core package SHALL expose an active-file tracking helper compatible with the native `.claude/active-file` behavior.

#### Scenario: Active file is tracked for a scaffolded project
- **WHEN** JavaScript records an active file for a project root that already contains `.claude`
- **THEN** `.claude/active-file` is written under the project root
- **AND** its contents are the selected file path relative to the project root

#### Scenario: Active file tracking does not create agent metadata directories
- **WHEN** JavaScript records an active file for a project root that does not contain `.claude`
- **THEN** the helper does not create `.claude`
- **AND** it does not create `.claude/active-file`
- **AND** it still reports the selected file path relative to the project root
