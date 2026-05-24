## ADDED Requirements

### Requirement: Native Toolbar Title Offset
The Electron opened-project toolbar SHALL offset the project title to match the native SwiftUI left-sidebar compensation.

#### Scenario: Left sidebar is visible
- **WHEN** a project is open and the left sidebar is visible
- **THEN** the toolbar project title is translated left by half of the visible left-sidebar width

#### Scenario: Left sidebar is hidden
- **WHEN** the user hides the left sidebar
- **THEN** the toolbar project title offset is reset to `0`

#### Scenario: Left sidebar is restored
- **WHEN** the user restores the left sidebar
- **THEN** the toolbar project title again translates left by half of the visible left-sidebar width
