# electron-info-tab-conditional-parity Specification

## Purpose
Define Electron right-sidebar INFO optional-section rendering parity with the current SwiftUI macOS app.
## Requirements
### Requirement: Optional Info Sections
The Electron right-sidebar INFO tab SHALL match native SwiftUI conditional rendering for optional document sections.

#### Scenario: Markdown file has no directions
- **WHEN** a selected markdown file has no frontmatter `directions:` value
- **THEN** the INFO tab does not show the `DIRECTIONS` section
- **AND** it does not show placeholder text for missing directions

#### Scenario: Markdown file has directions
- **WHEN** a selected markdown file has a frontmatter `directions:` value
- **THEN** the INFO tab shows the `DIRECTIONS` section
- **AND** it displays that value

#### Scenario: Markdown file has no wikilinks
- **WHEN** a selected markdown file has no wikilinks
- **THEN** the INFO tab does not show the `LINKED` section
- **AND** it does not show placeholder text for missing links

#### Scenario: Markdown file has wikilinks
- **WHEN** a selected markdown file has one or more wikilinks
- **THEN** the INFO tab shows the `LINKED` section
- **AND** it displays unique wikilink targets
