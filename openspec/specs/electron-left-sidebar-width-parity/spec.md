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
