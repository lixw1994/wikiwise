## ADDED Requirements

### Requirement: Toolbar Icon Size Parity
The Electron opened-project icon-only toolbar controls SHALL match native SwiftUI symbol font sizes while preserving existing symbols and behavior.

#### Scenario: Icon-only toolbar controls use native symbol sizes
- **WHEN** a project toolbar is rendered
- **THEN** the appearance control uses a 13px icon size
- **AND** the 3D map control uses a 12px icon size
- **AND** the left sidebar restore control uses a 14px icon size
- **AND** the right sidebar toggle uses a 16px icon size
- **AND** Back/Forward arrow typography, toolbar group spacing, sidebar toggle color states, symbol names, titles, aria labels, click behavior, sidebar layout behavior, and project title offset behavior are not changed for this requirement
