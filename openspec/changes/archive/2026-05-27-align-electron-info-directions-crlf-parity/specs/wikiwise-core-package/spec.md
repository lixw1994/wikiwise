## ADDED Requirements

### Requirement: Native-Compatible Directions Newline Parsing
The core package SHALL extract INFO directions from markdown frontmatter using native `RightSidebar.parseDirections(from:)` newline and exact-marker behavior.

#### Scenario: LF frontmatter directions are extracted
- **WHEN** JavaScript summarizes a markdown document whose text starts with LF-delimited frontmatter marker lines exactly equal to `---`
- **THEN** a non-empty exact `directions:` value inside the opening marker is returned after trimming spaces

#### Scenario: CRLF marker lines are ignored
- **WHEN** JavaScript summarizes a markdown document whose frontmatter marker lines are CRLF-delimited and therefore retain `\r` when split by native LF semantics
- **THEN** directions are not returned
- **AND** the rest of the document metadata summary remains available
