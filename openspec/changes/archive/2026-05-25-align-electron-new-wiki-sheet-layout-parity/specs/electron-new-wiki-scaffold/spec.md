## ADDED Requirements

### Requirement: New Wiki Sheet Layout Parity
The Electron create-new-wiki dialog SHALL match the native SwiftUI new-wiki sheet's core layout and typography.

#### Scenario: New wiki sheet is inspected
- **WHEN** the Electron create-new-wiki dialog is rendered
- **THEN** its panel uses the native 400px sheet width
- **AND** it uses the native 24px sheet padding
- **AND** it uses the native 20px vertical form spacing
- **AND** its title uses 16px semibold typography
- **AND** its field labels use 12px medium typography
- **AND** the existing name, location, choose, cancel, and create controls keep their IDs and labels
