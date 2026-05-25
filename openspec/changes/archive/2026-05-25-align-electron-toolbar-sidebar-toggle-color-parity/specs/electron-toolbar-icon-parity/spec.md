## ADDED Requirements

### Requirement: Sidebar Toolbar Toggle Color Parity
The Electron sidebar toolbar toggle controls SHALL match the native SwiftUI plain-icon foreground color states instead of using selected-button chrome.

#### Scenario: Sidebar toolbar toggles use native color states
- **WHEN** a project toolbar is rendered
- **THEN** visible sidebar toggles use the toolbar text color with a transparent background
- **AND** hidden sidebar toggles use the toolbar disabled color
- **AND** sidebar toolbar toggles do not use sidebar selected background or selected text colors for their visible state
- **AND** sidebar toggle symbol names, titles, aria labels, `aria-pressed` state, click behavior, sidebar layout behavior, and toolbar title offset behavior are not changed for this requirement
