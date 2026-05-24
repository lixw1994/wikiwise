## Context

The SwiftUI app publishes compiled wiki output through `Publisher.swift`. It stores `publish.json` at the project root, checks subdomain availability, uploads all files from the compiler output directory to `https://publish.wiki-wise.com/_publish`, rewrites `home.html` to root `index.html`, and supports unpublish through a DELETE request. Electron already owns project lifecycle, compilation, saves, watching, scaffolding, and right sidebar services through `@wikiwise/core` and main/preload IPC, but it has no publish flow.

## Goals / Non-Goals

**Goals:**

- Move the native publishing contract into dependency-light `@wikiwise/core` helpers that Electron can use without touching Swift sources.
- Preserve the Swift `publish.json` shape: `subdomain`, `token`, `lastPublishedAt`, and `url`.
- Match native publish/update behavior, including generated random subdomains, availability states, `home.html` root rewrite, `index.html` to `catalog.html`, upload status handling, config persistence, and unpublish cleanup.
- Keep renderer publishing sandboxed behind preload APIs.
- Add structural Electron tests and behavior-focused core tests with injected network functions.

**Non-Goals:**

- Do not publish to the live service during automated verification.
- Do not alter the Swift app or release signing/notarization workflow.
- Do not complete app chrome, menu persistence, map polish, packaging, or final parity audit in this phase.
- Do not add external publish SDK dependencies.

## Decisions

1. **Core owns publish semantics.** `@wikiwise/core` will expose `loadPublishConfig`, `randomPublishSubdomain`, `checkPublishAvailability`, `publishSite`, and `unpublishSite`. Alternative: keep publishing only in Electron main. Core is better because the Swift behavior is a portable domain rule, and tests can exercise it without Electron.

2. **Network is injectable.** Core publishing helpers will accept a `fetch`-compatible function option and default to `globalThis.fetch`. Tests will inject fake responses. Alternative: mock globals or skip upload tests. Injection keeps tests deterministic and avoids live network calls.

3. **Main process owns compilation and filesystem access.** Electron main will recompile before publish, pass the compiler output directory and project root to core, and expose only serializable results. The renderer never reads `publish.json`, site files, or tokens directly.

4. **Renderer mirrors the native toolbar flow with simple HTML controls.** The renderer adds a publish button, modal dialog, subdomain input, availability status, publish/update action, unpublish action, result/error messaging, and busy/disabled states. The UI remains lightweight until the later app chrome polish phase.

5. **Availability checks are explicit and debounced in renderer.** The renderer sanitizes subdomains, waits briefly before calling preload, and treats `available` or `owned` as publishable, matching native behavior.

## Risks / Trade-offs

- **Network behavior differences** -> Core maps HTTP status codes to native-compatible error codes and messages, and tests cover the mapping.
- **Token exposure** -> Renderer receives config status and URL details but not raw token values unless needed for native-compatible display; all writes stay in main/core.
- **Published output mismatch** -> Core tests cover `home.html` to `index.html`, original `index.html` to `catalog.html`, and HTML link rewrites.
- **Real service drift** -> This phase verifies request shape and error handling offline; live-service QA remains manual/deferred.
- **Renderer complexity growth** -> Keep publish state localized and defer broader toolbar/app-shell refactors to the upcoming chrome/menus/persistence phase.
