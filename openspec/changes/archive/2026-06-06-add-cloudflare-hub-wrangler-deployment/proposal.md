## Why

Self-hosted Cloudflare Hub support currently describes a manual setup path, but the repository does not provide a checked-in Wrangler configuration or repeatable operator workflow for deploying that Hub. This makes the self-hosted path harder to validate, document, and reproduce after the Hub has grown to include app-owned auth, memberships, comments, and moderation.

## What Changes

- Add a repository-owned Cloudflare/Wrangler deployment configuration for `apps/cloudflare-hub`.
- Provide npm scripts or equivalent commands for validating, running, deploying, and applying Hub D1 migrations.
- Document the operator setup flow for D1, R2, Worker routes, wildcard DNS, environment variables, and Cloudflare secrets.
- Make deployment configuration explicit about required bindings and secrets without embedding secret values.
- Add validation coverage that keeps the deployment manifest, package scripts, and documentation aligned with the Hub runtime contract.
- Do not provision Cloudflare resources automatically with a Cloudflare API token in this change.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `cloudflare-wiki-hub`: Add repeatable Wrangler deployment configuration and operator setup behavior for the self-hosted Hub.

## Impact

- Affected code/config: `apps/cloudflare-hub/package.json`, a new Wrangler deployment manifest under `apps/cloudflare-hub/`, and related deployment or migration helper files if needed.
- Affected docs: README self-hosted Cloudflare Hub setup instructions.
- Affected validation: Cloudflare Hub tests or repository checks for deployment manifest shape, required bindings, required secrets, and documented commands.
- No change is expected to the desktop publish API, Hub reader runtime, D1 schema semantics, or official Wikiwise publishing target.
