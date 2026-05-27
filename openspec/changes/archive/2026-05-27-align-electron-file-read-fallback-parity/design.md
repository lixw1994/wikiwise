## Context

The native app separates display resilience from internal file IO by using `try? String(contentsOf:) ?? "Could not read file."` inside `ContentView.loadFile(_:)`. Electron already centralizes IO in `@wikiwise/core`, but the existing `readTextFile` helper intentionally throws and is used by internal readers such as app settings and publish config.

## Design

Introduce a small shared helper for display reads:

- `readDisplayTextFile(filePath)` attempts the same UTF-8 read as `readTextFile`.
- On any read failure it returns the exact native fallback string `Could not read file.`.
- `readTextFile` remains throwing and continues to back internal reads.

Electron main-process user-visible content paths will call `readDisplayTextFile`:

- the `wikiwise:readFile` IPC used by renderer file-tree selection
- `compileWikiHomeIfPresent` when preparing the initially selected `wiki/home.md`
- standalone selected-file content in `createProjectResult`

Compiler bridge reads already mirror native compiler behavior by returning empty strings for unreadable files, so this change stays scoped to selected-file detail content.

## Verification

Add core tests that prove display reads return the native fallback on missing/unreadable paths while ordinary `readTextFile` still throws. Add Electron source-alignment tests that anchor the helper usage to native `ContentView.loadFile(_:)` and guard against accidentally using the throwing helper on display-content paths.
