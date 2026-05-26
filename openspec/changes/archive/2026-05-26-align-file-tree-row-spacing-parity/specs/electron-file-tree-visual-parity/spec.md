## ADDED Requirements

### Requirement: File Tree Row Spacing Parity
The Electron file tree SHALL match the native SwiftUI zero-spacing layout between both root rows and expanded child rows.

#### Scenario: File tree row spacing is inspected
- **WHEN** the Electron project browser renders root file-tree rows
- **THEN** the root file-tree container has no inter-row grid gap beyond each row's native padding
- **AND** expanded child-row containers also have no inter-row grid gap
- **AND** row padding, indentation, disclosure icons, folder icons, selected-file accent, expansion behavior, and file navigation are unchanged
