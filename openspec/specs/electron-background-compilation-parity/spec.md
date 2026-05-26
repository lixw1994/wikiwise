# electron-background-compilation-parity Specification

## Purpose
Define the Electron background compilation contract for matching the native SwiftUI compiler lifecycle that scans project metadata, serves the selected page, and progressively compiles remaining wiki pages after project open or rebuild events.
## Requirements
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

### Requirement: Window-Owned Background Compilation Lifecycle
The Electron app SHALL bind background compilation jobs to the webContents that opened the directory-backed project, mirroring native SwiftUI timer cleanup when a view disappears or opens a different project.

#### Scenario: Window opens a different project
- **WHEN** an Electron webContents opens a different directory-backed project or opens a standalone file after a directory-backed project
- **THEN** Electron stops background compilation for the previous directory-backed project root
- **AND** Electron records only the new directory-backed project root, or no root for a standalone file, as owned by that webContents

#### Scenario: Window is destroyed
- **WHEN** an Electron webContents that owns a directory-backed project is destroyed
- **THEN** Electron stops background compilation for that project root
- **AND** Electron clears the project root ownership for that webContents
- **AND** this matches the native `ContentView.onDisappear` background timer invalidation behavior
