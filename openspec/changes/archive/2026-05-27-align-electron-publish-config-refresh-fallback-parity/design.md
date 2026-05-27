## Context

There are two distinct native publishing behaviors:

- `ContentView.loadPublishConfig()` is a non-blocking UI refresh path and uses `try?`, so malformed config becomes `nil`.
- `Publisher.publish` and `Publisher.unpublish` are user actions and preserve `PublishError.corruptConfig`.

The shared core already preserves the throwing helper used by publish/unpublish. The parity gap is only in Electron main-process `getPublishConfig`, which is used by renderer state refresh and dialog setup.

## Design

Add a small main-process wrapper around the existing `loadPublishConfig` call:

- Resolve the project root and compute the same suggested subdomain fallback used for missing config.
- Return published config when `loadPublishConfig` succeeds.
- Return the unpublished fallback when there is no config.
- Catch only `corrupt_config` from the refresh path and return the unpublished fallback, matching native `try?`.
- Let unexpected errors continue to surface.

Do not change `publishProject`, `unpublishProject`, or shared `loadPublishConfig`; those paths must still reject malformed config with the native message.

## Verification

Add Electron publishing source tests that prove:

- native `ContentView.loadPublishConfig()` uses `try? Publisher.loadConfig`
- Electron `getPublishConfig` catches `corrupt_config` and returns the unpublished fallback with a suggested subdomain
- Electron publish/unpublish paths still delegate to throwing helpers and do not swallow corrupt-config errors

Run targeted publishing tests before and after implementation, then run the usual OpenSpec, package, runtime audit, and release-readiness evidence chain.
