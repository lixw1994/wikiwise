## MODIFIED Requirements

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
