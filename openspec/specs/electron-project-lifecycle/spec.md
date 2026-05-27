# electron-project-lifecycle Specification

## Purpose
Define Electron project lifecycle behavior for opening folders/files, restoring recent projects, service boundaries for standalone files, and path-safe project IPC.
## Requirements
### Requirement: Welcome Entry Points

The Electron app SHALL show a welcome state with entry points for creating a new wiki and opening an existing folder, matching the native app's first-step structure.

#### Scenario: No project is open

- **WHEN** the Electron app starts without an opened project
- **THEN** the renderer shows Wikiwise welcome copy
- **AND** it shows Create a New Wiki and Open Existing Folder actions
- **AND** Create a New Wiki opens the new-wiki scaffold dialog

### Requirement: Open Existing Folder or File

The Electron app SHALL let the user choose an existing directory or markdown/plain-text file through the operating system picker, SHALL match the native SwiftUI open panel's message-only dialog chrome, folder/plain-text and single-selection contract, SHALL initialize compiler state for wiki folders when compiler resources are available, and SHALL open newly created scaffolded wikis through the same project state path.

#### Scenario: Open picker matches native allowed content

- **WHEN** the user opens the Electron "Open Existing" picker
- **THEN** the picker uses the native message copy `Choose a markdown file or a folder`
- **AND** the picker does not set an explicit dialog title because the current SwiftUI `NSOpenPanel` does not set `panel.title`
- **AND** the picker allows directory selection
- **AND** the picker allows file selection
- **AND** the picker is constrained to markdown/plain-text file extensions
- **AND** the picker does not advertise code, web asset, JSON, or all-file filters
- **AND** the picker does not allow multiple selections

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

### Requirement: Standalone Markdown Detail Mode Parity
Standalone files opened through Electron SHALL preserve the native SwiftUI initial compiled/WIKI detail mode selection while retaining editor fallback when no compiled preview exists or when the selected file type is not Markdown.

#### Scenario: User opens a standalone markdown file
- **WHEN** the user chooses an existing markdown file
- **THEN** Electron marks the project result as a standalone file
- **AND** the renderer selects WIKI detail mode to match the native initial `.compiled` state
- **AND** the renderer displays the file editor because no compiled standalone preview is attached
- **AND** the file tree remains empty

#### Scenario: User opens a standalone non-markdown text file
- **WHEN** the user chooses an existing non-markdown plain-text file
- **THEN** Electron marks the project result as a standalone file
- **AND** the renderer preserves the current WIKI detail mode that matches the native initial `.compiled` state
- **AND** the renderer displays the file editor because non-Markdown files always render in the editor

### Requirement: Open Existing Picker Title Parity
The Electron Open Existing picker SHALL preserve native message-only dialog chrome.

#### Scenario: Open existing picker is configured
- **WHEN** the Electron main process opens the Open Existing picker
- **THEN** the dialog message matches the native SwiftUI `NSOpenPanel` message
- **AND** the dialog does not set an explicit title override
- **AND** folder/file constraints, allowed extensions, and single-selection behavior remain unchanged
