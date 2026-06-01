# Cloudflare Wiki Hub Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete Cloudflare Hub documentation and generated wiki agent guidance.

**Architecture:** Completed blocks added target-aware core publish helpers, Electron publishing integration, a testable Cloudflare Worker runtime, app-level auth/access boundaries, and Hub comment/annotation APIs. This block documents the self-hosted deployment path and the generated wiki agent workflow.

**Tech Stack:** Node.js, Electron IPC/preload/renderer, `@wikiwise/core`, Node test runner, future Cloudflare Worker/D1/R2 runtime.

---

## Scope

This execution plan covers the final implementation block: README deployment guidance and scaffold agent instructions for Cloudflare Hub publishing. It intentionally does not add automatic Cloudflare provisioning or a production `wrangler.toml`.

## Covers

- `7.1` Update README with Cloudflare Hub deployment and publishing overview.
- `7.2` Update scaffold agent guidance for Cloudflare Hub publish workflows.
- `7.3` Document manual Cloudflare setup: Worker route, D1, R2, secrets, and wildcard DNS.
- `8.2` Run targeted Electron publishing/scaffold documentation tests.
- `8.4` Run `npm test`.
- `8.5` Run `git diff --check`.

## Plan Type

full

## Execution Strategy

tdd-required

## Ordered Steps

1. Write failing documentation tests in `apps/electron/test/cloudflare-hub-docs.test.js`:
   - README describes Cloudflare Hub publishing and deployment overview.
   - README documents manual setup for Worker route, D1, R2, secrets, and wildcard DNS.
   - Scaffold `AGENTS.md` guides agents through Cloudflare Hub publish settings and token guardrails.

2. Run the targeted documentation test and confirm the new tests fail before implementation:

   ```bash
   node --test apps/electron/test/cloudflare-hub-docs.test.js
   ```

3. Update documentation:
   - Add a root README section for self-hosted Cloudflare Hub publishing.
   - Document manual setup for `apps/cloudflare-hub`, D1 `DB`, R2 `WIKIWISE_FILES`, `WIKIWISE_PUBLISH_TOKEN`, OAuth secrets, Worker route, and wildcard DNS.
   - Add scaffold `AGENTS.md` publish guidance for official hosting versus Cloudflare Hub.
   - Call out public/private visibility, shared/per-wiki auth realms, comment policy, and secret handling.

4. Run targeted validation:

   ```bash
   node --test apps/electron/test/cloudflare-hub-docs.test.js
   npm test
   git diff --check
   ```

5. Mark tasks `7.1` through `7.3`, `8.4`, and `8.5` complete in `tasks.md` if the checks pass.

## Validation Per Step

1. New documentation tests fail before implementation.
2. Failure proves the README and scaffold guidance are missing required Hub publishing details.
3. Documentation includes the self-hosted publishing model, Cloudflare resource setup, and agent guardrails.
4. Targeted docs tests, full workspace tests, and whitespace checks pass.
5. Task checkboxes reflect only completed, verified work.

## Files / Owners

- `README.md`
- `apps/electron/resources/scaffold/AGENTS.md`
- `apps/electron/test/cloudflare-hub-docs.test.js`
- `openspec/changes/add-cloudflare-wiki-hub/tasks.md`

## Completion Checkpoint

This plan block is complete when the root README explains how to publish to and manually deploy a self-hosted Cloudflare Hub, scaffold `AGENTS.md` tells generated-wiki agents how to handle Hub publish settings safely, and validation passes.

## Completion Verification

Required before claiming this plan block complete:

```bash
node --test apps/electron/test/cloudflare-hub-docs.test.js
npm test
git diff --check
```

Retained verification evidence is not required for this documentation-only block; command evidence is recorded inline in the session.

## Debugging Trail

Current reproduction signal: README and scaffold `AGENTS.md` do not describe the Cloudflare Hub publish/deploy workflow. Regression proof is the new failing documentation test.

## Parallel Units

No further implementation phases remain after this block.

## Isolation Boundaries

This block owns only documentation/scaffold guidance and its documentation test. Runtime code and Electron publish UI are out of scope.

## Finish Checklist

- Documentation tests pass.
- Root README describes the Hub publish model.
- Root README describes manual Cloudflare setup boundaries.
- Scaffold `AGENTS.md` describes Hub publish workflow and secret guardrails.
- `tasks.md` only marks verified tasks complete.

## Delivery Handoff

After this block, the change is implementation-complete and ready for final verification or archive.

## Execution Notes

- Added target-aware `publish.json` loading while keeping existing official configs compatible.
- Added Cloudflare Hub payload preparation that reuses the existing home/index rewrite and omits secret-like settings.
- Added Cloudflare Hub publish helper tests and implementation for successful PUT, local config save, and stable error-code mapping.
- Added Electron main/preload routing for Cloudflare Hub publishes while keeping the official publish route intact.
- Added renderer target selection, Hub settings controls, Hub URL preview, and Hub success/error feedback through the existing publish surface.
- Added `@wikiwise/cloudflare-hub` with a Worker-compatible request handler, D1 schema migration, R2-prefixed file storage, publish token checks, and public static serving tests.
- Full workspace `npm test` passes after fixing a CSS selector collision with the existing `.text-input` source-level scaffold test.
- Added Hub session parsing, private wiki membership checks, `/_wikiwise/me`, and OIDC provider list/start boundaries for Google, Feishu, and Lark without returning client secrets.
- Added Hub page-level and annotation comment APIs with disabled/login-required/members-only policy enforcement, parent-before-child listing, anchor JSON storage, and conservative stale-anchor updates during publish.
- Added README and scaffold `AGENTS.md` guidance for Cloudflare Hub publishing, manual Cloudflare setup, and publish/OAuth secret handling.
- Addressed review findings for per-wiki scoped profile/comment identity, stale R2 object cleanup on republish, opaque OIDC start state storage, and cross-project Cloudflare Hub publish draft reset.

## Manual Adjustments

none
