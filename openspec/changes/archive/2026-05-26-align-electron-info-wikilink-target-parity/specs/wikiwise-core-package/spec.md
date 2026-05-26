## ADDED Requirements

### Requirement: Native-Compatible Document Info Wikilink Targets
The core document-info helper SHALL extract wikilink targets using the same raw target semantics as the native right sidebar.

#### Scenario: Raw wikilink target is requested
- **WHEN** JavaScript summarizes a markdown document containing a wikilink target with surrounding whitespace inside `[[` and `]]`
- **THEN** the document info includes the target exactly as written between the delimiters

#### Scenario: Exact duplicate wikilink targets are requested
- **WHEN** JavaScript summarizes a markdown document containing repeated identical raw wikilink targets
- **THEN** the document info includes that raw target once

#### Scenario: Trimmed-equivalent wikilink targets are requested
- **WHEN** JavaScript summarizes a markdown document containing multiple wikilink targets that differ only by surrounding whitespace
- **THEN** the document info keeps each distinct raw target in native encounter order
