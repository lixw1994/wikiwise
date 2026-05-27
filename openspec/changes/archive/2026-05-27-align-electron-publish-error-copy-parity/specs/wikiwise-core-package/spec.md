## ADDED Requirements

### Requirement: Native-Compatible Publish Error Copy
The core package SHALL expose native publish failure descriptions while preserving stable machine-readable error codes.

#### Scenario: Malformed publish config is rejected
- **WHEN** JavaScript loads a malformed `publish.json`
- **THEN** the helper rejects with the native corrupt-config description
- **AND** the helper preserves the existing corrupt-config error code

#### Scenario: Publish service returns mapped failure statuses
- **WHEN** JavaScript publishes or unpublishes and the service returns token mismatch, subdomain taken, rate-limited, or server failure responses
- **THEN** the helper rejects with the native description for the mapped failure where native defines a fixed description
- **AND** the helper preserves the existing stable error code for the mapped failure

#### Scenario: Upload is too large
- **WHEN** JavaScript publishes and the service returns an upload-too-large response body
- **THEN** the helper preserves the native behavior of using the service response body as the user-facing description
