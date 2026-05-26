## MODIFIED Requirements

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
