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
- **AND** Back exposes the native toolbar help text `Go Back (⌘[)` through `title` and `aria-label`
- **AND** Forward exposes the native toolbar help text `Go Forward (⌘])` through `title` and `aria-label`
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

### Requirement: Toolbar Mode Switch Style Parity
The Electron opened-project toolbar SHALL render the File/Wiki mode switch with native compact segmented styling.

#### Scenario: File/Wiki mode switch uses native segmented styling
- **WHEN** a project toolbar is rendered
- **THEN** the File/Wiki mode buttons use native monospaced 10px text, 0.8px tracking, 4px by 10px padding, selected foreground color, muted inactive foreground color, selected background fill, sidebar-rule stroke, and 3px outer segment corners
- **AND** mode IDs, selected state, disabled state, and mode switching behavior are not changed for this requirement
- **AND** publish and icon toolbar controls are not changed for this requirement

### Requirement: Toolbar Group Spacing Parity
The Electron opened-project toolbar SHALL match native SwiftUI horizontal spacing for the left navigation and right primary action groups.

#### Scenario: Project toolbar groups use native spacing
- **WHEN** a project toolbar is rendered
- **THEN** the left navigation toolbar group uses 14px horizontal spacing between controls
- **AND** the right primary action toolbar group uses 10px horizontal spacing between controls
- **AND** toolbar controls, symbols, labels, disabled state, sidebar toggle state, project title offset behavior, menu command routing, and project layout are not changed for this requirement

### Requirement: Toolbar Navigation Arrow Style Parity
The Electron opened-project Back and Forward toolbar arrows SHALL match the native SwiftUI text-arrow typography and disabled color behavior.

#### Scenario: Back and Forward arrows use native text styling
- **WHEN** a project toolbar is rendered
- **THEN** Back and Forward render as monospaced 16px regular-weight text arrows
- **AND** enabled Back and Forward arrows use the toolbar text color
- **AND** disabled Back and Forward arrows use the toolbar disabled color without additional opacity reduction
- **AND** navigation history behavior, disabled attributes, titles, aria labels, menu command routing, toolbar group spacing, project title offset behavior, and project layout are not changed for this requirement
