## ADDED Requirements

### Requirement: Publish Conflict Retry Subdomain Parity
The Electron app SHALL inherit native first-publish conflict retry subdomain behavior from the shared publish helper.

#### Scenario: First-publish conflict retry matches native
- **WHEN** Electron publishes a project with no saved `publish.json`
- **AND** the publish service reports a first-candidate `409` conflict that the shared helper retries automatically
- **THEN** the first generated candidate may use the project-name prefix
- **AND** the retry candidate is generated without the project-name prefix, matching native `Publisher.publish`
- **AND** publish dialog state, result feedback, error feedback, availability checks, and unpublish behavior remain unchanged

#### Scenario: Retry behavior remains source-aligned
- **WHEN** native `Publisher.publish` calls `randomSubdomain(wikiName: projectRoot.lastPathComponent)` initially and `randomSubdomain()` on `409` retry
- **THEN** Electron/shared tests retain assertions that the shared helper distinguishes the initial project-name candidate from the suffix-only retry candidate
