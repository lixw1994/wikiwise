## ADDED Requirements

### Requirement: Info Non-Markdown Metadata Parity
The Electron INFO tab SHALL request and render selected-document metadata for non-Markdown selected files using the same selected-file scope as the native macOS right sidebar.

#### Scenario: Non-Markdown project file is selected
- **WHEN** a non-Markdown source file inside an opened project is selected
- **THEN** Electron requests document-info metadata for that selected file
- **AND** the INFO tab displays the selected file name, edited time, and word count when metadata is available
- **AND** directions and linked sections use the same metadata extraction and conditional visibility as Markdown selections

#### Scenario: Standalone text file is opened
- **WHEN** Electron opens a standalone text file
- **THEN** Electron requests document-info metadata for that selected file
- **AND** it does not start project watcher, terminal, publishing, or generated-map project services for the file's parent directory

#### Scenario: Non-Markdown selected file is saved
- **WHEN** a selected non-Markdown source file is saved
- **THEN** Electron refreshes the INFO metadata for the selected file
- **AND** compiled preview refresh behavior remains Markdown-only

#### Scenario: Non-Markdown selected file is manually refreshed
- **WHEN** Refresh Page reloads a selected non-Markdown source file from disk
- **THEN** Electron refreshes the INFO metadata for the selected file
- **AND** generated-page refresh behavior remains unchanged
