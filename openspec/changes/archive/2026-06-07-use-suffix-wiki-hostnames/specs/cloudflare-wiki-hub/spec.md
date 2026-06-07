## MODIFIED Requirements

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
