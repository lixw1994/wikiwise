## ADDED Requirements

### Requirement: OAuth Callback Session Creation

The Cloudflare Hub SHALL complete configured OAuth/OIDC callbacks by creating or updating Hub users, linking provider accounts, and starting Hub-owned sessions.

#### Scenario: OAuth callback succeeds

- **WHEN** a user returns to `/_wikiwise/auth/<provider>/callback` with a valid authorization code and unexpired state
- **THEN** the Hub exchanges the code with the configured provider
- **AND** the Hub resolves a stable provider subject from the provider profile
- **AND** the Hub creates or updates the matching Hub user and provider account link
- **AND** the Hub creates a session for that user
- **AND** the Hub sets a secure HTTP-only session cookie
- **AND** the Hub redirects the user to the stored safe return URL

#### Scenario: OAuth state is invalid

- **WHEN** a callback omits state, uses an unknown state, uses an expired state, or uses a state created for a different provider
- **THEN** the Hub rejects the callback
- **AND** no user, provider account, or session is created
- **AND** no session cookie is set

#### Scenario: Provider profile is incomplete

- **WHEN** the provider token exchange succeeds but the profile does not contain a stable provider subject
- **THEN** the Hub rejects the callback
- **AND** no session is created
- **AND** provider token or profile internals are not returned to the browser

#### Scenario: OAuth state is consumed

- **WHEN** a callback succeeds with a stored OAuth state
- **THEN** the Hub prevents that state from being reused
- **AND** a later callback with the same state does not create another session

### Requirement: Hub Session Lifecycle

The Cloudflare Hub SHALL manage app-owned sessions independently of provider tokens.

#### Scenario: Signed-in user requests profile

- **WHEN** a request to `/_wikiwise/me` includes a valid Hub session cookie
- **THEN** the Hub returns the signed-in user's public profile for that wiki realm
- **AND** the response includes the wiki visibility, auth realm, and membership role when present
- **AND** the response does not include session ids, provider tokens, OAuth state ids, or client secrets

#### Scenario: Session is expired or unknown

- **WHEN** a request uses an expired or unknown Hub session cookie
- **THEN** the Hub treats the request as signed out
- **AND** private wiki content and protected comment writes remain inaccessible

#### Scenario: User logs out

- **WHEN** a signed-in user logs out through the Hub
- **THEN** the Hub invalidates the current session record
- **AND** the Hub clears the browser session cookie
- **AND** subsequent requests with that cookie are treated as signed out

### Requirement: Private Wiki Owner Bootstrap

The Cloudflare Hub SHALL provide a minimal operator-controlled way for configured owner identities to access newly published private wikis.

#### Scenario: Configured owner signs in to a private wiki

- **WHEN** a user signs in through OAuth for a private wiki
- **AND** the provider profile email matches a configured Hub owner/admin allowlist
- **AND** the provider reports that email as verified
- **THEN** the Hub grants that user membership for the callback wiki
- **AND** the membership role is `owner`
- **AND** the user can read that private wiki after the callback completes

#### Scenario: Configured owner email is not verified by the provider

- **WHEN** a user signs in through OAuth for a private wiki
- **AND** the provider profile email matches a configured Hub owner/admin allowlist
- **AND** the provider does not report that email as verified
- **THEN** the Hub may create a user session
- **BUT** the Hub does not grant private wiki membership
- **AND** private wiki content remains forbidden for that user

#### Scenario: Non-owner signs in to a private wiki

- **WHEN** a user signs in through OAuth for a private wiki
- **AND** the provider profile email does not match the configured Hub owner/admin allowlist
- **THEN** the Hub may create a user session
- **BUT** the Hub does not grant private wiki membership
- **AND** private wiki content remains forbidden for that user

#### Scenario: Owner bootstrap is scoped to the callback wiki

- **WHEN** a configured owner signs in from one private wiki
- **THEN** the Hub grants membership only for that wiki
- **AND** access to another private wiki still requires explicit membership or a separate owner bootstrap through that wiki
