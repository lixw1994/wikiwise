# electron-left-sidebar-width-parity Specification

## Purpose
Define Electron left file sidebar width constraints and resizing behavior that match the native SwiftUI split-view sidebar.
## Requirements
### Requirement: Native Left Sidebar Width Constraints
The Electron file sidebar SHALL match native SwiftUI left-sidebar width constraints.

#### Scenario: Project opens with native ideal sidebar width
- **WHEN** a project is open and the left sidebar is visible
- **THEN** the left sidebar width is `200px`

#### Scenario: User resizes the left sidebar
- **WHEN** the user drags the left-sidebar divider
- **THEN** the left sidebar width changes
- **AND** the width is clamped to a minimum of `110px`
- **AND** the width is clamped to a maximum of `360px`

#### Scenario: Sidebar width is preserved while hidden
- **WHEN** the user resizes the left sidebar and then hides it
- **THEN** the left sidebar is removed from layout
- **AND** restoring the sidebar restores the previous resized width

#### Scenario: Toolbar title follows resized sidebar
- **WHEN** the left sidebar width changes
- **THEN** the toolbar project title offset is recalculated from the current left-sidebar width

### Requirement: Left Sidebar Resize Handle Visual Parity
The Electron left-sidebar resize handle SHALL visually match the native macOS split-view sidebar divider while preserving existing resize behavior.

#### Scenario: Left sidebar resize handle remains visually transparent
- **WHEN** a project left sidebar is rendered
- **THEN** the sidebar keeps a 1px trailing divider using the sidebar-rule color
- **AND** the resize handle uses a 5px trailing-edge hit target with a column-resize cursor
- **AND** the base handle background is transparent
- **AND** hover and focus-visible states remain visually transparent
- **AND** the handle does not use the generic resize hover fill
- **AND** left-sidebar width constraints, hide/show behavior, toolbar-title offset behavior, file-tree behavior, right-sidebar behavior, and project layout are not changed for this requirement

### Requirement: Active Resize Transition Bypass
The Electron project shell SHALL bypass the sidebar visibility animation while a sidebar resize drag is active.

#### Scenario: User drags a sidebar resize handle
- **WHEN** the user is actively resizing the left or right sidebar
- **THEN** the project grid updates immediately without the 200ms visibility-toggle transition
- **AND** toolbar hide/show controls keep the native 200ms ease-in-out layout animation when no resize drag is active
- **AND** sidebar width constraints, toolbar title offset behavior, terminal refit behavior, and file tree behavior are unchanged
