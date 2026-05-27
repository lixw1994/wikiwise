## ADDED Requirements

### Requirement: Selected File Accent Height Parity

Electron selected file-tree rows SHALL render the leading accent as a full-height row overlay matching native SwiftUI.

#### Scenario: File row is selected
- **WHEN** Electron renders the selected file row in the project tree
- **THEN** the leading accent spans the full selected row background height
- **AND** the accent remains 2px wide
- **AND** the accent keeps the native leading offset aligned to `indent + 4`
- **AND** selected row background, italic label styling, row padding, typography, folder icons, and expansion behavior remain unchanged
