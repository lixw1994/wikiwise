## ADDED Requirements

### Requirement: Info Directions Parser Parity
The Electron INFO tab SHALL display directions only when core document-info extraction matches the native `RightSidebar.parseDirections` frontmatter rules.

#### Scenario: Native-compatible directions are displayed
- **WHEN** a selected markdown document has an exact opening `---` line and a frontmatter line beginning exactly with `directions:`
- **THEN** the INFO tab shows the `DIRECTIONS` section with the trimmed directions text

#### Scenario: Native-incompatible loose directions are hidden
- **WHEN** a selected markdown document only has directions in loose frontmatter that native `RightSidebar.parseDirections` ignores
- **THEN** the INFO tab hides the `DIRECTIONS` section
- **AND** the renderer does not display directions text that native macOS would omit

#### Scenario: Native-compatible loose closing delimiter behavior is preserved
- **WHEN** a selected markdown document has an exact opening frontmatter marker and a whitespace-padded `---` line before an exact `directions:` line
- **THEN** the INFO tab shows the `DIRECTIONS` section with the directions text native macOS would find
