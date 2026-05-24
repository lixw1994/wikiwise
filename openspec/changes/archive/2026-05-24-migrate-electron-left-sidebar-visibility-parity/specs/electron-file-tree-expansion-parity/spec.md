## ADDED Requirements

### Requirement: File Tree State Across Sidebar Visibility
The Electron file tree SHALL preserve selection and expansion state when the left sidebar is hidden and restored.

#### Scenario: Expanded tree survives sidebar hide and restore
- **WHEN** the project tree has expanded folders and a selected nested file
- **AND** the user hides and restores the left sidebar
- **THEN** previously expanded folders that still exist remain expanded
- **AND** the selected file row remains selected after the sidebar is restored
