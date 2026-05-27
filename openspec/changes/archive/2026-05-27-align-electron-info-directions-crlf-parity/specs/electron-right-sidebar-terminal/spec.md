## ADDED Requirements

### Requirement: Info Directions CRLF Visibility Parity
The Electron INFO tab SHALL show or hide directions using shared document-info parsing that matches native `RightSidebar.parseDirections(from:)` newline handling.

#### Scenario: CRLF frontmatter directions are present
- **WHEN** a selected markdown document contains CRLF frontmatter with `directions:`
- **THEN** the Electron INFO tab hides the `DIRECTIONS` section like the native macOS app
- **AND** document metadata, wikilinks, tab switching, terminal behavior, and right-sidebar styling remain unchanged

#### Scenario: Directions parsing remains source-aligned
- **WHEN** native `RightSidebar.parseDirections(from:)` splits text with `separator: "\n"` and compares marker lines exactly to `---`
- **THEN** Electron/shared tests retain assertions that shared document-info parsing preserves CR characters instead of normalizing CRLF before marker comparison
