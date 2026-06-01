## Readiness Decision

ready with conditions

The change is ready to plan and begin in narrow implementation slices. The first implementation should avoid full auth/comment UI and instead establish target-aware publishing compatibility and the Cloudflare Hub static publish contract.

## Execution Mode

tdd-required

This change touches publish configuration, security-sensitive auth boundaries, and Electron publish behavior. Tests must be written before implementation for each slice.

## Verification Mode

retained-recommended

Core and Electron unit tests are required inline. Retained verification notes are recommended for the first Hub runtime publish flow and any security-sensitive auth/comment API slice.

## Debug Mode

systematic-debugging

Unexpected publish/auth/comment behavior must be reduced to a reproducible failing test before fixes are attempted.

## Review Request

No external review is requested before the first slice. A focused review should be requested before merging the first implementation that exposes Hub auth or comment write APIs.

## Review Scope

- `packages/wikiwise-core/src/index.js`
- `packages/wikiwise-core/test/publisher.test.js`
- `apps/electron/src/main/`
- `apps/electron/src/preload/`
- `apps/electron/src/renderer/`
- New Cloudflare Hub runtime package and tests
- `apps/electron/resources/scaffold/` documentation and skills

## Review Focus

- Official publishing remains backward-compatible.
- Hub publish tokens and OAuth secrets are not leaked into static output.
- Private wiki responses do not expose protected files before authorization.
- Shared realm identity is global while wiki permissions remain per wiki.
- Annotation relocation prefers stale markers over unsafe matches.

## Review Status

not-requested

## Delegation Mode

single-agent

The user did not request subagents. Later implementation slices are subagent-eligible once file ownership is clear.

## Parallelization Mode

parallel-eligible

Core publish helper work, Hub runtime skeleton, and Electron UI can be parallelized after the config contract is stable.

## Worktree Mode

same-tree

The current branch is already dedicated to this feature work.

## Branch Finish Mode

finish-recommended

The branch should receive a final review before merge because it changes publishing and auth boundaries.

## Blocked By

none

## Observed Failure

Users cannot publish Wikiwise sites to their own Cloudflare infrastructure with app-owned auth and comments. The only current publish path targets the official `wiki-wise.com` service and only supports static public hosting through that service contract.

## Validation Focus

- Existing `npm test` remains green.
- Existing official publish config shape loads and publishes as before.
- New Cloudflare Hub config shape loads and rejects malformed configs.
- Hub publish payload preserves home/index rewrite behavior.
- Electron publish UI can distinguish official and Cloudflare targets without regressing official dialog tests.
- Hub runtime tests cover publish token rejection, unknown wiki slug, public/private serving, comment policy enforcement, threaded replies, and stale annotation anchors.
- Security-sensitive slices include negative tests for missing auth, invalid token, and protected content access.

## Key Risks

- Rewriting `publish.json` too aggressively could break existing official projects.
- Storing a Hub publish token in `publish.json` conflicts with the current `.gitignore` behavior but may still surprise users; docs must call this out.
- Cookie scope across `*.wiki.flybullet.net` needs careful SameSite/CSRF design before auth write APIs ship.
- Feishu/Lark OIDC claim shape may vary; provider config must remain flexible.
- Annotation relocation can create false positives; stale state is safer than incorrect placement.

## Findings Summary

- Accepted: Start with target-aware config and static Hub publish before account/comment runtime.
- Accepted: Keep official publishing as the compatibility baseline for every slice.
- Accepted: Store OAuth client secrets only in Cloudflare secrets, never in wiki project files.
- Deferred: Exact Hub package location can be resolved in the first runtime skeleton task.
- Deferred: Whether annotation relocation runs server-side or client-side can wait until the comment UI slice.

## Manual Adjustments

none
