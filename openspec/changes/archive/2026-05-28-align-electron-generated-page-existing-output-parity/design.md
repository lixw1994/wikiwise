## Context

Native folder open creates a compiler, calls `scanPages()`, then starts background compilation:

```swift
let c = Compiler(sourceDir: url)
compiler = c
c.scanPages()
startBackgroundCompilation(c)
```

Native generated-page navigation is intentionally a lightweight lookup. The toolbar map action checks for `map-3d.html` in `c.outputDir`; `handleWikilink(_:)` similarly checks for the generated HTML fallback. Neither path calls `compileAll()`.

Electron mirrors project-open scanning in `createProjectResult()`, but the generated-page IPC helpers currently call `compiler.compileAll()` before checking for the requested generated page. That makes navigation itself perform full output generation, which is broader than the native click/link behavior.

## Goals / Non-Goals

**Goals:**

- Make toolbar 3D map opening use existing generated output only.
- Make generated preview-link fallback use existing generated output only.
- Preserve `null`/no-op behavior when generated output is absent.
- Preserve full compilation for publish and source-file compile paths.

**Non-Goals:**

- Changing native SwiftUI behavior.
- Removing project-open `scanPages()` output generation.
- Changing background compilation scheduling.
- Claiming final migration completion; signed/notarized release evidence remains required.

## Decisions

- Keep `getCompiler(projectRoot)` in generated-page helpers so output directory resolution and project-root validation remain centralized.
- Remove `compileAll()` from `openGeneratedPage()` and `resolvePreviewNavigation()` generated fallback handling.
- Continue returning `null` when the requested generated HTML is absent; renderer paths already treat `null` as no-op.
- Anchor regression coverage to native source rather than only implementation shape, because the parity distinction is a lifecycle side effect.

## Risks / Trade-offs

- Direct IPC calls to open a generated page before a project has been opened/scanned may now return `null`. This matches the native UI, where generated-page controls rely on the active compiler lifecycle created by folder open.
- If future generated pages are added, they must still be produced by scan/open/watch compilation before navigation can show them.
