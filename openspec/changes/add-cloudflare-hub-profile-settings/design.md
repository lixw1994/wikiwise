## Context

The Cloudflare Hub already stores provider-derived `displayName` and `avatarUrl` in `users`, returns a realm-aware public profile from `/_wikiwise/me`, serializes public comment authors, and lists members with public profile fields. Those values currently come from OAuth provider profiles and are not editable by the signed-in user.

This change affects the Cloudflare Hub Worker package only: `apps/cloudflare-hub/src/worker.js`, Hub D1 migrations if profile override persistence is needed, Hub reader runtime source/styles, and `apps/cloudflare-hub/test/worker.test.js`. No Electron main/preload/renderer, core publish helpers, scaffold templates, CodeMirror resources, file watching, xterm terminal integration, release workflow, or official hosting behavior is expected to change.

## Goals / Non-Goals

**Goals:**

- Let signed-in Hub users update public display name and avatar URL.
- Preserve provider-derived profile data as a fallback while allowing user-edited public profile values to take precedence.
- Respect realm scope: shared realm profile settings apply across shared-realm wikis, while per-wiki realm profile settings apply only to the current wiki.
- Reflect updated public profile values in `/_wikiwise/me`, comment author serialization, and owner member lists.
- Keep profile update responses free of emails, provider subjects, provider tokens, OAuth states, session ids, and invitation internals.
- Add compact reader runtime controls for editing the signed-in user's public profile.

**Non-Goals:**

- Do not add avatar uploads or R2-backed user media storage.
- Do not add email editing, provider account linking, account deletion, password auth, billing, notifications, or a full account dashboard.
- Do not add admin editing of another user's profile.
- Do not change desktop publishing, official hosting, scaffold generation, or release packaging.

## Decisions

### Profile overrides instead of overwriting provider identity

Store user-edited public profile values separately from provider-derived user data. A practical implementation can add a D1 profile override table keyed by `user_id` plus a realm scope:

- shared scope: one row for the Hub user, used by shared-realm wikis
- per-wiki scope: one row for the Hub user and wiki slug, used only on that wiki

Profile resolution should use the override when present, then fall back to the provider-derived `users.display_name` and `users.avatar_url`.

Alternative considered: update the existing `users` row directly. That is simpler, but current OAuth callback code upserts provider profile fields and could overwrite a user-edited public identity on the next sign-in. Keeping overrides separate makes provider refreshes safe and keeps the source of truth explicit.

### Use current wiki realm to choose profile scope

The profile update API should operate in the context of the requested wiki host. If that wiki uses the shared realm, the update changes the user's shared public profile. If that wiki uses the per-wiki realm, the update changes only the current wiki-scoped public profile.

Alternative considered: always update one global Hub profile. That matches shared realm but weakens the per-wiki realm contract, where visible identity is supposed to be scoped to one wiki.

### PATCH the existing profile endpoint

Use `PATCH /_wikiwise/me` for profile updates while preserving `GET /_wikiwise/me` for reading session state. This keeps account state under one same-origin resource and avoids adding a broader account dashboard route.

Alternative considered: add `/_wikiwise/profile`. A separate route is also viable, but it creates another API surface without a meaningful user-facing distinction.

### Narrow public fields and validation

Accept only `displayName` and `avatarUrl`. Trim display names, require a non-empty display name within a bounded length, normalize an empty avatar URL to null, and accept only safe absolute `http` or `https` avatar URLs within a bounded length. Reject malformed updates without changing stored data.

Alternative considered: allow arbitrary profile metadata. That would make comments and member lists harder to keep safe and is unnecessary for the first profile-settings slice.

### Reader runtime stays lightweight

Add a small signed-in-only edit control to the existing injected account surface. On save, the runtime calls the profile update API, refreshes account state, and rerenders affected local surfaces such as comments and owner member lists where practical.

Alternative considered: add a full account settings page. That can come later if account management expands, but this slice should stay close to the existing reader runtime.

## Risks / Trade-offs

- [Risk] Realm-scoped profile resolution can become inconsistent between `/me`, comments, and members. Mitigation: centralize public profile resolution helpers and test all three surfaces.
- [Risk] OAuth callbacks may overwrite public user edits if provider data remains the only stored identity. Mitigation: use overrides with provider-derived values only as fallback.
- [Risk] Avatar URLs can become an unsafe injection vector. Mitigation: require absolute `http` or `https` URLs, reject credentials and unsupported schemes, and continue escaping through DOM/text APIs in the runtime.
- [Risk] Per-wiki profile overrides add data-model complexity. Mitigation: keep the override shape narrow and keyed by user plus optional wiki slug, without adding unrelated account fields.
- [Risk] Existing comments may have author ids stored before profile overrides exist. Mitigation: resolve author display from current profile data at serialization time rather than copying display fields into comments.

## Migration Plan

1. Add failing Hub tests for profile update API behavior, validation, realm scoping, serialized author/member display, and reader runtime controls.
2. Add the minimal D1 migration needed for profile overrides, or equivalent persistence that preserves provider-derived fallback data.
3. Implement profile resolution helpers and route handling.
4. Update comment author and member serialization to use the same public profile resolver.
5. Add reader runtime edit controls and styles.
6. Run targeted Cloudflare Hub tests, OpenSpec validation, and full repository tests.

Rollback is straightforward before deployment: remove the route, migration, runtime controls, and tests. Existing Hub data remains compatible because provider-derived `users` rows and existing sessions/comments continue to work as fallback identity data.

## Open Questions

- Should avatar URL validation allow non-HTTPS `http` URLs for local development only, or require `https` everywhere?
- Should users be able to clear a profile override and return to provider-derived display data in this slice, or should that wait for a broader account settings page?
