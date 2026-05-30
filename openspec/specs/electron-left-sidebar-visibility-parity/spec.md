# electron-left-sidebar-visibility-parity Specification

## Purpose
Capture Electron parity for the native macOS left file sidebar visibility interaction, including hide/show behavior, detail layout expansion, project state preservation, and runtime audit evidence.
## Requirements
### Requirement: Toggleable Left File Sidebar
The Electron app SHALL let users hide and restore the left file sidebar for an opened project, matching the native macOS sidebar visibility interaction.

#### Scenario: User hides the left sidebar
- **WHEN** a project is open and the user activates the left-sidebar toolbar control
- **THEN** the left file sidebar is hidden
- **AND** the detail area expands into the space previously occupied by the left sidebar
- **AND** the current left-sidebar width is preserved for later restore
- **AND** the right sidebar remains in its current visible or hidden state

#### Scenario: User restores the left sidebar
- **WHEN** the left file sidebar is hidden and the user activates the left-sidebar toolbar control again
- **THEN** the left file sidebar is visible
- **AND** the previous left-sidebar width is restored
- **AND** the file tree shows the same selected file and compatible expanded folders as before hiding

### Requirement: State Preservation Across Sidebar Visibility
The Electron app SHALL preserve current project state while the left sidebar is hidden or restored.

#### Scenario: Sidebar toggles with a selected file
- **WHEN** a project has a selected file and expanded tree state
- **AND** the user hides and restores the left sidebar
- **THEN** the selected document remains loaded
- **AND** the selected tree row remains selected after restore
- **AND** the current detail mode remains unchanged

#### Scenario: Sidebar toggles while terminal is active
- **WHEN** the Terminal tab is active in the right sidebar
- **AND** the user hides or restores the left sidebar
- **THEN** the terminal remains mounted
- **AND** terminal resize behavior remains available through the existing right-sidebar terminal path

### Requirement: Runtime Audit Evidence
The Electron runtime audit SHALL verify left-sidebar visibility parity.

#### Scenario: Runtime audit toggles the left sidebar
- **WHEN** runtime audit captures an opened-project scenario
- **THEN** it activates the left-sidebar toolbar control to hide and restore the sidebar
- **AND** it records initial, hidden, and restored sidebar visibility
- **AND** it records detail width before and while the sidebar is hidden
- **AND** it fails if the sidebar does not hide, does not restore, or the detail area does not expand while hidden

### Requirement: Left Sidebar Visibility Animation Parity
The Electron left file sidebar SHALL animate project layout changes when the toolbar control hides or restores the sidebar, matching the Electron macOS toolbar restore timing.

#### Scenario: User toggles left sidebar visibility
- **WHEN** the user activates the project toolbar left-sidebar control
- **THEN** Electron transitions the project layout over 200ms ease-in-out while the detail area expands or contracts
- **AND** the hidden left-sidebar layout uses a zero-width left-sidebar track so the layout can interpolate from the visible sidebar width
- **AND** the detail pane and right sidebar remain assigned to their logical grid tracks while the left track is zero-width
- **AND** toolbar button labels, native affordance metadata, selected state, file-tree state, selected detail content, right-sidebar state, terminal behavior, saved width, and resizing behavior are unchanged
