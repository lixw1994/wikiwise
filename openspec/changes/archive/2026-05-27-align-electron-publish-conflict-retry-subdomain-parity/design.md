## Context

Native publishing has two different random-subdomain call sites. The first publish path includes the project name so the suggested URL is recognizable. The automatic `409` conflict retry path intentionally omits the wiki name by calling `randomSubdomain()` with the default `nil` parameter, so retries fall back to a bare six-character candidate.

## Decisions

- Keep `randomPublishSubdomain(wikiName)` unchanged as the shared primitive.
- Change `publishSite`'s default random-subdomain callback to accept an optional wiki name.
- Call the callback with `path.basename(projectRoot)` only for the initial first-publish candidate.
- Continue calling the callback with no argument inside the existing `409` retry helper so default retries become suffix-only, matching native.
- Keep custom `options.randomSubdomain` test hooks compatible with existing zero-argument callbacks.

## Risks

- A user who collides on first publish may see a less descriptive automatically retried URL than before. This is intentional because native macOS already behaves that way.
- Existing tests that inject a zero-argument `randomSubdomain` callback should continue to pass because JavaScript ignores extra arguments for those callbacks.
