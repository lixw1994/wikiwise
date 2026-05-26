## ADDED Requirements

### Requirement: Right Sidebar Visibility Animation Parity
The Electron right sidebar SHALL animate project layout changes when the toolbar control hides or restores the right sidebar, matching the native SwiftUI toolbar toggle timing.

#### Scenario: User toggles right sidebar visibility
- **WHEN** the user activates the project toolbar right-sidebar control
- **THEN** Electron transitions the project layout over 200ms ease-in-out while the detail area expands or contracts
- **AND** the hidden right-sidebar layout uses a zero-width right-sidebar track so the layout can interpolate from the visible sidebar width
- **AND** toolbar button labels, selected state, right-sidebar tab state, terminal behavior, Info tab behavior, saved width, and resizing behavior are unchanged
