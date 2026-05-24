## ADDED Requirements

### Requirement: Welcome Entry Points

The Electron app SHALL show a welcome state with entry points for creating a new wiki and opening an existing folder, matching the native app's first-step structure.

#### Scenario: No project is open

- **WHEN** the Electron app starts without an opened project
- **THEN** the renderer shows Wikiwise welcome copy
- **AND** it shows Create a New Wiki and Open Existing Folder actions
- **AND** Create a New Wiki is clearly deferred until the scaffold migration phase

### Requirement: Open Existing Folder or File

The Electron app SHALL let the user choose an existing directory or file through the operating system picker.

#### Scenario: User opens a folder

- **WHEN** the user chooses an existing directory
- **THEN** the Electron app records that directory as the current project root
- **AND** scans one level of visible project files
- **AND** displays the folder name in the app chrome

#### Scenario: User opens a file

- **WHEN** the user chooses an existing file
- **THEN** the Electron app records the parent directory as the current project root
- **AND** reads and displays the selected file content

### Requirement: File Tree Selection

The Electron app SHALL render a file tree from the current project and allow selecting visible files.

#### Scenario: User selects a file

- **WHEN** the user selects a visible file in the Electron file tree
- **THEN** the selected file path is stored in renderer state
- **AND** the file content is displayed in the detail area

### Requirement: Phase Gap Disclosure

The Electron app SHALL not present deferred native features as complete during this phase.

#### Scenario: Deferred action is visible

- **WHEN** the renderer shows Create a New Wiki or compiled preview affordances
- **THEN** the UI indicates those capabilities are coming in later OpenSpec phases
