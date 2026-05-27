## ADDED Requirements

### Requirement: Editor Empty Change Save Guard

Electron editor bridge handling SHALL mirror native `EditorWebView` by ignoring empty editor content-change payloads before save state mutation.

#### Scenario: Empty editor bridge payload is received
- **WHEN** the renderer receives an empty editor content-changed payload for a selected file
- **THEN** the selected file draft content and dirty state are not changed for that payload
- **AND** no debounce save is scheduled solely for that empty payload

#### Scenario: Non-empty editor bridge payload is received
- **WHEN** the renderer receives non-empty editor content for a selected file
- **THEN** the selected file draft content is updated from the payload
- **AND** dirty state, save state, and debounce autosave behavior remain available
