## Context

The native compiler is a Swift `Compiler` class that loads `markdown-it`, KaTeX, CSS, app JS, graph JS, map HTML, map-3d HTML, and `build.js` into JavaScriptCore. It injects filesystem bridge functions and exposes `scanPages`, `compilePage`, `compileAll`, and related operations. Electron can mirror this with Node's `vm` module and the same bridge surface.

## Goals / Non-Goals

**Goals:**

- Reuse the existing bundled `build.js` compiler exactly.
- Keep filesystem and compiler work in core/main process, not renderer.
- Add a visible Wiki preview mode in Electron.
- Compile `wiki/home.md` after opening a scaffolded wiki folder.

**Non-Goals:**

- No watcher/live reload.
- No editor save integration.
- No custom navigation handling inside the preview iframe.
- No packaging changes.

## Decisions

- Implement a `WikiCompiler` class in `@wikiwise/core` backed by `node:vm`.
- Inject the same bridge names used by Swift: `readFile`, `writeFile`, `copyFile`, `listDir`, `mkdirp`, `fileExists`, `fileMtime`, and `log`.
- Load project `site/` resource overrides before repository bundled resources, matching native `Compiler.swift`.
- Convert compiled output paths to file URLs in main process before sending them to renderer.
- Use an iframe for preview in this phase; richer navigation/scroll behavior remains later.

## Risks / Trade-offs

- Running existing compiler code in Node VM is close to JSCore behavior but not identical; retained tests cover output existence and basic content, while later phases need deeper parity tests.
- `build.js` can reference browser/CDN resources inside generated HTML; this phase only verifies local file generation and iframe load wiring.
- Preview iframe security and navigation rules need deeper treatment in a later WebView parity phase.

## State Model

- **compiler-uninitialized:** project opened but compiler not created.
- **metadata-scanned:** compiler has scanned pages and output shared artifacts.
- **page-compiled:** selected markdown page has compiled HTML.
- **preview-ready:** renderer has a file URL for the compiled HTML.
- **compile-error:** compiler failed and renderer shows an error.

## Migration Plan

1. Write failing core compiler tests using a temporary wiki fixture.
2. Implement `WikiCompiler`, slug helpers, and compiler exports in `@wikiwise/core`.
3. Write failing Electron structural tests for compiler IPC/preload/renderer preview.
4. Implement IPC, preload APIs, project open compilation, renderer mode toggle, and iframe preview.
5. Verify tests, OpenSpec, and Swift source untouched.

## Open Questions

- Live rebuild and scroll preservation belong in later phases.
- Full visual parity of compiled preview will need browser-level/manual screenshot verification later.
