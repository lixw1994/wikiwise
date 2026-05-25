## ADDED Requirements

### Requirement: Right Sidebar Tab Header Divider Parity
The Electron right sidebar tab header SHALL render native top and bottom sidebar-rule dividers around the tab bar.

#### Scenario: Right sidebar tab header uses divider pair
- **WHEN** a project right sidebar is rendered
- **THEN** the right tab header has a 1px top divider using the sidebar-rule color
- **AND** it keeps the existing 1px bottom divider using the sidebar-rule color
- **AND** tab switcher alignment, tab padding, text styling, active tab styling, selected state, panel switching, terminal behavior, Info tab behavior, and sidebar resizing behavior are not changed for this requirement
