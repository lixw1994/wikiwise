## ADDED Requirements

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

