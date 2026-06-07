## Why

Cloudflare Universal SSL covers `*.flybullet.net` for free, but it does not cover the second-level wildcard `*.wiki.flybullet.net` without Advanced Certificate Manager. Moving Wikiwise Hub public hosts to a `-wiki` suffix keeps each published wiki on a first-level subdomain that can be served without a paid certificate add-on.

## What Changes

- Change self-hosted Cloudflare Hub public wiki URLs from `https://<slug>.wiki.flybullet.net` to `https://<slug>-wiki.flybullet.net`.
- Change the recommended Hub control and OAuth callback origin from `https://hub.wiki.flybullet.net` to `https://hub-wiki.flybullet.net`.
- Reserve the `hub` slug so `hub-wiki.flybullet.net` remains the Hub control host rather than a published wiki.
- Update Worker hostname parsing, publish URL reporting, Electron defaults/previews, shared core URL generation, Wrangler config checks, and deployment documentation.
- **BREAKING** for the in-progress self-hosted Hub deployment shape: operators must update DNS, Worker routes, OAuth callback registrations, and App Hub endpoint settings to the new `-wiki` hostname model.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `cloudflare-wiki-hub`: public wiki hostnames, Hub control hostname, Wrangler deployment configuration, and setup documentation use the first-level `-wiki` suffix model.
- `electron-publishing`: Cloudflare Hub publishing defaults and URL previews show `https://<slug>-wiki.flybullet.net`.

## Impact

- `apps/cloudflare-hub`: Worker host parsing, public URL generation, Wrangler configuration, deployment preflight, tests, and docs.
- `packages/wikiwise-core`: Cloudflare Hub public URL derivation from the configured Hub endpoint.
- `apps/electron`: Cloudflare Hub publish defaults, renderer preview text, persisted publish draft behavior, and tests.
- `README.md` and scaffold guidance: operator DNS, Worker route, OAuth callback URLs, and publish dialog setup copy.
