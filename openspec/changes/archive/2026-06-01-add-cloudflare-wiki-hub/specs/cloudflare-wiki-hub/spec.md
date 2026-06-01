## ADDED Requirements

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
