## 1. Deployment Contract Tests

- [x] 1.1 Add failing tests for the Hub Wrangler manifest covering Worker entrypoint, compatibility date, wildcard route, `DB` D1 binding, `WIKIWISE_FILES` R2 binding, and `WIKIWISE_PUBLIC_DOMAIN`.
- [x] 1.2 Add failing tests that the checked-in deployment manifest does not contain publish token values, session secret values, OAuth client secret values, or provider token data.
- [x] 1.3 Add failing tests for Hub package scripts covering local Wrangler development, deploy, and D1 migration commands.
- [x] 1.4 Extend README/setup documentation tests to require the Wrangler-backed deployment flow and publish dialog handoff details.

## 2. Wrangler Configuration and Scripts

- [x] 2.1 Add `apps/cloudflare-hub/wrangler.toml` with the Hub Worker entrypoint, route, public vars, D1 binding, and R2 binding.
- [x] 2.2 Add Hub package scripts for local Wrangler development and Worker deployment.
- [x] 2.3 Add Hub package scripts or documented commands for applying local and remote D1 migrations from `apps/cloudflare-hub/migrations/`.
- [x] 2.4 Keep secret values out of checked-in config while making required secret names clear to operators.

## 3. Documentation

- [x] 3.1 Update README's self-hosted Cloudflare Hub setup section to use the Wrangler manifest and scripts.
- [x] 3.2 Document required Cloudflare resources: D1 database, R2 bucket, Worker route, wildcard DNS, public domain, and Cloudflare secrets.
- [x] 3.3 Document how the deployed Hub endpoint and publish token map back to the Wikiwise publish dialog.
- [x] 3.4 Preserve the existing warning that OAuth secrets, provider token responses, session cookies, and publish tokens stay out of wiki folders and `publish.json`.

## 4. Validation

- [x] 4.1 Run `openspec validate add-cloudflare-hub-wrangler-deployment --strict`.
- [x] 4.2 Run targeted Cloudflare Hub deployment/configuration tests.
- [x] 4.3 Run targeted README documentation tests.
- [x] 4.4 Run full repository tests.
