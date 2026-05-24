## ADDED Requirements

### Requirement: Native Sidebar Header

The Electron project sidebar SHALL match the native SwiftUI sidebar header structure and styling.

#### Scenario: Project sidebar header is displayed

- **WHEN** a project is open and the left sidebar is visible
- **THEN** the sidebar displays a literal `FILES` header before the file tree
- **AND** the header uses regular monospaced typography with 9px font size and 1.6px letter spacing
- **AND** the header uses 18px horizontal padding, 6px top padding, and 10px bottom padding
- **AND** the sidebar content does not add extra top padding outside the header
- **AND** the file tree follows the header without an additional top margin
- **AND** the sidebar does not display a project-name heading
- **AND** the toolbar remains the project-name display location
