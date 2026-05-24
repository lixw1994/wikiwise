## Why

The Electron app can now open a project and display text files, but it still cannot render the compiled wiki view that is central to the native app. The next parity dependency is the native `Compiler.swift` bridge: load the bundled compiler resources, scan markdown, compile pages, and let the Electron renderer preview generated HTML.

## What Changes

- Add a Node-based compiler wrapper in `@wikiwise/core` that executes the existing bundled `build.js` and related assets through a sandboxed VM context with native filesystem bridge functions.
- Expose compiler operations through Electron main-process IPC and preload APIs.
- Extend the Electron renderer with a File/Wiki mode switch and compiled HTML preview.
- Compile the native `wiki/home.md` equivalent after opening a wiki folder when possible.

## Success Criteria

- Core tests prove a temporary wiki can be scanned and compiled into `site/out/home.html`.
- Electron tests prove compiler IPC, preload APIs, renderer mode switching, and preview iframe wiring exist without launching Electron.
- Root `npm test` passes.
- `openspec validate migrate-electron-compiler-preview --strict` passes.
- Swift source files remain untouched.
- Retained verification records implemented behavior and remaining native preview gaps.

## Non-Goals

- No live file watching or automatic rebuilds.
- No CodeMirror editing/save parity.
- No scroll preservation parity.
- No map/graph navigation beyond whatever `build.js` generates.
- No publish or terminal migration.

## Capabilities

### New Capabilities

- `electron-compiler-preview`: Node-backed wiki compilation and compiled HTML preview in the Electron app.

### Modified Capabilities

- `wikiwise-core-package`: Add a compiler wrapper that mirrors the native JavaScriptCore `Compiler` behavior using Node VM and bundled resources.
- `cross-platform-electron-workspace`: Add compiler IPC and preload APIs while preserving renderer sandboxing.
- `electron-project-lifecycle`: Extend project opening to compile and select the wiki home page when available.

## Impact

- Modifies `packages/wikiwise-core`.
- Modifies `apps/electron` main, preload, renderer, CSS, and tests.
- Adds OpenSpec artifacts and retained verification for the compiler/preview phase.
- Does not modify Swift source or native release scripts.
