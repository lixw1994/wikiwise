# cloudflare-wiki-hub Specification

## Purpose
Define the self-hosted Cloudflare Hub runtime that receives Wikiwise publishes, serves multiple wiki slugs, owns application-level auth, and supports comments and annotations.

## Requirements
### Requirement: Cloudflare Hub Deployment Model

Wikiwise SHALL support a self-hosted Cloudflare Hub that is manually deployed once and can serve multiple published wikis.

#### Scenario: Hub serves wildcard wiki hostnames

- **WHEN** a request arrives for `https://<slug>.wiki.flybullet.net`
- **THEN** the Hub resolves `<slug>` from the hostname
- **AND** the Hub loads that wiki's metadata and access policy
- **AND** the Hub serves the matching wiki instead of the official Wikiwise hosting service

#### Scenario: Hub handles unknown wiki slugs

- **WHEN** a request arrives for a slug that has not been published
- **THEN** the Hub returns a not-found response
- **AND** no static files from another wiki are exposed

### Requirement: Hub Publish API

The Cloudflare Hub SHALL expose an authenticated publish API that receives compiled wiki output and wiki settings from Wikiwise.

#### Scenario: Wiki is published to the Hub

- **WHEN** Wikiwise publishes a compiled site to the Hub with a valid publish token
- **THEN** the Hub stores the static files for the requested wiki slug
- **AND** the Hub stores the wiki access configuration
- **AND** the Hub reports the public URL as `https://<slug>.wiki.flybullet.net`

#### Scenario: Publish token is missing or invalid

- **WHEN** a publish request omits the Hub publish token or sends an invalid token
- **THEN** the Hub rejects the request
- **AND** no wiki files or settings are updated

### Requirement: Wiki Access Configuration

Each Hub wiki SHALL have independently configurable visibility, auth realm, and comment policy.

#### Scenario: Public wiki is viewed

- **WHEN** a wiki has `visibility` set to `public`
- **THEN** anonymous users can read the wiki content
- **AND** comment write access is still governed by the wiki's comment policy

#### Scenario: Private wiki is viewed anonymously

- **WHEN** a wiki has `visibility` set to `private`
- **AND** the visitor does not have a valid session with access to the wiki
- **THEN** the Hub prompts the visitor to sign in
- **AND** protected wiki content is not served before authorization succeeds

#### Scenario: Shared auth realm is selected

- **WHEN** a wiki uses the shared auth realm
- **THEN** user profile and comment identity are shared across all Hub wikis
- **AND** per-wiki permissions still determine whether that shared user can access or comment on each wiki

#### Scenario: Per-wiki auth realm is selected

- **WHEN** a wiki uses a per-wiki auth realm
- **THEN** membership and comment identity are scoped to that wiki
- **AND** access to another wiki is not implied by signing in to this wiki

### Requirement: Hub-Owned OAuth/OIDC Authentication

The Hub SHALL own application-level authentication for published wikis instead of relying on Cloudflare Access as the primary auth layer.

#### Scenario: Google auth is configured

- **WHEN** Google auth is enabled for the Hub
- **THEN** users can sign in through the Hub-owned Google OIDC flow
- **AND** the resulting user identity is stored in the Hub user model

#### Scenario: Feishu or Lark auth is configured

- **WHEN** Feishu or Lark auth is enabled for the Hub
- **THEN** users can sign in through a Hub-owned OIDC-compatible flow
- **AND** the resulting user identity is stored in the Hub user model

#### Scenario: Auth secrets are required

- **WHEN** the Hub is deployed
- **THEN** OAuth client secrets and session secrets are stored as Cloudflare secrets
- **AND** those secrets are never embedded in published wiki static files

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

### Requirement: Threaded Comments

The Hub SHALL support page-level threaded comments for published wikis.

#### Scenario: User writes a top-level comment

- **WHEN** comments are enabled for a wiki page
- **AND** the current user satisfies the wiki comment policy
- **THEN** the user can create a top-level comment associated with that wiki page

#### Scenario: User replies to a comment

- **WHEN** a user replies to an existing comment thread
- **THEN** the reply is associated with the parent comment
- **AND** the thread can be rendered in parent-child order

#### Scenario: Comment write policy is enforced

- **WHEN** a wiki comment policy is `disabled`, `login-required`, or `members-only`
- **THEN** the Hub enforces that policy before accepting comment writes

### Requirement: Annotation Comments

The Hub SHALL support comments anchored to selected text or page regions in addition to page-level threads.

#### Scenario: User creates an annotation comment

- **WHEN** a user comments on selected text in a wiki page
- **THEN** the comment stores an anchor for that selection
- **AND** the comment can be displayed from the page text and from the page comment thread

#### Scenario: Annotated page is regenerated

- **WHEN** a wiki page is republished and an annotation's original location changes
- **THEN** the Hub attempts to relocate the annotation using the stored selected text and surrounding context
- **AND** the annotation remains attached if it can be safely relocated

#### Scenario: Annotation cannot be safely relocated

- **WHEN** an annotation cannot be safely relocated after a page update
- **THEN** the comment remains visible in the page comment thread
- **AND** the annotation is marked stale instead of being silently moved to an incorrect location
