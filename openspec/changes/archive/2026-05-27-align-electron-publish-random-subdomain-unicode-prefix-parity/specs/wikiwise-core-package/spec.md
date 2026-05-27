## ADDED Requirements

### Requirement: Native-Compatible Publish Subdomain Candidate
The core package SHALL generate random publish subdomain candidates with native `Publisher.randomSubdomain(wikiName:)` slug-prefix behavior.

#### Scenario: Wiki name candidate is generated
- **WHEN** JavaScript requests a random publish subdomain for a non-empty wiki name
- **THEN** the helper lowercases the name
- **AND** replaces spaces with hyphens
- **AND** removes characters other than Unicode letters, Unicode numbers, and hyphens
- **AND** truncates the sanitized slug to the first 20 native-compatible characters, not the first 20 UTF-16 code units
- **AND** appends a hyphen plus a six-character lowercase alphanumeric suffix

#### Scenario: Empty candidate uses suffix only
- **WHEN** JavaScript requests a random publish subdomain with no wiki name or with a name that sanitizes to an empty slug
- **THEN** the helper returns only a six-character lowercase alphanumeric suffix
