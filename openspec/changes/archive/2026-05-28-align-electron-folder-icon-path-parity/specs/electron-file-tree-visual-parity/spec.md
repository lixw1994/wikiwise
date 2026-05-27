## ADDED Requirements

### Requirement: Folder Icon Path Parity

Electron file-tree folder icons SHALL render the same Paper 14-by-12 folder path as native SwiftUI `FolderIcon`.

#### Scenario: Folder rows are rendered
- **WHEN** Electron renders directory rows in the project file tree
- **THEN** each folder icon uses an SVG path matching the native Canvas move, curve, line, and close commands
- **AND** the path keeps native scaled dimensions, fill color, stroke color, and stroke width
- **AND** special `raw` and `site` folder icons render the native center dot inside the same SVG coordinate system
- **AND** folder row layout, typography, indentation, disclosure marker, selected-file styling, tooltips, and expansion behavior remain unchanged
