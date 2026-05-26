## ADDED Requirements

### Requirement: Markdown Detail Mode Selection Persistence
The Electron renderer SHALL preserve the current FILE/WIKI detail mode when a user selects another Markdown file after the initial project or standalone-file selection, matching native SwiftUI navigation behavior.

#### Scenario: Markdown file is selected while FILE mode is active
- **WHEN** a project is open with a Markdown file selected in FILE mode
- **AND** the user selects a different Markdown file
- **THEN** Electron keeps FILE mode selected for the newly selected Markdown file
- **AND** it displays the source editor for the newly selected Markdown file

#### Scenario: Markdown file is selected while WIKI mode is active
- **WHEN** a project is open with a Markdown file selected in WIKI mode
- **AND** the user selects a different Markdown file
- **THEN** Electron keeps WIKI mode selected for the newly selected Markdown file
- **AND** it displays the compiled preview when available or the native editor fallback when no compiled preview is available

#### Scenario: Initial Markdown selection still starts in WIKI mode
- **WHEN** Electron applies the first selected Markdown file for a project open, created wiki, or standalone Markdown file
- **THEN** it starts from WIKI detail mode to match the native initial `.compiled` state
