## ADDED Requirements

### Requirement: Native-Compatible Publish Config

The core package SHALL read and write native-compatible publish configuration.

#### Scenario: Publish config is loaded

- **WHEN** JavaScript loads publish config from a project root
- **THEN** missing config returns null
- **AND** valid config returns `subdomain`, `token`, `lastPublishedAt`, and `url`
- **AND** malformed config is rejected

### Requirement: Native-Compatible Publish Availability

The core package SHALL check wiki subdomain availability using the native service contract.

#### Scenario: Availability is checked

- **WHEN** JavaScript checks a subdomain
- **THEN** the helper calls the check endpoint with the subdomain query parameter
- **AND** an existing token is sent as bearer authorization when provided
- **AND** the helper maps service reasons to available, owned, taken, invalid, or unknown

### Requirement: Native-Compatible Publish Upload

The core package SHALL publish compiled site output using the native upload contract.

#### Scenario: Site is published

- **WHEN** JavaScript publishes a compiled site folder
- **THEN** files are sent as base64 path/data entries
- **AND** existing config is reused when present
- **AND** new config is created when missing
- **AND** `publish.json` is saved after success with a fresh `lastPublishedAt`

#### Scenario: Root home rewrite is applied

- **WHEN** a compiled site includes `home.html` and `index.html`
- **THEN** `home.html` is also uploaded as root `index.html`
- **AND** original `index.html` is uploaded as `catalog.html`
- **AND** HTML links to `index.html` are rewritten to `catalog.html`

#### Scenario: Publish errors are mapped

- **WHEN** the publish service returns native error status codes
- **THEN** token mismatch, subdomain taken, upload too large, rate limited, and server errors are rejected with stable error codes

### Requirement: Native-Compatible Unpublish

The core package SHALL unpublish a wiki using the native delete contract.

#### Scenario: Wiki is unpublished

- **WHEN** JavaScript unpublishes a project with valid publish config
- **THEN** the helper sends a DELETE request with bearer token and subdomain
- **AND** local `publish.json` is removed after successful or already-gone responses
