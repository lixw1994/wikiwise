## ADDED Requirements

### Requirement: Publish Toolbar Busy Indicator Parity
The Electron publish toolbar action SHALL render a native-equivalent busy indicator while publishing work is in progress.

#### Scenario: Toolbar publish action shows busy indicator
- **WHEN** publishing or unpublishing is in progress
- **THEN** the publish toolbar action shows a 12px inline busy indicator before the `PUBLISHING…` label
- **AND** the busy indicator is hidden when the publish action is idle
- **AND** publish labels, disabled state, help text, badge styling, and dialog behavior are not changed for this requirement
