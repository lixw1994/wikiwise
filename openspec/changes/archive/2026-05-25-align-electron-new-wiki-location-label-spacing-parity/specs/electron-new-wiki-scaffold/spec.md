## ADDED Requirements

### Requirement: New Wiki Location Label Spacing Parity
The Electron create-new-wiki dialog SHALL mirror the native sheet's 6px spacing between the `Location` label and the selected path row.

#### Scenario: New wiki location spacing is inspected
- **WHEN** the Electron create-new-wiki dialog is rendered
- **THEN** the `Location` label-to-path gap matches the native 6px field spacing
- **AND** the path keeps native system-font styling, muted color, and middle truncation
- **AND** the full selected path metadata remains available
- **AND** wiki creation continues to use the full selected location path
