## ADDED Requirements

### Requirement: Publish Subdomain Input Character Parity
The Electron publish dialog SHALL preserve native subdomain sanitizer character behavior before availability validation.

#### Scenario: Sanitized subdomain input preserves native letters and numbers
- **WHEN** the user edits the publish subdomain field
- **THEN** Electron lowercases the value like the native publish sheet
- **AND** Electron preserves Unicode letters, Unicode numbers, and hyphens like the native publish sheet
- **AND** Electron removes unsupported punctuation and symbols
- **AND** availability feedback remains responsible for reporting unsupported names as invalid
