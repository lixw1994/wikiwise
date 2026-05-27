## ADDED Requirements

### Requirement: Folder Row Trailing Padding Parity

Electron file-tree folder rows SHALL match the native SwiftUI folder-row trailing padding behavior.

#### Scenario: Folder and file rows are rendered
- **WHEN** Electron renders folder and file rows in the project file tree
- **THEN** folder rows omit the native file-row-only 8px trailing inset
- **AND** file rows keep the native 8px trailing inset
- **AND** row leading indentation, vertical padding, typography, selected-file accent alignment, folder icons, and expansion behavior remain unchanged
