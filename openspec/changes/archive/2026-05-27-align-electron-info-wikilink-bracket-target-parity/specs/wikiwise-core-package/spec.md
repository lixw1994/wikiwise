## ADDED Requirements

### Requirement: Native-Compatible Wikilink Bracket Target Parsing
The core package SHALL extract INFO wikilink targets using native `RightSidebar.wikilinkTargets(in:)` scanner semantics.

#### Scenario: Target contains a single closing bracket
- **WHEN** JavaScript summarizes a markdown document containing a wikilink such as `[[Alpha]Beta]]`
- **THEN** the linked target list includes `Alpha]Beta`
- **AND** duplicate occurrences of the same raw target are still returned only once

#### Scenario: Existing raw target behavior remains
- **WHEN** JavaScript summarizes wikilinks with raw whitespace or empty target text
- **THEN** non-empty raw targets preserve their original whitespace
- **AND** empty targets remain omitted
