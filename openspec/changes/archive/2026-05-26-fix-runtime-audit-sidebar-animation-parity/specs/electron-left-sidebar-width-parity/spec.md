## ADDED Requirements

### Requirement: Active Resize Transition Bypass
The Electron project shell SHALL bypass the sidebar visibility animation while a sidebar resize drag is active.

#### Scenario: User drags a sidebar resize handle
- **WHEN** the user is actively resizing the left or right sidebar
- **THEN** the project grid updates immediately without the 200ms visibility-toggle transition
- **AND** toolbar hide/show controls keep the native 200ms ease-in-out layout animation when no resize drag is active
- **AND** sidebar width constraints, toolbar title offset behavior, terminal refit behavior, and file tree behavior are unchanged
