## MODIFIED Requirements

### Requirement: Info Tab
The Electron right sidebar SHALL show selected-document metadata matching native INFO behavior.

#### Scenario: Markdown file is selected
- **WHEN** a markdown file is selected
- **THEN** the INFO tab shows the selected document path label, modified time label, and word count
- **AND** it shows directions from frontmatter when present
- **AND** it hides the directions section when directions are absent
- **AND** it shows unique wikilink targets found in the file
- **AND** it hides the linked section when wikilinks are absent
