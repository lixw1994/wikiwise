## Context

SwiftUI opens a folder by creating a `Compiler`, calling `scanPages()`, selecting and compiling `wiki/home.md` when present, and then scheduling a timer that calls `compileNextBatch(size: 3)` every 0.1 seconds until no pages remain. The same background drip restarts after CSS, markdown, rebuild, and structure watcher events.

Electron already shares the compiler runtime through `@wikiwise/core`, which exposes `scanPages()`, `compileMarkdownFile()`, `compileNextBatch()`, `invalidateAll()`, `reloadCSS()`, and `rescan()`. The main process currently compiles selected pages on demand and uses `compileAll()` for generated pages and publishing, but it does not keep a native-equivalent background batch lifecycle after project open or watcher invalidation.

## Goals / Non-Goals

**Goals:**
- Start background batch compilation for directory-backed projects after initial scan/home selection.
- Restart background batch compilation after watcher summaries rescan or invalidate compiler state.
- Keep the UI responsive by scheduling small compiler batches on the main process event loop.
- Retain tests and runtime audit evidence that pending pages drain to completion.

**Non-Goals:**
- Replace on-demand preview compilation.
- Change generated page or publishing behavior, which can still force `compileAll()` for freshness.
- Add worker threads or a new compiler process in this phase.
- Claim final migration completion or signed/notarized release completion.

## Decisions

1. Use the existing progressive compiler API.

   The native app and shared bundled `build.js` already define the progressive lifecycle. Calling `scanPages()` followed by repeated `compileNextBatch(3)` keeps Electron aligned with native behavior instead of inventing another queue.

2. Own scheduling in the Electron main process.

   The compiler instance and filesystem access already live in main. Keeping timers there avoids renderer filesystem privileges and lets watcher summaries restart compilation immediately after `rescan()`, `reloadCSS()`, or `invalidateAll()`.

3. Key background jobs by project root.

   This prevents duplicate intervals for the same project and makes restart semantics simple: stop the existing interval, start a new one, and remove it once `compileNextBatch()` returns zero remaining pages.

4. Preserve deterministic user-triggered compilation.

   File selection, save, generated page, and publishing flows keep returning explicit compiled outputs. Background compilation is opportunistic parity work and must not become required for a selected page to render.

## Risks / Trade-offs

- [Risk] Background batches could race with on-demand compilation. -> JavaScript execution in the Electron main process is single-threaded; use small synchronous batches and restart after explicit invalidations.
- [Risk] Repeated watcher events could create multiple timers. -> Track jobs by normalized project root and stop the previous job before starting a new one.
- [Risk] Tests can overfit implementation names. -> Add a direct core compiler test for `compileNextBatch()` and keep Electron tests focused on lifecycle contracts.
- [Risk] Runtime audit stubs do not exercise production main timers. -> Record runtime audit evidence that the shared compiler drains pending pages, and use main-process tests to guard production wiring.

## Migration Plan

1. Add failing tests for progressive compiler coverage, Electron main scheduling, watcher restart wiring, and runtime audit evidence fields.
2. Implement main-process background compilation helpers and start/restart calls.
3. Add runtime audit report evidence for drained pending compilation.
4. Run focused tests, runtime audit, full verification, archive the OpenSpec change, and commit.

Rollback removes the main-process scheduler, runtime audit fields, and the archived background compilation spec. Existing on-demand preview, generated page, publishing, and watcher refresh paths continue to work.

## Open Questions

None for this phase.
