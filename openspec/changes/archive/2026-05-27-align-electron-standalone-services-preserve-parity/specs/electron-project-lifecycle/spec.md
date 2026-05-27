## MODIFIED Requirements

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
