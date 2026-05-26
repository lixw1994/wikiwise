# electron-project-lifecycle Specification

## Purpose
TBD - created by archiving change migrate-electron-project-lifecycle. Update Purpose after archive.
## Requirements
### Requirement: Welcome Entry Points

The Electron app SHALL show a welcome state with entry points for creating a new wiki and opening an existing folder, matching the native app's first-step structure.

#### Scenario: No project is open

- **WHEN** the Electron app starts without an opened project
- **THEN** the renderer shows Wikiwise welcome copy
- **AND** it shows Create a New Wiki and Open Existing Folder actions
- **AND** Create a New Wiki opens the new-wiki scaffold dialog

### Requirement: Open Existing Folder or File

The Electron app SHALL let the user choose an existing directory or file through the operating system picker, SHALL initialize compiler state for wiki folders when compiler resources are available, and SHALL open newly created scaffolded wikis through the same project state path.

#### Scenario: User opens a folder

- **WHEN** the user chooses an existing directory
- **THEN** the Electron app records that directory as the current project root
- **AND** scans one level of visible project files
- **AND** displays the folder name in the app chrome
- **AND** if `wiki/home.md` exists, scans compiler metadata and compiles `home.html`

#### Scenario: User opens a file

- **WHEN** the user chooses an existing file
- **THEN** the Electron app records the parent directory as the current project root
- **AND** reads and displays the selected file content

#### Scenario: User creates a scaffolded wiki

- **WHEN** the user creates a new wiki from the welcome screen
- **THEN** the Electron app records the created directory as the current project root
- **AND** scans visible project files
- **AND** displays the created wiki name in the app chrome
- **AND** scans compiler metadata and compiles `wiki/home.md`

### Requirement: File Tree Selection

The Electron app SHALL render a file tree from the current project and allow selecting visible files.

#### Scenario: User selects a file

- **WHEN** the user selects a visible file in the Electron file tree
- **THEN** the selected file path is stored in renderer state
- **AND** the file content is displayed in the detail area

### Requirement: Phase Gap Disclosure

The Electron app SHALL not present deferred native features as complete during this phase.

#### Scenario: Deferred action is visible

- **WHEN** the renderer shows terminal, publishing, persistence, or menu affordances
- **THEN** the UI indicates those capabilities are coming in later OpenSpec phases

### Requirement: Standalone File Open Parity
The Electron app SHALL distinguish standalone-file opens from folder project opens using native SwiftUI file-open behavior.

#### Scenario: User opens a standalone file
- **WHEN** the user chooses an existing file
- **THEN** the Electron app records the file's parent directory as the current project root
- **AND** marks the project result as a standalone file
- **AND** reads and displays the selected file content
- **AND** leaves the file tree empty
- **AND** does not attach compiled wiki preview output to the selected file

#### Scenario: User opens a folder
- **WHEN** the user chooses an existing directory
- **THEN** the Electron app marks the project result as a folder
- **AND** retains the existing folder tree scan, `wiki/home.md` selection, compiler scan, and background compilation behavior
