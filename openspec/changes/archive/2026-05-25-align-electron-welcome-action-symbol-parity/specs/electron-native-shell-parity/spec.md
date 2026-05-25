## ADDED Requirements

### Requirement: Welcome Action Symbol Parity
The Electron no-folder welcome actions SHALL expose the same native action symbol semantics as the SwiftUI welcome buttons.

#### Scenario: Welcome actions are inspected
- **WHEN** the Electron welcome view is rendered
- **THEN** the Create a New Wiki action exposes a `plus.circle` native-symbol marker before its label
- **AND** the Open Existing Folder action exposes a `folder` native-symbol marker before its label
- **AND** both welcome action labels remain unchanged
- **AND** the create/open action IDs and behaviors remain available for the existing welcome flows
