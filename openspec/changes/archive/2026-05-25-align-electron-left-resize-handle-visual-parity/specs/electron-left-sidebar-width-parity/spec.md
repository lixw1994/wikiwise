## ADDED Requirements

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
