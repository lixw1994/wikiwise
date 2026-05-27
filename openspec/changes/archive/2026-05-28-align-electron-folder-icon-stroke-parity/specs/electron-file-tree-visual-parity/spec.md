## ADDED Requirements

### Requirement: Folder Icon Stroke Weight Parity

Electron file-tree folder icons SHALL use the same native scaled stroke width as SwiftUI `FolderIcon(size: 13)`.

#### Scenario: Folder rows are rendered
- **WHEN** Electron renders a directory row in the project file tree
- **THEN** the folder icon body stroke width matches native `0.8 * 13 / 14`
- **AND** the folder icon tab stroke width matches native `0.8 * 13 / 14`
- **AND** special `raw` and `site` folder icons keep their special stroke color with the same stroke width
- **AND** folder icon aspect, special marker geometry, folder row typography, disclosure marker, indentation, and expansion behavior remain unchanged
