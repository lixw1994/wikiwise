## ADDED Requirements

### Requirement: Native Progressive Compilation
The Electron app SHALL progressively compile remaining wiki pages in the background after a directory-backed project is opened.

#### Scenario: Wiki folder is opened
- **WHEN** Electron opens a project directory and scans wiki metadata
- **THEN** it compiles the selected home page when present
- **AND** it schedules background batches for remaining pending pages
- **AND** the background job stops after pending pages reach zero

#### Scenario: Scaffolded wiki is created
- **WHEN** Electron creates and opens a scaffolded wiki
- **THEN** it uses the same project-open compilation lifecycle
- **AND** remaining scaffold pages are progressively compiled without waiting for map, publish, or explicit navigation

### Requirement: Background Compilation Lifecycle
The Electron main process SHALL own background compilation jobs without renderer filesystem access.

#### Scenario: Background job starts
- **WHEN** a background compilation job is started for a project root
- **THEN** any previous job for that project root is stopped
- **AND** batches use native-equivalent small batch sizing and interval cadence

#### Scenario: Background job completes
- **WHEN** a batch reports no remaining pending pages
- **THEN** Electron stops the project root's background job
- **AND** no orphan interval remains for that project root
