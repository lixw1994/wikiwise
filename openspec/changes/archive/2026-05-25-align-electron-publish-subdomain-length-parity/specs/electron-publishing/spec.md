## ADDED Requirements

### Requirement: Publish Subdomain Input Length Parity
The Electron publish dialog SHALL preserve native subdomain input length behavior after sanitizing characters.

#### Scenario: Sanitized subdomain input is not renderer-truncated
- **WHEN** the user edits the publish subdomain field
- **THEN** Electron lowercases the value and removes unsupported characters like the native publish sheet
- **AND** Electron does not truncate the sanitized value to 48 characters in the renderer
- **AND** availability feedback remains responsible for reporting invalid length
