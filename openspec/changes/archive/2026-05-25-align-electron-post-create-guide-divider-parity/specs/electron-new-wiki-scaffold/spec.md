## ADDED Requirements

### Requirement: Post-Create Guide Divider Parity
The Electron post-create guide SHALL render native-style section dividers between the same guide sections separated by SwiftUI `Divider()` rows.

#### Scenario: Post-create guide dividers are inspected
- **WHEN** Electron shows the post-create guide after creating a wiki
- **THEN** the guide renders three dividers between the title summary, agent quick-start, seed options, and final guidance sections
- **AND** each divider uses the native sidebar rule color
- **AND** each divider is constrained to the native guide content column
- **AND** existing guide copy, command rendering, seed options, summary/title styling, and dismiss behavior are preserved
