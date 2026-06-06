## ADDED Requirements

### Requirement: Hub Wrangler Deployment Configuration
The Cloudflare Hub SHALL include a repository-owned Wrangler deployment configuration for deploying the self-hosted Hub Worker.

#### Scenario: Operator reviews Hub deployment configuration
- **WHEN** an operator opens the Hub deployment configuration
- **THEN** the configuration identifies the Cloudflare Hub Worker entrypoint
- **AND** it declares the D1 binding used by the Worker as `DB`
- **AND** it declares the R2 binding used by the Worker as `WIKIWISE_FILES`
- **AND** it declares the public wiki domain configuration used to build `https://<slug>.wiki.flybullet.net` URLs

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
- **THEN** the documentation lists the required Cloudflare resources, Worker route, wildcard DNS, D1 binding, R2 binding, public domain variable, and secrets
- **AND** it shows how to apply D1 migrations and deploy the Hub through the documented Wrangler commands

#### Scenario: Operator connects Wikiwise publishing to the deployed Hub
- **WHEN** an operator finishes deploying the Hub
- **THEN** the documentation identifies the Hub endpoint, publish token, wiki slug, visibility, auth realm, and comment policy values needed by the Wikiwise publish dialog
- **AND** it warns that publish tokens and OAuth secrets must not be committed to wiki project files
