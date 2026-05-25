## Context

Electron already owns the project watcher in the main process and the renderer already responds to `wikiwise:projectChanged` events. The existing runtime audit, however, only stubs `wikiwise:startProjectWatcher` and never emits a watcher event through the preload bridge. That leaves an evidence gap between the source-level watcher tests and the native macOS behavior, where FSEvents refresh the selected markdown preview after markdown and CSS changes.

This change affects the Electron runtime audit harness and its source tests. It does not change the production Electron watcher implementation, SwiftUI native app, scaffold templates, or release workflow.

## Goals / Non-Goals

**Goals:**

- Prove during the Electron runtime audit that the renderer starts the project watcher through preload.
- Emit a controlled watcher change for the selected scaffold `home.md` and CSS refresh semantics.
- Record evidence that the renderer re-reads the selected markdown file and recompiles its preview with invalidate and CSS reload flags.
- Fail project runtime audit scenarios when watcher startup, event delivery, refresh IPC, or selected markdown preservation evidence is missing.
- Update the live rebuild watching spec so deeper runtime watcher QA is no longer tracked as deferred after this slice.

**Non-Goals:**

- Do not change the production `fs.watch` coalescing behavior in `apps/electron/src/main/main.js`.
- Do not add real filesystem mutation during the audit; the audit should remain deterministic and read-only.
- Do not change Swift FSEvents behavior, release signing, notarization, DMG packaging, or scaffold content.

## Decisions

- Capture watcher evidence in the audit host rather than mutating files on disk. This keeps the audit deterministic and proves the bridge contract by sending `wikiwise:projectChanged` through the same `webContents.send` path used by production.
- Track read and compile IPC payloads while the watcher event is active. The renderer's visible DOM can show the selected file stayed on `home.md`, while host-side IPC payloads prove the selected markdown file was re-read and recompiled with `invalidate: true` and `reloadCSS: true`.
- Store renderer-readable watcher evidence on `window.__wikiwiseWatcherRuntimeEvidence`, matching existing audit evidence patterns for preview scroll and generated map flows.
- Keep production code unchanged unless the new runtime audit exposes an actual parity failure. This slice is an audit coverage phase, not a watcher architecture rewrite.

## Risks / Trade-offs

- Audit event could fire before the renderer subscribes to watcher changes -> wait for the watcher startup IPC to provide a live sender before emitting the event.
- Renderer refresh is asynchronous -> wait on host-observed compile IPC payloads before reading DOM evidence.
- A deterministic synthetic event does not prove every native file watching edge case -> existing source tests still cover production watcher coalescing, while this runtime audit proves the renderer bridge and selected-preview refresh path.
- Future renderer refactors could rename evidence fields -> source tests assert the audit markers and failure messages so regressions fail before runtime parity is overstated.
