## ADDED Requirements

### Requirement: Toolbar Navigation Arrow Style Parity
The Electron opened-project Back and Forward toolbar arrows SHALL match the native SwiftUI text-arrow typography and disabled color behavior.

#### Scenario: Back and Forward arrows use native text styling
- **WHEN** a project toolbar is rendered
- **THEN** Back and Forward render as monospaced 16px regular-weight text arrows
- **AND** enabled Back and Forward arrows use the toolbar text color
- **AND** disabled Back and Forward arrows use the toolbar disabled color without additional opacity reduction
- **AND** navigation history behavior, disabled attributes, titles, aria labels, menu command routing, toolbar group spacing, project title offset behavior, and project layout are not changed for this requirement
