## ADDED Requirements

### Requirement: Native Detail Empty State
The Electron detail pane SHALL render the native empty-state placeholder when no selected file, generated page, or post-create guide is active.

#### Scenario: No detail content is selected
- **WHEN** an Electron project is open without a selected file or generated page
- **THEN** the detail pane shows a centered `doc.text` native-symbol placeholder
- **AND** it shows the copy `Select a file to read`
- **AND** the placeholder uses native muted sidebar color, 8px vertical spacing, 32px light icon styling, 13px text, and content background
- **AND** editor, preview, generated-page, post-create guide, hidden save chrome, toolbar, file tree, and right-sidebar behavior are unchanged
