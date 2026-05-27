## MODIFIED Requirements

### Requirement: Active File Side-Effect Parity

Electron project lifecycle operations SHALL preserve the native best-effort `.claude/active-file` side-effect boundary, including silent user-facing behavior when the side-effect write fails.

#### Scenario: Standalone file selection is recorded without creating agent metadata
- **WHEN** a user opens a standalone markdown or plain-text file whose parent directory does not contain `.claude`
- **THEN** Electron reads and displays the selected file
- **AND** Electron does not create `.claude` in the file's parent directory solely to record the active file

#### Scenario: Scaffolded project selection still records active file
- **WHEN** a user opens or creates a scaffolded wiki project that contains `.claude`
- **THEN** Electron continues to record the selected file at `.claude/active-file`
- **AND** the recorded path remains relative to the project root

#### Scenario: Active-file selection write fails
- **WHEN** the Electron renderer asks the main process to record the selected active file and that side-effect write rejects
- **THEN** the selected-file flow continues without surfacing a global renderer error
- **AND** main-process project-root and file-path validation remain unchanged
