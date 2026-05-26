## ADDED Requirements

### Requirement: Left Sidebar Visibility Animation Parity
The Electron left file sidebar SHALL animate project layout changes when the toolbar control hides or restores the sidebar, matching the native SwiftUI toolbar restore timing.

#### Scenario: User toggles left sidebar visibility
- **WHEN** the user activates the project toolbar left-sidebar control
- **THEN** Electron transitions the project layout over 200ms ease-in-out while the detail area expands or contracts
- **AND** the hidden left-sidebar layout uses a zero-width left-sidebar track so the layout can interpolate from the visible sidebar width
- **AND** the detail pane and right sidebar remain assigned to their logical grid tracks while the left track is zero-width
- **AND** toolbar button labels, native affordance metadata, selected state, file-tree state, selected detail content, right-sidebar state, terminal behavior, saved width, and resizing behavior are unchanged
