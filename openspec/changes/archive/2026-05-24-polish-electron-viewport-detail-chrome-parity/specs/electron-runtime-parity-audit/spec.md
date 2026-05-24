## ADDED Requirements

### Requirement: Viewport And Detail Chrome Evidence
The Electron runtime parity audit SHALL retain evidence that project scenarios are bounded to the viewport and do not show non-native detail chrome.

#### Scenario: Project runtime evidence is captured
- **WHEN** the runtime audit captures an opened-project scenario
- **THEN** the report includes project shell rectangle dimensions
- **AND** the report includes detail header visibility evidence
- **AND** the report includes whether selected filename/save status/Save button chrome appears in visible body text

#### Scenario: Project runtime evidence fails parity
- **WHEN** project shell height exceeds the viewport height or detail header chrome is visible
- **THEN** runtime audit fails the scenario
