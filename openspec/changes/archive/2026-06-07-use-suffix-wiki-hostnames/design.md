## Context

The current Cloudflare Hub proposal uses `https://<slug>.wiki.flybullet.net` for public wikis and `https://hub.wiki.flybullet.net` for the control endpoint. DNS can resolve that shape, but HTTPS for `*.wiki.flybullet.net` requires a certificate that includes a second-level wildcard. Cloudflare's free Universal SSL covers `flybullet.net` and `*.flybullet.net`, so a first-level suffix host such as `notes-wiki.flybullet.net` avoids the paid certificate path.

## Goals / Non-Goals

**Goals:**

- Use `https://<slug>-wiki.flybullet.net` for all published Hub wiki URLs.
- Use `https://hub-wiki.flybullet.net` as the default Hub endpoint and fixed OAuth callback origin.
- Keep all published wiki traffic behind a Worker route that can be constrained to `*-wiki.flybullet.net/*`.
- Keep App previews, shared core URL generation, Worker publish responses, docs, and deployment checks aligned.

**Non-Goals:**

- No account-system, comment-system, or data-model changes.
- No migration tooling for already-published experimental Hub sites.
- No path-mode hosting.
- No paid Cloudflare certificate configuration.

## Decisions

### Decision: Suffix first-level public hosts

Published wiki hosts use `<slug>-wiki.flybullet.net`, with `hub-wiki.flybullet.net` reserved for control and OAuth callbacks.

Rationale: this keeps every host under the free `*.flybullet.net` certificate while preserving a distinct public URL per wiki. Compared with path mode, each wiki still has its own origin-like URL. Compared with Advanced Certificate Manager, operators do not need a paid TLS add-on.

### Decision: Configure public domain as the apex domain

The Hub `WIKIWISE_PUBLIC_DOMAIN` value becomes `flybullet.net`; Worker URL helpers append and strip the `-wiki` suffix around the slug.

Rationale: cookie scoping, OAuth callback sharing, and public URL construction all need the effective parent domain. Using `wiki.flybullet.net` would keep the deployment tied to the second-level wildcard that caused the TLS issue.

### Decision: Preserve compatibility in shared core URL derivation

The shared core helper should derive `https://<slug>-wiki.flybullet.net` from `https://hub-wiki.flybullet.net`, while still handling older `hub.<domain>` endpoints for custom deployments.

Rationale: Electron defaults move to the new shape, but keeping the helper tolerant avoids surprising operators who configured another Hub origin shape during the experimental phase.

### Decision: Reserve the `hub` slug

The Worker must not treat `hub-wiki.flybullet.net` as a published wiki slug.

Rationale: the same hostname owns publish APIs and OAuth callbacks. Reserving `hub` prevents public wiki lookups from colliding with the control host.

## Risks / Trade-offs

- Cloudflare route pattern support for `*-wiki.flybullet.net/*` may vary by dashboard/API surface -> document `*.flybullet.net/*` as a fallback only if the stricter route cannot be configured, while Worker hostname parsing still rejects non-suffix hosts.
- A DNS wildcard for `*.flybullet.net` can resolve unrelated subdomains -> the Worker only serves Wikiwise content for hosts that end in `-wiki.flybullet.net`.
- Slugs ending in `-wiki` produce hosts like `foo-wiki-wiki.flybullet.net` -> this is acceptable because the suffix is a routing marker, not part of slug normalization.

## Migration Plan

1. Update Cloudflare DNS to proxy `*.flybullet.net`.
2. Update the Worker route to `*-wiki.flybullet.net/*` and set `WIKIWISE_PUBLIC_DOMAIN=flybullet.net`.
3. Set `WIKIWISE_AUTH_ORIGIN=https://hub-wiki.flybullet.net`.
4. Update Google, Feishu, and Lark OAuth redirect URIs to the `hub-wiki.flybullet.net` callback URLs.
5. Update Wikiwise App Cloudflare Hub endpoint settings to `https://hub-wiki.flybullet.net` and republish wikis.

Rollback is to restore the previous Hub endpoint, public domain, route, and OAuth callbacks if the operator has a valid certificate for `*.wiki.flybullet.net`.
