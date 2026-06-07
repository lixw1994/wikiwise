# cloudflare-wiki-hub Specification

## Purpose
Define the self-hosted Cloudflare Hub runtime that receives Wikiwise publishes, serves multiple wiki slugs, owns application-level auth, and supports comments and annotations.
## Requirements
### Requirement: Cloudflare Hub Deployment Model

Wikiwise SHALL support a self-hosted Cloudflare Hub that is manually deployed once and can serve multiple published wikis.

#### Scenario: Hub serves wildcard wiki hostnames

- **WHEN** a request arrives for `https://<slug>-wiki.flybullet.net`
- **THEN** the Hub resolves `<slug>` from the hostname
- **AND** the Hub loads that wiki's metadata and access policy
- **AND** the Hub serves the matching wiki instead of the official Wikiwise hosting service

#### Scenario: Hub rejects the reserved control hostname as a wiki

- **WHEN** a request arrives for `https://hub-wiki.flybullet.net` outside a Hub API or auth route
- **THEN** the Hub does not resolve `hub` as a published wiki slug
- **AND** no published wiki files are served from the Hub control hostname

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
- **AND** the Hub reports the public URL as `https://<slug>-wiki.flybullet.net`

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

### Requirement: Hub User Profile Settings

The Cloudflare Hub SHALL let signed-in users update the public profile fields used for their reader identity.

#### Scenario: Signed-in user updates public profile

- **WHEN** a signed-in user updates their public profile for the current wiki with a valid display name and avatar URL
- **THEN** the Hub stores the updated public profile for the current wiki realm
- **AND** the Hub returns the updated public profile
- **AND** a later `/_wikiwise/me` request for that realm returns the updated display name and avatar URL

#### Scenario: Signed-out visitor attempts profile update

- **WHEN** a visitor without a valid Hub session attempts to update a profile
- **THEN** the Hub rejects the request
- **AND** no profile data is changed

#### Scenario: Invalid profile update is rejected

- **WHEN** a signed-in user submits an empty display name, an overlong display name, an unsafe avatar URL, or unsupported profile fields
- **THEN** the Hub rejects the update
- **AND** the user's stored public profile remains unchanged

#### Scenario: Profile responses expose only public fields

- **WHEN** the Hub returns a profile update response or a `/_wikiwise/me` response
- **THEN** the response includes only public identity fields needed by the reader runtime
- **AND** emails, provider subjects, provider tokens, OAuth state ids, session ids, invitation tokens, and invitation token hashes are not included

### Requirement: Hub Profile Realm Scope

The Cloudflare Hub SHALL apply user-edited profile settings according to the current wiki auth realm.

#### Scenario: Shared realm profile update is shared

- **WHEN** a signed-in user updates their profile from a shared-realm wiki
- **THEN** the updated display name and avatar URL are used for that user across shared-realm Hub wikis
- **AND** comments and member lists in those shared-realm wikis use the updated public profile

#### Scenario: Per-wiki profile update is scoped

- **WHEN** a signed-in user updates their profile from a per-wiki realm wiki
- **THEN** the updated display name and avatar URL are used only for that wiki-scoped identity
- **AND** another per-wiki realm wiki does not receive that profile update
- **AND** the user's shared-realm public profile is not changed

#### Scenario: Provider profile refresh preserves user-edited profile

- **WHEN** a user has edited their public profile
- **AND** the user later signs in again through an OAuth provider that returns different profile claims
- **THEN** the Hub keeps using the user-edited public profile for the applicable realm
- **AND** provider-derived profile values remain only fallback data for realms without a user-edited profile

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

### Requirement: Hub Reader Runtime Assets

The Cloudflare Hub SHALL serve reader runtime assets from stable same-origin `/_wikiwise/` routes without requiring those assets to be included in published static wiki files.

#### Scenario: Reader script is requested

- **WHEN** a visitor requests `/_wikiwise/client.js` for a published wiki host
- **THEN** the Hub returns JavaScript for the reader runtime
- **AND** the response is cacheable without embedding OAuth client secrets, session ids, or provider tokens

#### Scenario: Reader stylesheet is requested

- **WHEN** a visitor requests `/_wikiwise/client.css` for a published wiki host
- **THEN** the Hub returns stylesheet rules for the reader runtime
- **AND** the stylesheet uses Hub-specific selectors that do not require generated wiki markup changes

### Requirement: Hub Reader Runtime Injection

The Cloudflare Hub SHALL inject its reader runtime into eligible wiki HTML responses while preserving non-HTML responses unchanged.

#### Scenario: Published HTML page is served

- **WHEN** a public or authorized visitor requests a published wiki HTML page
- **THEN** the Hub returns the page content
- **AND** the response includes the Hub reader stylesheet and script

#### Scenario: Non-HTML asset is served

- **WHEN** a visitor requests a published wiki asset that is not HTML
- **THEN** the Hub returns the asset without injecting reader runtime markup

#### Scenario: API response is served

- **WHEN** a visitor requests a `/_wikiwise/` API endpoint
- **THEN** the Hub returns the API response without injecting reader runtime markup

### Requirement: Hub Reader Account Surface

The Cloudflare Hub reader runtime SHALL provide an account surface that reflects the visitor's session and configured sign-in providers.

#### Scenario: Signed-out visitor opens a wiki page

- **WHEN** the reader runtime loads for a visitor without a valid Hub session
- **THEN** it displays sign-in actions for the configured providers
- **AND** each sign-in action returns the visitor to the current page after authentication

#### Scenario: Signed-in visitor opens a wiki page

- **WHEN** the reader runtime loads for a visitor with a valid Hub session
- **THEN** it displays the visitor's public profile information
- **AND** it provides a logout action that clears the current Hub session

#### Scenario: No providers are configured

- **WHEN** the reader runtime loads and the Hub has no configured OAuth providers
- **THEN** it displays account status without presenting unusable sign-in actions

### Requirement: Hub Reader Profile Settings Surface

The Cloudflare Hub reader runtime SHALL provide a signed-in-only profile settings surface for editing public identity fields.

#### Scenario: Signed-in user opens account surface

- **WHEN** the reader runtime loads for a signed-in user
- **THEN** the account surface provides a profile edit action
- **AND** the edit surface is prefilled with the current public display name and avatar URL

#### Scenario: Signed-in user saves profile from runtime

- **WHEN** a signed-in user saves valid profile changes from the reader runtime
- **THEN** the runtime calls the Hub profile update API
- **AND** the account surface updates to show the saved public profile
- **AND** comments and owner-only member lists refresh or rerender to reflect the saved public profile where they are visible

#### Scenario: Signed-out visitor opens account surface

- **WHEN** the reader runtime loads for a signed-out visitor
- **THEN** profile edit controls are not shown
- **AND** sign-in actions remain available when providers are configured

### Requirement: Hub Reader Comments Surface

The Cloudflare Hub reader runtime SHALL provide a page-level comments surface backed by the Hub comments API and governed by the wiki comment policy.

#### Scenario: Comments are available for a page

- **WHEN** the reader runtime loads on a wiki page
- **THEN** it requests comments for the current page path
- **AND** it renders returned comments in parent-child order
- **AND** it displays reader-facing author names and avatars when provided

#### Scenario: Visitor can write a comment

- **WHEN** the current visitor satisfies the wiki comment policy
- **THEN** the comments surface provides a composer for a top-level comment
- **AND** submitting the composer creates the comment through the Hub comments API
- **AND** the surface refreshes to include the new comment

#### Scenario: Visitor cannot write a comment

- **WHEN** the current visitor does not satisfy the wiki comment policy
- **THEN** the comments surface does not claim the visitor can post
- **AND** server-side comment policy enforcement remains authoritative

### Requirement: Hub Private Sign-In Page

The Cloudflare Hub SHALL return a Hub-owned sign-in page for protected wiki content that cannot be served to the current visitor.

#### Scenario: Anonymous visitor requests private wiki HTML

- **WHEN** a private wiki HTML page is requested without an authorized Hub session
- **THEN** the Hub returns a sign-in page instead of the protected wiki page
- **AND** the sign-in page includes configured provider actions with a safe return URL
- **AND** protected wiki content is not included in the response

#### Scenario: Unauthorized signed-in visitor requests private wiki HTML

- **WHEN** a signed-in visitor does not have access to the requested private wiki
- **THEN** the Hub returns a sign-in or access-required page instead of the protected wiki page
- **AND** protected wiki content is not included in the response

### Requirement: Threaded Comments

The Hub SHALL support page-level threaded comments for published wikis and SHALL include reader-facing author profiles with serialized comments.

#### Scenario: User writes a top-level comment

- **WHEN** comments are enabled for a wiki page
- **AND** the current user satisfies the wiki comment policy
- **THEN** the user can create a top-level comment associated with that wiki page
- **AND** the created comment response includes an `author` profile with public display fields

#### Scenario: User replies to a comment

- **WHEN** a user replies to an existing comment thread
- **THEN** the reply is associated with the parent comment
- **AND** the thread can be rendered in parent-child order

#### Scenario: Comment write policy is enforced

- **WHEN** a wiki comment policy is `disabled`, `login-required`, or `members-only`
- **THEN** the Hub enforces that policy before accepting comment writes

#### Scenario: Comments are listed with author profiles

- **WHEN** comments are listed for a wiki page
- **THEN** each serialized comment includes an `author` object
- **AND** the `author` object includes only public identity fields needed for reader display
- **AND** provider tokens, provider subjects, emails, session ids, and membership internals are not included

#### Scenario: Shared realm author is reused across wikis

- **WHEN** the same shared-realm user comments on multiple Hub wikis
- **THEN** serialized comments use the same `author.id`
- **AND** the author display name and avatar are consistent across those wikis

#### Scenario: Per-wiki author is scoped to the wiki

- **WHEN** the same signed-in user comments on multiple per-wiki realm wikis
- **THEN** serialized comments use different wiki-scoped `author.id` values
- **AND** each author retains the signed-in user's display name and avatar for reader display

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

### Requirement: Hub Comment Moderation

The Cloudflare Hub SHALL let wiki owners hide and restore comments for the current wiki without deleting comment records.

#### Scenario: Owner hides a comment

- **WHEN** a signed-in owner hides a comment for the current wiki
- **THEN** the Hub marks that comment hidden
- **AND** normal reader-facing comment lists no longer include the hidden comment
- **AND** the comment record remains stored for future restoration or audit

#### Scenario: Owner restores a hidden comment

- **WHEN** a signed-in owner restores a hidden comment for the current wiki
- **THEN** the Hub marks that comment visible again
- **AND** normal reader-facing comment lists include the restored comment

#### Scenario: Non-owner attempts to moderate a comment

- **WHEN** an anonymous visitor, signed-in non-member, or signed-in non-owner member attempts to hide or restore a comment
- **THEN** the Hub rejects the request
- **AND** the comment status is not changed

#### Scenario: Moderation is scoped to the current wiki

- **WHEN** a signed-in owner moderates a comment
- **THEN** only comments belonging to the current wiki can be changed
- **AND** comments with the same identifier or page path in another wiki are not changed

### Requirement: Hub Owner Comment Moderation Surface

The Cloudflare Hub reader runtime SHALL expose comment moderation controls only to signed-in wiki owners.

#### Scenario: Owner opens comments

- **WHEN** the reader runtime loads comments for a signed-in owner
- **THEN** visible comments include an owner-only action for hiding the comment
- **AND** hidden comments can be reviewed and restored without leaving the wiki page

#### Scenario: Non-owner opens comments

- **WHEN** the reader runtime loads comments for an anonymous visitor, signed-in non-member, or signed-in non-owner member
- **THEN** comment moderation controls are not shown

#### Scenario: Owner moderates from the runtime

- **WHEN** an owner hides or restores a comment through the reader runtime
- **THEN** the runtime calls the owner-only moderation API
- **AND** the comment list refreshes to reflect the updated status

### Requirement: Hub Wrangler Deployment Configuration

The Cloudflare Hub SHALL include a repository-owned Wrangler deployment configuration for deploying the self-hosted Hub Worker.

#### Scenario: Operator reviews Hub deployment configuration

- **WHEN** an operator opens the Hub deployment configuration
- **THEN** the configuration identifies the Cloudflare Hub Worker entrypoint
- **AND** it declares the D1 binding used by the Worker as `DB`
- **AND** it declares the R2 binding used by the Worker as `WIKIWISE_FILES`
- **AND** it declares the public wiki domain configuration used to build `https://<slug>-wiki.flybullet.net` URLs
- **AND** it declares the recommended Hub OAuth callback origin as `https://hub-wiki.flybullet.net`

#### Scenario: Deployment configuration keeps secrets out of source control

- **WHEN** the deployment configuration is committed to the repository
- **THEN** it does not include publish token values, session secret values, OAuth client secret values, provider token responses, or user session data
- **AND** required secret names are discoverable through the documented setup flow

#### Scenario: Operator targets their own Cloudflare resources

- **WHEN** an operator deploys the self-hosted Hub to their Cloudflare account
- **THEN** the deployment configuration can be pointed at the operator's D1 database, R2 bucket, Worker route, and wiki domain without modifying Hub Worker source code

### Requirement: Hub Wrangler Command Surface

The Cloudflare Hub package SHALL expose repeatable operator commands for Wrangler-based development, deployment, and migration application.

#### Scenario: Operator runs the Hub locally

- **WHEN** an operator runs the documented local Hub command
- **THEN** Wrangler starts the Cloudflare Hub Worker using the configured Worker entrypoint and bindings
- **AND** the local runtime can exercise Hub routes without changing Electron application code

#### Scenario: Operator applies Hub migrations

- **WHEN** an operator runs the documented D1 migration command for the Hub
- **THEN** the SQL migration files in `apps/cloudflare-hub/migrations/` are applied to the configured D1 database in filename order
- **AND** the command targets the same D1 binding name used by the Worker runtime

#### Scenario: Operator deploys the Hub

- **WHEN** an operator runs the documented Hub deploy command
- **THEN** Wrangler deploys the Cloudflare Hub Worker using the checked-in deployment configuration
- **AND** the deployed Worker keeps using Cloudflare-managed secrets rather than secrets stored in wiki project files

### Requirement: Hub Deployment Documentation

Wikiwise SHALL document the self-hosted Cloudflare Hub deployment flow using the repository-owned Wrangler configuration.

#### Scenario: Operator follows setup documentation

- **WHEN** an operator reads the self-hosted Cloudflare Hub setup instructions
- **THEN** the documentation lists the required Cloudflare resources, Worker route, wildcard DNS, D1 binding, R2 binding, public domain variable, fixed auth origin variable, and secrets
- **AND** it shows how to apply D1 migrations and deploy the Hub through the documented Wrangler commands
- **AND** it identifies `*.flybullet.net` wildcard DNS and `*-wiki.flybullet.net/*` Worker routing for the default free-TLS deployment shape

#### Scenario: Operator connects Wikiwise publishing to the deployed Hub

- **WHEN** an operator finishes deploying the Hub
- **THEN** the documentation identifies the Hub endpoint, publish token, wiki slug, visibility, auth realm, and comment policy values needed by the Wikiwise publish dialog
- **AND** it identifies `https://hub-wiki.flybullet.net` as the default Hub endpoint
- **AND** it warns that publish tokens and OAuth secrets must not be committed to wiki project files

### Requirement: Hub Membership Invitations

The Cloudflare Hub SHALL let wiki owners create, list, and revoke invitation links that grant membership for the current wiki.

#### Scenario: Owner creates an invitation

- **WHEN** a signed-in owner requests an invitation for a wiki
- **THEN** the Hub creates a pending invitation scoped to that wiki
- **AND** the Hub returns a one-time invitation URL containing the raw invite token
- **AND** the stored invitation record does not expose the raw invite token

#### Scenario: Non-owner attempts to create an invitation

- **WHEN** a signed-in non-owner or anonymous visitor requests an invitation
- **THEN** the Hub rejects the request
- **AND** no invitation is created

#### Scenario: Owner lists invitations

- **WHEN** a signed-in owner lists invitations for a wiki
- **THEN** the Hub returns invitations scoped only to that wiki
- **AND** raw tokens and token hashes are not included

#### Scenario: Owner revokes an invitation

- **WHEN** a signed-in owner revokes a pending invitation
- **THEN** the Hub marks the invitation revoked
- **AND** the invitation can no longer be accepted

### Requirement: Hub Invitation Acceptance

The Cloudflare Hub SHALL let signed-in visitors accept valid pending invitations and receive wiki membership.

#### Scenario: Signed-out visitor opens an invitation

- **WHEN** a signed-out visitor opens a valid invitation URL
- **THEN** the Hub prompts the visitor to sign in
- **AND** the sign-in actions return the visitor to the invitation URL
- **AND** protected wiki content is not included in the response

#### Scenario: Signed-in visitor accepts a valid invitation

- **WHEN** a signed-in visitor accepts a valid pending invitation
- **THEN** the Hub grants that user `member` membership for the invitation wiki
- **AND** the Hub marks the invitation accepted
- **AND** the visitor can read that private wiki after acceptance

#### Scenario: Invalid invitation cannot be accepted

- **WHEN** an invitation token is unknown, revoked, accepted, or expired
- **THEN** the Hub rejects acceptance
- **AND** no membership is granted

#### Scenario: Invitation is scoped to one wiki

- **WHEN** a visitor accepts an invitation for one wiki
- **THEN** the granted membership applies only to that wiki
- **AND** access to another private wiki is not implied

### Requirement: Hub Owner Invitation Surface

The Cloudflare Hub reader runtime SHALL expose a lightweight invitation control only to signed-in wiki owners.

#### Scenario: Owner opens a wiki page

- **WHEN** the reader runtime loads for a signed-in owner
- **THEN** it provides an invitation action
- **AND** created invitation links are displayed to the owner without exposing token hashes

#### Scenario: Non-owner opens a wiki page

- **WHEN** the reader runtime loads for an anonymous visitor, signed-in non-member, or signed-in non-owner member
- **THEN** it does not show owner invitation controls

### Requirement: Hub Member Management

The Cloudflare Hub SHALL let wiki owners list and remove member access for the current wiki.

#### Scenario: Owner lists wiki members

- **WHEN** a signed-in owner requests members for a wiki
- **THEN** the Hub returns memberships scoped only to that wiki
- **AND** each listed member includes public profile fields and membership role metadata
- **AND** provider tokens, provider subjects, emails, session ids, invitation token hashes, and invitation raw tokens are not included

#### Scenario: Non-owner attempts to list wiki members

- **WHEN** an anonymous visitor, signed-in non-member, or signed-in non-owner member requests members for a wiki
- **THEN** the Hub rejects the request
- **AND** member data is not returned

#### Scenario: Owner removes a member

- **WHEN** a signed-in owner removes a `member` user from a wiki
- **THEN** the Hub removes that user's membership for the current wiki
- **AND** the removed user can no longer read that private wiki
- **AND** the removed user's access to other wikis is unchanged

#### Scenario: Owner removal is not supported

- **WHEN** a signed-in owner attempts to remove an `owner` membership
- **THEN** the Hub rejects the request
- **AND** the owner membership remains intact

### Requirement: Hub Owner Member Surface

The Cloudflare Hub reader runtime SHALL expose member management controls only to signed-in wiki owners.

#### Scenario: Owner opens a wiki page

- **WHEN** the reader runtime loads for a signed-in owner
- **THEN** it provides a member management action
- **AND** the owner can view current wiki members without leaving the wiki page

#### Scenario: Owner removes a member from the runtime

- **WHEN** an owner removes a listed `member` user through the reader runtime
- **THEN** the runtime calls the owner-only member removal API
- **AND** the member list refreshes to reflect the removal

#### Scenario: Non-owner opens a wiki page

- **WHEN** the reader runtime loads for an anonymous visitor, signed-in non-member, or signed-in non-owner member
- **THEN** it does not show member management controls

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
