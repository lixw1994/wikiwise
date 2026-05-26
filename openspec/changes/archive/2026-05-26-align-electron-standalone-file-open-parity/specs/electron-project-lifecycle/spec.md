## ADDED Requirements

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
