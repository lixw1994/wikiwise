## ADDED Requirements

### Requirement: Info Wikilink Target Parser Parity
The Electron INFO tab SHALL display linked target rows from document metadata using native raw wikilink target semantics.

#### Scenario: Raw linked target row is displayed
- **WHEN** a selected markdown document contains a wikilink target with surrounding whitespace inside `[[` and `]]`
- **THEN** the INFO tab shows the `LINKED` section with the target text exactly as native macOS would render it

#### Scenario: Distinct raw linked targets are displayed
- **WHEN** a selected markdown document contains wikilink targets that differ only by surrounding whitespace
- **THEN** the INFO tab keeps distinct linked rows for each raw target in native encounter order
- **AND** exact duplicate raw targets are still displayed only once
