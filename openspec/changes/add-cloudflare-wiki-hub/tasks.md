## 1. Target-Aware Publish Config

- [x] 1.1 Add failing core tests for loading existing official publish configs and new Cloudflare Hub configs.
- [x] 1.2 Implement target-aware publish config normalization while preserving existing official config behavior.
- [x] 1.3 Add stable validation errors for malformed Cloudflare Hub configs.

## 2. Core Cloudflare Hub Publishing

- [x] 2.1 Add failing core tests for Cloudflare Hub publish payload preparation, including root home rewrite.
- [x] 2.2 Implement Cloudflare Hub payload preparation without including OAuth or session secrets.
- [x] 2.3 Add failing core tests for Cloudflare Hub publish success and Hub error mapping.
- [x] 2.4 Implement Cloudflare Hub publish helper and saved local config updates.

## 3. Electron Publish Integration

- [x] 3.1 Add Electron tests for publish target selection and official publish compatibility.
- [x] 3.2 Add main/preload IPC for target-aware publish config and Cloudflare Hub publishing.
- [x] 3.3 Add renderer state and publish dialog controls for Hub endpoint, token, slug, visibility, auth realm, and comment policy.
- [x] 3.4 Add Electron success/error feedback tests for Cloudflare Hub publishing.

## 4. Cloudflare Hub Runtime Skeleton

- [x] 4.1 Add a Hub runtime package with testable Worker entrypoint, package scripts, and local test harness.
- [x] 4.2 Add D1 schema migrations for wikis, users, OAuth accounts, sessions, wiki members, comments, and page revisions.
- [x] 4.3 Add R2-backed static file storage boundaries for per-wiki objects.
- [x] 4.4 Add publish endpoint tests for valid publish, missing token, invalid token, and unknown slug reads.
- [x] 4.5 Implement Hub publish endpoint and static file serving for public wikis.

## 5. Hub Auth and Access Control

- [x] 5.1 Add tests for public wiki reads, private anonymous reads, and private authorized reads.
- [x] 5.2 Implement Hub session parsing and public/private wiki access checks.
- [x] 5.3 Add provider configuration and OIDC flow boundaries for Google and Feishu/Lark.
- [x] 5.4 Add tests for shared realm profile reuse and per-wiki membership isolation.

## 6. Comments and Annotations

- [x] 6.1 Add tests for comment policy enforcement: disabled, login-required, and members-only.
- [x] 6.2 Implement page-level threaded comment create/list APIs.
- [x] 6.3 Add tests for annotation comments with anchor data and threaded replies.
- [x] 6.4 Implement annotation comment storage and stale-anchor status.
- [x] 6.5 Add tests for safe re-anchor success and stale fallback after page updates.

## 7. Documentation and Scaffold Guidance

- [x] 7.1 Update README with Cloudflare Hub deployment and publishing overview.
- [x] 7.2 Update scaffold agent guidance for Cloudflare Hub publish workflows.
- [x] 7.3 Document manual Cloudflare setup: Worker route, D1, R2, secrets, and wildcard DNS.

## 8. Validation

- [x] 8.1 Run targeted core tests for publish config and Cloudflare Hub publishing.
- [x] 8.2 Run targeted Electron publishing tests.
- [x] 8.3 Run Hub runtime tests.
- [x] 8.4 Run `npm test`.
- [x] 8.5 Run `git diff --check`.
