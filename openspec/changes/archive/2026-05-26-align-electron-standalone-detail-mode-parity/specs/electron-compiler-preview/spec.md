## ADDED Requirements

### Requirement: Wiki Mode Fallback Selection
The Electron renderer SHALL allow WIKI detail mode to remain selected for markdown files even when no compiled preview is currently available.

#### Scenario: Markdown file lacks compiled preview
- **WHEN** a markdown file is selected in WIKI detail mode
- **AND** the file has no compiled preview URL
- **THEN** the WIKI mode button remains selected
- **AND** the detail area displays the editor fallback instead of a blank preview

#### Scenario: Non-markdown file is selected
- **WHEN** a selected file is not markdown
- **THEN** the renderer selects FILE detail mode
- **AND** the detail area displays the editor
