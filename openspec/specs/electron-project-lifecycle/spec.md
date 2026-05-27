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
The Electron app SHALL distinguish standalone-file opens from folder project opens using native SwiftUI file-open behavior, including preserving existing folder-owned services that native does not stop from the standalone-file branch.

#### Scenario: User opens a standalone file with no prior folder service
- **WHEN** the user chooses an existing file before any folder watcher or background compiler is running for the window
- **THEN** the Electron app records the file's parent directory as the current project root
- **AND** marks the project result as a standalone file
- **AND** reads and displays the selected file content
- **AND** leaves the file tree empty
- **AND** does not attach compiled wiki preview output to the selected file
- **AND** does not start project watcher or background compilation services for the file's parent directory

#### Scenario: User opens a standalone file after a folder
- **WHEN** the user chooses an existing file after the same window has already opened a folder project
- **THEN** the Electron app records the file's parent directory as the current project root
- **AND** marks the project result as a standalone file
- **AND** reads and displays the selected file content
- **AND** leaves the file tree empty
- **AND** does not attach compiled wiki preview output to the selected file
- **AND** preserves the previous folder-owned watcher and background compilation ownership until another folder replaces it or the window closes
- **AND** does not retarget those services to the standalone file's parent directory

#### Scenario: User opens a folder
- **WHEN** the user chooses an existing directory
- **THEN** the Electron app marks the project result as a folder
- **AND** retains the existing folder tree scan, `wiki/home.md` selection, compiler scan, and background compilation behavior
- **AND** replaces any previous folder-owned watcher and background compilation ownership for the window

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

### Requirement: Active File Side-Effect Parity

Electron project lifecycle operations SHALL preserve the native best-effort `.claude/active-file` side-effect boundary, including silent user-facing behavior when the side-effect write fails.

#### Scenario: Standalone file selection is recorded without creating agent metadata
- **WHEN** a user opens a standalone markdown or plain-text file whose parent directory does not contain `.claude`
- **THEN** Electron reads and displays the selected file
- **AND** Electron does not create `.claude` in the file's parent directory solely to record the active file

#### Scenario: Scaffolded project selection still records active file
- **WHEN** a user opens or creates a scaffolded wiki project that contains `.claude`
- **THEN** Electron continues to record the selected file at `.claude/active-file`
- **AND** the recorded path remains relative to the project root

#### Scenario: Active-file selection write fails
- **WHEN** the Electron renderer asks the main process to record the selected active file and that side-effect write rejects
- **THEN** the selected-file flow continues without surfacing a global renderer error
- **AND** main-process project-root and file-path validation remain unchanged

### Requirement: Selected File Read Fallback Parity
Electron project lifecycle content reads SHALL mirror native `ContentView.loadFile(_:)` by preserving selected file state and displaying the native fallback text when user-visible file content cannot be read.

#### Scenario: File-tree selection read fails
- **WHEN** Electron reads a selected file through the renderer file-selection path and the file content cannot be read
- **THEN** the read IPC returns `Could not read file.`
- **AND** the renderer can keep the file selected instead of treating the read failure as an open/select failure

#### Scenario: Initial selected file read fails
- **WHEN** Electron prepares the initial selected file for an opened standalone file or `wiki/home.md`
- **THEN** the selected file content uses the same native fallback text
- **AND** compiler setup, tree scanning, project kind, and active-file side effects remain unchanged

### Requirement: Standalone File History Preservation Parity

Electron project lifecycle behavior SHALL mirror native SwiftUI by preserving existing navigation history when a standalone-file project result is applied and by clearing navigation history when a folder project result is applied.

#### Scenario: User opens a standalone file after navigating in a project
- **WHEN** the Electron renderer already has back or forward navigation history
- **AND** the user opens a standalone markdown or plain-text file
- **THEN** Electron applies the standalone-file project result
- **AND** Electron preserves the existing back and forward history stacks
- **AND** this matches native `openURL(_:)`, whose standalone-file branch does not clear `backHistory` or `forwardHistory`

#### Scenario: User opens a folder project
- **WHEN** the Electron renderer applies a folder project result
- **THEN** Electron clears the existing back and forward history stacks
- **AND** this matches native `openURL(_:)`, whose folder branch clears both history stacks

#### Scenario: Standalone file open does not become a history push
- **WHEN** Electron applies a standalone-file project result
- **THEN** Electron does not push the previously selected file or generated page onto history as part of that project result
- **AND** ordinary in-project file and generated-page navigation history behavior remains unchanged

