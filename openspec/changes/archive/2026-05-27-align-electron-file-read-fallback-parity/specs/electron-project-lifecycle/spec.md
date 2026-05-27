## ADDED Requirements

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
