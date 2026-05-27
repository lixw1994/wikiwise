## ADDED Requirements

### Requirement: Save Active File Side-Effect Parity

Electron save operations SHALL preserve the native `.claude/active-file` directory side-effect boundary.

#### Scenario: Saving outside a scaffolded project does not create agent metadata
- **WHEN** Electron saves a selected file whose project root does not contain `.claude`
- **THEN** the file contents are saved through the normal save path
- **AND** Electron does not create `.claude` solely to update `.claude/active-file`

#### Scenario: Saving inside a scaffolded project records active file
- **WHEN** Electron saves a selected file whose project root already contains `.claude`
- **THEN** the file contents are saved through the normal save path
- **AND** `.claude/active-file` records the saved file path relative to the project root
