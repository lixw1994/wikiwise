## Why

Wikiwise can currently publish a static wiki to the official `wiki-wise.com` hosting service, but users who want to own their hosting, domain, identity, and future interaction features need a self-hosted path.

The desired product direction is a Cloudflare-hosted Wikiwise Hub that can serve multiple published wikis at `https://<slug>.wiki.flybullet.net`, support per-wiki public/private visibility, and later support first-party account and comment systems. Cloudflare Access is not sufficient as the primary auth layer because the product needs app-owned users, shared profiles, comment identity, wiki membership, and annotation/comment data.

## What Changes

This change introduces a Cloudflare Hub publishing model alongside the existing official publishing flow.

The Hub is manually deployed once by the user and then receives wiki publishes from the Electron app through a publish API. It owns static serving, wiki routing, app-level auth, permissions, threaded comments, and annotation comments.

The Electron app gains the ability to publish a built wiki to a configured Cloudflare Hub, set a wiki slug, and configure public/private access, auth realm, and comment policy. Existing official publishing behavior remains available and unchanged unless the user selects the Cloudflare target.

## Success Criteria

- A user can configure a Cloudflare Hub publish target without using the official Wikiwise hosting service.
- A published wiki is served at `https://<slug>.wiki.flybullet.net`.
- Each wiki can be configured as public or private.
- Auth can be shared across all Hub wikis or isolated per wiki.
- In shared realm mode, user profile and comment identity are shared across all Hub wikis.
- Google and Feishu/Lark auth are modeled as Hub-owned OIDC providers rather than Cloudflare Access.
- Comments support both threaded replies and annotation anchors.
- Annotation comments attempt to re-anchor after page regeneration and become stale if they cannot be safely relocated.
- The current official publishing flow continues to work.

## Non-Goals

- Do not implement Cloudflare Access as the primary auth layer.
- Do not require Wikiwise to create the user's Cloudflare Worker, D1 database, R2 bucket, DNS records, or secrets automatically.
- Do not implement billing, teams, moderation workflows, notifications, or admin dashboards in the first implementation.
- Do not replace the existing static site compiler.
- Do not require every wiki to use comments or auth.

## Capabilities

### New Capabilities

- `cloudflare-wiki-hub`: Self-hosted Cloudflare Hub deployment, publish API, static serving, wiki routing, auth configuration, permissions, and comments.

### Modified Capabilities

- `electron-publishing`: Add Cloudflare Hub as a selectable publish target while preserving the existing official publishing flow.
- `wikiwise-core-package`: Add core helpers for Cloudflare Hub publish config, publish payload preparation, and API interactions.

## Impact

- `packages/wikiwise-core/`: publish config loading, publish target modeling, Cloudflare Hub API helpers, and tests.
- `apps/electron/src/main/`: IPC handlers for Cloudflare Hub config and publish operations.
- `apps/electron/src/preload/`: publish bridge surface for Cloudflare Hub operations.
- `apps/electron/src/renderer/`: publish UI target selection, Cloudflare Hub settings, and result/error states.
- `apps/electron/resources/scaffold/`: generated wiki documentation and agent guidance for Cloudflare Hub publishing.
- `openspec/specs/electron-publishing/` and `openspec/specs/wikiwise-core-package/`: updated behavior contracts.
- New Cloudflare Hub runtime files, tests, and deployment documentation.
