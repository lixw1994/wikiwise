## MODIFIED Requirements

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

## ADDED Requirements

### Requirement: Open Existing Picker Title Parity
The Electron Open Existing picker SHALL preserve native message-only dialog chrome.

#### Scenario: Open existing picker is configured
- **WHEN** the Electron main process opens the Open Existing picker
- **THEN** the dialog message matches the native SwiftUI `NSOpenPanel` message
- **AND** the dialog does not set an explicit title override
- **AND** folder/file constraints, allowed extensions, and single-selection behavior remain unchanged
