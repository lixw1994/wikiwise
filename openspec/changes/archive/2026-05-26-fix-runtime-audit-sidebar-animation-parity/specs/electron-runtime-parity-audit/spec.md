## ADDED Requirements

### Requirement: Animated Sidebar Layout Evidence Settlement
The Electron runtime audit SHALL measure sidebar visibility layout evidence after the native 200ms layout animation settles.

#### Scenario: Left-sidebar visibility evidence is captured
- **WHEN** the runtime audit activates the left-sidebar toolbar control
- **THEN** it waits longer than the native 200ms grid-template animation before recording hidden detail width and toolbar-title offset
- **AND** it waits again after restoring the sidebar before recording restored width and toolbar-title offset
- **AND** resize evidence, file-tree state evidence, toolbar affordance evidence, terminal evidence, and screenshot capture are unchanged

### Requirement: Resize Evidence Uses Immediate Drag Geometry
The Electron runtime audit SHALL be able to observe sidebar drag-resize geometry without the visibility animation delaying active drag measurements.

#### Scenario: Sidebar resize evidence is captured
- **WHEN** the runtime audit simulates left or right sidebar drag-resize
- **THEN** the active resize interaction updates project grid geometry without the sidebar visibility transition delaying the measured width
- **AND** the native toolbar hide/show transition remains enabled outside active resize gestures
