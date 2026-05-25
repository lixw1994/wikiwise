## Why

Electron has source-level watcher coverage, but the runtime parity audit still stubs watcher startup without sending project-change events through the preload bridge. The native macOS app uses FSEvents to refresh the currently viewed markdown page after markdown or CSS changes, so the Electron migration needs runtime evidence for that live-refresh path.

## What Changes

- Extend the Electron runtime parity audit to simulate a watched markdown/CSS change for the selected scaffold `home.md`.
- Record evidence that the renderer receives the project-change event and requests a preview refresh with invalidate and CSS reload semantics.
- Record evidence that the selected markdown page remains visible after the watcher-driven refresh.
- Fail project audit scenarios when watcher startup, event delivery, refresh IPC, or restored preview evidence is missing.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `electron-runtime-parity-audit`: add runtime evidence and assertions for watcher-driven markdown/CSS preview refresh.
- `electron-live-rebuild-watching`: add runtime watcher QA requirements and retire the deeper runtime watcher QA deferred marker for this slice.

## Impact

- Affected code: `scripts/audit-electron-runtime.mjs`, `apps/electron/test/runtime-parity-audit.test.js`.
- Affected specs: `openspec/specs/electron-runtime-parity-audit/spec.md`, `openspec/specs/electron-live-rebuild-watching/spec.md`.
- No Swift, dependency, release signing, or packaging contract changes are expected.
