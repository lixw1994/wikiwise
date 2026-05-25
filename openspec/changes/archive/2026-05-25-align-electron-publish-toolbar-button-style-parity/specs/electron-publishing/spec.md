## ADDED Requirements

### Requirement: Publish Toolbar Button Style Parity
The Electron publish toolbar action SHALL render with the native compact publish badge styling.

#### Scenario: Toolbar publish action uses native badge styling
- **WHEN** a project toolbar is rendered
- **THEN** the publish action uses native monospaced 10px text, 0.8px tracking, selected foreground color, selected background fill, sidebar-rule border, 3px corner radius, and 4px by 10px padding
- **AND** shared icon toolbar button styling is not changed for this requirement
- **AND** publish labels, disabled state, help text, and dialog behavior are not changed for this requirement
