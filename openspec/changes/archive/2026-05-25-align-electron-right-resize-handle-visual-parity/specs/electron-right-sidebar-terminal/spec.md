## ADDED Requirements

### Requirement: Right Sidebar Resize Handle Visual Parity
The Electron right-sidebar resize handle SHALL visually match the native macOS transparent resize overlay while preserving the existing resize interaction.

#### Scenario: Right sidebar resize handle remains visually transparent
- **WHEN** a project right sidebar is rendered
- **THEN** the resize handle uses a 5px leading-edge hit target with a column-resize cursor
- **AND** the base handle background is transparent
- **AND** hover and focus-visible states remain visually transparent
- **AND** the handle does not use the generic resize hover fill
- **AND** right-sidebar width dragging, tab selection, terminal behavior, Info tab behavior, and layout constraints are not changed for this requirement
