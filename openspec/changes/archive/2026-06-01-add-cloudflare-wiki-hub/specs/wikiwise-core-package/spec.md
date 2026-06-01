## ADDED Requirements

### Requirement: Target-Aware Publish Config

The core package SHALL support publish configuration that distinguishes official Wikiwise publishing from Cloudflare Hub publishing.

#### Scenario: Existing official publish config is loaded

- **WHEN** a project contains the current official `publish.json` shape with `subdomain`, `token`, and `url`
- **THEN** the core package treats it as an official publish config
- **AND** existing callers can continue to publish through the official service

#### Scenario: Cloudflare Hub publish config is loaded

- **WHEN** a project contains Cloudflare Hub publish settings
- **THEN** the core package returns the Hub endpoint, wiki slug, visibility, auth realm, comment policy, and published URL
- **AND** malformed Hub configs are rejected with stable publish config errors

### Requirement: Cloudflare Hub Publish Payload

The core package SHALL prepare compiled wiki output for Cloudflare Hub publishing.

#### Scenario: Hub payload is prepared

- **WHEN** the core package prepares a Cloudflare Hub publish payload from a compiled site folder
- **THEN** static files are included as path/data entries
- **AND** root home rewrite behavior remains consistent with existing publishing
- **AND** wiki settings are included with the payload

#### Scenario: Hub publish excludes local secrets

- **WHEN** a Cloudflare Hub publish payload is prepared
- **THEN** OAuth client secrets, session secrets, and local-only credentials are not included in the payload

### Requirement: Cloudflare Hub Publish API Client

The core package SHALL expose helpers for publishing compiled wiki output to a Cloudflare Hub.

#### Scenario: Wiki is published to Hub

- **WHEN** JavaScript calls the Cloudflare Hub publish helper with a project root, site folder, Hub endpoint, publish token, wiki slug, and wiki settings
- **THEN** the helper sends the publish request to the Hub
- **AND** saves local publish config after success
- **AND** returns the published URL and uploaded file count

#### Scenario: Hub publish errors are mapped

- **WHEN** the Hub returns auth, validation, payload-size, rate-limit, or server errors
- **THEN** the helper rejects with stable error codes suitable for Electron error feedback
