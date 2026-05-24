# electron-chrome-menus-persistence Specification

## Purpose
TBD - created by archiving change migrate-electron-chrome-menus-persistence. Update Purpose after archive.
## Requirements
### Requirement: Persistent App Settings

The Electron app SHALL persist native-equivalent app settings across launches.

#### Scenario: Appearance mode is persisted

- **WHEN** the user cycles appearance mode
- **THEN** Electron stores `Auto`, `Light`, or `Dark`
- **AND** the mode is restored when the app starts again
- **AND** the renderer reflects the active mode

#### Scenario: Last folder is persisted

- **WHEN** the user opens or creates a wiki folder
- **THEN** Electron stores the project directory as the last folder path

### Requirement: Startup Restore

The Electron app SHALL restore the previous wiki folder when possible.

#### Scenario: Last folder still exists

- **WHEN** Electron starts and a persisted last folder path exists
- **THEN** the renderer receives and opens the restored project result

#### Scenario: Last folder is missing

- **WHEN** Electron starts and the persisted path no longer exists
- **THEN** the welcome screen remains visible
- **AND** no project restore error is shown

### Requirement: App Menu Commands

The Electron app SHALL expose native-compatible app menu commands in the same File command group placement as the SwiftUI app.

#### Scenario: File command group contains navigation actions

- **WHEN** the Electron application menu is created
- **THEN** the File menu contains Open Existing Folder, Go Back, Go Forward, and Refresh Page in that order
- **AND** no separate top-level Navigate menu is exposed for those commands

#### Scenario: Navigation command is selected

- **WHEN** the user selects Go Back, Go Forward, or Refresh Page from the app menu
- **THEN** the focused renderer receives the matching app command event
- **AND** the renderer handles the command through its existing project state

### Requirement: Native-Like Toolbar Controls
The Electron renderer SHALL expose native-like toolbar controls for opened projects.

#### Scenario: Project toolbar is rendered
- **WHEN** a project is open
- **THEN** the toolbar includes File/Wiki mode, back, forward, appearance, 3D map, publish, right-sidebar toggle, and project title controls
- **AND** back and forward disabled states reflect renderer history
- **AND** appearance, 3D map, and sidebar toolbar actions use icon-only native symbol semantics rather than visible text labels
- **AND** icon-only toolbar actions keep accessible labels through `title` and `aria-label`
- **AND** the project title is offset like the native toolbar when the left sidebar is visible

### Requirement: Renderer History

The Electron renderer SHALL maintain navigation history for selected files and generated pages.

#### Scenario: User navigates between pages

- **WHEN** the user selects files or opens the generated 3D map
- **THEN** the previous view is pushed to back history
- **AND** forward history is cleared

#### Scenario: User navigates back and forward

- **WHEN** the user invokes back or forward
- **THEN** the renderer restores the corresponding file or generated page view

### Requirement: Generated Map Navigation

The Electron app SHALL open the generated 3D map from the toolbar.

#### Scenario: Map button is selected

- **WHEN** the user activates the map control
- **THEN** the renderer asks preload for the generated `map-3d.html` page
- **AND** the preview displays that generated page

### Requirement: Visible Appearance Palette
The Electron renderer SHALL reflect stored appearance mode as visible shell palette changes, not only as persisted state.

#### Scenario: User cycles to dark appearance
- **WHEN** the user cycles appearance mode to `Dark`
- **THEN** the renderer sets dark appearance state
- **AND** primary visible shell surfaces use dark palette colors matching the native app

#### Scenario: User cycles to light appearance
- **WHEN** the user cycles appearance mode to `Light`
- **THEN** the renderer sets light appearance state
- **AND** primary visible shell surfaces use light palette colors matching the native app
