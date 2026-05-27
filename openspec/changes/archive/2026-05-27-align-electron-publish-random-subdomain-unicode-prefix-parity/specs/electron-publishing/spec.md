## ADDED Requirements

### Requirement: First Publish Generated Subdomain Prefix Parity
The Electron app SHALL display first-publish generated subdomain candidates whose shared-core prefix behavior matches native `Publisher.randomSubdomain(wikiName:)`.

#### Scenario: Unicode project name generates candidate
- **WHEN** the first-publish dialog is opened for a project whose name contains retained supplementary-plane Unicode letters or numbers
- **THEN** the generated subdomain candidate keeps the native-compatible first 20 sanitized characters before the random suffix
- **AND** the suffix remains a hyphen plus six lowercase alphanumeric characters

#### Scenario: Generated candidate remains source-aligned
- **WHEN** native `Publisher.randomSubdomain(wikiName:)` defines `.prefix(20)` truncation after filtering
- **THEN** Electron/shared publish tests retain assertions that shared candidate generation truncates by characters instead of UTF-16 code units
