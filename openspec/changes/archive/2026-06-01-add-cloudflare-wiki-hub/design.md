## Context

Wikiwise currently compiles local Markdown into `site/out` and publishes those static files to the official Wikiwise service through core helpers in `packages/wikiwise-core/src/index.js`. Electron owns the user-facing publish dialog, but main/preload largely delegate publishing to the core package.

The Cloudflare Hub is a second publish target. It is not a replacement for the existing official service. It is a user-owned runtime that is deployed once to Cloudflare and then receives wiki publishes from the desktop app. The Hub must own app-level identity because the product direction includes user profiles, shared comment identity, private wiki membership, threaded comments, and annotation comments.

## Goals / Non-Goals

**Goals:**

- Add a target-aware publishing model that keeps official publishing compatible.
- Add a Cloudflare Hub publish path for `https://<slug>.wiki.flybullet.net`.
- Model Hub settings: endpoint, publish token, wiki slug, visibility, auth realm, and comment policy.
- Provide a Hub runtime architecture for Worker, D1, R2, OIDC auth, sessions, static serving, and comments.
- Support shared realm profile/comment identity across Hub wikis and per-wiki realm isolation.
- Support threaded comments and annotation comments with stale-anchor handling.
- Keep Cloudflare account setup manual: Worker, D1, R2, DNS, routes, and secrets are created by the user, not by Wikiwise.

**Non-Goals:**

- Do not build a full moderation system, notification system, billing model, or admin analytics.
- Do not require Cloudflare Access for primary auth.
- Do not implement automatic Cloudflare account provisioning with a Cloudflare API token.
- Do not change the compiler output contract unless needed for comments/annotations injection.
- Do not remove official Wikiwise publishing.

## Decisions

### Publish target model

The project publish config becomes target-aware while preserving the existing official shape. Existing configs with `subdomain`, `token`, and `url` are treated as official configs. New Cloudflare configs should use an explicit shape:

```json
{
  "target": "cloudflare-hub",
  "hub": {
    "endpoint": "https://hub.wiki.flybullet.net",
    "publishToken": "wwh_...",
    "slug": "notes",
    "url": "https://notes.wiki.flybullet.net",
    "visibility": "public",
    "authRealm": "shared",
    "comments": {
      "policy": "login-required"
    }
  },
  "lastPublishedAt": "2026-05-31T00:00:00.000Z"
}
```

The existing official config does not need an immediate migration. Core can normalize both shapes internally.

### Hub publish API

The desktop app builds `site/out`, then core prepares the same static file payload shape used by official publishing: path plus base64 data, including the home/index rewrite. The Hub API receives:

- `slug`
- `settings`: visibility, auth realm, comment policy
- `files`: static file entries
- optional publish metadata such as build timestamp

The Hub authenticates publish requests with a Hub publish token stored in the project config for now. OAuth client secrets and session secrets are never stored in wiki projects.

### Hub runtime

The Hub runtime lives as a new Cloudflare Worker package in the repository, likely under `apps/cloudflare-hub/` or `packages/wikiwise-cloudflare-hub/`. It uses:

- Worker Static Assets or R2-backed serving for compiled wiki files.
- D1 for users, OAuth accounts, sessions, wikis, wiki members, comments, and annotation anchors.
- R2 for per-wiki static file objects keyed by wiki id/slug and file path.
- Worker secrets for publish token, session signing/encryption secret, and OAuth provider secrets.

R2 is preferred for wiki files because a single Hub owns multiple independently updated wikis and can overwrite one wiki without redeploying the Worker bundle.

### Routing

The Worker handles `*.wiki.flybullet.net`. It extracts the first hostname label as `slug`, looks up `wikis.slug`, then serves that wiki. Unknown slugs return not found. The root Hub hostname can expose a minimal health/setup page later, but that is not required for the MVP.

### Auth and sessions

The Hub owns OIDC flows for Google and Feishu/Lark. Provider details are configured in Worker environment/secrets. The Hub maps provider identities into `users` and `oauth_accounts`.

Shared realm:

- `users` and profile fields are global across the Hub.
- The same user id, display name, avatar, and comment identity apply across all Hub wikis.
- `wiki_members` controls per-wiki permissions.

Per-wiki realm:

- Membership and comment identity are scoped to one wiki.
- A user can still authenticate through the same provider, but the visible identity and membership are resolved through the wiki scope.

Sessions should be HTTP-only, secure cookies scoped to `.wiki.flybullet.net` so shared realm can work across subdomains. The session check still enforces per-wiki membership when a private wiki or members-only comments require it.

### Comments and annotations

Use one comment model:

- `parent_comment_id` enables threaded replies.
- `anchor_json` is nullable. Null means page-level comment; present means annotation comment.
- `status` distinguishes visible, deleted, hidden, and stale-anchor states.

Annotation anchors store selected text and surrounding context. On publish, the Hub can mark page revisions. On read, the client or API attempts to locate anchors in the current page revision. If the match is safe, render an inline marker. If not, keep the comment in the thread and mark the anchor stale.

### Electron UI

The publish dialog becomes target-aware. The official target keeps the current subdomain row. The Cloudflare target shows Hub-specific controls:

- Hub endpoint
- publish token
- wiki slug
- final URL preview `https://<slug>.wiki.flybullet.net`
- visibility segmented control: public/private
- auth realm segmented control: shared/per-wiki
- comment policy menu: disabled/login-required/members-only

Avoid nested cards. Keep the publish surface compact and operational, consistent with the current native-like dialog.

### Scaffold guidance

Generated wikis should document Cloudflare Hub publishing in `AGENTS.md` and relevant skills once the feature is implemented. Existing official hosting guidance should remain accurate.

## Risks / Trade-offs

- App-owned auth is more complex than Cloudflare Access, but it is required for comments, profiles, memberships, and future account features.
- R2-backed static serving adds object storage complexity, but it avoids redeploying a Worker for every wiki update.
- Feishu/Lark OIDC compatibility depends on provider claim availability and configuration. The implementation should model provider config flexibly rather than hard-coding one claim shape.
- Cookies across `*.wiki.flybullet.net` are convenient for shared realm but require careful CSRF and SameSite handling.
- Annotation re-anchoring can attach comments incorrectly if the algorithm is too permissive. The design must prefer stale anchors over unsafe relocation.

## State Model

### Project publish state

- `unpublished`: no publish config exists.
- `official`: existing official config shape is present.
- `cloudflare-hub`: Cloudflare target config is present.
- `publishing`: publish request in flight.
- `published`: target publish succeeded and `lastPublishedAt` is updated.
- `error`: publish failed and the previous config remains intact.

### Wiki visibility state

- `public`: content readable anonymously.
- `private`: content readable only after Hub session and wiki access check.

### Auth realm state

- `shared`: profile/comment identity shared across Hub wikis.
- `per-wiki`: identity and membership scoped to a wiki.

### Comment state

- `visible`: normal comment.
- `deleted`: user-visible tombstone or hidden content depending later policy.
- `hidden`: reserved for future moderation.
- `stale-anchor`: annotation still exists but no safe current-page location was found.

## Migration Plan

1. Preserve official publishing as the default path for existing projects.
2. Add target-aware config loading with compatibility tests before UI changes.
3. Add Cloudflare Hub core helpers and tests using mocked fetch calls.
4. Add Electron UI and IPC for Cloudflare target selection and settings.
5. Add the Cloudflare Hub runtime skeleton with D1 migrations, R2 API boundaries, and publish endpoint tests.
6. Add auth/comment APIs after static publish works.
7. Update scaffold docs and README after behavior exists.

Rollback is straightforward until a project chooses the Cloudflare target: official configs remain unchanged. If a Cloudflare publish config is invalid, users can remove or edit `publish.json` to return to unpublished state.

## Open Questions

- Whether Hub runtime should live in `apps/cloudflare-hub` or `packages/wikiwise-cloudflare-hub`.
- Whether the initial implementation should use a single `publish.json` file for both targets or split local secrets into a separate ignored config file.
- Whether annotation anchor relocation runs server-side, client-side, or both in the first implementation slice.
