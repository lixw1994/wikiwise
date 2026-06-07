## ADDED Requirements

### Requirement: Fixed Hub OAuth Callback Origin

The Cloudflare Hub SHALL support an optional fixed OAuth/OIDC callback origin that can be shared by all published wiki slugs.

#### Scenario: Fixed callback origin is configured

- **WHEN** a visitor starts OAuth sign-in from `https://<slug>-wiki.flybullet.net`
- **AND** the Hub is configured with a fixed OAuth callback origin
- **THEN** the provider authorization request uses `https://hub-wiki.flybullet.net/_wikiwise/auth/<provider>/callback` as the redirect URI
- **AND** the Hub stores the initiating wiki slug and safe return URL in OAuth state
- **AND** the callback completes authentication using that same fixed redirect URI during token exchange

#### Scenario: Fixed callback origin is not configured

- **WHEN** a visitor starts OAuth sign-in from `https://<slug>-wiki.flybullet.net`
- **AND** the Hub is not configured with a fixed OAuth callback origin
- **THEN** the provider authorization request uses the current wiki origin callback URL
- **AND** existing per-wiki callback deployments keep working

#### Scenario: Session created on fixed callback host is shared with wiki hosts

- **WHEN** OAuth callback succeeds through a fixed callback host under the configured public wiki domain
- **THEN** the Hub sets a secure HTTP-only session cookie scoped to the public wiki domain
- **AND** the user is redirected to the stored safe return URL for the initiating wiki
- **AND** subsequent requests to that wiki host can use the created session

#### Scenario: Operator reviews fixed callback setup documentation

- **WHEN** an operator configures OAuth providers for the Cloudflare Hub
- **THEN** the setup documentation lists the fixed Google, Feishu, and Lark callback URLs to register with providers
- **AND** the documentation identifies the Hub endpoint under the public wiki domain as the recommended callback origin
