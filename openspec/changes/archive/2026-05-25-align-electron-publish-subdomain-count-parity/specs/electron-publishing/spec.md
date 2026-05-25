## ADDED Requirements

### Requirement: Publish Subdomain Character Count Parity
The Electron publish dialog SHALL use native-like character counting for local subdomain minimum-length feedback.

#### Scenario: Local invalid state uses character count
- **WHEN** the user edits the publish subdomain field
- **THEN** Electron determines the local three-character minimum from sanitized Unicode characters rather than JavaScript UTF-16 code units
- **AND** Electron keeps empty input as unknown
- **AND** Electron keeps shorter non-empty input as invalid
- **AND** availability feedback remains responsible for reporting longer unsupported names as invalid
