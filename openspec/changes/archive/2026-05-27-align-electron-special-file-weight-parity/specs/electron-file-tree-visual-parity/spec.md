## ADDED Requirements

### Requirement: Special File Row Weight Parity

Electron file-tree rows for native special files SHALL render with the same medium typography weight as native SwiftUI.

#### Scenario: Special file rows are rendered
- **WHEN** Electron renders file-tree rows for `home.md`, `index.md`, or `log.md`
- **THEN** those rows use a medium font weight matching native SwiftUI `.medium`
- **AND** regular file rows remain regular weight
- **AND** file-tree indentation, selected accent, serif typography, and special filename membership remain unchanged
