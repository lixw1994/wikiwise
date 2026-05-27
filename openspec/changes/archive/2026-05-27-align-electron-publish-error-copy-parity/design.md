## Context

The native Swift publisher centralizes user-facing failure copy in `PublishError.errorDescription`. Electron surfaces shared core publish errors through its publish error modal, so differences in core error messages become visible UI parity gaps even when the HTTP status mapping and IPC path are otherwise correct.

Current shared core publish helpers keep the same broad error codes as native behavior, but several messages are shorter than the Swift descriptions:
- malformed `publish.json`
- token mismatch
- subdomain taken
- rate limiting

## Goals / Non-Goals

**Goals:**

- Align shared core publish error messages with native `Publisher.swift` descriptions.
- Preserve existing error codes so tests, callers, and future diagnostics can still branch on stable machine-readable values.
- Add source-anchored regression coverage in core and Electron publishing tests.

**Non-Goals:**

- Do not change publish endpoints, headers, payloads, retry handling, or `publish.json` format.
- Do not add a new error abstraction or dependency.
- Do not claim final signed/notarized Electron release completion.

## Decisions

1. Keep message parity in `@wikiwise/core`.
   - Rationale: core helpers are the source of Electron publish failures, and renderer feedback already displays the thrown message.
   - Alternative considered: translate messages in the renderer. That would duplicate native mapping outside the publish helper and leave other core consumers divergent.

2. Preserve existing error codes.
   - Rationale: stable codes are useful for tests and callers, while native parity only requires the user-facing description to match.
   - Alternative considered: rename codes to Swift enum case names. That would increase churn without improving user-visible parity.

3. Cover both direct helper behavior and Electron surfacing.
   - Rationale: core tests prove the message mapping; Electron source tests prove the renderer continues to pass those messages into the `Publish Error` modal.

## Risks / Trade-offs

- [Risk] Copy assertions can be brittle if native copy changes later. -> Mitigation: tests anchor to `Publisher.swift`, so failures point to a deliberate native copy update rather than a silent Electron drift.
- [Risk] Existing tests that assert only codes may miss message regressions. -> Mitigation: add explicit message assertions for each native mapped status and corrupt config flow.
- [Risk] Network behavior could be accidentally changed while touching publish helpers. -> Mitigation: keep implementation to `publishError` call sites and run the existing publisher tests.
