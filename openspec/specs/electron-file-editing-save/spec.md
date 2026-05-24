# electron-file-editing-save Specification

## Purpose
TBD - created by archiving change migrate-electron-file-editing-save. Update Purpose after archive.
## Requirements
### Requirement: Editable Source Mode

The Electron renderer SHALL let users edit selected visible text files in File mode.

#### Scenario: User edits a selected file

- **WHEN** a visible text file is selected
- **THEN** File mode displays editable source content
- **AND** editing the source marks the selected file dirty
- **AND** the renderer keeps the draft content separate from the last saved content

### Requirement: Save Controls

The Electron renderer SHALL expose native-like save affordances for edited source files.

#### Scenario: Dirty file is saved

- **WHEN** a selected file has unsaved edits
- **THEN** the renderer enables a save control
- **AND** pressing `Mod-S` invokes the same save path
- **AND** debounce-save behavior can persist edits after typing settles
- **AND** save completion clears the dirty state

### Requirement: Save-Triggered Preview Refresh

Saving a markdown file in Electron SHALL refresh the compiled Wiki preview when compilation succeeds.

#### Scenario: Markdown edit is saved

- **WHEN** the renderer saves a markdown file
- **THEN** the main process writes the source content
- **AND** invalidates and recompiles the corresponding markdown page
- **AND** the renderer receives an updated compiled page result with a main-created file URL
- **AND** Wiki mode can show the refreshed compiled HTML

### Requirement: Deferred Native Editor Gaps

The file editing/save phase SHALL identify editor parity gaps that remain for later OpenSpec phases.

#### Scenario: Source editing is available

- **WHEN** Electron allows editing and saving files
- **THEN** the phase verification records that full CodeMirror parity, scroll preservation, and watcher-driven live rebuild remain deferred
