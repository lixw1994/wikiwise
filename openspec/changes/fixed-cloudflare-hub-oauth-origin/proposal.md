## Why

Cloudflare Hub OAuth callbacks currently use the wiki subdomain that initiated sign-in. That forces operators to register a callback URL for every published wiki slug, which makes self-hosted publishing awkward and brittle.

## What Changes

- Add a configurable fixed OAuth callback origin for the Cloudflare Hub, intended for `https://hub.wiki.flybullet.net`.
- Keep wiki sign-in initiation on the current wiki host so the Hub can preserve the requesting wiki slug and safe return URL.
- Use the fixed callback origin for provider authorization and token exchange when configured.
- Preserve the existing per-wiki callback behavior when no fixed auth origin is configured.
- Document the fixed callback URLs operators should register with Google, Feishu, and Lark.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `cloudflare-wiki-hub`: Hub-owned OAuth/OIDC authentication supports a fixed callback origin shared by all wiki slugs.

## Impact

- Affected Worker code: `apps/cloudflare-hub/src/worker.js`
- Affected deployment config and docs: `apps/cloudflare-hub/wrangler.toml`, `README.md`
- Affected tests: Cloudflare Hub worker tests and deployment documentation tests
- No new runtime dependencies are expected.
