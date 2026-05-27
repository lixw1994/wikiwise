## ADDED Requirements

### Requirement: Native-Compatible Publish Conflict Retry Subdomain
The core package SHALL generate automatic first-publish conflict retry subdomains using native `Publisher.publish` retry semantics.

#### Scenario: Initial candidate uses wiki name and retry uses suffix only
- **WHEN** JavaScript publishes a project with no existing `publish.json`
- **AND** the first upload receives a `409` conflict that triggers an automatic first-publish retry
- **THEN** the initial generated subdomain includes the native project-name slug prefix
- **AND** the automatic retry subdomain is generated without the project-name prefix and contains only the six-character lowercase alphanumeric suffix
- **AND** the helper preserves the native retry limit and existing `subdomain_taken` failure after retry exhaustion

#### Scenario: Explicit or existing subdomains remain stable
- **WHEN** JavaScript publishes with an explicit subdomain or an existing publish config
- **THEN** the helper continues to use the requested or saved subdomain unless the user explicitly changes it
