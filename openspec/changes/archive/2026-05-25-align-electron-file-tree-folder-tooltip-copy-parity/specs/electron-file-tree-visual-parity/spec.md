## ADDED Requirements

### Requirement: Native Folder Tooltip Copy
The Electron file tree SHALL expose native folder help text for directory row tooltips.

#### Scenario: Special top-level folders are displayed
- **WHEN** the Electron project tree renders `wiki`, `sources`, `raw`, or `site` folder rows
- **THEN** their row tooltips match the native SwiftUI `folderTooltip(_:)` strings
- **AND** `wiki`, `sources`, and `raw` tooltip copy uses the native em dash punctuation
- **AND** the `site` tooltip remains `Build tooling and compiled HTML output`
