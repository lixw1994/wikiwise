## ADDED Requirements

### Requirement: Native-Compatible Document Info

The core package SHALL expose helpers that summarize selected markdown document metadata for the Electron INFO tab.

#### Scenario: Markdown document info is requested

- **WHEN** JavaScript summarizes an existing markdown file
- **THEN** the result includes the file path, basename, modification timestamp, word count, directions frontmatter value when present, and unique wikilink targets

#### Scenario: Missing document info is requested

- **WHEN** JavaScript summarizes a missing file
- **THEN** the helper rejects the request instead of returning fabricated metadata
