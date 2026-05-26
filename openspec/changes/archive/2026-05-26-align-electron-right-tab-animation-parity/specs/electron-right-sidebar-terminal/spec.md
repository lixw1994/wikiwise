## ADDED Requirements

### Requirement: Right Sidebar Tab Animation Parity
The Electron right sidebar SHALL animate INFO/TERMINAL tab selection state changes with the same native timing as the SwiftUI right-sidebar tab switcher.

#### Scenario: User switches right-sidebar tabs
- **WHEN** the user changes the active right-sidebar tab between INFO and TERMINAL
- **THEN** Electron transitions the visible tab text color, active tab background, and active tab shadow with a 150ms ease-in-out animation
- **AND** right tab IDs, selected state, default Terminal tab, panel switching behavior, terminal behavior, Info tab behavior, and right sidebar resizing behavior are unchanged
