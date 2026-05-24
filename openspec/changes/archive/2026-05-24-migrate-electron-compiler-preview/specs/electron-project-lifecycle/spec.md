## MODIFIED Requirements

### Requirement: Open Existing Folder or File

The Electron app SHALL let the user choose an existing directory or file through the operating system picker and SHALL initialize compiler state for wiki folders when compiler resources are available.

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
