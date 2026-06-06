## Context

The Cloudflare Hub runtime already lives in `apps/cloudflare-hub/` and exposes a Worker-compatible handler backed by D1, R2, app-owned OAuth sessions, memberships, comments, and moderation. README currently documents a manual Cloudflare setup flow, but operators still have to infer the Wrangler manifest, binding names, route shape, and migration commands from prose and code.

This change makes the self-hosted deployment path concrete without changing the Electron publish dialog, official Wikiwise publishing, or Hub API semantics. The affected surfaces are the Cloudflare Hub workspace package, repository README, and validation tests. No Electron main/preload/renderer, scaffold, release workflow, file watching, CodeMirror, or terminal integration changes are expected.

## Goals / Non-Goals

**Goals:**

- Add a checked-in Wrangler deployment manifest for `apps/cloudflare-hub`.
- Keep D1 binding `DB`, R2 binding `WIKIWISE_FILES`, and public domain variable `WIKIWISE_PUBLIC_DOMAIN` explicit.
- Keep publish tokens, session secrets, OAuth client secrets, and provider tokens out of checked-in config.
- Add package-level scripts for Hub local development, deployment, and D1 migrations.
- Update README so an operator can create Cloudflare resources, configure secrets, apply migrations, deploy the Worker, and publish from Wikiwise.
- Add validation coverage that catches drift between the manifest, scripts, docs, and Worker runtime contract.

**Non-Goals:**

- Do not automatically create Cloudflare accounts, D1 databases, R2 buckets, DNS records, or OAuth apps.
- Do not add a Cloudflare API token flow to Wikiwise.
- Do not change the desktop publish target model or publish payload.
- Do not change Hub database schema semantics unless a migration script needs documentation coverage.
- Do not add Cloudflare Access as the primary auth layer.

## Decisions

### Checked-in Wrangler manifest

Add `apps/cloudflare-hub/wrangler.toml` as the operator-facing deployment manifest. It should point at `src/worker.js`, declare the compatibility date, configure the route for `*.wiki.flybullet.net/*`, declare the D1 binding as `DB`, declare the R2 binding as `WIKIWISE_FILES`, and define non-secret public vars such as `WIKIWISE_PUBLIC_DOMAIN`.

Alternative considered: only add `wrangler.example.toml`. That avoids placeholder production values but keeps the package without a default Wrangler entrypoint. A real manifest is preferable because npm scripts and tests can target one stable file. Values that vary by Cloudflare account, such as D1 database id and R2 bucket name, can be documented as operator-editable placeholders.

### No checked-in secret values

The manifest and README should name required secrets, but secret values must be set through `wrangler secret put` or Cloudflare dashboard configuration. This includes `WIKIWISE_PUBLISH_TOKEN`, `WIKIWISE_SESSION_SECRET`, OAuth client secrets, and any provider token credentials.

Alternative considered: put empty strings in `[vars]`. That makes required names visible but risks operators accidentally deploying blank secrets and blurs public vars versus secrets. Naming secrets in docs and tests is clearer.

### Package scripts over root workflow changes

Add Hub-specific scripts in `apps/cloudflare-hub/package.json`, for example local dev, deploy, migration listing/apply commands, and manifest validation if needed. Keep root `npm test` behavior unchanged so the repository default remains lightweight.

Alternative considered: add root-level deployment scripts. That makes commands shorter but spreads Cloudflare-specific operations into the Electron-first workspace root. Package-level scripts keep the operational surface close to the Worker.

### Documentation stays operator-first

Replace the README's purely manual setup list with a Wrangler-backed flow: create Cloudflare resources, update manifest placeholders, set secrets, run D1 migrations, deploy, configure DNS/routes, and then publish from the desktop app.

Alternative considered: move all deployment docs into `apps/cloudflare-hub/README.md`. A package README can be added later, but the top-level README should still carry the primary user-facing setup path because this is how users discover self-hosted Hub publishing.

## Risks / Trade-offs

- Placeholder resource ids could be committed into a manifest that looks deployable but still requires editing. Mitigation: tests and docs should explicitly call out operator-edited values and secret setup.
- Wrangler command behavior can change across versions. Mitigation: scripts should stay simple and docs should prefer standard Wrangler commands; add a dev dependency only if implementation needs a pinned local CLI.
- D1 migration commands can accidentally target local instead of remote resources. Mitigation: docs and script names should distinguish local development from remote migration application.
- A route hard-coded to `wiki.flybullet.net` is convenient for this product direction but not universal. Mitigation: keep `WIKIWISE_PUBLIC_DOMAIN` and manifest route documented as operator-editable.

## Migration Plan

1. Add failing deployment manifest, package script, and documentation assertions.
2. Add `wrangler.toml` with explicit Worker, route, D1, R2, and public variable configuration.
3. Add Hub package scripts for Wrangler local development, deployment, and D1 migration application.
4. Update README's Cloudflare setup section to use the manifest and scripts.
5. Run targeted Hub and documentation tests, then full repository tests when implementation is complete.

Rollback is simple: remove the manifest/scripts/docs added by this change. Existing desktop publishing and already-deployed manual Hub Workers remain compatible because Worker source, API routes, and D1 schema semantics are unchanged.

## Open Questions

- Should the implementation pin Wrangler as a local dev dependency or rely on the operator's installed Wrangler CLI?
- Should a package-local `apps/cloudflare-hub/README.md` be added in addition to the top-level README, or should this change keep documentation centralized?
