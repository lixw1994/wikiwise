## ADDED Requirements

### Requirement: Watcher Selected Source Reload Parity

Electron live rebuild watching SHALL mirror native CSS and rebuild watcher behavior by reloading the selected non-Markdown source file from disk when the selected file has no unsaved draft.

#### Scenario: CSS watcher event while a non-Markdown source file is selected
- **WHEN** a watched event reports CSS changes
- **AND** the currently selected file is not Markdown
- **AND** the selected file has no unsaved draft
- **THEN** the renderer rereads the selected file from disk
- **AND** updates selected-file content, draft content, saved content, and clean state from that disk content
- **AND** refreshes selected-file INFO metadata
- **AND** does not request a Markdown compiled-preview refresh for that selected non-Markdown file

#### Scenario: Rebuild watcher event while a non-Markdown source file is selected
- **WHEN** a watched event reports a rebuild change
- **AND** the currently selected file is not Markdown
- **AND** the selected file has no unsaved draft
- **THEN** the renderer rescans the file tree
- **AND** rereads the selected file from disk
- **AND** refreshes selected-file INFO metadata
- **AND** does not request a Markdown compiled-preview refresh for that selected non-Markdown file

#### Scenario: Non-Markdown source file has an unsaved draft
- **WHEN** a watched CSS or rebuild event arrives while the selected non-Markdown file is dirty
- **THEN** Electron preserves the unsaved draft content
- **AND** does not replace it with disk content from the watcher event
