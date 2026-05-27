# electron-chrome-menus-persistence Specification

## Purpose
Define Electron app chrome, menu commands, startup restore, appearance persistence, toolbar navigation, and sidebar state behavior needed to match the native macOS shell.
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
- **THEN** the File menu contains New Window, Go Back, Go Forward, and Refresh Page in that order
- **AND** New Window uses the native new-window accelerator
- **AND** Open Existing Folder is not exposed as a File-menu command because the current SwiftUI command group does not add it
- **AND** no separate top-level Navigate menu is exposed for those commands

#### Scenario: New window command is selected

- **WHEN** the user selects New Window from the app menu
- **THEN** Electron creates a new main window through the same window creation path as app startup
- **AND** the later window remains subject to the native first-window-only startup restore rule

#### Scenario: Navigation command is selected

- **WHEN** the user selects Go Back, Go Forward, or Refresh Page from the app menu
- **THEN** every live renderer receives the matching app command event
- **AND** each renderer handles the command through its existing project state
- **AND** this matches the native global `NotificationCenter` command path received by every live `ContentView`

#### Scenario: Welcome open-existing action is selected

- **WHEN** the user selects Open Existing Folder from the Electron welcome screen
- **THEN** Electron uses the existing open picker flow through the focused renderer
- **AND** the picker is not exposed through an additional File-menu command

#### Scenario: Refresh Page command is selected for Markdown

- **WHEN** the user selects Refresh Page while a Markdown source file is selected
- **THEN** Electron invalidates and refreshes the selected Markdown preview
- **AND** the command remains routed through existing renderer project state

#### Scenario: Refresh Page command is selected for generated page

- **WHEN** the user selects Refresh Page while a generated map or graph page is active
- **THEN** Electron does not directly refresh the generated page from that command
- **AND** the behavior matches the native command path where `recompileCurrentPage(_:)` returns without a selected file

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

- **WHEN** the user selects a different file or opens the generated 3D map
- **THEN** the previous view is pushed to back history
- **AND** forward history is cleared

#### Scenario: User reselects the active file

- **WHEN** the user selects the file that is already active
- **THEN** the back history is not changed
- **AND** forward history is not cleared
- **AND** the current file may still be reloaded and its document info refreshed

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

### Requirement: Toolbar Mode Switch Enabled Parity
The Electron opened-project FILE/WIKI toolbar mode controls SHALL remain enabled like the native SwiftUI toolbar buttons.

#### Scenario: FILE/WIKI toolbar controls remain enabled
- **WHEN** a project toolbar is rendered
- **THEN** the FILE mode control is not disabled
- **AND** the WIKI mode control is not disabled
- **AND** selecting WIKI without an available compiled preview falls back to the source editor instead of showing a blank pane
- **AND** the WIKI segment remains selected whenever Wiki mode is selected, even while source fallback is shown
- **AND** generated page rendering remains prioritized over source or compiled detail modes
- **AND** mode labels, segmented styling, click handlers, project toolbar controls, navigation disabled states, and generated page navigation behavior are not changed for this requirement

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

### Requirement: Standard macOS Menu Role Parity
The Electron app SHALL preserve standard macOS menu role coverage while adding Wikiwise-specific File commands.

#### Scenario: App menu includes standard macOS roles
- **WHEN** the Electron application menu is created on macOS
- **THEN** the app menu includes About, Services, Hide, Hide Others, Show All, and Quit roles
- **AND** those roles are grouped with standard macOS separators

#### Scenario: Edit menu includes standard editing roles
- **WHEN** the Electron application menu is created
- **THEN** the menu bar includes an Edit menu
- **AND** the Edit menu includes Undo, Redo, Cut, Copy, Paste, Paste and Match Style, Delete, and Select All roles

#### Scenario: Window menu includes standard window roles
- **WHEN** the Electron application menu is created
- **THEN** the menu bar includes a Window menu
- **AND** the Window menu includes Minimize, Zoom, and Bring All to Front roles
- **AND** existing Wikiwise File commands and View fullscreen behavior are preserved

### Requirement: Refresh Page Selected File Reload
The Electron app SHALL handle the Refresh Page menu command for any selected source file the native app can select, not only Markdown files.

#### Scenario: Refresh Page command is selected for non-Markdown source
- **WHEN** the user selects Refresh Page while a non-Markdown source file is selected
- **THEN** Electron rereads the selected file content from disk
- **AND** Electron rerenders the selected file without adding a history entry

#### Scenario: Refresh Page command keeps Markdown preview behavior
- **WHEN** the user selects Refresh Page while a Markdown source file is selected
- **THEN** Electron continues to invalidate and refresh the selected Markdown preview
- **AND** the command remains routed through existing renderer project state

