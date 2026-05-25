## ADDED Requirements

### Requirement: New Wiki Location Path Color Parity
The Electron create-new-wiki dialog SHALL render the selected location path with the same muted sidebar text color used by the native SwiftUI sheet.

#### Scenario: New wiki location path color is inspected
- **WHEN** the Electron create-new-wiki dialog displays the selected location path
- **THEN** the path uses the native muted sidebar text color
- **AND** the path keeps native system-font styling, spacing, and middle truncation
- **AND** shared muted text color remains available for non-new-wiki surfaces
