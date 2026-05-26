## ADDED Requirements

### Requirement: Startup Restore Window Scope
The Electron app SHALL mirror the native SwiftUI app by limiting automatic startup restore to the first app window in a process.

#### Scenario: First window restores the last project
- **WHEN** the first Electron main window asks to restore the last project and a persisted last folder path exists
- **THEN** the renderer receives and opens the restored project result

#### Scenario: Later windows remain on welcome
- **WHEN** a later Electron main window asks to restore the last project
- **THEN** the main process returns no restored project
- **AND** the renderer leaves the welcome screen visible without showing a restore error
- **AND** this matches the native `ContentView` guard that restores only the first instance
