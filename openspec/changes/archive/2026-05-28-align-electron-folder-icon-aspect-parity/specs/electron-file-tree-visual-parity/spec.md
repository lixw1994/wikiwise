## ADDED Requirements

### Requirement: Folder Icon Aspect Parity

Electron file-tree folder icons SHALL use the same native 13px-scaled 14-by-12 SVG aspect and special-folder marker geometry as SwiftUI `FolderIcon(size: 13)`.

#### Scenario: Folder rows are rendered
- **WHEN** Electron renders a directory row in the project file tree
- **THEN** the folder icon remains 13px wide
- **AND** the folder icon height matches native `13 * 12 / 14`
- **AND** special `raw` and `site` folder marker dots match the native scaled dot diameter
- **AND** special marker dots use the native scaled center point
- **AND** folder icon colors, folder row typography, disclosure marker, indentation, and expansion behavior remain unchanged
