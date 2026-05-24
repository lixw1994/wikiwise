## ADDED Requirements

### Requirement: Draggable Right Sidebar Width
The Electron app SHALL let users resize the right sidebar by dragging its left edge, matching the native macOS right-sidebar interaction.

#### Scenario: User drags the right sidebar handle wider
- **WHEN** a project is open and the user drags the right-sidebar left-edge handle leftward
- **THEN** the right sidebar width increases
- **AND** the project detail area gives up the corresponding width
- **AND** the right sidebar remains visible

#### Scenario: User drags the right sidebar handle narrower
- **WHEN** a project is open and the user drags the right-sidebar left-edge handle rightward
- **THEN** the right sidebar width decreases
- **AND** it does not shrink below 200px

### Requirement: Native Width Constraints
The Electron right sidebar SHALL use the same width constraints as the native macOS app.

#### Scenario: Project shell is first opened
- **WHEN** a project is opened in the Electron app
- **THEN** the right sidebar starts at 360px when viewport constraints allow

#### Scenario: Resize exceeds maximum
- **WHEN** a user drags the right sidebar beyond half of the project viewport
- **THEN** the right sidebar width is clamped to at most half of the project viewport

### Requirement: Terminal Refit After Sidebar Resize
The Electron terminal SHALL refit after right-sidebar width changes.

#### Scenario: Right sidebar is resized while terminal tab is active
- **WHEN** the right sidebar width changes
- **THEN** the xterm surface is fitted to the new sidebar width
- **AND** the terminal resize IPC is sent with the current columns and rows

### Requirement: Runtime Audit Evidence
The Electron runtime audit SHALL verify right-sidebar resize behavior.

#### Scenario: Runtime audit drags the right sidebar
- **WHEN** runtime audit captures an opened-project scenario
- **THEN** it simulates dragging the right-sidebar resize handle
- **AND** it records the initial and resized right-sidebar widths
- **AND** it fails if the width does not change or violates native constraints
