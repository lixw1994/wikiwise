## ADDED Requirements

### Requirement: Resizable Right Sidebar Surface
The Electron right-sidebar surface SHALL include native resize behavior for both Info and Terminal tabs.

#### Scenario: User resizes right sidebar on terminal tab
- **WHEN** the Terminal tab is active and the user drags the right-sidebar resize handle
- **THEN** the sidebar width updates without changing the active tab
- **AND** the terminal stays mounted and visible

#### Scenario: User resizes right sidebar on info tab
- **WHEN** the Info tab is active and the user drags the right-sidebar resize handle
- **THEN** the sidebar width updates without changing the active tab
- **AND** document metadata remains visible when a document is selected
