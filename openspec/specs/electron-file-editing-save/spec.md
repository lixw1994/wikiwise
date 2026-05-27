# electron-file-editing-save Specification

## Purpose
Define Electron file editing and save behavior, including source editor integration, path-safe writes, markdown recompilation, and native-compatible editor parity boundaries.

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

The file editing/save phase SHALL no longer list CodeMirror editor parity as a deferred native editor gap after Electron adopts the shared editor resource.

#### Scenario: Source editing is available

- **WHEN** Electron allows editing and saving files
- **THEN** the phase verification records that CodeMirror editor resource parity is implemented
- **AND** any remaining editor gaps are limited to later accepted deviations or explicitly tracked follow-up changes

### Requirement: Save Active File Side-Effect Parity

Electron save operations SHALL preserve the native `.claude/active-file` directory side-effect boundary.

#### Scenario: Saving outside a scaffolded project does not create agent metadata
- **WHEN** Electron saves a selected file whose project root does not contain `.claude`
- **THEN** the file contents are saved through the normal save path
- **AND** Electron does not create `.claude` solely to update `.claude/active-file`

#### Scenario: Saving inside a scaffolded project records active file
- **WHEN** Electron saves a selected file whose project root already contains `.claude`
- **THEN** the file contents are saved through the normal save path
- **AND** `.claude/active-file` records the saved file path relative to the project root
