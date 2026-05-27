## ADDED Requirements

### Requirement: File Tree Row Typography Parity

Electron file-tree folder and file row labels SHALL render with the same native 13px regular serif typography as SwiftUI, while preserving native medium weight for special file rows.

#### Scenario: File-tree rows are rendered
- **WHEN** Electron renders folder rows in the project file tree
- **THEN** their labels use 13px regular serif typography matching native SwiftUI
- **AND** regular file labels use 13px regular serif typography matching native SwiftUI
- **AND** `home.md`, `index.md`, and `log.md` continue to use the native medium special-file weight
- **AND** file-tree indentation, row padding, selected-row italic styling, selected accent, folder icons, and expansion behavior remain unchanged
