## Why

Native `ContentView.loadPublishConfig()` refreshes toolbar publish state with `publishConfig = try? Publisher.loadConfig(projectRoot:)`. If `publish.json` exists but is malformed, native treats the refreshed toolbar state as unpublished and keeps the project usable; the corrupt-config error is surfaced later only when the user actually publishes or unpublishes.

Electron currently lets `loadPublishConfig` errors escape from `getPublishConfig`, so a malformed `publish.json` can surface during project service refresh or dialog setup instead of matching the native best-effort toolbar refresh behavior.

## What Changes

- Make Electron `getPublishConfig` mirror native refresh semantics by treating malformed publish config as unpublished for state refresh.
- Preserve native corrupt-config errors for real publish/unpublish operations.
- Add source-alignment tests for native `try?` refresh behavior, Electron main fallback behavior, and preserved publish error behavior.

## Impact

- Projects with malformed `publish.json` continue to open with publish controls in the native unpublished state.
- Clicking Publish still surfaces the native corrupt-config error through the existing publish error modal.
