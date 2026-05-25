## ADDED Requirements

### Requirement: New Wiki Field Label Color Parity
The Electron create-new-wiki dialog SHALL render its field labels with the same sidebar text color used by the native SwiftUI sheet.

#### Scenario: New wiki field labels are inspected
- **WHEN** the Electron create-new-wiki dialog is rendered
- **THEN** the `Name` and `Location` labels use the native sidebar text color
- **AND** the labels keep the native 12px medium typography
- **AND** shared field label color remains available for non-new-wiki dialogs
