## Context

Cloudflare Hub already stores published wiki files, access settings, OAuth sessions, memberships, and comments. The missing piece is a reader-facing runtime: public wiki visitors can read static pages, but they cannot see account state or participate in comments from the page itself, and private wiki visitors need a sign-in page before protected content is served.

The static compiler output should remain portable. Hub-specific account and comment behavior belongs to `apps/cloudflare-hub/src/worker.js` and its tests, not to the Electron bundled `app.js` or generated wiki files.

## Goals / Non-Goals

**Goals:**

- Serve a small Hub-owned reader script and stylesheet from stable `/_wikiwise/*` routes.
- Inject those assets into Hub-served HTML pages only.
- Render account state, provider sign-in actions, logout, and page-level comments using existing Hub APIs.
- Return a private sign-in page when anonymous or unauthorized visitors request protected wiki HTML.
- Keep public/static assets, API responses, and non-HTML resources free from unwanted HTML injection.

**Non-Goals:**

- Build a full account settings page, profile editor, moderation console, or admin dashboard.
- Implement annotation rendering in this change.
- Change Electron publishing settings or static wiki compilation.
- Add new OAuth providers or change provider token handling.

## Decisions

1. Hub injects the reader runtime at response time.

   The worker will append `/_wikiwise/client.css` and `/_wikiwise/client.js` to eligible served HTML pages. This keeps Hub behavior self-contained and lets locally opened wiki output continue to work without Hub APIs.

   Alternative considered: bake the UI into Electron's `app.js`. That would make every static export carry Hub-only assumptions and would require compile-time knowledge of hosting behavior.

2. Runtime assets are served by the Hub under `/_wikiwise/`.

   The script and stylesheet can evolve with the deployed worker and do not need to be republished with every wiki. The runtime will use same-origin requests so sessions, cookies, and wiki slug resolution stay in the worker.

   Alternative considered: publish the runtime as generated files alongside each wiki. That duplicates runtime code across slugs and makes rollback harder.

3. The reader UI is progressive enhancement.

   HTML content remains readable when comments are disabled, the visitor is signed out, or the runtime fails to load. The runtime adds a compact account surface and an article-level comments block without changing the static document's article content.

4. Private sign-in is a server-rendered fallback.

   When protected content cannot be served, the worker returns a minimal sign-in page with configured providers and a safe return URL. This page must not expose protected wiki content.

## Risks / Trade-offs

- Injecting into the wrong response type could corrupt JSON, scripts, or binary assets. Mitigation: only inject for successful `text/html` wiki file responses.
- Runtime UI could conflict with generated wiki CSS. Mitigation: use namespaced `wikiwise-hub-*` classes and keep layout compact.
- Provider configuration might be absent. Mitigation: the private sign-in page and account surface must handle zero configured providers with a clear unavailable state.
- Comment writes can fail due to policy or session state. Mitigation: surface server error messages without bypassing existing server-side enforcement.

## Migration Plan

Deploying the updated worker is sufficient. Existing published wiki files do not need to be republished because runtime assets and HTML injection are Hub-owned. Rollback is the previous worker version; existing stored wiki data, users, sessions, and comments remain compatible.

## Open Questions

- None for this change. Deeper moderation, notifications, and annotation UI can be handled by later changes.
