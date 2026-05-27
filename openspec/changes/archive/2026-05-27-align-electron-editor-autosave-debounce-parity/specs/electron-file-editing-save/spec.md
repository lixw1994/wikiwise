## MODIFIED Requirements

### Requirement: Save Controls

The Electron renderer SHALL expose native-like save affordances for edited source files while matching native editor bridge save timing.

#### Scenario: Dirty file is saved

- **WHEN** a selected file has unsaved edits
- **THEN** the renderer enables a save control
- **AND** pressing `Mod-S` invokes the same save path
- **AND** the shared editor bridge debounce can persist edits after typing settles
- **AND** the renderer does not add a second delayed autosave after receiving a non-empty editor bridge payload
- **AND** save completion clears the dirty state

### Requirement: Editor Empty Change Save Guard

Electron editor bridge handling SHALL mirror native `EditorWebView` by ignoring empty editor content-change payloads before save state mutation and by saving non-empty bridge payloads without an additional renderer debounce.

#### Scenario: Empty editor bridge payload is received
- **WHEN** the renderer receives an empty editor content-changed payload for a selected file
- **THEN** the selected file draft content and dirty state are not changed for that payload
- **AND** no save is scheduled or started solely for that empty payload

#### Scenario: Non-empty editor bridge payload is received
- **WHEN** the renderer receives non-empty editor content for a selected file
- **THEN** the selected file draft content is updated from the payload
- **AND** dirty state and save state are updated
- **AND** the renderer starts the normal save path from that payload without scheduling an additional debounce timer
