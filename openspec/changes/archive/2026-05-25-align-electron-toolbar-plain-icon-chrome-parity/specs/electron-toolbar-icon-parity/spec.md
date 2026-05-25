## ADDED Requirements

### Requirement: Toolbar Plain Icon Chrome Parity
The Electron opened-project icon-only toolbar controls SHALL match native SwiftUI `.buttonStyle(.plain)` chrome by avoiding custom bordered rounded button styling.

#### Scenario: Icon-only toolbar controls use plain chrome
- **WHEN** a project toolbar is rendered
- **THEN** Electron icon-only toolbar controls do not draw a border
- **AND** Electron icon-only toolbar controls do not add rounded rectangle chrome
- **AND** mode segmented controls and the publish action keep their explicit native rounded rectangle chrome
- **AND** toolbar symbol names, icon sizes, color states, accessible labels, click behavior, toolbar group spacing, sidebar layout behavior, and project title offset behavior are not changed for this requirement
