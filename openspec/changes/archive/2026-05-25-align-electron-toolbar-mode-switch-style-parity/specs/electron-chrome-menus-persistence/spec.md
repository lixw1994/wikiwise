## ADDED Requirements

### Requirement: Toolbar Mode Switch Style Parity
The Electron opened-project toolbar SHALL render the File/Wiki mode switch with native compact segmented styling.

#### Scenario: File/Wiki mode switch uses native segmented styling
- **WHEN** a project toolbar is rendered
- **THEN** the File/Wiki mode buttons use native monospaced 10px text, 0.8px tracking, 4px by 10px padding, selected foreground color, muted inactive foreground color, selected background fill, sidebar-rule stroke, and 3px outer segment corners
- **AND** mode IDs, selected state, disabled state, and mode switching behavior are not changed for this requirement
- **AND** publish and icon toolbar controls are not changed for this requirement
