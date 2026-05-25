## Context

The native SwiftUI toolbar exposes an `Open 3D Map` button that opens `map-3d.html` from compiler output as a generated page. When the user opens the map from a selected markdown page, the native app pushes the markdown page into back history so Back restores the selected page. Electron already has source-level tests for `openGeneratedPage`, generated preview frames, and history wiring, but the runtime audit does not exercise that user flow through the real renderer. The runtime flow also depends on compiler generation staying valid after progressive scan/cache usage.

## Goals / Non-Goals

**Goals:**

- Exercise the opened-project toolbar map control in the Electron runtime audit.
- Persist report evidence that `map-3d.html` appears in the generated preview frame.
- Persist report evidence that Back returns from the generated map page to `home.md` and hides the generated frame.
- Preserve full compiler generation after `scanPages()` seeds a progressive cache with deferred HTML.
- Fail the runtime audit when any of those native-flow markers are missing.

**Non-Goals:**

- Change generated map rendering, compiler output, or bundled `map-3d.html` resources.
- Add runtime coverage for every generated page link target in this slice.
- Change Swift behavior, release signing, notarization, or packaging scripts.

## Decisions

- Capture generated map evidence immediately after default WIKI preview and scroll evidence. This proves the toolbar flow while the selected markdown page is still active, matching the native transition from markdown page to generated map.
- Restore the markdown page with the existing Back toolbar control before continuing the audit. Later runtime checks still expect source editor, terminal, sidebars, and selected-file evidence for `home.md`.
- Store DOM evidence on `window.__wikiwiseGeneratedMapEvidence`. This follows the existing runtime audit pattern for independent UI interactions and keeps the JSON report explicit.
- Assert on `map-3d.html`, generated frame visibility, selected label, and back-button restoration instead of screenshot pixels. The runtime screenshot still catches blank output, while DOM evidence gives stable behavioral proof.
- Treat progressive cache entries with missing HTML as cache misses during full compilation. This preserves the fast progressive scan path while preventing full map generation from reusing deferred page bodies.

## Risks / Trade-offs

- [Risk] Generated map frame load can be asynchronous. -> Wait for generated frame visibility and a `map-3d.html` source before reading evidence.
- [Risk] Opening the map could disturb later project audit checks. -> Navigate back to `home.md` and wait for WIKI preview restoration before switching to FILE mode.
- [Risk] This does not prove every graph/map link path. -> Keep this slice focused on the native toolbar flow; preview link routing remains covered by existing source tests and can gain runtime coverage later.
