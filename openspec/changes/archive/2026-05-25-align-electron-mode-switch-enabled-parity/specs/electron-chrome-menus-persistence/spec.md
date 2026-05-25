## ADDED Requirements

### Requirement: Toolbar Mode Switch Enabled Parity
The Electron opened-project FILE/WIKI toolbar mode controls SHALL remain enabled like the native SwiftUI toolbar buttons.

#### Scenario: FILE/WIKI toolbar controls remain enabled
- **WHEN** a project toolbar is rendered
- **THEN** the FILE mode control is not disabled
- **AND** the WIKI mode control is not disabled
- **AND** selecting WIKI without an available compiled preview falls back to the source editor instead of showing a blank pane
- **AND** the WIKI segment remains selected whenever Wiki mode is selected, even while source fallback is shown
- **AND** generated page rendering remains prioritized over source or compiled detail modes
- **AND** mode labels, segmented styling, click handlers, project toolbar controls, navigation disabled states, and generated page navigation behavior are not changed for this requirement
