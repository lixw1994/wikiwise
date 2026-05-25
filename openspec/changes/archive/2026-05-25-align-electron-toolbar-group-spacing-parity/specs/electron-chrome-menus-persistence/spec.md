## ADDED Requirements

### Requirement: Toolbar Group Spacing Parity
The Electron opened-project toolbar SHALL match native SwiftUI horizontal spacing for the left navigation and right primary action groups.

#### Scenario: Project toolbar groups use native spacing
- **WHEN** a project toolbar is rendered
- **THEN** the left navigation toolbar group uses 14px horizontal spacing between controls
- **AND** the right primary action toolbar group uses 10px horizontal spacing between controls
- **AND** toolbar controls, symbols, labels, disabled state, sidebar toggle state, project title offset behavior, menu command routing, and project layout are not changed for this requirement
