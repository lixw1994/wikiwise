## ADDED Requirements

### Requirement: Publish Target Selection

The Electron app SHALL let users choose between the official Wikiwise publishing service and a self-hosted Cloudflare Hub.

#### Scenario: Official target is selected

- **WHEN** the user selects the official Wikiwise target
- **THEN** the existing `wiki-wise.com` publish flow remains available
- **AND** the app preserves the current official publish dialog behavior

#### Scenario: Cloudflare Hub target is selected

- **WHEN** the user selects the Cloudflare Hub target
- **THEN** the publish dialog collects Cloudflare Hub settings instead of an official `wiki-wise.com` subdomain
- **AND** the published URL is shown as `https://<slug>.wiki.flybullet.net`

### Requirement: Cloudflare Hub Publish Settings

The Electron app SHALL collect and persist the project settings needed to publish to a configured Cloudflare Hub.

#### Scenario: User configures Hub settings

- **WHEN** the user configures Cloudflare Hub publishing
- **THEN** the app records the Hub endpoint, publish token reference, wiki slug, visibility, auth realm, and comment policy
- **AND** the app does not store OAuth client secrets inside the wiki project

#### Scenario: Public/private visibility is selected

- **WHEN** the user publishes to the Cloudflare Hub
- **THEN** the user can select whether the wiki is public or private
- **AND** that setting is sent with the publish request

#### Scenario: Auth realm is selected

- **WHEN** the user publishes to the Cloudflare Hub
- **THEN** the user can select shared or per-wiki auth realm
- **AND** shared realm is described as sharing profile and comment identity across Hub wikis

#### Scenario: Comment policy is selected

- **WHEN** the user publishes to the Cloudflare Hub
- **THEN** the user can select disabled, login-required, or members-only comments
- **AND** the selected comment policy is sent with the publish request

### Requirement: Cloudflare Hub Publish Feedback

The Electron app SHALL show clear success and error feedback for Cloudflare Hub publishing.

#### Scenario: Hub publish succeeds

- **WHEN** a Cloudflare Hub publish completes successfully
- **THEN** the app shows the published Hub URL
- **AND** the app refreshes local publish state for the selected project

#### Scenario: Hub publish fails

- **WHEN** the Hub rejects a publish request
- **THEN** the app shows the Hub error message using the existing publish error surface
- **AND** publishing controls are re-enabled

### Requirement: Official Publish Compatibility

Adding Cloudflare Hub publishing SHALL NOT regress the existing official publish flow.

#### Scenario: Existing official publish config is opened

- **WHEN** a project contains an existing official publish config
- **THEN** the Electron app recognizes it as an official publish target
- **AND** existing official publish, availability, result, and unpublish behavior remains compatible
