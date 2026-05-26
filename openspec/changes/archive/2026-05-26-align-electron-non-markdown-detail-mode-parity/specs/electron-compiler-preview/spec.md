## MODIFIED Requirements

### Requirement: Wiki Mode Fallback Selection
The Electron renderer SHALL allow WIKI detail mode to remain selected when the selected file cannot currently render a compiled wiki preview, matching the native separation between selected detail mode and editor fallback rendering.

#### Scenario: Markdown file lacks compiled preview
- **WHEN** a markdown file is selected in WIKI detail mode
- **AND** the file has no compiled preview URL
- **THEN** the WIKI mode button remains selected
- **AND** the detail area displays the editor fallback instead of a blank preview

#### Scenario: Non-markdown file is selected
- **WHEN** a selected file is not markdown
- **THEN** the renderer preserves the current FILE/WIKI detail mode selection
- **AND** the detail area displays the editor because non-Markdown files cannot render compiled wiki previews
